import { createTemperatureSensor } from "./sensors/temperature.js";
import { createPulseOximeterSensor } from "./sensors/pulse-oximeter.js";
import { createEcgSensor } from "./sensors/ecg.js";
import { createStethoscopeSensor } from "./sensors/stethoscope.js";
import { createCameraSensor } from "./sensors/camera.js";

(() => {
  "use strict";

  // DECL configuration: add the license values supplied for your MedWand integration here.
  const MW_DECL_LICENSE = "eyJQbGF0Zm9ybSI6Im1lZHdhbmQuZGV2IiwiVmVyc2lvbiI6IjEuMCIsIkxpY2Vuc2VJZCI6IjI0MzYxMjJmLWMwYzItNDMwNC04NzBlLTk2ZDAwMDA5ZmIwNSIsIkNyZWF0ZURhdGVVdGMiOiIyMDI2LTA0LTE1VDE2OjA3OjM1LjI2OTE0NjJaIiwiRXhwaXJ5RGF0ZVV0YyI6IjIwMjYtMDctMzFUMDA6MDA6MDAiLCJQYXlsb2FkIjoiNzRDT0h5WUd5MjFmY1ZhNGw2NW1wT2hxSGJuekRXVFUzZU8vekhSTWg3L0oxVWFiSElrZTlmbHppa3k3dE0zUlozNXJlR2dqV0xGVmQxb3NIZ1pCbE1nL2gwSkhZUnNvb0VSamJjVVo2RHhEb2dRTlNXXHUwMDJCdjZ5dGVlYlhwdEVxQTVZUDdXemxucXAyaWlHbkNXNmlhM1NIRmV0SXU0UmV2dTluZjZIbFFBOWpUOUdveU8wYnRmcXhiSTdDRUlvVFx1MDAyQkFzSWVcdTAwMkJDWU4wa2lyTGxHL0tEU2hmVUJDenI4ZEdTaXhKUkxqV0NDR1Vkdk1va2UyaERhRVh4ckVDWDBhNVx1MDAyQmxYQk1SNmxJVWwvNmZNT2tOZVBMaUtBZzFLNGZhR1NPZFd0VDBrM21yaGJ2NnNWVm5SM0pONWxUTEU0QURjV2UxYW5RelhwV0lDRW1IZjRVYlZKZVJnSldKZjBBRmxEN0taS24vSmQzdVx1MDAyQlhFeTBTa0d4ZlAwUUlSRWlINlRjQkdnTUp4MWpoWnAvTHE1cTNkZnZNYldhQ1oxdE1lMy9SajlcdTAwMkJxbWJrbmZWMU1mUTJsNlNodkFid3lBUkxUWFEvV3lFTXJzcHJYd3dRNFlRbWd5QkdvVzlBNzduM29hWDNMT0YwTFFSTjczNVhQQkhJOVZVM0NzVDFcdTAwMkI4UW5HdjgyaFM0UVpzak5ZRkRpaGxtOGVYU3c2Z3I5WmRRWnZSOTBTQ3NkR2FuL3A2OTdBQVRsZHlnRC9kR05jYWpCTE9IQ092VGwvXHUwMDJCdXBZQ3k5S251S21DQ1FGTnZFQllxZm1tc295ak1QcGE3djMwRHdsa2JnNklnSzhkT0o1cm9VUGxuM0Y1cmd4ZkJYVU1KWXd2ZEVxNVBMNEwyL3RKNjRyTHByZC9hL1NneVB5MTI1M0ZDRWdHbk5iaTQ2MUlOT2w1YzNmSmR3S3dNLzEvb0dKOG5NdDNheGl4T3FcdTAwMkJWREphSmtJXHUwMDJCeXR2b0J1SzVKTlMxS0V0aWQ1eGR2RTVcdTAwMkJyMnBYTmdLd0d5b0p3ZFYySXljeEVCY052YUFSZElFbGJmSnVjck8veVcyNXFNMEVXRUdwSVE9IiwiU2lnbmF0dXJlIjoiV0JZckFSTDNWTDh1OVRnZ3FBanlnNWMyVU9yRGprZHJ3T1JGbkhPcEswYTVHV2xwWC9TTVlTXHUwMDJCQUllM290N1VuTlkvejFiWHI5M2dEdVRpVXp5NDVvanRyNTJpOWZQeXBFazFiT1NmdXJhUEZrOU5SaWJoZk5ubDA5UWxZZWJtWnFicWNRSHI0S2J1UmtDQnFuWnpxZ05aZ1x1MDAyQlB1NEV4MUk0a0RXUmZOeDRVSEpjZjFTdTBjR0JvcWpzNGk5dktCYUFPWjgwOTJpZy9cdTAwMkJyUURtcDJDUGRcdTAwMkJVZEM2WDJHUXZaVUJlU01Gekl3NXBhXHUwMDJCN0QvMDRuSEs1b0FLYXBGUnRLbkwveGFRWXR0eWpLbks0b21DSXM3NUhpQmpNdUtoZEQ4SFd4OFFPdHIwcHFcdTAwMkJXS0ZVVTJuYmYvVjNPcUw4RERDUFByMFNEZmgvZjZ4dzllQmFhTXUzVmhnPT0ifQ==";
  const MW_DECL_PUBLIC_KEY = "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA523eKCY53CsvckmPwpACtAUQlQ/0UsNNLR/IMyWlHmvMAZo4JtybXqKswkEoc5Qy2RCByOMkJkJ7O+LoUpuDt0nOrL3mqrER2cqEUYEaLMdvU58eQfCk/CbLRlSUCLgz5i3WxyJc9C0+DcP1HiiN8IzbcvLdYaOBKNlY+Jm0jrUMuz0dOd+KxpHhQ1eHSnz7+az/LVQ39DzdFAWIRrWjxrO9GSQBZrOaNhlsvMqwt/CwMk7/2AM3rvDGH45rq47z4pc/LoNrhZ4hgsif40vU/61RwnSSSvrR9Tu5e+39zIU9jOHvMuHKblwOJ4fUatPzZ9NsnJu8O+hCpKK4e+/3RQIDAQAB";

  // DECL bundle entry point. All MedWand device operations below flow through this object.
  const decl = globalThis.MedWandSdk;
  if (!decl) throw new Error("MedWand DECL bundle did not load.");

  let medWandController = null;
  let activeView = "summary";
  let activeSensor = null;
  let navigationLocked = false;

  function log(message) {
    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    $("<li>").append($("<time>").text(time), $("<span>").text(message)).prependTo("#activity-log");
  }

  function errorText(error) {
    const message = error?.exception?.message || error?.message;
    const code = error?.errorCode || error?.code || error?.name;
    if (message && code && !String(message).includes(String(code))) return `${message} (${code})`;
    if (message) return String(message);
    if (code) return String(code);
    const fallback = String(error);
    return fallback === "[object Object]" ? JSON.stringify(error) : fallback;
  }
  function setBusy($button, busy, label) { $button.prop("disabled", busy).text(busy ? "Working..." : label); }

  function setConnection(connected, label = connected ? "Connected" : "Disconnected") {
    $("#device-status, #summary-state").text(label);
    $("#device-state").text(label);
    $("#is-connected").text(String(connected));
    $("#connection-dot").toggleClass("connected", connected);
    $("#connect-button").prop("hidden", connected);
    $("#disconnect-button").prop("disabled", !connected);
  }

  function setReadingState(readingState) {
    $(".reading-state")
      .text(readingState)
      .toggleClass("live", !["Stopped", "Ready", "Error"].includes(readingState));
  }

  function getController() { return medWandController; }
  function getActiveSensor() { return activeSensor; }
  function setActiveSensor(name) { activeSensor = name; }
  function getActiveView() { return activeView; }

  const temperatureSensor = createTemperatureSensor(
    decl, getController, getActiveSensor, setActiveSensor, stopActiveSensor,
    formatReading, errorText, handleActionError
  );
  const pulseOximeterSensor = createPulseOximeterSensor(
    decl, getController, getActiveSensor, setActiveSensor, stopActiveSensor,
    formatReading, errorText, handleActionError
  );
  const ecgSensor = createEcgSensor(
    getController, setActiveSensor, stopActiveSensor, setNavigationLocked,
    errorText, log, downloadDataUrl
  );
  const stethoscopeSensor = createStethoscopeSensor(
    decl, getController, getActiveSensor, setActiveSensor, stopActiveSensor,
    setNavigationLocked, errorText, log, handleActionError
  );
  const cameraSensor = createCameraSensor(
    decl, getController, getActiveView, getActiveSensor, setActiveSensor,
    stopActiveSensor, errorText, log
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
      $button.prop("disabled", feature === "ecg" ? !medWandController.canUseEcg || !medWandController.hasValidEcg
        : feature === "camera" ? !medWandController.canUseCamera || !medWandController.hasValidOtoscope
        : feature === "stethoscope" ? !medWandController.canUseStethoscope || !medWandController.hasValidStethoscope
        : false);
    });
  }

  function setNavigationLocked(locked) {
    if (navigationLocked === locked) return;
    navigationLocked = locked;
    if (locked) {
      $(".nav-item[data-view]").each((_, button) => {
        const $button = $(button);
        $button.prop("disabled", $button.data("view") !== activeView);
      });
      log("Navigation locked while recording");
      return;
    }
    if (medWandController?.isInitialized) enableTools();
    log("Navigation unlocked");
  }

  async function showView(name) {
    if (name === activeView) return;
    await stopActiveSensor();
    activeView = name;
    $(".view").removeClass("active").filter(`#view-${name}`).addClass("active");
    $(".nav-item").removeClass("active").filter(`[data-view="${name}"]`).addClass("active");
    const sensor = sensorFor(name);
    if (sensor) await sensor.activate();
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

  // Sensor modules own their DECL media callbacks.
  function attachDeclCaptureEvents() {
    ecgSensor.attachEvents();
    stethoscopeSensor.attachEvents();
    cameraSensor.attachEvents();
  }

  function formatReading(value) { return value == null || value === "" || value === "Reading" ? "--" : value; }

  // DECL lifecycle: construct, configure, connect, and initialize the controller in order.
  async function connectDecl(license, publicKey) {
    const $button = $("#connect-button");
    if (!license.trim() || !publicKey.trim()) {
      const message = "Add MW_DECL_LICENSE and MW_DECL_PUBLIC_KEY at the top of app.js before connecting.";
      log(message);
      setConnection(false, "License not configured");
      return;
    }
    setBusy($button, true, "Connect");
    try {
      await disconnectDecl(false);
      medWandController = new decl.MedWandController();
      attachDeclControllerEvents();
      // DECL: validate the supplied license and configure the ECG rendering target.
      medWandController.construct(license.trim(), publicKey.trim());
      if (!medWandController.isLicenseValid) throw new Error("The DECL license is not valid.");
      medWandController.configure($("#ecg-canvas")[0]);
      setConnection(false, "Choose device");
      // DECL: request the device, then initialize its sensors and capabilities.
      await medWandController.connect();
      setConnection(true, "Initializing");
      await medWandController.initialize();
      if (!medWandController.isInitialized) throw new Error("The MedWand did not initialize.");
      attachDeclCaptureEvents();
      enableTools();
      await loadDeviceDetails();
      setConnection(true, "Initialized");
      $("#license-state").text("Valid");
      log("MedWand initialized");
    } catch (error) {
      log(`Connection failed: ${errorText(error)}`);
      setConnection(false);
    } finally { setBusy($button, false, "Connect"); }
  }

  async function loadDeviceDetails() {
    // DECL: query device identity and firmware metadata after initialization.
    const values = await Promise.allSettled([medWandController.getDeviceId(), medWandController.getGeneration(), medWandController.getFirmwareVersion(), medWandController.getUdi(), medWandController.isBootloaderMode(false)]);
    const value = (index) => values[index].status === "fulfilled" ? String(values[index].value || "--") : "Unavailable";
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
    $("#camera-model").text(medWandController.hasValidOtoscope ? "Detected when camera opens" : "Unavailable");
    $("#stethoscope-model").text(medWandController.hasValidStethoscope ? medWandController.stethoscopeModel : "Unavailable");
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
    $("#status-bar").text(`Device: ${medWandController.comPort || "WebSerial"}/${medWandController.vendorId || "--"}/${medWandController.productId || "--"} | ${medWandController.udi || "--"} | ${medWandController.generation || "--"} v${medWandController.firmwareVersion || "--"}`);
  }

  // DECL lifecycle: stop active hardware, disconnect, unsubscribe, and release resources.
  async function disconnectDecl(updateUi = true) {
    if (!medWandController) return;
    try { await stopActiveSensor(); await medWandController.disconnect(); } catch (error) { log(`Disconnect: ${errorText(error)}`); }
    medWandController.dispose();
    medWandController = null;
    navigationLocked = false;
    if (updateUi) {
      setConnection(false);
      $("#is-initialized").text("false");
      updateGeneralStatus();
      $(".nav-item:not([data-view='summary'])").prop("disabled", true);
      await showView("summary");
      log("Device disconnected");
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

  function downloadDataUrl(data, filename) {
    $("<a>", { href: data, download: filename })[0].click();
  }

  $("#connect-button").on("click", () => connectDecl(MW_DECL_LICENSE, MW_DECL_PUBLIC_KEY));
  $("#disconnect-button").on("click", () => {
    if (globalThis.confirm("Are you sure you want to disconnect?")) disconnectDecl();
  });
  $(".nav-item[data-view]").on("click", function () { showView($(this).data("view")).catch(handleActionError); });
  $(window).on("beforeunload", () => medWandController?.dispose());
  $("#continue-button").on("click", () => $("#startup-notice").prop("hidden", true));

  function handleActionError(error) { log(`Action failed: ${errorText(error)}`); setReadingState("Error"); }
})();
