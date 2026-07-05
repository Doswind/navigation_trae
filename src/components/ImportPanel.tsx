import { useRef, useState } from 'react';
import { Modal } from './Modal';
import { useAppStore } from '@/store/useAppStore';
import { useI18n } from '@/hooks/useI18n';
import type { AppData, Group, Page, Site } from '@/types';
import { generateId } from '@/utils/helpers';

export function ImportPanel({ onClose }: { onClose: () => void }) {
  const { t } = useI18n();
  const { importData } = useAppStore();
  const [importMode, setImportMode] = useState<'current' | 'new' | 'replace'>('current');
  const [parsedData, setParsedData] = useState<AppData | null>(null);
  const [selectedPageIds, setSelectedPageIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const normalizeSite = (site: Partial<Site>): Site => ({
    id: generateId('site'),
    name: site.name || '未命名站点',
    url: site.url || '',
    description: site.description,
    icon: site.icon,
    effects: site.effects || {},
  });

  const normalizeGroup = (group: Partial<Group>): Group => ({
    id: generateId('group'),
    name: group.name || '未命名分组',
    color: group.color || '#3b82f6',
    sites: Array.isArray(group.sites) ? group.sites.map(normalizeSite) : [],
  });

  const normalizePage = (page: { id?: string; name?: string; color?: string; groups?: Partial<Group>[] }): Page => ({
    id: generateId('page'),
    name: page.name || '未命名页面',
    color: page.color,
    groups: Array.isArray(page.groups) ? page.groups.map(normalizeGroup) : [],
  });

  const parseImportData = (raw: unknown): AppData => {
    if (raw && typeof raw === 'object' && 'pages' in raw && Array.isArray((raw as Record<string, unknown>).pages)) {
      return { pages: ((raw as Record<string, unknown>).pages as Partial<Page>[]).map(normalizePage) };
    }
    if (Array.isArray(raw)) {
      if (raw.length === 0) return { pages: [] };
      const first = raw[0] as Partial<Page> | Partial<Group>;
      const looksLikePages = 'groups' in first;
      return looksLikePages
        ? { pages: (raw as Partial<Page>[]).map(normalizePage) }
        : { pages: [normalizePage({ name: '导入页面', groups: raw as Partial<Group>[] })] };
    }
    throw new Error('Invalid format');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsLoading(true);
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        const appData = parseImportData(parsed);
        if (appData.pages.length === 0) {
          alert('导入失败：文件中没有可导入的数据');
          setParsedData(null);
          setSelectedPageIds(new Set());
          return;
        }
        setParsedData(appData);
        setSelectedPageIds(new Set(appData.pages.map((p) => p.id)));
      } catch (err) {
        alert('导入失败：文件格式不正确');
        setParsedData(null);
        setSelectedPageIds(new Set());
      } finally {
        setIsLoading(false);
        if (fileRef.current) fileRef.current.value = '';
      }
    };
    reader.onerror = () => {
      alert('导入失败：无法读取文件');
      setIsLoading(false);
    };
    reader.readAsText(file);
  };

  const togglePage = (id: string) => {
    setSelectedPageIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (!parsedData) return;
    if (selectedPageIds.size === parsedData.pages.length) {
      setSelectedPageIds(new Set());
    } else {
      setSelectedPageIds(new Set(parsedData.pages.map((p) => p.id)));
    }
  };

  const handleConfirm = () => {
    if (!parsedData || selectedPageIds.size === 0) return;
    const filtered: AppData = {
      pages: parsedData.pages.filter((p) => selectedPageIds.has(p.id)),
    };
    importData(filtered, importMode);
    onClose();
  };

  const modeOptions: { mode: 'current' | 'new' | 'replace'; label: string; desc: string }[] = [
    { mode: 'current', label: t('importCurrent'), desc: t('importCurrentDesc') },
    { mode: 'new', label: t('importNew'), desc: t('importNewDesc') },
    { mode: 'replace', label: t('importReplace'), desc: t('importReplaceDesc') },
  ];

  return (
    <Modal isOpen onClose={onClose} title={t('importData')} className="max-w-lg">
      <div className="space-y-4">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-theme-secondary">{t('importMode')}</label>
          <div className="grid grid-cols-1 gap-2">
            {modeOptions.map(({ mode, label, desc }) => (
              <label
                key={mode}
                className={`flex cursor-pointer items-start gap-2 rounded-md border px-3 py-2 text-xs transition-colors ${
                  importMode === mode
                    ? 'border-blue-500/50 bg-blue-500/10'
                    : 'border-theme-border bg-theme-input hover:bg-theme-card-hover'
                }`}
              >
                <input
                  type="radio"
                  name="importMode"
                  value={mode}
                  checked={importMode === mode}
                  onChange={() => setImportMode(mode)}
                  className="accent-blue-500 mt-0.5"
                />
                <div className="flex-1">
                  <div className={importMode === mode ? 'font-medium text-blue-500' : 'font-medium text-theme-primary'}>
                    {label}
                  </div>
                  <div className="mt-0.5 text-[11px] text-theme-muted">{desc}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-theme-secondary">{t('chooseFile')}</label>
          <input
            ref={fileRef}
            type="file"
            accept=".json,application/json"
            onChange={handleFileChange}
            disabled={isLoading}
            className="w-full rounded-md border border-theme-border bg-theme-input px-3 py-2 text-xs text-theme-primary file:mr-2 file:rounded file:border-0 file:bg-theme-border-strong file:px-2 file:py-1 file:text-xs file:text-theme-primary disabled:opacity-50"
          />
        </div>

        {parsedData && parsedData.pages.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-theme-secondary">{t('selectImportPages')}</span>
              <label className="flex cursor-pointer items-center gap-1.5 text-xs text-theme-secondary hover:text-theme-primary">
                <input
                  type="checkbox"
                  checked={selectedPageIds.size === parsedData.pages.length && parsedData.pages.length > 0}
                  onChange={toggleAll}
                  className="accent-blue-500"
                />
                {t('selectAll')}
              </label>
            </div>
            <div className="max-h-48 overflow-auto rounded-md border border-theme-border p-2 scrollbar-thin">
              {parsedData.pages.map((page) => {
                const groupCount = page.groups.length;
                const siteCount = page.groups.reduce((sum, g) => sum + g.sites.length, 0);
                return (
                  <label
                    key={page.id}
                    className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-xs text-theme-secondary hover:bg-theme-card-hover"
                  >
                    <input
                      type="checkbox"
                      checked={selectedPageIds.has(page.id)}
                      onChange={() => togglePage(page.id)}
                      className="accent-blue-500"
                    />
                    <div
                      className="h-2 w-2 flex-shrink-0 rounded-full"
                      style={{ backgroundColor: page.color || '#3b82f6' }}
                    />
                    <span className="flex-1 truncate">{page.name}</span>
                    <span className="text-[11px] text-theme-muted">
                      {t('importSummary', { groups: String(groupCount), sites: String(siteCount) })}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex justify-end gap-2 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-theme-border px-3 py-1.5 text-xs font-medium text-theme-secondary hover:bg-theme-card-hover"
          >
            {t('cancel')}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!parsedData || selectedPageIds.size === 0}
            className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-500 disabled:opacity-50"
          >
            {t('confirm')}
          </button>
        </div>
      </div>
    </Modal>
  );
}
