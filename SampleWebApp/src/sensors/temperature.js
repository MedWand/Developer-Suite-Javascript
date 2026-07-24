export function createTemperatureSensor(
  decl,
  getController,
  getActiveSensor,
  setActiveSensor,
  stopActiveSensor,
  formatReading,
  errorText,
  handleActionError,
) {
  const $button = $("#view-temperature .sensor-action");
  let latestValue = "--";

  async function toggle() {
    if (getActiveSensor() === "temperature") {
      await stop();
      return;
    }

    await stopActiveSensor();
    const started = await getController().startThermometer();
    if (started) {
      setActiveSensor("temperature");
      $button.text("Stop").addClass("stop");
    }
  }

  async function stop() {
    if (getActiveSensor() !== "temperature") return;
    await getController().stopSensor();
    setActiveSensor(null);
    $button.text("Start").removeClass("stop");
    setStatus("Ready");
  }

  function activate() {
    $("#temperature-value").text("--");
    $button.text("Start").removeClass("stop");
    setStatus("Ready");
  }

  function handleReading(reading) {
    if (reading.sensorType !== decl.MedWandSensor.Thermometer) return;
    latestValue = formatReading(reading.tempObject);
    $("#temperature-value").text(latestValue);
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
    $("#view-temperature .reading-state").text(value);
  }

  $button.on("click", () => toggle().catch(handleActionError));

  return {
    activate,
    stop,
    handleReading,
    handleReadingState,
    handleDeviceError,
    getLatestValue: () => latestValue,
  };
}
