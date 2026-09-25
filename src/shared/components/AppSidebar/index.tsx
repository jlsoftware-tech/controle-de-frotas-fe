import logo from '@/assets/logo.png';
import { useLogout } from '@/modules/auth/hooks/useLogout';
import { useAuthStore } from '@/modules/auth/store/useAuthStore';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/shared/components/ui/collapsible';
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
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/shared/components/ui/sidebar';
import { APP_ROUTES } from '@/shared/constants/urlRoutes';
import useNavigationMenu from '@/shared/hooks/useNavigationMenu';
import { useTheme } from '@/shared/hooks/useTheme';
import useToastLoading from '@/shared/hooks/useToastLoading';
import { cn } from '@/shared/lib/utils';
import { ChevronRight, LogOut, Moon, Sun } from 'lucide-react';
import type { IconType } from 'react-icons';
import * as FaIcons from 'react-icons/fa';
import * as MdIcons from 'react-icons/md';
import * as TbIcons from 'react-icons/tb';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const FaIconMap = FaIcons as Record<string, IconType>;
const MdIconMap = MdIcons as Record<string, IconType>;
const TbIconMap = TbIcons as Record<string, IconType>;

const DynamicIcon = ({
  name,
  className,
}: {
  name: string;
  className?: string;
}) => {
  const IconComponent =
    FaIconMap[name] || MdIconMap[name] || TbIconMap[name] || FaIcons.FaCircle;
  return <IconComponent className={className} />;
};

/** Ícone do item de navegação, dentro de um "chip" que reage ao hover/active do botão pai. */
const NavIcon = ({ name }: { name: string }) => (
  <span
    className={cn(
      'flex size-6 shrink-0 items-center justify-center rounded-md',
      'bg-sidebar-foreground/[0.06] text-sidebar-foreground/60 transition-colors duration-200',
      'group-hover/menu-button:text-sidebar-foreground/80',
      'group-data-[active=true]/menu-button:bg-sidebar-primary/15 group-data-[active=true]/menu-button:text-sidebar-primary'
    )}
  >
    <DynamicIcon name={name} className="h-3.5 w-3.5" />
  </span>
);

