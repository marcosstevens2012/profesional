# 🔍 Observability & Monitoring Guide

Complete observability setup for the Profesional platform with error tracking, analytics, and performance monitoring.

## 📊 Monitoring Stack

### Error Tracking - Sentry

- **Web App**: Client and server-side error tracking
- **API**: Backend error monitoring and performance
- **Real-time alerts**: Email/Slack notifications for critical errors

### Analytics - PostHog

- **User behavior**: Page views, clicks, user journeys
- **Business metrics**: Bookings, payments, conversions
- **Feature flags**: A/B testing and gradual rollouts
- **Retention analysis**: User engagement and churn

### Performance Monitoring

- **API Response times**: Endpoint performance tracking
- **Database queries**: Query optimization insights
- **Bundle analysis**: Frontend performance monitoring
- **Core Web Vitals**: User experience metrics

## 🚀 Quick Setup

### 1. Sentry Configuration

**Create Sentry Projects:**

1. Go to [sentry.io](https://sentry.io) → New Project
2. Create two projects:
   - `profesional-web` (Next.js)
   - `profesional-api` (Node.js)

**Environment Variables:**

```bash
# Both web and API
SENTRY_DSN=https://your-key@o123456.ingest.sentry.io/123456

# Web only (public)
NEXT_PUBLIC_SENTRY_DSN=https://your-key@o123456.ingest.sentry.io/123456
```

### 2. PostHog Configuration

**Create PostHog Project:**

1. Go to [posthog.com](https://posthog.com) → New Project
2. Get your project API key

**Environment Variables:**

```bash
# Both web and API
POSTHOG_KEY=phc_your_project_key

# Web only (public)
NEXT_PUBLIC_POSTHOG_KEY=phc_your_project_key
```

## 📋 Implementation Details

### Web App Integration

**Automatic Error Boundary:**

```typescript
// apps/web/src/app/error.tsx
'use client';

import { useEffect } from 'react';
import { logComponentError } from '@/lib/logger';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logComponentError(error, { componentStack: error.stack || '' });
  }, [error]);

  return (
    <div className="error-boundary">
      <h2>Something went wrong!</h2>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

**Analytics Integration:**

```typescript
// Track user interactions
import { analytics } from "@/lib/analytics";

// In components
const handleBookingCreated = (bookingId: string) => {
  analytics.bookingCreated(bookingId, professionalId, amount);
};

const handleUserLogin = (userId: string) => {
  analytics.identify(userId, { email, role });
  analytics.track("user_login", { method: "email" });
};
```

### API Integration

**Error Handling Middleware:**

```typescript
// Global exception filter
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private observability: ObservabilityService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    this.observability.error(exception);
    // Handle response...
  }
}
```

**Business Event Tracking:**

```typescript
// In services
@Injectable()
export class BookingService {
  constructor(private observability: ObservabilityService) {}

  async createBooking(data: CreateBookingDto) {
    const start = Date.now();

    try {
      const booking = await this.bookingRepository.save(data);

      // Track success
      this.observability.trackBookingEvent("created", booking.id, {
        professional_id: booking.professionalId,
        amount: booking.amount,
        duration: Date.now() - start,
      });

      return booking;
    } catch (error) {
      // Track error with context
      this.observability.setContext("booking_creation", data);
      this.observability.error(error);
      throw error;
    }
  }
}
```

## 📈 Key Metrics to Track

### Business Metrics

```typescript
// Revenue tracking
analytics.track("revenue_generated", {
  amount: booking.amount,
  commission: booking.commission,
  professional_id: booking.professionalId,
});

// Conversion funnel
analytics.track("signup_started");
analytics.track("signup_completed");
analytics.track("first_booking_made");

// Professional onboarding
analytics.track("professional_application_submitted");
analytics.track("professional_approved");
analytics.track("first_booking_received");
```

### Technical Metrics

```typescript
// API performance
observability.trackPerformance("create_booking", duration, true, {
  endpoint: "/bookings",
  user_id: userId,
});

// Database performance
observability.trackPerformance("db_query", queryTime, true, {
  query_type: "booking_search",
  result_count: results.length,
});

// External service calls
observability.trackPerformance("mercadopago_payment", duration, success, {
  payment_id: paymentId,
  amount: amount,
});
```

## 🚨 Alerting Rules

### Critical Alerts (PagerDuty/Slack)

- API response time > 5 seconds
- Error rate > 5% in 5 minutes
- Payment processing failures > 10/hour
- Database connection errors
- Memory usage > 85%

### Warning Alerts (Email)

- API response time > 2 seconds
- Error rate > 2% in 15 minutes
- Failed login attempts > 20/hour
- Disk usage > 80%

### Business Alerts

- Booking creation failures > 5/hour
- Payment reconciliation delays > 1 hour
- Professional application queue > 50 pending
- User registration drops > 50% vs yesterday

## 📊 Dashboards

### Operations Dashboard

- API health status
- Response times (95th percentile)
- Error rates by endpoint
- Active user count
- System resources (CPU, memory, disk)

### Business Dashboard

- Daily/weekly/monthly revenue
- Booking conversion rates
- Professional approval rates
- Payment success rates
- User growth metrics

### Performance Dashboard

- Core Web Vitals (LCP, FID, CLS)
- Bundle sizes and load times
- Database query performance
- Third-party service response times

## 🔧 Configuration Examples

### Sentry Configuration

```typescript
// sentry.client.config.ts
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
  debug: false,
  replaysOnErrorSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  integrations: [
    new Sentry.Replay({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
});
```

### PostHog Configuration

```typescript
// posthog.ts
import { PostHog } from "posthog-js";

if (typeof window !== "undefined") {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: "https://app.posthog.com",
    autocapture: false, // Disable for GDPR compliance
    capture_pageview: false, // Manual page tracking
  });
}
```

## 📱 Mobile App Considerations

### React Native Integration

```typescript
// For future mobile app
import * as Sentry from "@sentry/react-native";
import PostHog from "posthog-react-native";

// Initialize with same configuration
```

## 🔒 Privacy & Compliance

### GDPR Compliance

- Mask sensitive data in error reports
- Allow users to opt-out of analytics
- Data retention policies (30 days for errors, 365 days for analytics)
- User data deletion on request

### Data Anonymization

```typescript
// Sanitize sensitive data before sending
const sanitizedUser = {
  id: user.id,
  role: user.role,
  // Don't send email, phone, etc.
};

analytics.identify(user.id, sanitizedUser);
```

## 🚀 Deployment Integration

### CI/CD Pipeline

```yaml
# In GitHub Actions
- name: Upload source maps to Sentry
  run: |
    pnpm sentry-cli releases files upload-sourcemaps .next/static

- name: Create Sentry release
  run: |
    pnpm sentry-cli releases new ${{ github.sha }}
    pnpm sentry-cli releases set-commits --auto ${{ github.sha }}
```

### Health Checks

```typescript
// Include observability in health check
@Get('health')
async healthCheck() {
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
    sentry: !!process.env.SENTRY_DSN,
    posthog: !!process.env.POSTHOG_KEY,
    version: process.env.npm_package_version
  };
}
```

This observability setup provides comprehensive monitoring for both technical and business metrics, ensuring you can operate the platform effectively from day 1 with full visibility into system health and user behavior.
