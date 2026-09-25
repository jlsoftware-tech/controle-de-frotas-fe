export interface NavigationSubItem {
  name_sub_menu: string;
  url: string;
  icon: string;
  description?: string;
}

export interface NavigationItem {
  name_menu: string;
  icon: string;
  description?: string;
  sub_menu?: NavigationSubItem[];
}

export type NavigationResponse = NavigationItem[];