export function AppSidebar() {
  const user = useAuthStore((s) => s.user);
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const clearAuth = useAuthStore((s) => s.logout);
  const { mutateAsync: logoutMutation } = useLogout();
  const toast = useToastLoading();

  const { items: navigationItems, isLoading } = useNavigationMenu();

  const handleLogout = async () => {
    toast({ message: 'Saindo...' });
    const res = await logoutMutation();
    toast({ type: res.type, message: res.message });
    clearAuth();
    navigate(APP_ROUTES.LOGIN);
  };

  return (
    <Sidebar
      collapsible="icon"
      variant="inset"
      className="shadow-xl shadow-black/20"
    >
      <SidebarHeader className="relative flex flex-col items-center justify-center gap-3 overflow-hidden border-b border-sidebar-border/60 py-6 group-data-[collapsible=icon]:py-4">
        <div className="pointer-events-none absolute inset-x-6 -top-12 h-24 rounded-full bg-sidebar-primary/15 blur-3xl" />
        <img
          src={logo}
          alt="Logo"
          className="relative w-28 h-auto shrink-0 object-contain drop-shadow-sm transition-all group-data-[collapsible=icon]:w-8"
        />
        <div className="relative flex flex-col items-center text-center group-data-[collapsible=icon]:hidden">
          <span className="text-lg font-black leading-none tracking-tight text-sidebar-foreground">
            Controle de Frotas
          </span>
          <span className="mt-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-sidebar-primary">
            Gestão Inteligente
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-1">
        <SidebarGroup>
          <SidebarGroupLabel className="px-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-sidebar-foreground/45">
            Menu Principal
          </SidebarGroupLabel>
          <SidebarGroupContent className="mt-1">
            {isLoading ? (
              <div className="space-y-2 p-2">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="h-9 animate-pulse rounded-lg bg-sidebar-foreground/[0.06]"
                  />
                ))}
              </div>
            ) : (
              <SidebarMenu className="gap-1">
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
                            className={cn(
                              'h-10 gap-3 rounded-lg font-medium text-sidebar-foreground/75 transition-all duration-200',
                              'hover:bg-sidebar-foreground/[0.06] hover:text-sidebar-foreground',
                              'data-[active=true]:bg-sidebar-primary/10 data-[active=true]:text-sidebar-primary data-[active=true]:font-semibold'
                            )}
                          >
                            <NavIcon name={item.icon} />
                            <span>{item.name_menu}</span>
                            <ChevronRight className="ml-auto size-3.5 text-sidebar-foreground/35 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 group-data-[state=open]/collapsible:text-sidebar-foreground/60" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="overflow-hidden">
                          <SidebarMenuSub className="mx-4 mt-1 gap-0.5 border-sidebar-border/60 px-2.5">
                            {filteredSubItems.map((subItem) => (
                              <SidebarMenuSubItem key={subItem.name_sub_menu}>
                                <SidebarMenuSubButton
                                  asChild
                                  isActive={subItem.url === location.pathname}
                                  className="rounded-md text-sidebar-foreground/65 data-[active=true]:bg-sidebar-primary/10 data-[active=true]:font-medium data-[active=true]:text-sidebar-primary [&>svg]:data-[active=true]:text-sidebar-primary"
                                >
                                  <Link
                                    to={subItem.url}
                                    className="flex items-center gap-2"
                                  >
                                    <DynamicIcon
                                      name={subItem.icon}
                                      className="h-3.5 w-3.5 shrink-0"
                                    />
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
                        className={cn(
                          'h-10 gap-3 rounded-lg font-medium text-sidebar-foreground/75 transition-all duration-200',
                          'hover:bg-sidebar-foreground/[0.06] hover:text-sidebar-foreground'
                        )}
                      >
                        <NavIcon name={item.icon} />
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

      <SidebarFooter className="border-t border-sidebar-border/60 px-3 py-3 group-data-[collapsible=icon]:px-1">
        <SidebarMenu className="gap-3 group-data-[collapsible=icon]:items-center">
          <SidebarMenuItem className="group-data-[collapsible=icon]:hidden">
            <p className="mb-2 px-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-sidebar-foreground/45">
              Aparência
            </p>
            <div className="grid grid-cols-2 rounded-xl border border-sidebar-border/60 bg-black/20 p-1">
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
              tooltip={
                theme === 'light' ? 'Ativar tema escuro' : 'Ativar tema claro'
              }
              className="size-11 rounded-xl border border-sidebar-border/60 bg-black/20 transition-all duration-300 hover:border-sidebar-primary/30 hover:bg-sidebar-accent hover:text-sidebar-primary"
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
              <div className="flex items-center gap-3 rounded-xl px-2.5 py-2.5 transition-colors hover:bg-sidebar-foreground/[0.05] group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:hover:bg-transparent">
                <div className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-sidebar-primary text-sm font-bold text-sidebar-primary-foreground shadow-sm ring-2 ring-sidebar-primary/25">
                  {user.name?.charAt(0).toUpperCase()}
                </div>

                <div className="flex min-w-0 flex-1 flex-col group-data-[collapsible=icon]:hidden">
                  <span className="truncate text-sm font-medium text-sidebar-foreground">
                    {user.name}
                  </span>
                  <span className="truncate text-xs text-sidebar-primary">
                    {user.profile?.name}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  title="Sair"
                  className="flex size-8 shrink-0 items-center justify-center rounded-lg text-sidebar-foreground/40 transition-colors duration-200 hover:bg-red-500/10 hover:text-red-400 group-data-[collapsible=icon]:hidden"
                >
                  <LogOut className="size-4" />
                </button>
              </div>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
