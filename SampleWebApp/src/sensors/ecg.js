export function createEcgSensor(getController, setActiveSensor, stopActiveSensor, setNavigationLocked, errorText, log, downloadDataUrl) {
  const $recordButton = $("#ecg-record");
  let captureCount = 0;
  let recording = false;
  let lastStrip = null;

  function attachEvents() {
    const module = getController().ecg;
    if (typeof module?.on !== "function") return;
    module.on("recordedStripReady", handleRecordedStrip);
  }

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
    $recordButton.prop("disabled", true).text("Start Recording").removeClass("stop");
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
    recording = false;
    setNavigationLocked(false);
    $recordButton.text("Start Recording").removeClass("stop");
    setStatus("Monitoring");
  }

  function handleRecordedStrip(capture) {
    const data = typeof capture === "string" ? capture : getController().ecgBmpFromCapture(capture);
    if (data) downloadDataUrl(data, `medwand-ecg-${Date.now()}.bmp`);
    lastStrip = data;
    captureCount += 1;
    setStatus("Monitoring");
    log("ECG strip captured");
  }

  function handleReading() {}

  function handleReadingState(value) {
    setStatus(String(value));
  }

  function handleDeviceError(error) {
    recording = false;
    setNavigationLocked(false);
    $recordButton.prop("disabled", true).text("Start Recording").removeClass("stop");
    setStatus(`Error - ${errorText(error)}`);
  }

  function setStatus(value) {
    $("#view-ecg .reading-state").text(`${value}  [${captureCount} Captured]`);
  }

  $recordButton.on("click", toggleRecording);

  return { attachEvents, activate, stop, handleReading, handleReadingState, handleDeviceError, getLastStrip: () => lastStrip };
}
