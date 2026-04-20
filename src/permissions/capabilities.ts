// Canonical list of capabilities the mobile app RECOGNISES. Backend is still
// the source of truth for what a user can do — this enum is just a typed
// mirror so the client can render UI conditionally without string-matching.
//
// Rule: if a feature is gated by a capability NOT in this list, it means the
// mobile build is older than the backend contract — route it through a
// generic "unknown capability" guard that defaults to hiding the UI.

export const Capability = {
  tasksRead: 'tasks.read',
  tasksAcceptAssigned: 'tasks.accept_assigned',
  tasksTransition: 'tasks.transition',
  tasksCommentCreate: 'tasks.comment_create',
  tasksAttachmentUpload: 'tasks.attachment_upload',

  scannerResolveQr: 'scanner.resolve_qr',

  notificationsRegisterDevice: 'notifications.register_device',

  buildingsListAccessible: 'buildings.list_accessible',
  buildingsChangeActiveScope: 'buildings.change_active_scope',

  profileRead: 'profile.read',
  settingsRead: 'settings.read',
} as const;

export type CapabilityKey = (typeof Capability)[keyof typeof Capability];
