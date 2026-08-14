import { createTemperatureSensor } from "./sensors/temperature.js";
import { createPulseOximeterSensor } from "./sensors/pulse-oximeter.js";
import { createEcgSensor } from "./sensors/ecg.js";
import { createStethoscopeSensor } from "./sensors/stethoscope.js";
import { createCameraSensor } from "./sensors/camera.js";

(() => {
  "use strict";

  // DECL configuration: add the license values supplied for your MedWand integration here.
  const MW_DECL_LICENSE =
    "";
  const MW_DECL_PUBLIC_KEY =
    "";

  // DECL bundle entry point. All MedWand device operations below flow through this object.
  const decl = globalThis.MedWandSdk;
  if (!decl) throw new Error("MedWand DECL bundle did not load.");

  let medWandController = null;
  let activeView = "home";
  let activeSensor = null;
  let navigationLocked = false;
  const navigationSelector = ".nav-item[data-view], #home-button";
  const connectionModal = new bootstrap.Modal("#connection-modal", {
    backdrop: "static",
    keyboard: false,
  });

  function log(message) {
    const time = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    $("<li>")
      .append($("<time>").text(time), $("<span>").text(message))
      .prependTo("#activity-log");
  }

  function errorText(error) {
    const message = error?.exception?.message || error?.message;
    const code = error?.errorCode || error?.code || error?.name;
    const constraint = error?.exception?.constraint || error?.constraint;
    let detail = message ? String(message) : code ? String(code) : "";
    if (message && code && !detail.includes(String(code)))
      detail = `${detail} (${code})`;
    if (constraint) detail = `${detail} [Constraint: ${constraint}]`;
    if (detail) return detail;
    const fallback = String(error);
    return fallback === "[object Object]" ? JSON.stringify(error) : fallback;
  }

  function setBusy($button, busy, label) {
    $button.prop("disabled", busy).text(busy ? "Working..." : label);
  }

  function showConnectionModal() {
    connectionModal.show();
  }

  function hideConnectionModal() {
    connectionModal.hide();
  }

  function setConnection(
    connected,
    label = connected ? "Connected" : "Disconnected",
  ) {
    $("#device-state").text(label);
    $("#is-connected").text(String(connected));
    $("#connect-button").prop("hidden", connected);
    $("#disconnect-button").prop("disabled", !connected);
  }

  function setReadingState(readingState) {
    $(".reading-state")
      .text(readingState)
      .toggleClass(
        "live",
        !["Stopped", "Ready", "Error"].includes(readingState),
      );
  }

  function getController() {
    return medWandController;
  }
  function getActiveSensor() {
    return activeSensor;
  }
  function setActiveSensor(name) {
    activeSensor = name;
  }
  function getActiveView() {
    return activeView;
  }

  const temperatureSensor = createTemperatureSensor(
    decl,
    getController,
    getActiveSensor,
    setActiveSensor,
    stopActiveSensor,
    formatReading,
    errorText,
    handleActionError,
  );
  const pulseOximeterSensor = createPulseOximeterSensor(
    decl,
    getController,
    getActiveSensor,
    setActiveSensor,
    stopActiveSensor,
    formatReading,
    errorText,
    handleActionError,
  );
  const ecgSensor = createEcgSensor(
    getController,
    setActiveSensor,
    stopActiveSensor,
    setNavigationLocked,
    errorText,
    log,
  );
  const stethoscopeSensor = createStethoscopeSensor(
    decl,
    getController,
    getActiveSensor,
    setActiveSensor,
    stopActiveSensor,
    setNavigationLocked,
    errorText,
    log,
    handleActionError,
  );
  const cameraSensor = createCameraSensor(
    decl,
    getController,
    getActiveView,
    getActiveSensor,
    setActiveSensor,
    stopActiveSensor,
    errorText,
    log,
  );

  function sensorFor(name) {
    if (name === "temperature") return temperatureSensor;
    if (name === "spo2") return pulseOximeterSensor;
    if (name === "ecg") return ecgSensor;
    if (name === "stethoscope") return stethoscopeSensor;
    if (name === "camera") return cameraSensor;
    return null;
  }

  function enableTools() {
    $(".nav-item[data-view]:not([data-view='summary'])").each((_, button) => {
      const $button = $(button);
      const feature = $button.data("feature");
      $button.prop(
        "disabled",
        feature === "ecg"
          ? !medWandController.canUseEcg || !medWandController.hasValidEcg
          : feature === "camera"
            ? !medWandController.canUseCamera ||
              !medWandController.hasValidOtoscope
            : feature === "stethoscope"
              ? !medWandController.canUseStethoscope ||
                !medWandController.hasValidStethoscope
              : false,
      );
    });
  }

  function setNavigationLocked(locked) {
    if (navigationLocked === locked) return;
    navigationLocked = locked;
    if (locked) {
      $(navigationSelector).each((_, button) => {
        const $button = $(button);
        $button.prop("disabled", $button.data("view") !== activeView);
      });
      log("Navigation locked while recording");
      return;
    }
    if (medWandController?.isInitialized) enableTools();
    $("#home-button, .nav-item[data-view='summary']").prop("disabled", false);
    log("Navigation unlocked");
  }

  async function showView(name) {
    if (name === activeView) return;
    await stopActiveSensor();
    activeView = name;
    $(".view").removeClass("active").filter(`#view-${name}`).addClass("active");
    $(navigationSelector)
      .removeClass("active")
      .filter(`[data-view="${name}"]`)
      .addClass("active");
    if (name === "summary") renderSummary();
    const sensor = sensorFor(name);
    if (sensor) await sensor.activate();
  }

  function renderSummary() {
    const pulseValues = pulseOximeterSensor.getLatestValues();
    const temperature = temperatureSensor.getLatestValue();
    $("#summary-temperature").text(
      temperature === "--" ? "--" : `${temperature} \u00b0F`,
    );
    $("#summary-spo2").text(
      pulseValues.spo2 === "--" ? "--" : `${pulseValues.spo2}%`,
    );
    $("#summary-pulse").text(
      pulseValues.pulse === "--" ? "--" : `${pulseValues.pulse} bpm`,
    );
    copyCaptures("#ecg-captures", "#summary-ecg", "No ECG strips captured.");
    copyCaptures(
      "#stethoscope-captures",
      "#summary-stethoscope",
      "No audio recordings captured.",
    );
    copyCaptures("#camera-captures", "#summary-camera", "No images captured.");
  }

  function copyCaptures(source, target, emptyMessage) {
    const $captures = $(source).children().clone();
    const $target = $(target).empty();
    if ($captures.length) {
      $captures.filter("audio").prop("controls", true);
      $target.append($captures);
    } else $target.append($("<p>").text(emptyMessage));
  }

  // DECL events: subscribe once after controller construction and dispose on disconnect.
  function attachDeclControllerEvents() {
    medWandController.on("deviceStateChanged", (value) => {
      setConnection(medWandController.isConnected, String(value));
      log(`Device state: ${value}`);
    });
    medWandController.on("readingStateChanged", (value) => {
      const sensor = sensorFor(activeView);
      if (sensor) sensor.handleReadingState(value);
      log(`Reading state: ${value}`);
    });
    medWandController.on("readingReceived", (reading) => {
      const sensor = sensorFor(activeView);
      if (sensor) sensor.handleReading(reading);
    });
    medWandController.on("deviceError", (error) => {
      setNavigationLocked(false);
      const detail = errorText(error);
      log(`Device error: ${detail}`);
      const sensor = sensorFor(activeView);
      if (sensor) sensor.handleDeviceError(error);
    });
    medWandController.on("licenseError", (value) => log(`License: ${value}`));
    medWandController.on("ledIntensityChanged", (value) => {
      $("#led-output").text(value);
      $("#led-intensity").val(value);
      $("#led-toggle").text(Number(value) > 0 ? "Turn off" : "Turn on");
    });
  }

  function formatReading(value) {
    return value == null || value === "" || value === "Reading" ? "--" : value;
  }

  // DECL lifecycle: construct, configure, connect, and initialize the controller in order.
  async function connectDecl(license, publicKey) {
    const $button = $("#connect-button");
    if (!license.trim() || !publicKey.trim()) {
      const message =
        "Add MW_DECL_LICENSE and MW_DECL_PUBLIC_KEY at the top of app.js before connecting.";
      log(message);
      setConnection(false, "License not configured");
      return;
    }
    setBusy($button, true, "Connect");
    try {
      await disconnectDecl(false);
      medWandController = new decl.MedWandController();
      attachDeclControllerEvents();
      // DECL: validate the supplied license.
      medWandController.construct(license.trim(), publicKey.trim());
      if (!medWandController.isLicenseValid)
        throw new Error("The DECL license is not valid.");
      setConnection(false, "Choose device");
      // Match the Functional Test App lifecycle: connect first, then create
      // sensor modules with Configure immediately before Initialize.
      await medWandController.connect();
      setConnection(true, "Initializing");
      medWandController.configure($("#ecg-canvas")[0]);
      await medWandController.initialize();
      if (!medWandController.isInitialized)
        throw new Error("The MedWand did not initialize.");
      enableTools();
      await loadDeviceDetails();
      setConnection(true, "Initialized");
      $("#license-state").text("Valid");
      log("MedWand initialized");
      hideConnectionModal();
    } catch (error) {
      log(`Connection failed: ${errorText(error)}`);
      if (medWandController) {
        try {
          await medWandController.disconnect();
        } catch (disconnectError) {
          log(`Connection cleanup: ${errorText(disconnectError)}`);
        }
        medWandController.dispose();
        medWandController = null;
      }
      activeSensor = null;
      navigationLocked = false;
      setConnection(false);
    } finally {
      setBusy($button, false, "Start");
    }
  }

  async function loadDeviceDetails() {
    // DECL: query device identity and firmware metadata after initialization.
    const values = await Promise.allSettled([
      medWandController.getDeviceId(),
      medWandController.getGeneration(),
      medWandController.getFirmwareVersion(),
      medWandController.getUdi(),
      medWandController.isBootloaderMode(false),
    ]);
    const value = (index) =>
      values[index].status === "fulfilled"
        ? String(values[index].value || "--")
        : "Unavailable";
    $("#device-id").text(value(0));
    $("#generation").text(value(1));
    $("#firmware").text(value(2));
    $("#udi").text(value(3));
    $("#bootloader-mode").text(value(4));
    $("#port").text(medWandController.comPort || "WebSerial");
    $("#vendor-id").text(medWandController.vendorId || "--");
    $("#product-id").text(medWandController.productId || "--");
    $("#is-connected").text(String(medWandController.isConnected));
    $("#is-initialized").text(String(medWandController.isInitialized));
    $("#camera-model").text(
      medWandController.hasValidOtoscope
        ? medWandController.cameraModel || "Available"
        : "Unavailable",
    );
    $("#stethoscope-model").text(
      medWandController.hasValidStethoscope
        ? medWandController.stethoscopeModel
        : "Unavailable",
    );
    $("#led-intensity")
      .attr("max", Math.max(1, medWandController.cameraLedIntensityMax || 1))
      .prop("disabled", !medWandController.cameraLedIntensityAdjustable);
    updateGeneralStatus();
  }

  function updateGeneralStatus() {
    if (!medWandController?.isConnected) {
      $("#status-bar").text("MedWand Browser DECL Sample");
      return;
    }
    $("#status-bar").text(
      `Device: ${medWandController.comPort || "WebSerial"}/${medWandController.vendorId || "--"}/${medWandController.productId || "--"} | ${medWandController.udi || "--"} | ${medWandController.generation || "--"} v${medWandController.firmwareVersion || "--"}`,
    );
  }

  // DECL lifecycle: stop active hardware, disconnect, unsubscribe, and release resources.
  async function disconnectDecl(updateUi = true) {
    if (!medWandController) return;
    try {
      await stopActiveSensor();
      await medWandController.disconnect();
    } catch (error) {
      log(`Disconnect: ${errorText(error)}`);
    }
    medWandController.dispose();
    medWandController = null;
    navigationLocked = false;
    if (updateUi) {
      setConnection(false);
      $("#is-initialized").text("false");
      updateGeneralStatus();
      $(".nav-item:not([data-view='summary'])").prop("disabled", true);
      await showView("home");
      log("Device disconnected");
      showConnectionModal();
    }
  }

  async function stopActiveSensor() {
    if (!medWandController || !activeSensor) return;
    const sensor = sensorFor(activeSensor);
    try {
      if (sensor) await sensor.stop();
    } catch (error) {
      log(`Stop failed: ${errorText(error)}`);
      activeSensor = null;
      setNavigationLocked(false);
    }
  }

  $("#connect-button").on("click", () =>
    connectDecl(MW_DECL_LICENSE, MW_DECL_PUBLIC_KEY),
  );
  $("#disconnect-button").on("click", () => {
    if (globalThis.confirm("Are you sure you want to disconnect?"))
      disconnectDecl();
  });
  $("#continue-button").on("click", () => {
    $("#startup-notice").prop("hidden", true);
    showConnectionModal();
  });
  $(navigationSelector).on("click", function () {
    showView($(this).data("view")).catch(handleActionError);
  });
  $(window).on("beforeunload", () => medWandController?.dispose());

  function handleActionError(error) {
    log(`Action failed: ${errorText(error)}`);
    setReadingState("Error");
  }

})();
