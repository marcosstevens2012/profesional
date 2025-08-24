/**
 * Utility functions for handling location data
 */

export interface LocationObject {
  id?: string;
  city?: string;
  province?: string;
}

/**
 * Safely converts a location object or string to a display string
 */
export function formatLocation(
  location: string | LocationObject | null | undefined
): string {
  if (!location) {
    return "Ubicación no especificada";
  }

  // If it's already a string, return it
  if (typeof location === "string") {
    return location;
  }

  // If it's an object, format it
  if (typeof location === "object") {
    const { city, province } = location;
    const parts = [city, province].filter(Boolean);
    return parts.length > 0 ? parts.join(", ") : "Ubicación no especificada";
  }

  return "Ubicación no especificada";
}
