import {
  ArrowRight,
  BarChart3,
  BookOpen,
  CalendarDays,
  MessageCircle,
  PenSquare,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { FireStreakIcon } from "../icons/fire-streak-icon";
import { IslaLogoIcon } from "../icons/isla-logo-icon";

const contentItems = [
  { label: "Create Content", icon: PenSquare },
  { label: "My chats", icon: MessageCircle },
  { label: "Content Schedule", icon: CalendarDays },
  { label: "Trending", icon: Search },
  { label: "Whatsapp notes", icon: Sparkles },
];

const brandContextItems = [
  { label: "Internal Knowledge", icon: BookOpen },
  { label: "Brand Audit", icon: ShieldCheck },
  { label: "Writing Style", icon: PenSquare },
];

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon" variant="sidebar">
      <SidebarHeader className="px-4 py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <IslaLogoIcon size={30} />
            <span className="text-base font-semibold">Isla</span>
          </div>
          <Avatar className="group-data-[collapsible=icon]:hidden">
            <AvatarImage src="/path/to/avatar.jpg" alt="User Avatar" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/70">
            Content
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {contentItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton
                    className="text-muted-foreground hover:text-foreground hover:bg-muted"
                    tooltip={item.label}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/70">
            Analytics
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive
                  className="text-foreground font-medium data-[active=true]:bg-primary/10 data-[active=true]:text-primary"
                  tooltip="Analytics"
                >
                  <BarChart3 className="h-4 w-4" />
                  <span>Analytics</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/70">
            Brand Context
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {brandContextItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton
                    className="text-muted-foreground hover:text-foreground hover:bg-muted"
                    tooltip={item.label}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="px-4 pb-4">
        <SidebarSeparator />
        <div className="flex items-center gap-3 py-3 group-data-[collapsible=icon]:justify-center">
          <div className="flex items-center justify-center rounded-lg bg-amber-50 p-1.5">
            <FireStreakIcon size={30} />
          </div>
          <div className="group-data-[collapsible=icon]:hidden">
            <p className="text-2xl font-bold leading-none text-foreground">7</p>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Day Streak
            </p>
          </div>
        </div>
        <div className="space-y-2 group-data-[collapsible=icon]:hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Credits Remaining
            </span>
            <span className="text-sm font-bold text-foreground">
              63{" "}
              <span className="text-muted-foreground font-normal">of 100</span>
            </span>
          </div>
          <Progress value={63} className="h-2" />
        </div>

        <SidebarSeparator className="group-data-[collapsible=icon]:hidden" />
        <button className="flex w-full items-center justify-between rounded-lg py-2 text-sm transition-colors hover:bg-muted group-data-[collapsible=icon]:hidden">
          <div className="text-left">
            <p className="font-semibold text-foreground">Pro Plan trial</p>
            <p className="text-xs text-muted-foreground">14 days left</p>
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground" />
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}
