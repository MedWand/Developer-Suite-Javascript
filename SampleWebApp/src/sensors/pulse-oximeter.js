export function createPulseOximeterSensor(decl, getController, getActiveSensor, setActiveSensor, stopActiveSensor, formatReading, errorText, handleActionError) {
  const $button = $("#view-spo2 .sensor-action");

  async function toggle() {
    if (getActiveSensor() === "spo2") {
      await stop();
      return;
    }

    await stopActiveSensor();
    const started = await getController().startPulseOximeter();
    if (started) {
      setActiveSensor("spo2");
      $button.text("Stop").addClass("stop");
    }
  }

  async function stop() {
    if (getActiveSensor() !== "spo2") return;
    await getController().stopSensor();
    setActiveSensor(null);
    $button.text("Start").removeClass("stop");
    setStatus("Ready");
  }

  function activate() {
    $("#spo2-value, #pulse-value").text("--");
    $button.text("Start").removeClass("stop");
    setStatus("Ready");
  }

  function handleReading(reading) {
    if (reading.sensorType !== decl.MedWandSensor.PulseOximeter) return;
    $("#spo2-value").text(formatReading(reading.spo2));
    $("#pulse-value").text(formatReading(reading.pulseRate));
  }

  function handleReadingState(value) {
    setStatus(String(value));
  }

  function handleDeviceError(error) {
    setStatus(`Error - ${errorText(error)}`);
    $button.prop("disabled", true).text("").removeClass("stop");
  }

  function setStatus(value) {
    $("#view-spo2 .reading-state").text(value);
  }

  $button.on("click", () => toggle().catch(handleActionError));

  return { activate, stop, handleReading, handleReadingState, handleDeviceError };
}
