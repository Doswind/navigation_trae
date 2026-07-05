export interface SiteEffects {
  highlight?: boolean;
  blink?: boolean;
  bounce?: boolean;
  shake?: boolean;
}

export interface Site {
  id: string;
  name: string;
  url: string;
  description?: string;
  icon?: string;
  effects: SiteEffects;
}

export interface Group {
  id: string;
  name: string;
  color: string;
  sites: Site[];
}

export interface Page {
  id: string;
  name: string;
  color?: string;
  groups: Group[];
}

export interface AppData {
  pages: Page[];
}

export type PageDisplay = 'dropdown' | 'tabs';
export type CardLayout = 'horizontal' | 'vertical' | 'compact';
export type ThemeMode = 'dark' | 'light' | 'system';

export interface AppConfig {
  theme: ThemeMode;
  pageDisplay: PageDisplay;
  groupsPerRow: number;
  showIcon: boolean;
  showName: boolean;
  showUrl: boolean;
  showDescription: boolean;
  cardLayout: CardLayout;
}

export type ModalType =
  | null
  | 'pageForm'
  | 'groupForm'
  | 'siteForm'
  | 'settings'
  | 'import'
  | 'export'
  | 'confirm';

export interface PageFormData {
  page?: Page;
}

export interface GroupFormData {
  group?: Group;
  pageId?: string;
}

export interface SiteFormData {
  site?: Site;
  groupId?: string;
  pageId?: string;
}

export type ModalData = PageFormData | GroupFormData | SiteFormData | unknown;

export interface ConfirmOptions {
  title: string;
  message: string;
  onConfirm: () => void;
}
