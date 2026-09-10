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
  let removeRecordedStripListener = null;
  let recordedStripSource = null;

  function attachRecordedStripListener() {
    const ecg = getController()?.Ecg;
    if (!ecg) return;
    if (recordedStripSource === ecg && removeRecordedStripListener) return;
    detachRecordedStripListener();
    recordedStripSource = ecg;
    removeRecordedStripListener = ecg.on(
      "RecordedStripReady",
      storeRecordedStrip,
    );
  }

  function detachRecordedStripListener() {
    removeRecordedStripListener?.();
    removeRecordedStripListener = null;
    recordedStripSource = null;
  }

  async function activate() {
    await stopActiveSensor();
    const started = await getController().StartEcg($("#ecg-canvas")[0]);
    if (!started) {
      setStatus("Not Monitoring");
      return;
    }
    setActiveSensor("ecg");
    attachRecordedStripListener();
    $recordButton.prop("disabled", false);
    setStatus("Monitoring");
  }

  async function stop() {
    if (recording) getController().StopRecording();
    await getController().StopSensor();
    detachRecordedStripListener();
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
      getController().StartRecording();
      recording = true;
      setNavigationLocked(true);
      $recordButton.text("Stop Recording").addClass("stop");
      setStatus("Recording");
      return;
    }

    getController().StopRecording();
    recording = false;
    setNavigationLocked(false);
    $recordButton.text("Start Recording").removeClass("stop");
    setStatus("Monitoring");
  }

  function storeRecordedStrip(bytes) {
    if (!bytes?.length) return;
    const data = getController().EcgBmpFromCapture(bytes);
    if (!data) return;
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
    detachRecordedStripListener();
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
