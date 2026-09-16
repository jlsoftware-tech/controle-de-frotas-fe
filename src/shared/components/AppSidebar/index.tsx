import { Link, useLocation, useNavigate } from 'react-router-dom';
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
import { ChevronRight, LogOut, Moon, Sun } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/shared/components/ui/collapsible';
import logo from '@/assets/logo.png';
import * as FaIcons from 'react-icons/fa';
import * as MdIcons from 'react-icons/md';
import * as TbIcons from 'react-icons/tb';
import type { IconType } from 'react-icons';
import { useAuthStore } from '@/modules/auth/store/useAuthStore';
import { useMenuStore } from '@/shared/store/useMenuStore';
import { useTheme } from '@/shared/hooks/useTheme';
import { Button } from '../ui/button';
import useToastLoading from '@/shared/hooks/useToastLoading';
import { useLogout } from '@/modules/auth/hooks/useLogout';
import { APP_ROUTES } from '@/shared/constants/urlRoutes';
import { cn } from '@/shared/lib/utils';

const FaIconMap = FaIcons as Record<string, IconType>;
const MdIconMap = MdIcons as Record<string, IconType>;
const TbIconMap = TbIcons as Record<string, IconType>;

const DynamicIcon = ({ name, className }: { name: string; className?: string }) => {
  const IconComponent = FaIconMap[name] || MdIconMap[name] || TbIconMap[name] || FaIcons.FaCircle;
  return <IconComponent className={className} />;
};

export function AppSidebar() {
  const user = useAuthStore((s) => s.user);
  const location = useLocation();
   const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const clearAuth = useAuthStore((s) => s.logout);
  const { mutateAsync: logoutMutation } = useLogout();
  const toast = useToastLoading();

  // Menu vem do useMenuStore, populado uma vez pelo AppLayout — não busca
  // mais aqui, só lê.
  const navigationItems = useMenuStore((s) => s.items);
  const isLoading = useMenuStore((s) => s.isLoading);

  const handleLogout = async () => {
    toast({ message: 'Saindo...' });
    const res = await logoutMutation();
    toast({ type: res.type, message: res.message });
    clearAuth();
    navigate(APP_ROUTES.LOGIN);
  };

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
                  const filteredSubItems = item.sub_menu || [];
                  const isGroupActive = filteredSubItems.some(
                    (subItem) => subItem.url === location.pathname
                  );

                  return filteredSubItems.length > 0 ? (
                    <Collapsible
                      key={item.name_menu}
                      asChild
                      defaultOpen={isGroupActive}
                      className="group/collapsible"
                    >
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton
                            tooltip={item.name_menu}
                            isActive={isGroupActive}
                            className="transition-colors font-medium"
                          >
                            <DynamicIcon name={item.icon} className="h-4 w-4" />
                            <span>{item.name_menu}</span>
                            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {filteredSubItems.map((subItem) => (
                              <SidebarMenuSubItem key={subItem.name_sub_menu}>
                                <SidebarMenuSubButton
                                  asChild
                                  isActive={subItem.url === location.pathname}
                                >
                                  <Link to={subItem.url} className="flex items-center gap-2">
                                    <DynamicIcon name={subItem.icon} className="h-4 w-4" />
                                    <span>{subItem.name_sub_menu}</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  ) : (
                    <SidebarMenuItem key={item.name_menu}>
                      <SidebarMenuButton
                        tooltip={item.name_menu}
                        className="transition-colors font-medium"
                      >
                        <DynamicIcon name={item.icon} className="h-4 w-4" />
                        <span>{item.name_menu}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            )}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
       <SidebarFooter className="border-t border-sidebar-border/70 px-3 py-3 group-data-[collapsible=icon]:px-1">
        <SidebarMenu className="gap-3 group-data-[collapsible=icon]:items-center">
          <SidebarMenuItem className="group-data-[collapsible=icon]:hidden">
            <p className="mb-2 px-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-sidebar-foreground/45">
              Aparência
            </p>
            <div className="grid grid-cols-2 rounded-xl border border-white/10 bg-black/20 p-1">
              <button
                type="button"
                aria-pressed={theme === 'light'}
                onClick={() => theme !== 'light' && toggleTheme()}
                className={cn(
                  'flex h-10 items-center justify-center gap-2 rounded-lg text-xs font-semibold transition-all duration-200',
                  theme === 'light'
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground shadow-sm shadow-black/30'
                    : 'text-sidebar-foreground/55 hover:text-sidebar-foreground'
                )}
              >
                <Sun className="size-4" />
                Claro
              </button>
              <button
                type="button"
                aria-pressed={theme === 'dark'}
                onClick={() => theme !== 'dark' && toggleTheme()}
                className={cn(
                  'flex h-10 items-center justify-center gap-2 rounded-lg text-xs font-semibold transition-all duration-200',
                  theme === 'dark'
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground shadow-sm shadow-black/30'
                    : 'text-sidebar-foreground/55 hover:text-sidebar-foreground'
                )}
              >
                <Moon className="size-4" />
                Escuro
              </button>
            </div>
          </SidebarMenuItem>

          <SidebarMenuItem className="hidden group-data-[collapsible=icon]:block">
            <SidebarMenuButton
              onClick={toggleTheme}
              tooltip={ theme === 'light' ? 'Ativar tema escuro' : 'Ativar tema claro'
              }
              className="size-11 rounded-xl border border-white/10 bg-black/20 transition-all duration-300 hover:border-sidebar-primary/30 hover:bg-sidebar-accent hover:text-sidebar-primary"
            >
              {theme === 'light' ? (
                <Moon className="size-5" />
              ) : (
                <Sun className="size-5" />
              )}
            </SidebarMenuButton>
          </SidebarMenuItem>

          {user && (
            <SidebarMenuItem>
              <div className="flex items-center gap-3 px-3 py-2.5 transition-colors group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0">
                <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-sidebar-primary text-sm font-bold text-sidebar-primary-foreground shadow-lg shadow-black/20">
                  { user.name?.charAt(0).toUpperCase() }
                </div>

                <div className="flex min-w-0 flex-1 flex-col group-data-[collapsible=icon]:hidden">
                  <span className="truncate text-sm font-medium">
                    {user.name}
                  </span>
                  <span className="truncate text-xs text-sidebar-primary">
                    {/* {getRoleLabel(user.role)} */}
                  </span>
                </div>

                <Button
                  onClick={handleLogout}
                  variant="destructive"
                  size="icon"
                  className="group-data-[collapsible=icon]:hidden"
                >
                  <LogOut className="size-4" />
                </Button>
              </div>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
