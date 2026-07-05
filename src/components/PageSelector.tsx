import { ChevronDown, Pencil, Trash2, Plus } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useI18n } from '@/hooks/useI18n';
import { cn } from '@/lib/utils';

export function PageSelector() {
  const { t } = useI18n();
  const {
    data,
    config,
    currentPageId,
    editMode,
    setCurrentPageId,
    openModal,
    openConfirm,
    deletePage,
  } = useAppStore();

  const currentPage = data.pages.find((p) => p.id === currentPageId);

  const handleAddPage = () => {
    openModal('pageForm');
  };

  const handleEditPage = (pageId: string) => {
    const page = data.pages.find((p) => p.id === pageId);
    if (page) openModal('pageForm', { page });
  };

  const handleDeletePage = (pageId: string, name: string) => {
    if (data.pages.length <= 1) {
      alert(t('cannotDeleteLastPage'));
      return;
    }
    openConfirm({
      title: t('confirmDelete'),
      message: t('deletePageConfirm', { name }),
      onConfirm: () => deletePage(pageId),
    });
  };

  const buttonBase =
    'rounded-lg border border-theme-border bg-theme-card p-1.5 text-theme-secondary transition-colors hover:bg-theme-card-hover hover:text-blue-500';

  if (config.pageDisplay === 'tabs') {
    return (
      <div className="flex items-center gap-1">
        <div className="flex rounded-lg border border-theme-border bg-theme-card p-1">
          {data.pages.map((page) => (
            <div key={page.id} className="group relative flex items-center">
              <button
                onClick={() => setCurrentPageId(page.id)}
                className={cn(
                  'rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
                  currentPageId === page.id
                    ? 'bg-theme-card-hover text-theme-primary'
                    : 'text-theme-secondary hover:bg-theme-card-hover/50 hover:text-theme-primary'
                )}
              >
                {page.name}
              </button>
              {editMode && (
                <div className="absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 items-center gap-0.5 group-hover:flex">
                  <button
                    onClick={() => handleEditPage(page.id)}
                    className="rounded p-0.5 text-theme-muted hover:text-yellow-500"
                  >
                    <Pencil size={10} />
                  </button>
                  <button
                    onClick={() => handleDeletePage(page.id, page.name)}
                    className="rounded p-0.5 text-theme-muted hover:text-red-500"
                  >
                    <Trash2 size={10} />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
        <button onClick={handleAddPage} className={buttonBase} aria-label={t('addPage')}>
          <Plus size={16} />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <div className="relative">
        <select
          value={currentPageId}
          onChange={(e) => setCurrentPageId(e.target.value)}
          className="appearance-none rounded-lg border border-theme-border bg-theme-card py-1.5 pl-3 pr-8 text-xs font-medium text-theme-primary outline-none focus:border-blue-500"
        >
          {data.pages.map((page) => (
            <option key={page.id} value={page.id}>
              {page.name}
            </option>
          ))}
        </select>
        <ChevronDown size={14} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-theme-muted" />
      </div>
      {editMode && (
        <>
          <button
            onClick={() => handleEditPage(currentPageId)}
            className={buttonBase}
            aria-label={t('editPage')}
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={() => currentPage && handleDeletePage(currentPage.id, currentPage.name)}
            className={buttonBase}
            aria-label={t('deletePage')}
          >
            <Trash2 size={14} />
          </button>
        </>
      )}
      <button onClick={handleAddPage} className={buttonBase} aria-label={t('addPage')}>
        <Plus size={16} />
      </button>
    </div>
  );
}
