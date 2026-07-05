import { useCallback, useEffect, useState } from 'react';

export type Language = 'zh-CN' | 'en';

const STORAGE_KEY = 'siteNavigator_language';

const translations = {
  'zh-CN': {
    appTitle: '站点导航',
    edit: '编辑',
    done: '完成',
    settings: '设置',
    import: '导入',
    export: '导出',
    addPage: '添加导航页',
    editPage: '编辑导航页',
    deletePage: '删除导航页',
    pageName: '导航页名称',
    pageColor: '导航页颜色',
    addGroup: '添加分组',
    editGroup: '编辑分组',
    deleteGroup: '删除分组',
    groupName: '分组名称',
    groupColor: '分组颜色',
    addSite: '添加站点',
    editSite: '编辑站点',
    deleteSite: '删除站点',
    siteName: '站点名称',
    siteUrl: '站点地址',
    siteDescription: '描述',
    siteIcon: '图标 URL',
    fetchIcon: '获取图标',
    iconService: '图标服务',
    iconServiceSmart: '智能选择',
    iconServiceDirect: '直接获取',
    effects: '特效',
    effectHighlight: '高亮显示',
    effectBlink: '闪烁效果',
    effectBounce: '跳动效果',
    effectShake: '抖动效果',
    save: '保存',
    cancel: '取消',
    confirm: '确认',
    confirmDelete: '确认删除',
    deletePageConfirm: '确定要删除导航页「{name}」吗？此操作不可恢复。',
    deleteGroupConfirm: '确定要删除分组「{name}」吗？其中的所有站点也将被删除。',
    deleteSiteConfirm: '确定要删除站点「{name}」吗？',
    cannotDeleteLastPage: '不能删除最后一个导航页。',
    pageDisplay: '导航页展示方式',
    dropdown: '下拉菜单',
    tabs: '标签页',
    groupsPerRow: '每行显示分组数量',
    theme: '主题色调',
    themeLight: '浅色',
    themeDark: '深色',
    themeSystem: '跟随系统',
    language: '语言',
    chinese: '中文',
    english: 'English',
    cardDisplay: '站点卡片显示',
    showIcon: '显示站点图标',
    showName: '显示站点名称',
    showUrl: '显示站点地址',
    showDescription: '显示站点描述',
    cardLayout: '站点卡片布局',
    layoutHorizontal: '水平布局',
    layoutVertical: '垂直布局',
    layoutCompact: '紧凑布局',
    exportData: '导出数据',
    importData: '导入数据',
    selectPages: '选择要导出的导航页',
    selectAll: '全选',
    importMode: '导入模式',
    importCurrent: '导入到当前页面',
    importNew: '作为新页面导入',
    importReplace: '替换所有数据',
    importCurrentDesc: '将文件中的数据覆盖当前导航页（只取第一个页面）',
    importNewDesc: '将文件中的页面作为新页面追加到现有数据中',
    importReplaceDesc: '用导入文件完全覆盖所有现有数据',
    selectImportPages: '选择要导入的页面',
    chooseFile: '选择文件',
    importSummary: '{groups} 个分组 / {sites} 个站点',
    emptyGroup: '暂无站点',
    noPages: '暂无导航页',
    dragToSort: '拖拽排序',
    preview: '预览',
  },
  en: {
    appTitle: 'Site Navigator',
    edit: 'Edit',
    done: 'Done',
    settings: 'Settings',
    import: 'Import',
    export: 'Export',
    addPage: 'Add Page',
    editPage: 'Edit Page',
    deletePage: 'Delete Page',
    pageName: 'Page Name',
    pageColor: 'Page Color',
    addGroup: 'Add Group',
    editGroup: 'Edit Group',
    deleteGroup: 'Delete Group',
    groupName: 'Group Name',
    groupColor: 'Group Color',
    addSite: 'Add Site',
    editSite: 'Edit Site',
    deleteSite: 'Delete Site',
    siteName: 'Site Name',
    siteUrl: 'Site URL',
    siteDescription: 'Description',
    siteIcon: 'Icon URL',
    fetchIcon: 'Fetch Icon',
    iconService: 'Icon Service',
    iconServiceSmart: 'Smart Select',
    iconServiceDirect: 'Direct',
    effects: 'Effects',
    effectHighlight: 'Highlight',
    effectBlink: 'Blink',
    effectBounce: 'Bounce',
    effectShake: 'Shake',
    save: 'Save',
    cancel: 'Cancel',
    confirm: 'Confirm',
    confirmDelete: 'Confirm Delete',
    deletePageConfirm: 'Are you sure you want to delete the page "{name}"? This action cannot be undone.',
    deleteGroupConfirm: 'Are you sure you want to delete the group "{name}"? All sites inside will also be deleted.',
    deleteSiteConfirm: 'Are you sure you want to delete the site "{name}"?',
    cannotDeleteLastPage: 'Cannot delete the last page.',
    pageDisplay: 'Page Display',
    dropdown: 'Dropdown',
    tabs: 'Tabs',
    groupsPerRow: 'Groups Per Row',
    theme: 'Theme',
    themeLight: 'Light',
    themeDark: 'Dark',
    themeSystem: 'System',
    language: 'Language',
    chinese: '中文',
    english: 'English',
    cardDisplay: 'Site Card Display',
    showIcon: 'Show Icon',
    showName: 'Show Name',
    showUrl: 'Show URL',
    showDescription: 'Show Description',
    cardLayout: 'Card Layout',
    layoutHorizontal: 'Horizontal',
    layoutVertical: 'Vertical',
    layoutCompact: 'Compact',
    exportData: 'Export Data',
    importData: 'Import Data',
    selectPages: 'Select pages to export',
    selectAll: 'Select All',
    importMode: 'Import Mode',
    importCurrent: 'Import to current page',
    importNew: 'Import as new pages',
    importReplace: 'Replace all data',
    importCurrentDesc: 'Overwrite current page with data from file (first page only)',
    importNewDesc: 'Append pages from file as new pages',
    importReplaceDesc: 'Completely replace all existing data with imported file',
    selectImportPages: 'Select pages to import',
    chooseFile: 'Choose File',
    importSummary: '{groups} groups / {sites} sites',
    emptyGroup: 'No sites yet',
    noPages: 'No pages yet',
    dragToSort: 'Drag to sort',
    preview: 'Preview',
  },
};

function getStoredLanguage(): Language {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'zh-CN' || stored === 'en') return stored;
  return 'zh-CN';
}

export function useI18n() {
  const [language, setLanguageState] = useState<Language>(getStoredLanguage);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, language);
  }, [language]);

  const t = useCallback(
    (key: keyof typeof translations['zh-CN'], values?: Record<string, string>) => {
      let text = translations[language][key] || translations['zh-CN'][key] || key;
      if (values) {
        Object.entries(values).forEach(([k, v]) => {
          text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), v);
        });
      }
      return text;
    },
    [language]
  );

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
  }, []);

  return { t, language, setLanguage };
}
