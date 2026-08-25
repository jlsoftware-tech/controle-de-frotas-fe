import { Link } from 'react-router-dom';
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
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from '@/shared/components/ui/sidebar';
import { ChevronRight } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/shared/components/ui/collapsible';
import { NAVIGATION_ITEMS } from '@/shared/constants/navigation';
import useAuthStore from '@/modules/auth/store/useAuthStore';
import logo from '@/assets/logo.png';

export function AppSidebar() {
  const user = useAuthStore((s) => s.user);
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border py-6 flex flex-col items-center justify-center gap-3 overflow-hidden group-data-[collapsible=icon]:py-4">
        <img 
          src={logo} 
          alt="Logo" 
          className="w-36 h-auto shrink-0 object-contain drop-shadow-sm group-data-[collapsible=icon]:w-8 transition-all" 
        />
        <div className="flex flex-col items-center text-center group-data-[collapsible=icon]:hidden">
          <span className="font-black text-xl text-sidebar-primary tracking-tight leading-none">
            Control Frotas
          </span>
          <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mt-1">
            Gestão Inteligente
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1.5">
              {NAVIGATION_ITEMS.filter(
                (item) => !item.allowedRoles || (user && item.allowedRoles.includes(user.role))
              ).map((item) => {
                const filteredSubItems = item.items?.filter(
                  (subItem) => !subItem.allowedRoles || (user && subItem.allowedRoles.includes(user.role))
                ) || [];

                return filteredSubItems.length > 0 ? (
                  <Collapsible
                    key={item.title}
                    asChild
                    defaultOpen={false}
                    className="group/collapsible"
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton 
                          tooltip={item.title}
                          className="transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground font-medium"
                        >
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                          <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {filteredSubItems.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton asChild>
                                <Link to={subItem.url} className="flex items-center gap-2">
                                  <subItem.icon className="h-4 w-4" />
                                  <span>{subItem.title}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                ) : (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild
                      tooltip={item.title}
                      className="transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground font-medium"
                    >
                      <Link to={item.url} className="flex items-center gap-3">
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="p-4 text-xs text-muted-foreground text-center truncate group-data-[collapsible=icon]:hidden">
          &copy; 2026 JL Software
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
