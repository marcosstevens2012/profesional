/* eslint-disable no-unused-vars */
declare global {
  interface Window {
    posthog?: {
      identify: (_userId: string, _properties?: Record<string, any>) => void;
      capture: (_event: string, _properties?: Record<string, any>) => void;
      reset: () => void;
      group: (
        _groupType: string,
        _groupKey: string,
        _groupProperties?: Record<string, any>
      ) => void;
    };
  }
}

export {};
