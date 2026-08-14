export function createEcgSensor(
  getController,
  setActiveSensor,
  stopActiveSensor,
  setNavigationLocked,
  errorText,
  log,
) {
  const $recordButton = $("#ecg-record");
  let captureCount = 0;
  let recording = false;

  async function activate() {
    await stopActiveSensor();
    const started = await getController().startEcg($("#ecg-canvas")[0]);
    if (!started) {
      setStatus("Not Monitoring");
      return;
    }
    setActiveSensor("ecg");
    $recordButton.prop("disabled", false);
    setStatus("Monitoring");
  }

  async function stop() {
    if (recording) getController().stopRecording();
    await getController().stopSensor();
    setActiveSensor(null);
    recording = false;
    setNavigationLocked(false);
    $recordButton
      .prop("disabled", true)
      .text("Start Recording")
      .removeClass("stop");
    setStatus("Not Monitoring");
  }

  function toggleRecording() {
    if (!recording) {
      getController().startRecording();
      recording = true;
      setNavigationLocked(true);
      $recordButton.text("Stop Recording").addClass("stop");
      setStatus("Recording");
      return;
    }

    getController().stopRecording();
    captureRenderedStrip();
    recording = false;
    setNavigationLocked(false);
    $recordButton.text("Start Recording").removeClass("stop");
    setStatus("Monitoring");
  }

  function captureRenderedStrip() {
    const canvas = $("#ecg-canvas")[0];
    const data = canvas.toDataURL("image/png");
    $("<img>", { src: data, alt: "Captured ECG strip" })
      .attr("data-captured-at", new Date().toISOString())
      .appendTo("#ecg-captures");
    captureCount += 1;
    log("ECG strip captured");
  }

  function handleReading() {}

  function handleReadingState(value) {
    setStatus(String(value));
  }

  function handleDeviceError(error) {
    recording = false;
    setNavigationLocked(false);
    $recordButton
      .prop("disabled", true)
      .text("Start Recording")
      .removeClass("stop");
    setStatus(`Error - ${errorText(error)}`);
  }

  function setStatus(value) {
    $("#view-ecg .reading-state").text(`${value}  [${captureCount} Captured]`);
  }

  $recordButton.on("click", toggleRecording);

  return {
    activate,
    stop,
    handleReading,
    handleReadingState,
    handleDeviceError,
  };
}
