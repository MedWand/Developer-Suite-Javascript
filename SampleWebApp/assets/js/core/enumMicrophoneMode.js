/**
 * Specifies the available microphone modes for the stethoscope functionality
 * within the MedWand SDK.
 */
export var MicrophoneModes;
(function (MicrophoneModes) {
    /** Disables the microphone. */
    MicrophoneModes["Off"] = "Off";
    /** Configures the microphone to capture heart sounds. */
    MicrophoneModes["Heart"] = "Heart";
    /** Configures the microphone to capture lung sounds. */
    MicrophoneModes["Lungs"] = "Lungs";
    /** Configures the microphone to capture bowel sounds. */
    MicrophoneModes["Bowel"] = "Bowel";
})(MicrophoneModes || (MicrophoneModes = {}));
//# sourceMappingURL=enumMicrophoneMode.js.map