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
  let manualFocus = false;

  function activate() {
    setStatus("Ready");
  }

  async function selectMode($button) {
    const modeName = $button.data("cameraMode");
    await stopActiveSensor();

    manualFocus = false;
    setStatus(modeName === "Off" ? "Ready" : "Starting");
    $("#camera-capture").prop("disabled", true);

    let started = false;
    try {
      const controller = getController();
      const preview = $("#camera-preview")[0];
      started = await controller.SetCameraMode(
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
        configureFocusControls();
        $("#camera-capture").prop("disabled", false);
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
    await getController().SetCameraMode(
      $("#camera-preview")[0],
      decl.CameraModes.Off,
    );
    clearPreview();
    setActiveSensor(null);
    manualFocus = false;
    $("#camera-capture").prop("disabled", true).text("Capture");
    hideControls();
    setStatus("Ready");
  }

  async function releaseCamera() {
    await getController()
      .SetCameraMode($("#camera-preview")[0], decl.CameraModes.Off)
      .catch(() => false);
    clearPreview();
    setActiveSensor(null);
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

  function capture() {
    if (!getController()?.CameraIsMonitoring)
      throw new Error("The camera preview is not running.");
    const canvas = $("#camera-preview")[0];
    const data = canvas.toDataURL("image/png");
    storeCapture(data, getController().CameraMode);
    captureCount += 1;
    setStatus("On");
    log("Camera image captured");
  }

  function configureControls() {
    const maximum = Math.max(0, getController().CameraLedIntensityMax || 0);
    const intensity = Number(getController().LedIntensity || 0);
    $("#led-controls").prop("hidden", true);
    $("#led-intensity")
      .prop("hidden", true)
      .attr("max", Math.max(1, maximum))
      .val(intensity)
      .prop("disabled", true);
    $("#led-output").text(intensity);
    $("#led-toggle")
      .prop("hidden", true)
      .prop("disabled", true)
      .text(intensity > 0 ? "Turn off" : "Turn on");
  }

  function configureFocusControls() {
    // Focus capability/range details are intentionally not exposed by the
    // controller's public API. Keep these optional controls unavailable.
    $("#focus-controls").prop("hidden", true);
    $("#focus-intensity, #focus-mode").prop("disabled", true);
  }

  function cameraStartupError(modeName) {
    return `${modeName} preview did not start.`;
  }

  function runCommand(command) {
    if (command === "zoom-in") getController().CameraZoom(1);
    else if (command === "zoom-out") getController().CameraZoom(-1);
    else if (command === "move-left") getController().CameraMove(-1, null);
    else if (command === "move-right") getController().CameraMove(1, null);
    else if (command === "move-up") getController().CameraMove(null, -1);
    else if (command === "move-down") getController().CameraMove(null, 1);
    else if (command === "radius-in") getController().Camera?.resizeMask(5);
    else if (command === "radius-out") getController().Camera?.resizeMask(-5);
    else getController().CameraReset();
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
  $("#focus-intensity").on("input", function () {
    $("#focus-value-output").text($(this).val());
  });
  $("#focus-intensity").on("change", async function () {
    try {
      const camera = getController().Camera;
      const modeChanged = await camera?.setFocusMode(
        decl.FocusModes.Manual,
      );
      const focusChanged = await camera?.setManualFocus(
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
      const changed = await getController().Camera?.setFocusMode(
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
    activate,
    stop,
    handleReading,
    handleReadingState,
    handleDeviceError,
  };
}
