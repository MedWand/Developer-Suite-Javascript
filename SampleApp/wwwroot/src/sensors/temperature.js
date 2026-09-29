export function createTemperatureSensor(
  decl,
  getController,
  getActiveSensor,
  setActiveSensor,
  stopActiveSensor,
  formatReading,
  errorText,
  handleActionError,
  setNavigationLocked = () => {},
) {
  const $button = $("#view-temperature .sensor-action");
  let latestValue = "--";

  let pending = null;
  let stopping = null;
  let blocked = false;
  let running = false;
  let errorRevision = 0;

  function updateButton() {
    $button.prop("disabled", blocked || pending != null)
      .text(blocked || pending != null ? "" : running ? "Stop" : "Start")
      .toggleClass("stop", running && !blocked && pending == null);
  }

  async function toggle() {
    if (pending || blocked) return;
    if (running) return stop();
    const revision = errorRevision;
    setNavigationLocked(true);
    // Defer execution so the pending guard is installed before any SDK callback.
    pending = Promise.resolve().then(async () => {
      if (getActiveSensor() === "temperature") {
        // After an error-clear event, release the previous session before retrying.
        await getController().StopSensor();
        if (getActiveSensor() === "temperature") setActiveSensor(null);
      } else {
        await stopActiveSensor();
      }
      if (revision !== errorRevision) return;
      const controller = getController();
      // Keep ownership on errors so navigation/disconnect can still stop hardware.
      setActiveSensor("temperature");
      try {
        const started = await controller.StartThermometer();
        if (!started && getActiveSensor() === "temperature") setActiveSensor(null);
        if (revision === errorRevision) running = started;
      } catch (error) {
        if (revision === errorRevision) blocked = true;
        throw error;
      }
    });
    updateButton();
    try {
      await pending;
    } catch (error) {
      if (revision === errorRevision) blocked = true;
      throw error;
    } finally {
      pending = null;
      updateButton();
      setNavigationLocked(false);
    }
  }

  async function stop() {
    if (stopping) return stopping;
    stopping = stopCore();
    try { await stopping; } finally { stopping = null; }
  }

  async function stopCore() {
    if (pending) {
      await pending.catch(() => {});
      // The operation's finally handler releases the pending guard first.
    }
    if (getActiveSensor() !== "temperature") return;
    const revision = errorRevision;
    setNavigationLocked(true);
    pending = Promise.resolve().then(async () => {
      try {
        await getController().StopSensor();
      } finally {
        if (getActiveSensor() === "temperature") setActiveSensor(null);
        running = false;
      }
    });
    updateButton();
    try {
      await pending;
      if (revision === errorRevision && !blocked) setStatus("Ready");
    } finally {
      pending = null;
      updateButton();
      setNavigationLocked(false);
    }
  }

  function activate() {
    $("#temperature-value").text("--");
    if (pending) return;
    blocked = false;
    running = false;
    errorRevision += 1;
    updateButton();
    setStatus("Ready");
  }

  function handleReading(reading) {
    if (reading.SensorType !== decl.MedWandSensor.Thermometer) return;
    latestValue = formatReading(reading.TempObject);
    $("#temperature-value").text(latestValue);
  }

  function handleReadingState(value) {
    if (!blocked) setStatus(String(value));
  }

  function handleDeviceError(error) {
    errorRevision += 1;
    blocked = error != null;
    running = false;
    setStatus(blocked ? `Error - ${errorText(error)}` : "Ready");
    updateButton();
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
