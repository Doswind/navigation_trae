import { useState } from 'react';
import { Modal } from './Modal';
import { useAppStore } from '@/store/useAppStore';
import { useI18n } from '@/hooks/useI18n';
import { downloadJson, formatDateForFilename } from '@/utils/helpers';
import type { AppData } from '@/types';

export function ExportPanel({ onClose }: { onClose: () => void }) {
  const { t } = useI18n();
  const { data } = useAppStore();
  const [selectedPageIds, setSelectedPageIds] = useState<Set<string>>(() =>
    new Set(data.pages.map((p) => p.id))
  );

  const togglePage = (id: string) => {
    setSelectedPageIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selectedPageIds.size === data.pages.length) {
      setSelectedPageIds(new Set());
    } else {
      setSelectedPageIds(new Set(data.pages.map((p) => p.id)));
    }
  };

  const handleExport = () => {
    const exportData: AppData = {
      pages: data.pages.filter((p) => selectedPageIds.has(p.id)),
    };
    const date = formatDateForFilename();
    downloadJson(exportData, `站点导航_${date}.json`);
  };

  return (
    <Modal isOpen onClose={onClose} title={t('exportData')} className="max-w-lg">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-theme-secondary">{t('selectPages')}</span>
          <button
            type="button"
            onClick={toggleAll}
            className="text-xs text-blue-500 hover:text-blue-400"
          >
            {t('selectAll')}
          </button>
        </div>
        <div className="max-h-48 overflow-auto rounded-md border border-theme-border p-2 scrollbar-thin">
          {data.pages.map((page) => (
            <label
              key={page.id}
              className="flex items-center gap-2 rounded px-2 py-1.5 text-xs text-theme-secondary hover:bg-theme-card-hover"
            >
              <input
                type="checkbox"
                checked={selectedPageIds.has(page.id)}
                onChange={() => togglePage(page.id)}
                className="accent-blue-500"
              />
              {page.name}
            </label>
          ))}
        </div>
        <button
          type="button"
          onClick={handleExport}
          disabled={selectedPageIds.size === 0}
          className="w-full rounded-md bg-blue-600 px-3 py-2 text-xs font-medium text-white hover:bg-blue-500 disabled:opacity-50"
        >
          {t('export')}
        </button>
      </div>
    </Modal>
  );
}
