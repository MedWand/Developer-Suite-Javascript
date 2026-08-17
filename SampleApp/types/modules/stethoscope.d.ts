import { MedWandGeneration, MicrophoneModes } from "../core.js";
import { TypedEventTarget } from "../events.js";
export type StethoscopeModel = {
    name: string;
    manufacturerGuid: string;
    productGuid: string;
    nameGuid: string;
    selectedMicrophoneMode: MicrophoneModes;
    volumeAdjustable: boolean;
    volumeMax: number;
    gainAdjustable: boolean;
    gainMax: number;
    hasOnTimer: boolean;
    onTimeMax: number;
};
type StethoscopeEvents = {
    frameReady: Uint8Array;
    recordedFramesReady: Uint8Array;
};
/**
 * Represents a module for managing stethoscope-related events within a browser application.
 */
export declare class StethoscopeModule extends TypedEventTarget<StethoscopeEvents> {
    private mediaStream;
    private audioContext;
    private processor;
    private recordedChunks;
    private isRunning;
    private isRecording;
    private sampleRate;
    private channels;
    private bitRate;
    readonly stethoscopeModel: StethoscopeModel;
    /**
     * Gets a value indicating whether the stethoscope is currently monitoring.
     */
    get isMonitoring(): boolean;
    /**
     * Gets a value indicating whether the stethoscope is currently recording.
     */
    get recording(): boolean;
    /**
     * Gets the current microphone mode of the stethoscope.
     */
    get microphoneMode(): MicrophoneModes;
    /**
     * Starts the stethoscope preview in the specified microphone mode.
     *
     * @param medwandGeneration - The generation of the connected MedWand device.
     * @param microphoneMode - The desired microphone mode for the stethoscope.
     * @param speakerName - The name of the speaker to use for audio output. Can be `null` if no specific speaker is required.
     * @returns `true` if the preview started successfully; otherwise, `false`.
     *
     * @remarks
     * This method configures browser microphone capture and begins emitting frame data.
     */
    startPreview(medwandGeneration: MedWandGeneration, microphoneMode: MicrophoneModes, speakerName?: string | null): Promise<boolean>;
    /**
     * Stops the stethoscope preview and releases browser audio resources.
     */
    stopPreview(): void;
    /**
     * Starts recording stethoscope frames.
     *
     * @returns `true` if recording started successfully; otherwise, `false`.
     */
    startRecordingFrames(): boolean;
    /**
     * Stops recording stethoscope frames.
     *
     * @returns `true` if recording stopped successfully; otherwise, `false`.
     *
     * @remarks
     * When recording stops, this method emits `recordedFramesReady` with the recorded frame data.
     */
    stopRecordingFrames(): boolean;
    /**
     * Converts the provided stethoscope capture data into a WAV audio file format.
     *
     * @param bytes - The byte array representing the stethoscope capture data.
     * @returns A Base64-encoded string representing the WAV audio file.
     */
    wavFromFrames(bytes: Uint8Array): string;
}
export {};