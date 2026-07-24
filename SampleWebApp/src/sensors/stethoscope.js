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
  let audio = null;
  let captureCount = 0;
  let recording = false;

  function attachEvents() {
    const module = getController().stethoscope;
    if (typeof module?.on !== "function") return;
    module.on("frameReady", playFrame);
    module.on("recordedFramesReady", handleRecordedFrames);
  }

  function activate() {
    setStatus();
  }

  async function selectMode($button) {
    const modeName = $button.data("stethMode");
    await stopActiveSensor();
    const started = await getController().setStethoscopeMode(
      decl.MicrophoneModes[modeName],
    );

    if (started && modeName !== "Off") {
      setActiveSensor("stethoscope");
      await startPlayback();
    }

    $("[data-steth-mode]").removeClass("active");
    $button.addClass("active");
    $("#steth-record").prop("disabled", modeName === "Off");
    setStatus();
  }

  async function stop() {
    if (getActiveSensor() !== "stethoscope") return;
    if (recording) getController().stopRecording();
    stopPlayback();
    await getController().setStethoscopeMode(decl.MicrophoneModes.Off);
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
      getController().startRecording();
      recording = true;
      setNavigationLocked(true);
      $button.text("Stop Recording").addClass("stop");
    } else {
      getController().stopRecording();
      recording = false;
      setNavigationLocked(false);
      $button.text("Start Recording").removeClass("stop");
    }
    setStatus();
  }

  async function startPlayback() {
    stopPlayback();
    const AudioContextType =
      globalThis.AudioContext || globalThis.webkitAudioContext;
    if (!AudioContextType)
      throw new Error("Live audio playback is not supported by this browser.");
    const sampleRate =
      getController().generation === decl.MedWandGeneration.Generation25
        ? 48000
        : 44100;
    const context = new AudioContextType({ sampleRate });
    const inputGain = context.createGain();
    const volume = context.createGain();
    inputGain.gain.value = 1;
    volume.gain.value = 0.15;
    inputGain.connect(volume).connect(context.destination);
    if (context.state === "suspended") await context.resume();
    audio = {
      context,
      inputGain,
      volume,
      nextTime: context.currentTime,
      sources: new Set(),
    };
  }

  function playFrame(bytes) {
    if (!audio || !bytes?.length) return;
    const samples = Math.floor(bytes.length / 2);
    const buffer = audio.context.createBuffer(
      1,
      samples,
      audio.context.sampleRate,
    );
    const output = buffer.getChannelData(0);
    const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    for (let index = 0; index < samples; index += 1)
      output[index] = view.getInt16(index * 2, true) / 32768;
    const source = audio.context.createBufferSource();
    source.buffer = buffer;
    source.connect(audio.inputGain);
    audio.sources.add(source);
    source.onended = () => audio.sources.delete(source);
    const startAt = Math.max(audio.context.currentTime, audio.nextTime);
    source.start(startAt);
    audio.nextTime = startAt + buffer.duration;
  }

  function stopPlayback() {
    if (!audio) return;
    audio.sources.forEach((source) => source.stop());
    audio.inputGain.disconnect();
    audio.volume.disconnect();
    audio.context.close().catch(() => {});
    audio = null;
  }

  function handleRecordedFrames(bytes) {
    const data = getController().stethoscopeWavFromCapture(bytes);
    if (data) storeCapture(data, getController().stethoscopeMode, bytes.length);
    captureCount += 1;
    setStatus();
    log(`Stethoscope recording captured (${bytes.length} bytes)`);
  }

  function storeCapture(data, mode, byteLength) {
    $("<audio>", { src: data, preload: "metadata" })
      .attr({
        "data-captured-at": new Date().toISOString(),
        "data-mode": String(mode),
        "data-byte-length": String(byteLength),
      })
      .appendTo("#stethoscope-captures");
  }

  function handleReading() {}
  function handleReadingState() {
    setStatus();
  }
  function handleDeviceError(error) {
    setStatus(`Error - ${errorText(error)}`);
  }

  function setStatus(override) {
    const mode = getController()?.stethoscopeMode || decl.MicrophoneModes.Off;
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
    attachEvents,
    activate,
    stop,
    handleReading,
    handleReadingState,
    handleDeviceError,
  };
}
