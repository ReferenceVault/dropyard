import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingBag,
  MessageSquare,
  Truck,
  Calendar,
  BarChart3,
  Inbox,
  Mail,
  type LucideIcon,
} from "lucide-react";

export type AdminNavItem = {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
  disabled?: boolean;
};

export type AdminNavSection = {
  id: string;
  label: string;
  items: AdminNavItem[];
};

export const ADMIN_NAV: AdminNavSection[] = [
  {
    id: "core",
    label: "Core",
    items: [
      { id: "overview", label: "Overview", href: "/admin",          icon: LayoutDashboard },
      { id: "inbox",    label: "Inbox",    href: "/admin/inbox",    icon: Inbox },
      { id: "users",    label: "Users",    href: "/admin/users",    icon: Users },
      { id: "items",    label: "Items",    href: "/admin/items",    icon: Package,       badge: "Soon", disabled: true },
      { id: "claims",   label: "Claims",   href: "/admin/claims",   icon: ShoppingBag,   badge: "Soon", disabled: true },
      { id: "messages", label: "Messages", href: "/admin/messages", icon: MessageSquare, badge: "Soon", disabled: true },
    ],
  },
  {
    id: "operations",
    label: "Operations",
    items: [
      { id: "moving-sales", label: "Moving Sales", href: "/admin/moving-sales", icon: Truck },
      { id: "email-blasts", label: "Email Blasts", href: "/admin/email-blasts", icon: Mail },
      { id: "drops",        label: "Drops",        href: "/admin/drops",        icon: Calendar,  badge: "Soon", disabled: true },
      { id: "reports",      label: "Reports",      href: "/admin/reports",      icon: BarChart3, badge: "Soon", disabled: true },
    ],
  },
];
