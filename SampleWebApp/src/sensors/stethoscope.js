export function createStethoscopeSensor(
  decl,
  getController,
  getActiveSensor,
  setActiveSensor,
  stopActiveSensor,
  setNavigationLocked,
  errorText,
  log,
  handleActionError,
) {
  let captureCount = 0;
  let recording = false;

  function activate() {
    setStatus();
  }

  async function selectMode($button) {
    const modeName = $button.data("stethMode");
    await stopActiveSensor();
    const started = await getController().SetStethoscopeMode(
      decl.MicrophoneModes[modeName],
    );

    if (started && modeName !== "Off") {
      setActiveSensor("stethoscope");
    }

    $("[data-steth-mode]").removeClass("active");
    $button.addClass("active");
    $("#steth-record").prop("disabled", modeName === "Off");
    setStatus();
  }

  async function stop() {
    if (getActiveSensor() !== "stethoscope") return;
    if (recording) getController().StopRecording();
    await getController().SetStethoscopeMode(decl.MicrophoneModes.Off);
    setActiveSensor(null);
    recording = false;
    setNavigationLocked(false);
    $("#steth-record")
      .prop("disabled", true)
      .text("Start Recording")
      .removeClass("stop");
    $("[data-steth-mode]")
      .removeClass("active")
      .filter("[data-steth-mode='Off']")
      .addClass("active");
    setStatus();
  }

  function toggleRecording() {
    const $button = $("#steth-record");
    if (!recording) {
      getController().StartRecording();
      recording = true;
      setNavigationLocked(true);
      $button.text("Stop Recording").addClass("stop");
    } else {
      getController().StopRecording();
      recording = false;
      setNavigationLocked(false);
      $button.text("Start Recording").removeClass("stop");
    }
    setStatus();
  }

  function handleReading() {}
  function handleReadingState() {
    setStatus();
  }
  function handleDeviceError(error) {
    setStatus(`Error - ${errorText(error)}`);
  }

  function setStatus(override) {
    const mode = getController()?.StethoscopeMode || decl.MicrophoneModes.Off;
    const reading =
      override ||
      (mode === decl.MicrophoneModes.Off
        ? "Ready"
        : recording
          ? "Recording"
          : "On");
    $("#view-stethoscope .reading-state").text(
      `${mode} : ${reading} [${captureCount} Captured]`,
    );
  }

  $("[data-steth-mode]").on("click", function () {
    selectMode($(this)).catch(handleActionError);
  });
  $("#steth-record").on("click", toggleRecording);

  return {
    activate,
    stop,
    handleReading,
    handleReadingState,
    handleDeviceError,
  };
}
