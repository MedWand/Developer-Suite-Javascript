export function createCameraSensor(decl, getController, getActiveView, getActiveSensor, setActiveSensor, stopActiveSensor, errorText, log) {
  let captureCount = 0;
  let frameReady = false;
  let capturePending = false;
  let manualFocus = false;

  function attachEvents() {
    const module = getController().camera;
    if (typeof module?.on !== "function") return;
    module.on("frameReady", handleFrame);
    module.on("recordedFrameReady", handleRecordedFrame);
  }

  function activate() {
    setStatus("Ready");
  }

  async function selectMode($button) {
    const modeName = $button.data("cameraMode");
    await stopActiveSensor();
    frameReady = false;
    manualFocus = false;

    const started = await getController().setCameraMode($("#camera-preview")[0], decl.CameraModes[modeName]);
    if (started && modeName !== "Off") setActiveSensor("camera");

    $("[data-camera-mode]").removeClass("active");
    $button.addClass("active");
    $("#camera-empty").prop("hidden", modeName !== "Off");
    $("#otoscope-controls").prop("hidden", modeName !== "Otoscope");
    $("#camera-capture").prop("disabled", true);

    if (started && modeName !== "Off") {
      $("#camera-model").text(getController().cameraModel);
      configureControls();
      configureFocusRange();
      setStatus("On");
      return;
    }
    if (modeName !== "Off") throw new Error("Camera preview did not start.");
    setStatus("Ready");
  }

  async function stop() {
    if (getActiveSensor() !== "camera") return;
    await getController().setCameraMode($("#camera-preview")[0], decl.CameraModes.Off);
    setActiveSensor(null);
    frameReady = false;
    capturePending = false;
    manualFocus = false;
    $("#camera-capture").prop("disabled", true).text("Capture");
    $("#led-toggle, #focus-mode").prop("disabled", true);
    $("#otoscope-controls").prop("hidden", true);
    setStatus("Ready");
  }

  function handleFrame(bytes) {
    if (!bytes?.length || getActiveSensor() !== "camera" || frameReady) return;
    frameReady = true;
    $("#camera-capture").prop("disabled", false);
    setStatus("On");
  }

  function capture() {
    if (!getController()?.cameraIsMonitoring || !frameReady) throw new Error("The camera preview has not produced a frame yet.");
    $("#camera-capture").prop("disabled", true).text("Capturing...");
    setStatus("Capturing");
    capturePending = true;
    getController().startRecording();
  }

  function handleRecordedFrame(bytes) {
    if (!capturePending) return;
    capturePending = false;
    const data = getController().cameraBmpFromCapture(bytes);
    if (data) storeCapture(data, getController().cameraMode);
    captureCount += 1;
    $("#camera-capture").prop("disabled", false).text("Capture");
    setStatus("On");
    log(`Camera image captured (${bytes.length} bytes)`);
  }

  function configureControls() {
    const maximum = Math.max(0, getController().cameraLedIntensityMax || 0);
    const intensity = Number(getController().ledIntensity || 0);
    $("#led-intensity").attr("max", Math.max(1, maximum)).val(intensity).prop("disabled", !getController().cameraLedIntensityAdjustable);
    $("#led-output").text(intensity);
    $("#led-toggle").prop("disabled", maximum === 0).text(intensity > 0 ? "Turn off" : "Turn on");
  }

  function configureFocusRange() {
    const track = $("#camera-preview")[0].srcObject?.getVideoTracks?.()[0];
    const focus = track?.getCapabilities?.().focusDistance;
    const $slider = $("#focus-intensity");
    if (!focus) {
      $slider.prop("disabled", true);
      $("#focus-mode").prop("disabled", true);
      $("#focus-output").text("Auto");
      return;
    }
    const value = track.getSettings?.().focusDistance ?? focus.min;
    $slider.attr({ min: focus.min, max: focus.max, step: focus.step || "any" }).val(value).prop("disabled", !manualFocus);
    $("#focus-mode").prop("disabled", false).text(manualFocus ? "Use Auto" : "Use Manual");
    $("#focus-output").text(manualFocus ? `Manual (${value})` : "Auto");
  }

  function runCommand(command) {
    if (command === "zoom-in") getController().cameraZoom(1);
    else if (command === "zoom-out") getController().cameraZoom(-1);
    else if (command === "move-left") getController().cameraMove(-1, null);
    else if (command === "move-right") getController().cameraMove(1, null);
    else if (command === "move-up") getController().cameraMove(null, -1);
    else if (command === "move-down") getController().cameraMove(null, 1);
    else if (command === "radius-in") getController().cameraResizeMask(5);
    else if (command === "radius-out") getController().cameraResizeMask(-5);
    else getController().cameraReset();
  }

  function handleKeydown(event) {
    if (getActiveView() !== "camera" || getActiveSensor() !== "camera") return;
    const commands = { ArrowLeft: "move-left", ArrowRight: "move-right", ArrowUp: "move-up", ArrowDown: "move-down", PageUp: "zoom-in", PageDown: "zoom-out", Enter: "reset" };
    const command = commands[event.key];
    if (!command) return;
    event.preventDefault();
    runCommand(command);
  }

  function handleReading() {}
  function handleReadingState(value) { setStatus(String(value)); }
  function handleDeviceError(error) { handleError(error); }

  function handleError(error) {
    const detail = errorText(error);
    log(`Camera error: ${detail}`);
    setStatus(`Error - ${detail}`);
  }

  function setStatus(value) {
    const mode = getController()?.cameraMode || decl.CameraModes.Off;
    const timer = getController()?.cameraHasOnTimer && mode !== decl.CameraModes.Off ? ` (${getController().cameraOnTimeMax}s available)` : "";
    $("#view-camera .reading-state").text(`${mode} : ${value}${timer} [${captureCount} Captured]`);
  }

  function storeCapture(data, mode) {
    $("<img>", { src: data, alt: `${mode} capture` })
      .attr({ "data-captured-at": new Date().toISOString(), "data-mode": String(mode) })
      .appendTo("#camera-captures");
  }

  $("[data-camera-mode]").on("click", function () { selectMode($(this)).catch(handleError); });
  $("#camera-capture").on("click", () => { try { capture(); } catch (error) { handleError(error); } });
  $("#led-intensity").on("input", function () { $("#led-output").text($(this).val()); });
  $("#led-intensity").on("change", function () { getController().setCameraLedIntensity(Number($(this).val())).catch(handleError); });
  $("#led-toggle").on("click", function () {
    const target = Number($("#led-output").text()) > 0 ? 0 : Number(getController().cameraLedIntensityMax || 1);
    getController().setCameraLedIntensity(target).catch(handleError);
  });
  $("#focus-intensity").on("input", function () { $("#focus-output").text($(this).val()); });
  $("#focus-intensity").on("change", async function () {
    try {
      await getController().setCameraFocusMode(decl.FocusModes.Manual);
      await getController().setCameraManualFocus(Number($(this).val()));
    } catch (error) { handleError(error); }
  });
  $("#focus-mode").on("click", async function () {
    try {
      manualFocus = !manualFocus;
      await getController().setCameraFocusMode(manualFocus ? decl.FocusModes.Manual : decl.FocusModes.Auto);
      configureFocusRange();
    } catch (error) { handleError(error); }
  });
  $("[data-camera-command]").on("click", function () { runCommand($(this).data("cameraCommand")); });
  $(window).on("keydown", handleKeydown);

  return { attachEvents, activate, stop, handleReading, handleReadingState, handleDeviceError };
}
