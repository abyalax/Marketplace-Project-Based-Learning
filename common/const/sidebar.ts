import {
  BookOpen,
  GraduationCap,
  HelpCircle,
  Home,
  LayoutDashboard,
  MessagesSquare,
  Settings,
  Table2,
  Users,
} from 'lucide-react';
import { PERMISSIONS } from '~/common/const/permission';
import { MenuGroup, MenuItem } from '~/components/fragments/sidebar/sidebar-app';
import { url } from '~/lib/utils/converter';

export const sidebarItems = (clientId: string): MenuGroup[] => [
  {
    group: 'Learner',
    items: [
      {
        title: 'Dashboard',
        url: url('/client/[clientId]/dashboard', { clientId }),
        icon: LayoutDashboard,
        permissions: [PERMISSIONS.LEARNER.READ_PROJECT, PERMISSIONS.LEARNER.READ_CLASS],
      },
      {
        title: 'Projects',
        url: url('/client/[clientId]/cv', { clientId }),
        icon: Table2,
        permissions: [PERMISSIONS.LEARNER.READ_PROJECT],
      },
      {
        title: 'Messages',
        url: url('/client/[clientId]/messages', { clientId }),
        icon: MessagesSquare,
        permissions: [PERMISSIONS.LEARNER.READ_MESSAGES],
      },
      {
        title: 'Classes',
        url: url('/client/[clientId]/chats', { clientId }),
        icon: GraduationCap,
        permissions: [PERMISSIONS.LEARNER.READ_CLASS],
      },
      {
        title: 'Progress',
        url: url('/client/[clientId]/analyze', { clientId }),
        icon: BookOpen,
        permissions: [PERMISSIONS.LEARNER.READ_ENROLLMENT],
      },
    ],
  },
  {
    group: 'Backoffice',
    items: [
      {
        title: 'Dashboard',
        url: url('/backoffice/dashboard'),
        icon: Home,
        permissions: [PERMISSIONS.ADMIN.READ_TRAFFIC],
      },
      {
        title: 'Users',
        url: url('/backoffice/clients'),
        icon: Users,
        permissions: [PERMISSIONS.ADMIN.MANAGE_USERS],
      },
    ],
  },
];

export const bottomItems: MenuItem[] = [
  {
    title: 'Help & Support',
    url: '/help',
    icon: HelpCircle,
    permissions: [],
  },
  {
    title: 'Settings',
    url: '/settings',
    icon: Settings,
    permissions: [],
  },
];
