import type { ElementType } from "react";

export interface NavigationSubItem {
  title: string;
  url: string;
  icon: ElementType;
  allowedRoles?: string[];
}

export interface NavigationItem {
  title: string;
  url: string;
  icon: ElementType;
  items?: NavigationSubItem[];
  allowedRoles?: string[];
}
