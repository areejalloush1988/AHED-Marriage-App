"use client";

import { useEffect } from "react";

export function WebOnlyCleanup() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    void navigator.serviceWorker
      .getRegistrations()
      .then((registrations) =>
        Promise.allSettled(registrations.map((registration) => registration.unregister())),
      )
      .catch(() => undefined);
  }, []);

  return null;
}
