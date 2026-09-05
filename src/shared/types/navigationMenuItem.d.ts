export interface NavigationSubItem {
  nameSubMenu: string;
  link: string;
  icon: string;
}

export interface NavigationItem {
  nameMenu: string;
  link: string;
  icon: string;
  subMenu?: NavigationSubItem[];
}

export type NavigationResponse = NavigationItem[];
