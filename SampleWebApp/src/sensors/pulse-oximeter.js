export function createPulseOximeterSensor(
  decl,
  getController,
  getActiveSensor,
  setActiveSensor,
  stopActiveSensor,
  formatReading,
  errorText,
  handleActionError,
) {
  const $button = $("#view-spo2 .sensor-action");
  let latestSpo2 = "--";
  let latestPulse = "--";

  async function toggle() {
    if (getActiveSensor() === "spo2") {
      await stop();
      return;
    }

    await stopActiveSensor();
    const started = await getController().StartPulseOximeter();
    if (started) {
      setActiveSensor("spo2");
      $button.text("Stop").addClass("stop");
    }
  }

  async function stop() {
    if (getActiveSensor() !== "spo2") return;
    await getController().StopSensor();
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
    latestSpo2 = formatReading(reading.spo2);
    latestPulse = formatReading(reading.pulseRate);
    $("#spo2-value").text(latestSpo2);
    $("#pulse-value").text(latestPulse);
  }

  function handleReadingState(value) {
    setStatus(String(value));
  }

  function handleDeviceError(error) {
    setActiveSensor(null);
    setStatus(`Error - ${errorText(error)}`);
    $button.prop("disabled", false).text("Start").removeClass("stop");
  }

  function setStatus(value) {
    $("#view-spo2 .reading-state").text(value);
  }

  $button.on("click", () => toggle().catch(handleActionError));

  return {
    activate,
    stop,
    handleReading,
    handleReadingState,
    handleDeviceError,
    getLatestValues: () => ({ spo2: latestSpo2, pulse: latestPulse }),
  };
}
