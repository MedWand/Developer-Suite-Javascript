export function createCameraSensor(
  decl,
  getController,
  getActiveView,
  getActiveSensor,
  setActiveSensor,
  stopActiveSensor,
  errorText,
  log,
) {
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
    setStatus(modeName === "Off" ? "Ready" : "Starting");
    $("#camera-capture").prop("disabled", true);

    let started = false;
    try {
      const controller = getController();
      const preview = $("#camera-preview")[0];
      started = await controller.setCameraMode(
        preview,
        decl.CameraModes[modeName],
      );
      if (modeName === "Off") clearPreview();
      if (!started && modeName !== "Off")
        throw new Error(cameraStartupError(modeName));

      if (started && modeName !== "Off") {
        setActiveSensor("camera");
      }

      $("[data-camera-mode]").removeClass("active");
      $button.addClass("active");
      $("#camera-empty").prop("hidden", modeName !== "Off");
      $("#otoscope-controls").prop("hidden", modeName !== "Otoscope");

      if (started && modeName !== "Off") {
        configureControls();
        await configureFocusControls();
        setStatus("On");
        return;
      }
      hideControls();
      setStatus("Ready");
    } catch (error) {
      await releaseCamera();
      throw error;
    }
  }

  async function stop() {
    if (getActiveSensor() !== "camera") return;
    await getController().setCameraMode(
      $("#camera-preview")[0],
      decl.CameraModes.Off,
    );
    clearPreview();
    setActiveSensor(null);
    frameReady = false;
    capturePending = false;
    manualFocus = false;
    $("#camera-capture").prop("disabled", true).text("Capture");
    hideControls();
    setStatus("Ready");
  }

  async function releaseCamera() {
    await getController()
      .setCameraMode($("#camera-preview")[0], decl.CameraModes.Off)
      .catch(() => false);
    clearPreview();
    setActiveSensor(null);
    frameReady = false;
    capturePending = false;
    manualFocus = false;
    $("#camera-capture").prop("disabled", true).text("Capture");
    hideControls();
  }

  function hideControls() {
    $("#led-controls, #focus-controls, #otoscope-controls").prop(
      "hidden",
      true,
    );
    $("#led-intensity, #led-toggle, #focus-intensity, #focus-mode").prop(
      "disabled",
      true,
    );
  }

  function clearPreview() {
    const canvas = $("#camera-preview")[0];
    const context = canvas.getContext("2d");
    if (!context) return;
    context.fillStyle = "#000";
    context.fillRect(0, 0, canvas.width, canvas.height);
  }

  function handleFrame(bytes) {
    if (!bytes?.length || getActiveSensor() !== "camera" || frameReady) return;
    frameReady = true;
    $("#camera-capture").prop("disabled", false);
    setStatus("On");
  }

  function capture() {
    if (!getController()?.cameraIsMonitoring || !frameReady)
      throw new Error("The camera preview has not produced a frame yet.");
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
    const adjustable = Boolean(getController().cameraLedIntensityAdjustable);
    $("#led-controls").prop("hidden", maximum === 0);
    $("#led-intensity")
      .prop("hidden", !adjustable)
      .attr("max", Math.max(1, maximum))
      .val(intensity)
      .prop("disabled", !adjustable);
    $("#led-output").text(intensity);
    $("#led-toggle")
      .prop("hidden", adjustable)
      .prop("disabled", maximum === 0)
      .text(intensity > 0 ? "Turn off" : "Turn on");
  }

  async function configureFocusControls() {
    const cameraModel = getController().camera?.cameraModel;
    const focus = cameraModel?.focusInfo;
    const $slider = $("#focus-intensity");

    if (!focus?.hasManualFocus) {
      $("#focus-controls").prop("hidden", true);
      $slider.prop("disabled", true);
      $("#focus-mode").prop("disabled", true);
      return;
    }

    if (focus.hasAutoFocus) {
      await getController().setCameraFocusMode(decl.FocusModes.Auto, true);
      manualFocus = false;
    }

    const value = Number(
      cameraModel.selectedFocusModeValue || focus.focusMinimum,
    );
    $("#focus-controls").prop("hidden", false);
    $("#focus-mode")
      .prop("hidden", !focus.hasManualFocus)
      .prop("disabled", !focus.hasManualFocus)
      .text("Use Manual");
    $("#focus-value-control").prop("hidden", !focus.hasManualFocus);
    $slider
      .attr({ min: focus.focusMinimum, max: focus.focusMaximum, step: 1 })
      .val(value)
      .prop("disabled", true);
    $("#focus-output").text(manualFocus ? `Manual (${value})` : "Auto");
    $("#focus-value-output").text(value);
  }

  function cameraStartupError(modeName) {
    const controller = getController();
    const detail = String(
      controller?.cameraLastError ?? controller?.CameraLastError ?? "",
    ).trim();
    return detail
      ? `${modeName} preview did not start. ${detail}`
      : `${modeName} preview did not start. No additional camera error was reported.`;
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
    const commands = {
      ArrowLeft: "move-left",
      ArrowRight: "move-right",
      ArrowUp: "move-up",
      ArrowDown: "move-down",
      PageUp: "zoom-in",
      PageDown: "zoom-out",
      Enter: "reset",
    };
    const command = commands[event.key];
    if (!command) return;
    event.preventDefault();
    runCommand(command);
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
    const mode = getController()?.cameraMode || decl.CameraModes.Off;
    const timer =
      getController()?.cameraHasOnTimer && mode !== decl.CameraModes.Off
        ? ` (${getController().cameraOnTimeMax}s available)`
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
  $("#led-intensity").on("input", function () {
    $("#led-output").text($(this).val());
  });
  $("#led-intensity").on("change", function () {
    getController()
      .setCameraLedIntensity(Number($(this).val()))
      .catch(handleError);
  });
  $("#led-toggle").on("click", function () {
    const target =
      Number($("#led-output").text()) > 0
        ? 0
        : Number(getController().cameraLedIntensityMax || 1);
    getController().setCameraLedIntensity(target).catch(handleError);
  });
  $("#focus-intensity").on("input", function () {
    $("#focus-value-output").text($(this).val());
  });
  $("#focus-intensity").on("change", async function () {
    try {
      const modeChanged = await getController().setCameraFocusMode(
        decl.FocusModes.Manual,
      );
      const focusChanged = await getController().setCameraManualFocus(
        Number($(this).val()),
      );
      if (!modeChanged || !focusChanged)
        throw new Error(
          "The active camera did not accept the manual focus setting.",
        );
      $("#focus-output").text(`Manual (${$(this).val()})`);
    } catch (error) {
      handleError(error);
    }
  });
  $("#focus-mode").on("click", async function () {
    try {
      const nextManualFocus = !manualFocus;
      const changed = await getController().setCameraFocusMode(
        nextManualFocus ? decl.FocusModes.Manual : decl.FocusModes.Auto,
        !nextManualFocus,
      );
      if (!changed)
        throw new Error(
          `The active camera did not accept ${nextManualFocus ? "manual" : "automatic"} focus mode.`,
        );
      manualFocus = nextManualFocus;
      $("#focus-intensity").prop("disabled", !manualFocus);
      $("#focus-mode").text(manualFocus ? "Use Auto" : "Use Manual");
      $("#focus-output").text(
        manualFocus ? `Manual (${$("#focus-intensity").val()})` : "Auto",
      );
    } catch (error) {
      handleError(error);
    }
  });
  $("[data-camera-command]").on("click", function () {
    runCommand($(this).data("cameraCommand"));
  });
  $(window).on("keydown", handleKeydown);

  return {
    attachEvents,
    activate,
    stop,
    handleReading,
    handleReadingState,
    handleDeviceError,
  };
}
