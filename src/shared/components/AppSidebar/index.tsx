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
import useAuthStore from '@/modules/auth/store/useAuthStore';
import logo from '@/assets/logo.png';
import { useQuery } from '@tanstack/react-query';
import * as FaIcons from 'react-icons/fa';
import * as MdIcons from 'react-icons/md';
import * as TbIcons from 'react-icons/tb';
import { getNavigation } from '@/shared/services/navigation';
import type { NavigationResponse } from '@/shared/types/navigationMenuItem';

const DynamicIcon = ({ name, className }: { name: string; className?: string }) => {
  const IconComponent = (FaIcons as any)[name] || (MdIcons as any)[name] || (TbIcons as any)[name] || FaIcons.FaCircle;
  return <IconComponent className={className} />;
};

export function AppSidebar() {
  const user = useAuthStore((s) => s.user);

  const { data: response , isLoading } = useQuery({
    queryKey: ['navigation'],
    queryFn: getNavigation,
    enabled: !!user,
  });
  const navigationItems: NavigationResponse = response?.data ?? [];
  
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
            {isLoading ? (
              <div className="p-4 text-sm text-muted-foreground">Carregando menu...</div>
            ) : (
              <SidebarMenu className="gap-1.5">
                {navigationItems.map((item) => {
                  const filteredSubItems = item.subMenu || [];

                  return filteredSubItems.length > 0 ? (
                    <Collapsible
                      key={item.nameMenu}
                      asChild
                      defaultOpen={false}
                      className="group/collapsible"
                    >
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton 
                            tooltip={item.nameMenu}
                            className="transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground font-medium"
                          >
                            <DynamicIcon name={item.icon} className="h-4 w-4" />
                            <span>{item.nameMenu}</span>
                            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {filteredSubItems.map((subItem) => (
                              <SidebarMenuSubItem key={subItem.nameSubMenu}>
                                <SidebarMenuSubButton asChild>
                                  <Link to={subItem.link} className="flex items-center gap-2">
                                    <DynamicIcon name={subItem.icon} className="h-4 w-4" />
                                    <span>{subItem.nameSubMenu}</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  ) : (
                    <SidebarMenuItem key={item.nameMenu}>
                      <SidebarMenuButton 
                        asChild
                        tooltip={item.nameMenu}
                        className="transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground font-medium"
                      >
                        <Link to={item.link} className="flex items-center gap-3">
                          <DynamicIcon name={item.icon} className="h-4 w-4" />
                          <span>{item.nameMenu}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            )}
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
