/**
 * Specifies the available microphone modes for the stethoscope functionality
 * within the MedWand SDK.
 */
export declare enum MicrophoneModes {
    /** Disables the microphone. */
    Off = "Off",
    /** Configures the microphone to capture heart sounds. */
    Heart = "Heart",
    /** Configures the microphone to capture lung sounds. */
    Lungs = "Lungs",
    /** Configures the microphone to capture bowel sounds. */
    Bowel = "Bowel"
}