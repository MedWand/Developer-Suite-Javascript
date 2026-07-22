/**
 * Specifies the available camera modes for the MedWand SDK.
 */
export declare enum CameraModes {
    /** The camera is turned off. */
    Off = "Off",
    /** The camera is operating in dermatoscope mode, suitable for skin examinations. */
    Dermatoscope = "Dermatoscope",
    /** The camera is operating in otoscope mode, suitable for ear examinations. */
    Otoscope = "Otoscope"
}
/**
 * Specifies the available focus modes for cameras supported by the MedWand SDK.
 */
export declare enum FocusModes {
    /** No focus adjustment is applied. */
    None = "None",
    /** The camera automatically adjusts the focus. */
    Auto = "Auto",
    /** The focus is manually adjusted by the user. */
    Manual = "Manual"
}