import { PostHog } from "posthog-node";
import { getPublicConfig } from "./environment";

let posthogClient: PostHog | null = null;

export function initializePostHog() {
  const config = getPublicConfig();

  if (config.posthogKey && typeof window !== "undefined") {
    // Client-side PostHog initialization
    const { posthog } = require("posthog-js");

    posthog.init(config.posthogKey, {
      api_host: "https://app.posthog.com",
      autocapture: config.isProduction,
      capture_pageview: true,
      capture_pageleave: true,
      disable_session_recording: !config.isProduction,
      debug: config.enableDebug,
      loaded: (posthog: any) => {
        if (config.isDevelopment) {
          posthog.debug();
        }
      },
    });

    return posthog;
  }

  return null;
}

export function initializeServerPostHog() {
  const config = getPublicConfig();

  if (config.posthogKey && !posthogClient) {
    posthogClient = new PostHog(config.posthogKey, {
      host: "https://app.posthog.com",
    });
  }

  return posthogClient;
}

// Analytics utilities
export const analytics = {
  // User events
  identify: (userId: string, properties?: Record<string, any>) => {
    if (typeof window !== "undefined" && window.posthog) {
      window.posthog.identify(userId, properties);
    }

    if (posthogClient) {
      posthogClient.identify({
        distinctId: userId,
        properties,
      });
    }
  },

  // Track events
  track: (event: string, properties?: Record<string, any>) => {
    if (typeof window !== "undefined" && window.posthog) {
      window.posthog.capture(event, properties);
    }

    if (posthogClient) {
      posthogClient.capture({
        distinctId: "server",
        event,
        properties,
      });
    }
  },

  // Page views
  pageview: (url?: string) => {
    if (typeof window !== "undefined" && window.posthog) {
      window.posthog.capture("$pageview", {
        $current_url: url || window.location.href,
      });
    }
  },

  // Business events
  bookingCreated: (
    bookingId: string,
    professionalId: string,
    amount: number
  ) => {
    analytics.track("booking_created", {
      booking_id: bookingId,
      professional_id: professionalId,
      amount,
      timestamp: new Date().toISOString(),
    });
  },

  paymentProcessed: (paymentId: string, amount: number, status: string) => {
    analytics.track("payment_processed", {
      payment_id: paymentId,
      amount,
      status,
      timestamp: new Date().toISOString(),
    });
  },

  userRegistered: (userId: string, userType: "client" | "professional") => {
    analytics.track("user_registered", {
      user_id: userId,
      user_type: userType,
      timestamp: new Date().toISOString(),
    });
  },

  professionalApproved: (professionalId: string) => {
    analytics.track("professional_approved", {
      professional_id: professionalId,
      timestamp: new Date().toISOString(),
    });
  },

  // Admin actions
  adminAction: (action: string, targetId: string, adminId: string) => {
    analytics.track("admin_action", {
      action,
      target_id: targetId,
      admin_id: adminId,
      timestamp: new Date().toISOString(),
    });
  },
};

// Cleanup function
export function shutdownPostHog() {
  if (posthogClient) {
    posthogClient.shutdown();
  }
}
