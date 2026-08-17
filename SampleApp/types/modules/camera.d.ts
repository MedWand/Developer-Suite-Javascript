import { CameraModes, FocusModes, OtoscopeMaskInfo } from "../core.js";
import { TypedEventTarget } from "../events.js";
export type ResolutionInfo = {
    width: number;
    height: number;
    frameRate: number;
    colorSpace: string;
    compression: string;
};
export type FocusInfo = {
    hasAutoFocus: boolean;
    hasManualFocus: boolean;
    focusMinimum: number;
    focusMaximum: number;
};
export type CameraModel = {
    name: string;
    vendorId: string;
    productId: string;
    usbPath: string;
    focusInfo: FocusInfo;
    dermatoscopeResolution: {
        width: number;
        height: number;
    };
    otoscopeResolution: {
        width: number;
        height: number;
    };
    otoscopeMaskInfo: OtoscopeMaskInfo;
    selectedCameraMode: CameraModes;
    selectedFocusMode: FocusModes;
    selectedFocusModeValue: number;
    ledIntensityAdjustable: boolean;
    ledIntensityMax: number;
    hasOnTimer: boolean;
    onTimeMax: number;
    coolTimeMin: number;
    selectedResolutionInfo: ResolutionInfo;
    setCameraMode(cameraMode: CameraModes): void;
};
type CameraEvents = {
    frameReady: Uint8ClampedArray;
    recordedFrameReady: Uint8ClampedArray;
};
/**
 * Represents a browser module for managing camera events within a browser application.
 */
export declare class CameraModule extends TypedEventTarget<CameraEvents> {
    private mediaStream;
    private video;
    private canvas;
    private animationFrameId;
    private latestFrame;
    private isRunning;
    private tipCenterLeft;
    private tipCenterTop;
    private tipRadius;
    private tipZoom;
    private preferredVideoDeviceId;
    /**
     * Gets the camera model associated with the module.
     *
     * @remarks
     * The camera model provides camera configuration details such as resolution, focus mode, camera mode,
     * and LED intensity capabilities.
     */
    cameraModel: CameraModel;
    /**
     * Gets a value indicating whether the camera is currently monitoring.
     */
    get isMonitoring(): boolean;
    /**
     * Gets a value indicating whether the camera's LED intensity is adjustable.
     */
    get ledIntensityAdjustable(): boolean;
    /**
     * Gets the maximum LED intensity value for the camera.
     */
    get ledIntensityMax(): number;
    /**
     * Gets the currently rendered otoscope mask geometry.
     */
    get currentOtoscopeMaskInfo(): OtoscopeMaskInfo;
    /**
     * Starts the camera preview in the specified camera mode.
     *
     * @param previewTarget - The `HTMLVideoElement` or `HTMLCanvasElement` where the camera preview will be displayed.
     * @param cameraMode - The desired camera mode.
     * @returns `true` if the preview started successfully; otherwise, `false`.
     *
     * @remarks
     * This method configures browser media capture, selects the requested camera mode, and begins emitting frame data.
     */
    startPreview(previewTarget: HTMLVideoElement | HTMLCanvasElement | null, cameraMode: CameraModes): Promise<boolean>;
    /**
     * Stops the camera preview and releases browser media resources.
     */
    stopPreview(): void;
    /**
     * Resets the camera's zoom and position to their initial values.
     */
    reset(): void;
    /**
     * Adjusts the zoom level of the camera by the specified increment.
     *
     * @param increment - The amount by which to adjust the zoom level. Positive values zoom in, while negative values zoom out.
     */
    zoom(increment: number): void;
    /**
     * Adjusts the otoscope mask opening radius by the specified increment.
     */
    resizeMask(increment: number): void;
    /**
     * Moves the camera by the specified increments in the horizontal and vertical directions.
     *
     * @param incrementLeft - The amount to move the camera horizontally. `null` indicates no horizontal movement.
     * @param incrementTop - The amount to move the camera vertically. `null` indicates no vertical movement.
     */
    move(incrementLeft?: number | null, incrementTop?: number | null): void;
    /**
     * Sets the browser camera focus mode when the active media track supports it.
     */
    setFocusMode(focusMode: FocusModes, resetLastValue?: boolean): Promise<boolean>;
    /**
     * Sets the browser camera focus distance when manual focus is supported.
     */
    setManualFocus(value: number): Promise<boolean>;
    /**
     * Records the latest available frame.
     *
     * @remarks
     * If a frame is available, this method emits `recordedFrameReady` with a copy of the latest frame data.
     */
    recordFrame(): void;
    /**
     * Converts a captured byte array from the camera into a Base64-encoded bitmap string.
     *
     * @param bytes - The byte array representing the captured camera frame.
     * @param width - Optional frame width. If omitted, the selected camera resolution is used.
     * @param height - Optional frame height. If omitted, the selected camera resolution is used.
     * @returns A Base64-encoded bitmap string.
     */
    bitmapFromFrame(bytes: Uint8Array | Uint8ClampedArray, width?: number, height?: number): string;
    private setCameraMode;
    private drawLoop;
    private drawOtoscopeMask;
    private get videoLabel();
    private selectCameraModelFromAvailableDevices;
    private updateCameraModelFromLabel;
}
export {};