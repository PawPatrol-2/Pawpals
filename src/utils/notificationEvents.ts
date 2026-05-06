export const NOTIFICATION_CHANGED_EVENT = "pawpals:notifications-changed";

export const emitNotificationChange = () => {
  window.dispatchEvent(new Event(NOTIFICATION_CHANGED_EVENT));
};
