import { createTemperatureSensor } from "./sensors/temperature.js";
import { createPulseOximeterSensor } from "./sensors/pulse-oximeter.js";
import { createEcgSensor } from "./sensors/ecg.js";

(() => {
  "use strict";

  // DECL configuration: add the license values supplied for your MedWand integration here.
  const MW_DECL_LICENSE =
    "eyJQbGF0Zm9ybSI6Im1lZHdhbmQuZGV2IiwiVmVyc2lvbiI6IjEuMCIsIkxpY2Vuc2VJZCI6IjI0MzYxMjJmLWMwYzItNDMwNC04NzBlLTk2ZDAwMDA5ZmIwNSIsIkNyZWF0ZURhdGVVdGMiOiIyMDI2LTA0LTE1VDE2OjA3OjM1LjI2OTE0NjJaIiwiRXhwaXJ5RGF0ZVV0YyI6IjIwMjYtMDctMzFUMDA6MDA6MDAiLCJQYXlsb2FkIjoiNzRDT0h5WUd5MjFmY1ZhNGw2NW1wT2hxSGJuekRXVFUzZU8vekhSTWg3L0oxVWFiSElrZTlmbHppa3k3dE0zUlozNXJlR2dqV0xGVmQxb3NIZ1pCbE1nL2gwSkhZUnNvb0VSamJjVVo2RHhEb2dRTlNXXHUwMDJCdjZ5dGVlYlhwdEVxQTVZUDdXemxucXAyaWlHbkNXNmlhM1NIRmV0SXU0UmV2dTluZjZIbFFBOWpUOUdveU8wYnRmcXhiSTdDRUlvVFx1MDAyQkFzSWVcdTAwMkJDWU4wa2lyTGxHL0tEU2hmVUJDenI4ZEdTaXhKUkxqV0NDR1Vkdk1va2UyaERhRVh4ckVDWDBhNVx1MDAyQmxYQk1SNmxJVWwvNmZNT2tOZVBMaUtBZzFLNGZhR1NPZFd0VDBrM21yaGJ2NnNWVm5SM0pONWxUTEU0QURjV2UxYW5RelhwV0lDRW1IZjRVYlZKZVJnSldKZjBBRmxEN0taS24vSmQzdVx1MDAyQlhFeTBTa0d4ZlAwUUlSRWlINlRjQkdnTUp4MWpoWnAvTHE1cTNkZnZNYldhQ1oxdE1lMy9SajlcdTAwMkJxbWJrbmZWMU1mUTJsNlNodkFid3lBUkxUWFEvV3lFTXJzcHJYd3dRNFlRbWd5QkdvVzlBNzduM29hWDNMT0YwTFFSTjczNVhQQkhJOVZVM0NzVDFcdTAwMkI4UW5HdjgyaFM0UVpzak5ZRkRpaGxtOGVYU3c2Z3I5WmRRWnZSOTBTQ3NkR2FuL3A2OTdBQVRsZHlnRC9kR05jYWpCTE9IQ092VGwvXHUwMDJCdXBZQ3k5S251S21DQ1FGTnZFQllxZm1tc295ak1QcGE3djMwRHdsa2JnNklnSzhkT0o1cm9VUGxuM0Y1cmd4ZkJYVU1KWXd2ZEVxNVBMNEwyL3RKNjRyTHByZC9hL1NneVB5MTI1M0ZDRWdHbk5iaTQ2MUlOT2w1YzNmSmR3S3dNLzEvb0dKOG5NdDNheGl4T3FcdTAwMkJWREphSmtJXHUwMDJCeXR2b0J1SzVKTlMxS0V0aWQ1eGR2RTVcdTAwMkJyMnBYTmdLd0d5b0p3ZFYySXljeEVCY052YUFSZElFbGJmSnVjck8veVcyNXFNMEVXRUdwSVE9IiwiU2lnbmF0dXJlIjoiV0JZckFSTDNWTDh1OVRnZ3FBanlnNWMyVU9yRGprZHJ3T1JGbkhPcEswYTVHV2xwWC9TTVlTXHUwMDJCQUllM290N1VuTlkvejFiWHI5M2dEdVRpVXp5NDVvanRyNTJpOWZQeXBFazFiT1NmdXJhUEZrOU5SaWJoZk5ubDA5UWxZZWJtWnFicWNRSHI0S2J1UmtDQnFuWnpxZ05aZ1x1MDAyQlB1NEV4MUk0a0RXUmZOeDRVSEpjZjFTdTBjR0JvcWpzNGk5dktCYUFPWjgwOTJpZy9cdTAwMkJyUURtcDJDUGRcdTAwMkJVZEM2WDJHUXZaVUJlU01Gekl3NXBhXHUwMDJCN0QvMDRuSEs1b0FLYXBGUnRLbkwveGFRWXR0eWpLbks0b21DSXM3NUhpQmpNdUtoZEQ4SFd4OFFPdHIwcHFcdTAwMkJXS0ZVVTJuYmYvVjNPcUw4RERDUFByMFNEZmgvZjZ4dzllQmFhTXUzVmhnPT0ifQ==";
  const MW_DECL_PUBLIC_KEY =
    "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA523eKCY53CsvckmPwpACtAUQlQ/0UsNNLR/IMyWlHmvMAZo4JtybXqKswkEoc5Qy2RCByOMkJkJ7O+LoUpuDt0nOrL3mqrER2cqEUYEaLMdvU58eQfCk/CbLRlSUCLgz5i3WxyJc9C0+DcP1HiiN8IzbcvLdYaOBKNlY+Jm0jrUMuz0dOd+KxpHhQ1eHSnz7+az/LVQ39DzdFAWIRrWjxrO9GSQBZrOaNhlsvMqwt/CwMk7/2AM3rvDGH45rq47z4pc/LoNrhZ4hgsif40vU/61RwnSSSvrR9Tu5e+39zIU9jOHvMuHKblwOJ4fUatPzZ9NsnJu8O+hCpKK4e+/3RQIDAQAB";

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
  function sensorFor(name) {
    if (name === "temperature") return temperatureSensor;
    if (name === "spo2") return pulseOximeterSensor;
    if (name === "ecg") return ecgSensor;
    return null;
  }

  function enableTools() {
    $(".nav-item[data-view]:not([data-view='summary'])").each((_, button) => {
      const $button = $(button);
      const feature = $button.data("feature");
      $button.prop(
        "disabled",
        feature === "ecg"
          ? !medWandController.CanUseEcg || !medWandController.HasValidEcg
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
    if (medWandController?.IsInitialized) enableTools();
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
      setConnection(medWandController.IsConnected, String(value));
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
      medWandController.Construct(license.trim(), publicKey.trim());
      if (!medWandController.IsLicenseValid)
        throw new Error("The DECL license is not valid.");
      setConnection(false, "Choose device");
      // Match the Functional Test App lifecycle: connect first, then create
      // sensor modules with Configure immediately before Initialize.
      await medWandController.Connect();
      setConnection(true, "Initializing");
      medWandController.Configure($("#ecg-canvas")[0]);
      await medWandController.Initialize();
      if (!medWandController.IsInitialized)
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
        medWandController.Dispose();
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
    // DECL identity properties are populated during Connect().
    let bootloaderMode = false;
    try {
      bootloaderMode = await medWandController.IsBootloaderMode(false);
    } catch {
      // The beta sample presents an unanswered bootloader query as False.
    }
    $("#device-id").text(medWandController.DeviceId || "--");
    $("#generation").text(String(medWandController.Generation ?? "--"));
    $("#firmware").text(medWandController.FirmwareVersion || "--");
    $("#udi").text(medWandController.Udi || "--");
    $("#bootloader-mode").text(bootloaderMode ? "True" : "False");
    $("#port").text(medWandController.ComPort || "WebSerial");
    $("#vendor-id").text(medWandController.VendorId || "--");
    $("#product-id").text(medWandController.ProductId || "--");
    $("#is-connected").text(String(medWandController.IsConnected));
    $("#is-initialized").text(String(medWandController.IsInitialized));
    updateGeneralStatus();
  }

  function updateGeneralStatus() {
    if (!medWandController?.IsConnected) {
      $("#status-bar").text("MedWand Browser DECL Sample");
      return;
    }
    $("#status-bar").text(
      `Device: ${medWandController.ComPort || "WebSerial"}/${medWandController.VendorId || "--"}/${medWandController.ProductId || "--"} | ${medWandController.Udi || "--"} | ${medWandController.Generation ?? "--"} v${medWandController.FirmwareVersion || "--"}`,
    );
  }

  // DECL lifecycle: stop active hardware, disconnect, unsubscribe, and release resources.
  async function disconnectDecl(updateUi = true) {
    if (!medWandController) return;
    try {
      await stopActiveSensor();
    } catch (error) {
      log(`Disconnect: ${errorText(error)}`);
    }
    medWandController.Dispose();
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
  $(window).on("beforeunload", () => medWandController?.Dispose());

  function handleActionError(error) {
    log(`Action failed: ${errorText(error)}`);
    setReadingState("Error");
  }

})();
