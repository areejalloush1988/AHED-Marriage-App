/* AHED service worker: notification display and notification-click routing. */

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("push", (event) => {
  let payload = {};
  try {
    payload = event.data ? event.data.json() : {};
  } catch {
    payload = { body: event.data?.text() };
  }

  const appRoot = self.registration.scope;
  event.waitUntil(
    self.registration.showNotification(payload.title || "رسالة جديدة في عَهْد", {
      body: payload.body || "وصلتك رسالة جديدة داخل التطبيق.",
      icon: new URL("favicon.png", appRoot).href,
      badge: new URL("favicon.png", appRoot).href,
      tag: payload.tag || "ahed-message",
      data: {
        url: payload.url || new URL("inside/", appRoot).href,
        conversationId: payload.conversationId,
      },
    }),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const targetUrl = new URL(
    event.notification.data?.url || "inside/",
    self.registration.scope,
  ).href;

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      const existing = clients.find((client) => client.url.startsWith(self.location.origin));
      if (existing) {
        existing.navigate(targetUrl);
        return existing.focus();
      }
      return self.clients.openWindow(targetUrl);
    }),
  );
});
