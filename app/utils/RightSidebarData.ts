// ─── Types ───────────────────────────────────────────────────────────────────

export interface AppNotification {
  id: number;
  title: string;
  message: string;
  time: string;
  unread: boolean;
}

export interface MemberStats {
  totalMembers: number;
  members: number;
  nonMembers: number;
}

// ─── Mock Data (replace with real API calls) ─────────────────────────────────

export const MOCK_NOTIFICATIONS: AppNotification[] = [
  {
    id: 1,
    title: "Creek Club Tambola Night",
    message: "Creek Club invites you to a lively Tambola evening for all members",
    time: "2 min ago",
    unread: true,
  },
  {
    id: 2,
    title: "Announcement - DHA",
    message: "Join Us for a fun-filled tambola night today at 26-01-2026.",
    time: "15 min ago",
    unread: true,
  },
  {
    id: 3,
    title: "Creek Club Tambola Night",
    message: "Creek Club invites you to a lively Tambola evening for all members.",
    time: "1 hr ago",
    unread: true,
  },
  {
    id: 4,
    title: "Announcement - DHA",
    message: "Join Us for a fun-filled tambola night today at 26-01-2026.",
    time: "2 hr ago",
    unread: false,
  },
  {
    id: 5,
    title: "Creek Club Tambola Night",
    message: "Creek Club invites you to a lively Tambola evening for all members",
    time: "3 hr ago",
    unread: false,
  },
  {
    id: 6,
    title: "Property Updated",
    message: "Unit 14B ownership details updated.",
    time: "5 hr ago",
    unread: false,
  },
  {
    id: 7,
    title: "System Maintenance",
    message: "Scheduled maintenance on Sunday 2:00 AM.",
    time: "Yesterday",
    unread: false,
  },
];

export const MOCK_STATS: MemberStats = {
  totalMembers: 120,
  members: 80,
  nonMembers: 40,
};