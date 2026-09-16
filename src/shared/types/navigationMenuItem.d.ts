export interface NavigationSubItem {
  name_sub_menu: string;
  url: string;
  icon: string;
}

export interface NavigationItem {
  name_menu: string;
  icon: string;
  sub_menu?: NavigationSubItem[];
}

export type NavigationResponse = NavigationItem[];
