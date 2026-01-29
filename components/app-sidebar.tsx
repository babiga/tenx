import * as React from "react"
import {
  ArrowUpCircleIcon,
  BriefcaseIcon,
  CalendarIcon,
  CrownIcon,
  LayoutDashboardIcon,
  PartyPopperIcon,
  SettingsIcon,
  StarIcon,
  UsersIcon,
  UtensilsIcon,
  WalletIcon,
} from "lucide-react"

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import type { DashboardUserWithProfile } from "@/lib/auth"

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboardIcon,
    },
    {
      title: "Bookings",
      url: "/dashboard/bookings",
      icon: CalendarIcon,
    },
    {
      title: "Events",
      url: "/dashboard/events",
      icon: PartyPopperIcon,
    },
    {
      title: "Jobs",
      url: "/dashboard/jobs",
      icon: BriefcaseIcon,
    },
  ],
  navManagement: [
    {
      name: "Menus",
      url: "/dashboard/menus",
      icon: UtensilsIcon,
    },
    {
      name: "Users",
      url: "/dashboard/users",
      icon: UsersIcon,
    },
    {
      name: "Finance",
      url: "/dashboard/finance",
      icon: WalletIcon,
    },
  ],
  navSecondary: [
    {
      title: "Reviews",
      url: "/dashboard/reviews",
      icon: StarIcon,
    },
    {
      title: "Memberships",
      url: "/dashboard/memberships",
      icon: CrownIcon,
    },
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: SettingsIcon,
    },
  ],
}

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: DashboardUserWithProfile
}

export function AppSidebar({ user, ...props }: AppSidebarProps) {
  const navUser = {
    name: user.name,
    email: user.email,
    avatar: user.avatar || "/avatars/default.png",
  }

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <ArrowUpCircleIcon className="h-5 w-5" />
                <span className="text-base font-semibold">Tenx Catering</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.navManagement} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={navUser} />
      </SidebarFooter>
    </Sidebar>
  )
}
