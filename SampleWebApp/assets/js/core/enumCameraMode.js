/**
 * Specifies the available camera modes for the MedWand SDK.
 */
export var CameraModes;
(function (CameraModes) {
    /** The camera is turned off. */
    CameraModes["Off"] = "Off";
    /** The camera is operating in dermatoscope mode, suitable for skin examinations. */
    CameraModes["Dermatoscope"] = "Dermatoscope";
    /** The camera is operating in otoscope mode, suitable for ear examinations. */
    CameraModes["Otoscope"] = "Otoscope";
})(CameraModes || (CameraModes = {}));
/**
 * Specifies the available focus modes for cameras supported by the MedWand SDK.
 */
export var FocusModes;
(function (FocusModes) {
    /** No focus adjustment is applied. */
    FocusModes["None"] = "None";
    /** The camera automatically adjusts the focus. */
    FocusModes["Auto"] = "Auto";
    /** The focus is manually adjusted by the user. */
    FocusModes["Manual"] = "Manual";
})(FocusModes || (FocusModes = {}));
//# sourceMappingURL=enumCameraMode.js.map