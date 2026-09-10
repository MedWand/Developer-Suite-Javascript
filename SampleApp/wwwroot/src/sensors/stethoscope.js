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
  let removeRecordedFramesListener = null;
  let recordedFramesSource = null;

  function attachRecordingCapture() {
    const stethoscope = getController()?.Stethoscope;
    if (!stethoscope) return;
    if (recordedFramesSource === stethoscope && removeRecordedFramesListener)
      return;
    detachRecordingCapture();
    recordedFramesSource = stethoscope;
    removeRecordedFramesListener = stethoscope.on(
      "RecordedFramesReady",
      storeRecording,
    );
  }

  function detachRecordingCapture() {
    removeRecordedFramesListener?.();
    removeRecordedFramesListener = null;
    recordedFramesSource = null;
  }

  function activate() {
    attachRecordingCapture();
    setStatus();
  }

  async function selectMode($button) {
    const modeName = $button.data("stethMode");
    if (getActiveSensor() !== "stethoscope") {
      await stopActiveSensor();
    } else if (recording) {
      getController().StopRecording();
      recording = false;
      setNavigationLocked(false);
      $("#steth-record").text("Start Recording").removeClass("stop");
    }
    const started = await getController().SetStethoscopeMode(
      decl.MicrophoneModes[modeName],
    );

    if (started && modeName !== "Off") {
      attachRecordingCapture();
      setActiveSensor("stethoscope");
      log(`Stethoscope input: ${getController().StethoscopeModel}`);
    } else {
      if (modeName === "Off") detachRecordingCapture();
      setActiveSensor(null);
    }

    $("[data-steth-mode]").removeClass("active");
    $button.addClass("active");
    $("#steth-record").prop("disabled", modeName === "Off");
    setStatus();
  }

  async function stop() {
    if (getActiveSensor() !== "stethoscope") {
      detachRecordingCapture();
      return;
    }
    if (recording) getController().StopRecording();
    await getController().SetStethoscopeMode(decl.MicrophoneModes.Off);
    detachRecordingCapture();
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

  function storeRecording(bytes) {
    if (!bytes?.byteLength) return;
    const dataUri = getController()?.StethoscopeWavFromCapture(bytes);
    if (!dataUri) {
      log("Stethoscope recording could not be converted to WAV.");
      return;
    }

    captureCount += 1;
    const mode = getController()?.StethoscopeMode || decl.MicrophoneModes.Off;
    const fileName = `stethoscope-${mode.toLowerCase()}-${captureCount}.wav`;
    const $capture = $("<div>", { class: "stethoscope-recording" });
    $("<strong>")
      .text(`${mode} recording ${captureCount}`)
      .appendTo($capture);
    $("<audio>", { controls: true, preload: "metadata", src: dataUri }).appendTo(
      $capture,
    );
    $("<a>", { href: dataUri, download: fileName })
      .text("Download WAV")
      .appendTo($capture);
    $("#stethoscope-captures").find("p").remove().end().append($capture);
    log(`Stethoscope ${mode} recording captured (${bytes.byteLength} PCM bytes).`);
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
