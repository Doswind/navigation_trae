import { create } from 'zustand';
import type { AppConfig, AppData, CardLayout, ConfirmOptions, FontSize, Group, ModalData, ModalType, Page, PageDisplay, Site } from '@/types';
import { sampleData } from '@/utils/sampleData';
import { generateId } from '@/utils/helpers';

const DATA_KEY = 'siteNavigatorData';
const CONFIG_KEY = 'siteNavigatorConfig';
const CURRENT_PAGE_KEY = 'siteNavigator_currentPageId';

const defaultConfig: AppConfig = {
  theme: 'system',
  pageDisplay: 'tabs',
  groupsPerRow: 4,
  showIcon: true,
  showName: true,
  showUrl: false,
  showDescription: false,
  cardLayout: 'compact',
  fontSize: 'sm',
};

function applyTheme(theme: AppConfig['theme']) {
  const root = document.documentElement;
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDark = theme === 'dark' || (theme === 'system' && systemDark);
  if (isDark) {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
}

function loadData(): AppData {
  try {
    const raw = localStorage.getItem(DATA_KEY);
    if (!raw) return sampleData;
    const parsed = JSON.parse(raw);
    if (parsed.pages && Array.isArray(parsed.pages)) return parsed as AppData;
    if (Array.isArray(parsed)) {
      return {
        pages: [
          {
            id: generateId('page'),
            name: '默认页面',
            groups: parsed as Group[],
          },
        ],
      };
    }
    return sampleData;
  } catch {
    return sampleData;
  }
}

function loadConfig(): AppConfig {
  try {
    const raw = localStorage.getItem(CONFIG_KEY);
    if (!raw) {
      applyTheme(defaultConfig.theme);
      return defaultConfig;
    }
    const config = { ...defaultConfig, ...JSON.parse(raw) };
    applyTheme(config.theme);
    return config;
  } catch {
    applyTheme(defaultConfig.theme);
    return defaultConfig;
  }
}

function loadCurrentPageId(data: AppData): string {
  try {
    const raw = localStorage.getItem(CURRENT_PAGE_KEY);
    if (raw && data.pages.some((p) => p.id === raw)) return raw;
    return data.pages[0]?.id || '';
  } catch {
    return data.pages[0]?.id || '';
  }
}

interface AppState {
  data: AppData;
  config: AppConfig;
  currentPageId: string;
  editMode: boolean;
  activeModal: ModalType;
  modalData: ModalData;
  confirmOptions: ConfirmOptions | null;
  dirty: boolean;

  setData: (data: AppData) => void;
  setConfig: (config: AppConfig) => void;
  setCurrentPageId: (id: string) => void;
  toggleEditMode: () => void;
  setEditMode: (value: boolean) => void;
  openModal: (modal: ModalType, data?: unknown) => void;
  closeModal: () => void;
  openConfirm: (options: ConfirmOptions) => void;
  closeConfirm: () => void;
  setDirty: (value: boolean) => void;

  addPage: (page: Omit<Page, 'id' | 'groups'>) => void;
  updatePage: (id: string, updates: Partial<Page>) => void;
  deletePage: (id: string) => void;

  addGroup: (group: Omit<Group, 'id' | 'sites'>, pageId?: string) => void;
  updateGroup: (pageId: string, groupId: string, updates: Partial<Group>) => void;
  deleteGroup: (pageId: string, groupId: string) => void;
  reorderGroups: (pageId: string, groupIds: string[]) => void;

  addSite: (pageId: string, groupId: string, site: Omit<Site, 'id'>) => void;
  updateSite: (pageId: string, groupId: string, siteId: string, updates: Partial<Site>) => void;
  deleteSite: (pageId: string, groupId: string, siteId: string) => void;
  reorderSites: (pageId: string, groupId: string, siteIds: string[]) => void;
  moveSite: (pageId: string, sourceGroupId: string, targetGroupId: string, siteId: string, targetIndex?: number) => void;

  getCurrentPage: () => Page | undefined;
  importData: (newData: AppData, mode: 'current' | 'new' | 'replace', targetPageId?: string) => void;
}

function persistData(data: AppData) {
  localStorage.setItem(DATA_KEY, JSON.stringify(data));
}

function persistConfig(config: AppConfig) {
  localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
}

export const useAppStore = create<AppState>((set, get) => {
  const initialData = loadData();
  const initialConfig = loadConfig();
  const initialPageId = loadCurrentPageId(initialData);

  return {
    data: initialData,
    config: initialConfig,
    currentPageId: initialPageId,
    editMode: false,
    activeModal: null,
    modalData: null,
    confirmOptions: null,
    dirty: false,

    setData: (data) => {
      persistData(data);
      set({ data });
    },

    setConfig: (config) => {
      persistConfig(config);
      applyTheme(config.theme);
      set({ config });
    },

    setCurrentPageId: (id) => {
      localStorage.setItem(CURRENT_PAGE_KEY, id);
      set({ currentPageId: id });
    },

    toggleEditMode: () => set((state) => ({ editMode: !state.editMode })),
    setEditMode: (value) => set({ editMode: value }),

    openModal: (modal, data) => set({ activeModal: modal, modalData: data }),
    closeModal: () => set({ activeModal: null, modalData: null }),

    openConfirm: (options) => set({ confirmOptions: options }),
    closeConfirm: () => set({ confirmOptions: null }),

    setDirty: (value) => set({ dirty: value }),

    getCurrentPage: () => {
      const { data, currentPageId } = get();
      return data.pages.find((p) => p.id === currentPageId);
    },

    addPage: (page) => {
      const { data, setCurrentPageId } = get();
      const newPage: Page = {
        ...page,
        id: generateId('page'),
        groups: [
          {
            id: generateId('group'),
            name: '默认分组',
            color: page.color || '#3b82f6',
            sites: [],
          },
        ],
      };
      const newData = { ...data, pages: [...data.pages, newPage] };
      persistData(newData);
      set({ data: newData });
      setCurrentPageId(newPage.id);
    },

    updatePage: (id, updates) => {
      const { data } = get();
      const newData = {
        ...data,
        pages: data.pages.map((p) => (p.id === id ? { ...p, ...updates } : p)),
      };
      persistData(newData);
      set({ data: newData });
    },

    deletePage: (id) => {
      const { data, currentPageId, setCurrentPageId } = get();
      if (data.pages.length <= 1) return;
      const newPages = data.pages.filter((p) => p.id !== id);
      const newData = { ...data, pages: newPages };
      persistData(newData);
      set({ data: newData });
      if (currentPageId === id) {
        setCurrentPageId(newPages[0]?.id || '');
      }
    },

    addGroup: (group, pageId) => {
      const { data, currentPageId } = get();
      const targetPageId = pageId || currentPageId;
      const newGroup: Group = { ...group, id: generateId('group'), sites: [] };
      const newData = {
        ...data,
        pages: data.pages.map((p) =>
          p.id === targetPageId ? { ...p, groups: [...p.groups, newGroup] } : p
        ),
      };
      persistData(newData);
      set({ data: newData });
    },

    updateGroup: (pageId, groupId, updates) => {
      const { data } = get();
      const newData = {
        ...data,
        pages: data.pages.map((p) =>
          p.id === pageId
            ? { ...p, groups: p.groups.map((g) => (g.id === groupId ? { ...g, ...updates } : g)) }
            : p
        ),
      };
      persistData(newData);
      set({ data: newData });
    },

    deleteGroup: (pageId, groupId) => {
      const { data } = get();
      const newData = {
        ...data,
        pages: data.pages.map((p) =>
          p.id === pageId ? { ...p, groups: p.groups.filter((g) => g.id !== groupId) } : p
        ),
      };
      persistData(newData);
      set({ data: newData });
    },

    reorderGroups: (pageId, groupIds) => {
      const { data } = get();
      const newData = {
        ...data,
        pages: data.pages.map((p) => {
          if (p.id !== pageId) return p;
          const map = new Map(p.groups.map((g) => [g.id, g]));
          return { ...p, groups: groupIds.map((id) => map.get(id)!).filter(Boolean) };
        }),
      };
      persistData(newData);
      set({ data: newData, dirty: false });
    },

    addSite: (pageId, groupId, site) => {
      const { data } = get();
      const newSite: Site = { ...site, id: generateId('site') };
      const newData = {
        ...data,
        pages: data.pages.map((p) =>
          p.id === pageId
            ? {
                ...p,
                groups: p.groups.map((g) =>
                  g.id === groupId ? { ...g, sites: [...g.sites, newSite] } : g
                ),
              }
            : p
        ),
      };
      persistData(newData);
      set({ data: newData });
    },

    updateSite: (pageId, groupId, siteId, updates) => {
      const { data } = get();
      const newData = {
        ...data,
        pages: data.pages.map((p) =>
          p.id === pageId
            ? {
                ...p,
                groups: p.groups.map((g) =>
                  g.id === groupId
                    ? { ...g, sites: g.sites.map((s) => (s.id === siteId ? { ...s, ...updates } : s)) }
                    : g
                ),
              }
            : p
        ),
      };
      persistData(newData);
      set({ data: newData });
    },

    deleteSite: (pageId, groupId, siteId) => {
      const { data } = get();
      const newData = {
        ...data,
        pages: data.pages.map((p) =>
          p.id === pageId
            ? {
                ...p,
                groups: p.groups.map((g) =>
                  g.id === groupId ? { ...g, sites: g.sites.filter((s) => s.id !== siteId) } : g
                ),
              }
            : p
        ),
      };
      persistData(newData);
      set({ data: newData });
    },

    reorderSites: (pageId, groupId, siteIds) => {
      const { data } = get();
      const newData = {
        ...data,
        pages: data.pages.map((p) =>
          p.id === pageId
            ? {
                ...p,
                groups: p.groups.map((g) => {
                  if (g.id !== groupId) return g;
                  const map = new Map(g.sites.map((s) => [s.id, s]));
                  return { ...g, sites: siteIds.map((id) => map.get(id)!).filter(Boolean) };
                }),
              }
            : p
        ),
      };
      persistData(newData);
      set({ data: newData, dirty: false });
    },

    moveSite: (pageId, sourceGroupId, targetGroupId, siteId, targetIndex) => {
      const { data } = get();
      const newData = {
        ...data,
        pages: data.pages.map((p) => {
          if (p.id !== pageId) return p;
          const sourceGroup = p.groups.find((g) => g.id === sourceGroupId);
          const site = sourceGroup?.sites.find((s) => s.id === siteId);
          if (!site) return p;

          return {
            ...p,
            groups: p.groups.map((g) => {
              if (g.id === sourceGroupId) {
                return { ...g, sites: g.sites.filter((s) => s.id !== siteId) };
              }
              if (g.id === targetGroupId) {
                const newSites = [...g.sites];
                if (targetIndex !== undefined && targetIndex >= 0 && targetIndex <= newSites.length) {
                  newSites.splice(targetIndex, 0, site);
                } else {
                  newSites.push(site);
                }
                return { ...g, sites: newSites };
              }
              return g;
            }),
          };
        }),
      };
      persistData(newData);
      set({ data: newData, dirty: false });
    },

    importData: (newData, mode, targetPageId) => {
      const { data, currentPageId, setCurrentPageId } = get();

      const normalizeSite = (site: Site): Site => ({
        ...site,
        id: generateId('site'),
        effects: site.effects || {},
      });

      const normalizeGroup = (group: Group): Group => ({
        ...group,
        id: generateId('group'),
        sites: (group.sites || []).map(normalizeSite),
      });

      const normalizePage = (page: Page): Page => ({
        ...page,
        id: generateId('page'),
        groups: (page.groups || []).map(normalizeGroup),
      });

      const importedPages = (newData.pages || []).map(normalizePage);

      let finalData: AppData;
      if (mode === 'replace') {
        finalData = { pages: importedPages };
      } else if (mode === 'new') {
        finalData = { pages: [...data.pages, ...importedPages] };
      } else {
        const targetId = targetPageId || currentPageId;
        const firstPage = importedPages[0];
        finalData = {
          ...data,
          pages: data.pages.map((p) =>
            p.id === targetId && firstPage ? { ...p, groups: firstPage.groups } : p
          ),
        };
      }

      persistData(finalData);
      set({ data: finalData });

      if (mode === 'new' || mode === 'replace') {
        if (finalData.pages.length > 0 && !finalData.pages.find((p) => p.id === currentPageId)) {
          setCurrentPageId(finalData.pages[0].id);
        }
      }
    },
  };
});
