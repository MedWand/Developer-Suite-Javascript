/**
 * Defines the various states of a license within the system.
 *
 * - The license is invalid or not recognized.
 * - The license does not support the requested feature.
 * - The license is nearing its expiration date.
 * - The license has expired and is no longer valid.
 */
export declare enum LicenseState {
    /**
     * Represents an invalid state of the license, indicating that the
     * license is either missing, corrupted, or otherwise unusable.
     */
    Invalid = "Invalid",
    /**
     * Indicates that the license does not support the feature requested.
     */
    InvalidFeature = "InvalidFeature",
    /**
     * Indicates that the license is nearing its expiration date but is still valid.
     */
    Expiring = "Expiring",
    /**
     * Indicates that the license has expired and is no longer valid.
     */
    Expired = "Expired"
}
/**
 * Represents an error associated with a license, including its state
 * and any related exception details.
 */
export declare class LicenseError {
    /**
     * Represents the current state of the license.
     */
    readonly state: LicenseState;
    /**
     * Exception details.
     */
    readonly exception: Error;
    constructor(state: LicenseState, exception: Error);
}