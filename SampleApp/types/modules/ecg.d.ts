import { MedWandReading } from "../core.js";
import { TypedEventTarget } from "../events.js";
type EcgEvents = {
    recordedStripReady: string;
};
/**
 * Represents a browser ECG module for monitoring, recording, and processing ECG data.
 */
export declare class EcgModule extends TypedEventTarget<EcgEvents> {
    private readonly recordedData;
    private readonly readingQueue;
    private animationFrameId;
    private isRecording;
    private isMonitoring;
    private canvas;
    private lastX;
    private lastY;
    private lineColor;
    /**
     * Starts the ECG monitoring process.
     *
     * @param canvas - Optional canvas used to render ECG data.
     */
    startMonitoring(canvas?: HTMLCanvasElement | null): void;
    /**
     * Stops the ECG monitoring process.
     */
    stopMonitoring(): void;
    /**
     * Starts recording ECG data.
     */
    startRecording(): void;
    /**
     * Stops recording ECG data.
     *
     * @remarks
     * When recording stops, this method emits `recordedStripReady` with a Base64-encoded bitmap string.
     */
    stopRecording(): void;
    /**
     * Gets the recorded ECG data as a list of numeric values.
     *
     * @returns A list of recorded ECG values, or `null` if no data is available.
     */
    getRecordedData(): number[] | null;
    /**
     * Adds an ECG reading to the processing queue.
     *
     * @param reading - The MedWand reading containing ECG data.
     */
    addReading(reading: MedWandReading): void;
    /**
     * Converts a captured byte array from the ECG into a Base64-encoded bitmap string.
     *
     * @param bytes - The byte array representing the captured ECG data.
     * @returns A Base64-encoded bitmap string.
     */
    bitmapFromCapture(bytes: Uint8Array): string;
    /**
     * Sets the color used for the live ECG trace.
     *
     * @param color - Any valid canvas stroke style color string.
     */
    setLineColor(color: string): void;
    private get baseline();
    private processQueue;
    private drawGrid;
    private drawReading;
    private restoreLeaderTrail;
    private drawLeader;
    private createRecordedEcgStrip;
}
export {};