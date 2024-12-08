'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {  Search, PieChart, LogOut, FolderKey, UserRoundPen, SquarePen } from 'lucide-react';

import { NavMain } from '@/components/nav-main';
import {
  Sidebar,
  SidebarContent,
  SidebarRail,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { showToast } from '@/components/Toast';
import useAuthStore from '@/lib/Auth/useAuthStore';

// This is sample data.
const data = {
  navMain: [
    {
      title: 'Dashboard',
      url: '/dashboard',
      icon: PieChart,
    },
    {
      title: 'Profile',
      url: '/profile',
      icon: UserRoundPen,
      isActive: true,
    },
    {
      title: 'Create',
      url: '/create',
      icon: SquarePen,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter();
  const { logout } = useAuthStore(); // Make sure to destructure correctly if it's exported as part of an object

  const handleLogout = () => {
    logout();
    showToast('Logout success!', 'You have successfully logged out', 'SUCCESS');
    router.replace('/'); // Navigate to the root or login page after logout
  };

  return (
    <Sidebar collapsible='icon' {...props}>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <SidebarMenuItem>
          <SidebarMenuButton tooltip='Logout' onClick={handleLogout}>
            <LogOut />
            <span>Logout</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
