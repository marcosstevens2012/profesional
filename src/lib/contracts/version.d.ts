/**
 * Contracts version for API compatibility
 * Format: MAJOR.MINOR.PATCH
 *
 * MAJOR: Breaking changes to schema structure
 * MINOR: New schemas or non-breaking additions
 * PATCH: Bug fixes, optimizations
 */
export declare const CONTRACTS_VERSION = "1.0.0";
/**
 * Version history and migration notes
 */
export declare const VERSION_HISTORY: {
  readonly "1.0.0": {
    readonly date: "2025-08-19";
    readonly description: "Initial comprehensive contract definitions";
    readonly changes: readonly [
      "User, Profile, and ProfessionalProfile schemas",
      "ServiceCategory and ServiceTag schemas",
      "Location with Argentina provinces support",
      "AvailabilitySlot for professional scheduling",
      "Booking with complete status lifecycle",
      "Payment integration with MercadoPago",
      "PaymentEvent for webhook audit trail",
      "Conversation and Message for chat system",
      "Review system with professional responses",
      "Notification system with types",
      "CommissionRule for platform fees",
      "Search and pagination utilities",
    ];
  };
};
/**
 * Check if current version is compatible with required version
 */
export declare function isCompatible(requiredVersion: string): boolean;
/**
 * Get the current contracts version
 */
export declare function getVersion(): string;
//# sourceMappingURL=version.d.ts.map
