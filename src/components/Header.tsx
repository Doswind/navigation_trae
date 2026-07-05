import { Compass, Pencil, Settings, Upload, Download } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useI18n } from '@/hooks/useI18n';
import { PageSelector } from './PageSelector';
import { cn } from '@/lib/utils';

export function Header() {
  const { t } = useI18n();
  const { editMode, toggleEditMode, openModal } = useAppStore();

  return (
    <header className="sticky top-0 z-30 border-b border-theme-border bg-theme-header px-4 py-2 backdrop-blur-md">
      <div className="mx-auto flex w-full items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-600/20 text-blue-500">
            <Compass size={18} />
          </div>
          <h1 className="font-display text-base font-bold tracking-tight text-theme-primary">{t('appTitle')}</h1>
        </div>

        <div className="flex-1 flex justify-center">
          <PageSelector />
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={toggleEditMode}
            className={cn(
              'flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-medium transition-colors',
              editMode
                ? 'border-yellow-500/30 bg-yellow-500/10 text-yellow-600 dark:text-yellow-300 hover:bg-yellow-500/20'
                : 'border-theme-border bg-theme-card text-theme-secondary hover:bg-theme-card-hover hover:text-theme-primary'
            )}
          >
            <Pencil size={13} />
            {editMode ? t('done') : t('edit')}
          </button>
          <button
            onClick={() => openModal('settings')}
            className="flex items-center gap-1.5 rounded-md border border-theme-border bg-theme-card px-2.5 py-1.5 text-xs font-medium text-theme-secondary transition-colors hover:bg-theme-card-hover hover:text-theme-primary"
          >
            <Settings size={13} />
            {t('settings')}
          </button>
          <button
            onClick={() => openModal('import')}
            className="flex items-center gap-1.5 rounded-md border border-theme-border bg-theme-card px-2.5 py-1.5 text-xs font-medium text-theme-secondary transition-colors hover:bg-theme-card-hover hover:text-theme-primary"
          >
            <Upload size={13} />
            {t('import')}
          </button>
          <button
            onClick={() => openModal('export')}
            className="flex items-center gap-1.5 rounded-md border border-theme-border bg-theme-card px-2.5 py-1.5 text-xs font-medium text-theme-secondary transition-colors hover:bg-theme-card-hover hover:text-theme-primary"
          >
            <Download size={13} />
            {t('export')}
          </button>
        </div>
      </div>
    </header>
  );
}
