export function createCameraSensor(
  decl,
  getController,
  getActiveView,
  getActiveSensor,
  setActiveSensor,
  stopActiveSensor,
  errorText,
  log,
  setNavigationLocked = () => {},
) {
  let captureCount = 0;
  let hasFrame = false;
  let removeFrameListener = null;
  let changingMode = false;
  let removeRecordedFrameListener = null;
  let recordedFrameSource = null;
  let focusValue = 0;
  let changingFocus = false;

  function activate() {
    attachRecordedFrameListener();
    refreshControls();
    setStatus("Ready");
  }

  function attachRecordedFrameListener() {
    const camera = getController()?.Camera;
    if (!camera) return;
    if (recordedFrameSource === camera && removeRecordedFrameListener) return;
    detachRecordedFrameListener();
    recordedFrameSource = camera;
    removeFrameListener = camera.on("FrameReady", () => {
      if (!hasFrame) { hasFrame = true; refreshCaptureButton(); }
    });
    removeRecordedFrameListener = camera.on(
      "RecordedFrameReady",
      storeRecordedFrame,
    );
  }

  function detachRecordedFrameListener() {
    removeFrameListener?.();
    removeFrameListener = null;
    removeRecordedFrameListener?.();
    removeRecordedFrameListener = null;
    recordedFrameSource = null;
  }

  async function selectMode($button) {
    if (changingMode) return;
    if ($button.data("cameraMode") === getController()?.CameraMode) return;
    changingMode = true;
    hasFrame = false;
    refreshCaptureButton();
    setNavigationLocked(true);
    $("[data-camera-mode]").prop("disabled", true);
    const modeName = $button.data("cameraMode");
    setStatus(modeName === "Off" ? "Ready" : "Starting");
    $("#camera-capture").prop("disabled", true);

    let started = false;
    try {
      await stopActiveSensor();
      if (getActiveView() !== "camera") return;
      const controller = getController();
      const preview = $("#camera-preview")[0];
      started = await controller.SetCameraMode(
        preview,
        decl.CameraModes[modeName],
      );
      if (getActiveView() !== "camera") {
        await releaseCamera();
        return;
      }
      if (modeName === "Off") clearPreview();
      if (!started && modeName !== "Off")
        throw new Error(cameraStartupError(modeName));

      if (started && modeName !== "Off") {
        attachRecordedFrameListener();
        setActiveSensor("camera");
      }

      $("[data-camera-mode]").removeClass("active");
      $button.addClass("active");
      $("#camera-empty").prop("hidden", modeName !== "Off");

      if (started && modeName !== "Off") {
        $("#camera-model").text(controller.CameraModel);
        refreshCaptureButton();
        refreshControls();
        setStatus("On");
        return;
      }
      resetPreviewState();
      refreshControls();
      setStatus("Ready");
    } catch (error) {
      await releaseCamera();
      throw error;
    } finally {
      changingMode = false;
      setNavigationLocked(false);
      $("[data-camera-mode]").prop("disabled", false);
      refreshCaptureButton();
      refreshControls();
    }
  }

  async function stop() {
    if (getActiveSensor() !== "camera") return;
    await getController().SetCameraMode(
      $("#camera-preview")[0],
      decl.CameraModes.Off,
    );
    clearPreview();
    detachRecordedFrameListener();
    setActiveSensor(null);
    $("#camera-capture").prop("disabled", true).text("Capture");
    resetPreviewState();
    refreshControls();
    setStatus("Ready");
  }

  async function releaseCamera() {
    await getController()
      .SetCameraMode($("#camera-preview")[0], decl.CameraModes.Off)
      .catch(() => false);
    clearPreview();
    detachRecordedFrameListener();
    setActiveSensor(null);
    $("#camera-capture").prop("disabled", true).text("Capture");
    resetPreviewState();
    refreshControls();
  }

  function resetPreviewState() {
    hasFrame = false;
    $("#camera-empty").prop("hidden", false);
    $("[data-camera-mode]").removeClass("active").filter('[data-camera-mode="Off"]').addClass("active");
  }

  function clearPreview() {
    const canvas = $("#camera-preview")[0];
    const context = canvas.getContext("2d");
    if (!context) return;
    context.fillStyle = "#000";
    context.fillRect(0, 0, canvas.width, canvas.height);
  }

  function capture() {
    if (changingMode || !hasFrame || !getController()?.CameraIsMonitoring)
      throw new Error("The camera preview is not running.");
    getController().StartRecording();
  }

  function storeRecordedFrame(bytes) {
    if (!bytes?.byteLength) return;
    const data = getController()?.CameraBmpFromCapture(bytes);
    if (!data) {
      log("Camera capture could not be converted to a bitmap.");
      return;
    }
    storeCapture(data, getController().CameraMode);
    captureCount += 1;
    setStatus("On");
    log("Camera image captured");
  }

  function cameraStartupError(modeName) {
    return `${modeName} preview did not start.`;
  }

  function runCommand(command) {
    if (changingMode || getActiveSensor() !== "camera" || getController()?.CameraMode !== decl.CameraModes.Otoscope) return;
    if (command === "zoom-in") getController().CameraZoom(1);
    else if (command === "zoom-out") getController().CameraZoom(-1);
    else if (command === "radius-increase") getController().CameraRadius(5);
    else if (command === "radius-decrease") getController().CameraRadius(-5);
    else if (command === "move-left") getController().CameraMove(-1, null);
    else if (command === "move-right") getController().CameraMove(1, null);
    else if (command === "move-up") getController().CameraMove(null, -1);
    else if (command === "move-down") getController().CameraMove(null, 1);
    else if (command === "reset") getController().CameraReset();
    refreshCaptureButton();
  }

  function refreshControls() {
    const controller = getController();
    const active = getActiveSensor() === "camera" && controller?.CameraIsMonitoring;
    const otoscope = active && controller.CameraMode === decl.CameraModes.Otoscope;
    const focusInfo = controller?.CameraFocusInfo;
    const hasAutoFocus = active && Boolean(focusInfo?.HasAutoFocus);
    const hasManualFocus = active && Boolean(focusInfo?.HasManualFocus);
    const hasFocus = hasAutoFocus || hasManualFocus;
    const lightMax = Number(controller?.CameraLedIntensityMax ?? 0);

    $("#camera-otoscope-controls").prop("hidden", !otoscope);
    $("[data-camera-command]").prop("disabled", !otoscope || changingMode);

    $("#camera-light-controls").prop("hidden", !active || lightMax <= 0);
    $("#camera-light")
      .attr({ max: String(Math.max(1, lightMax)), step: controller?.CameraLedIntensityAdjustable ? "1" : String(Math.max(1, lightMax)) })
      .val(String(controller?.LedIntensity ?? 0))
      .prop("disabled", !active || changingMode);

    $("#camera-focus-controls").prop("hidden", !hasFocus);
    $("#camera-focus-auto").prop("hidden", !hasAutoFocus).prop("disabled", changingMode || changingFocus);
    $("#camera-focus-manual").prop("hidden", !hasManualFocus).prop("disabled", changingMode || changingFocus);
    $("#camera-focus-auto").toggleClass("active", controller?.CameraFocusMode === decl.FocusModes.Auto);
    $("#camera-focus-manual").toggleClass("active", controller?.CameraFocusMode === decl.FocusModes.Manual);

    if (hasManualFocus) {
      const minimum = Number(focusInfo.FocusMinimum);
      const maximum = Number(focusInfo.FocusMaximum);
      if (focusValue < minimum || focusValue > maximum) focusValue = minimum;
      const manualSelected = controller.CameraFocusMode === decl.FocusModes.Manual;
      $("#camera-focus-value-label, #camera-focus-value").prop("hidden", !manualSelected);
      $("#camera-focus-value")
        .attr({ min: String(minimum), max: String(maximum), step: "any" })
        .val(String(focusValue))
        .prop("disabled", changingMode || changingFocus);
    } else {
      $("#camera-focus-value-label, #camera-focus-value").prop("hidden", true);
    }
  }

  async function applyFocus(change) {
    if (changingMode || changingFocus || getActiveSensor() !== "camera") return;
    const controller = getController();
    changingFocus = true;
    refreshControls();
    try {
      const applied = await change(controller);
      if (controller !== getController() || !controller.CameraIsMonitoring) return;
      if (!applied) throw new Error("The browser or camera did not apply the requested focus setting.");
      setStatus("On");
    } finally {
      changingFocus = false;
      refreshControls();
    }
  }

  async function setFocusMode(mode) {
    await applyFocus(controller => controller.CameraSetFocusMode(mode));
  }

  function handleKeydown(event) {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    if (getActiveView() !== "camera" || getActiveSensor() !== "camera" || getController()?.CameraMode !== decl.CameraModes.Otoscope) return;
    if ($(event.target).is("input, textarea, select, button, [contenteditable]")) return;
    const commands = {
      ArrowLeft: "move-left",
      ArrowRight: "move-right",
      ArrowUp: "move-up",
      ArrowDown: "move-down",
      "+": "zoom-in",
      "-": "zoom-out",
      Add: "zoom-in",
      Subtract: "zoom-out",
      PageUp: "radius-increase",
      PageDown: "radius-decrease",
      Delete: "reset",
    };
    if (event.shiftKey && event.key !== "+") return;
    const command = commands[event.key];
    if (!command) return;
    event.preventDefault();
    runCommand(command);
  }

  function refreshCaptureButton() {
    const active = getActiveSensor() === "camera" && getController()?.CameraIsMonitoring;
    $("#camera-capture").prop("disabled", !active || changingMode || !hasFrame);
  }

  function handleReading() {}
  function handleReadingState(value) {
    setStatus(String(value));
  }
  function handleDeviceError(error) {
    handleError(error);
  }

  function handleError(error) {
    const detail = errorText(error);
    log(`Camera error: ${detail}`);
    setStatus(`Error - ${detail}`);
  }

  function setStatus(value) {
    if (["Starting", "Started", "Reading"].includes(value)) value = "On";
    if (value === "Stopped") value = "Ready";
    const mode = getController()?.CameraMode || decl.CameraModes.Off;
    const timer =
      getController()?.CameraHasOnTimer && mode !== decl.CameraModes.Off
        ? ` (${getController().CameraOnTimeMax}s available)`
        : "";
    $("#view-camera .reading-state").text(
      `${mode} : ${value}${timer} [${captureCount} Captured]`,
    );
  }

  function storeCapture(data, mode) {
    $("<img>", { src: data, alt: `${mode} capture` })
      .attr({
        "data-captured-at": new Date().toISOString(),
        "data-mode": String(mode),
      })
      .appendTo("#camera-captures");
  }

  $("[data-camera-command]").on("click", function () {
    runCommand($(this).data("cameraCommand"));
  });
  $("#camera-light").on("change", function () {
    Promise.resolve(getController()?.CameraSetLedIntensity(Number($(this).val())))
      .then(refreshControls)
      .catch(handleError);
  });
  $("#camera-focus-auto").on("click", () => setFocusMode(decl.FocusModes.Auto).catch(handleError));
  $("#camera-focus-manual").on("click", () => setFocusMode(decl.FocusModes.Manual).catch(handleError));
  $("#camera-focus-value").on("change", function () {
    const requestedValue = Number($(this).val());
    applyFocus(async controller => {
      const applied = await controller.CameraSetFocusValue(requestedValue);
      if (applied) focusValue = requestedValue;
      return applied;
    }).catch(handleError);
  });

  $("[data-camera-mode]").on("click", function () {
    selectMode($(this)).catch(handleError);
  });
  $("#camera-capture").on("click", () => {
    try {
      capture();
    } catch (error) {
      handleError(error);
    }
  });
  $(window).on("keydown", handleKeydown);

  return {
    activate,
    stop,
    handleReading,
    handleReadingState,
    handleDeviceError,
  };
}
