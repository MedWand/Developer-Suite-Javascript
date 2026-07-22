/**
 * Defines the various states of a license within the system.
 *
 * - The license is invalid or not recognized.
 * - The license does not support the requested feature.
 * - The license is nearing its expiration date.
 * - The license has expired and is no longer valid.
 */
export var LicenseState;
(function (LicenseState) {
    /**
     * Represents an invalid state of the license, indicating that the
     * license is either missing, corrupted, or otherwise unusable.
     */
    LicenseState["Invalid"] = "Invalid";
    /**
     * Indicates that the license does not support the feature requested.
     */
    LicenseState["InvalidFeature"] = "InvalidFeature";
    /**
     * Indicates that the license is nearing its expiration date but is still valid.
     */
    LicenseState["Expiring"] = "Expiring";
    /**
     * Indicates that the license has expired and is no longer valid.
     */
    LicenseState["Expired"] = "Expired";
})(LicenseState || (LicenseState = {}));
/**
 * Represents an error associated with a license, including its state
 * and any related exception details.
 */
export class LicenseError {
    /**
     * Represents the current state of the license.
     */
    state;
    /**
     * Exception details.
     */
    exception;
    constructor(state, exception) {
        this.state = state;
        this.exception = exception;
    }
}
//# sourceMappingURL=enumLicense.js.map