// Domain types for Tasks. Intentionally lean — every display string comes
// from the backend; the client does not invent status labels or workflow
// transitions. When new statuses or transitions land server-side, this file
// gets additive updates.

export type TaskStatus = string;      // e.g. 'scheduled' | 'in_progress' | 'completed' …

export type TaskSummary = {
  id: string;
  title: string;
  buildingId: string;
  buildingName: string | null;
  locationId: string | null;
  locationLabel: string | null;
  status: TaskStatus;
  priority: 'low' | 'medium' | 'high' | 'urgent' | string | null;
  assigneeUserId: string | null;
  dueAt: string | null;
  lifecycleStage: string | null;
};

export type TaskTransition = {
  toStatus: TaskStatus;
  label: string;
  requiresComment?: boolean;
  requiresEvidence?: boolean;
};

export type TaskDetail = TaskSummary & {
  description: string | null;
  // Server dictates which transitions the current user may perform. Mobile
  // renders only these; never invents its own.
  allowedTransitions: TaskTransition[];
};

export type TaskComment = {
  id: string;
  actor: string;
  message: string;
  createdAt: string;
};

export type TaskTimelineEntry = {
  id: string;
  eventType: string;
  actor: string;
  createdAt: string;
  message: string | null;
};
