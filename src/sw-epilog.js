self.addEventListener("notificationclick", function(e) {
  var notification = e.notification;
  var primaryKey = notification.data.primaryKey;
  var action = e.action;

  if (action === "close") {
    notification.close();
  } else {
    clients.openWindow("http://www.example.com");
    notification.close();
  }
});

self.addEventListener("push", event => {
  let title =
    (event.data && event.data.text()) ||
    "a default message if nothing was passed to us";
  let body = "We have received a push message";
  let tag = "push-simple-demo-notification-tag";
  let icon = "/icon.png";

  event.waitUntil(
    self.registration.showNotification(title, { body, icon, tag })
  );
});
