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
      <div className="flex items-center gap-1.5">
        <div className="flex items-center gap-1 rounded-lg border border-theme-border bg-theme-card p-1">
          {data.pages.map((page) => {
            const isActive = currentPageId === page.id;
            return (
              <div
                key={page.id}
                className={cn(
                  'flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium transition-colors',
                  isActive
                    ? 'bg-blue-500 text-white shadow-sm'
                    : 'text-theme-secondary hover:bg-theme-card-hover hover:text-theme-primary'
                )}
              >
                <button
                  onClick={() => setCurrentPageId(page.id)}
                  className="flex items-center gap-1.5"
                >
                  <span
                    className="h-2 w-2 flex-shrink-0 rounded-full ring-1 ring-white/30"
                    style={{ backgroundColor: page.color }}
                  />
                  <span className="truncate max-w-[120px]">{page.name}</span>
                </button>
                {editMode && (
                  <div className="ml-0.5 flex items-center gap-0.5">
                    <button
                      onClick={() => handleEditPage(page.id)}
                      className={cn(
                        'rounded p-0.5 transition-colors',
                        isActive
                          ? 'text-blue-100 hover:bg-white/20 hover:text-white'
                          : 'text-theme-muted hover:text-yellow-500'
                      )}
                      aria-label={t('editPage')}
                    >
                      <Pencil size={12} />
                    </button>
                    <button
                      onClick={() => handleDeletePage(page.id, page.name)}
                      className={cn(
                        'rounded p-0.5 transition-colors',
                        isActive
                          ? 'text-blue-100 hover:bg-white/20 hover:text-white'
                          : 'text-theme-muted hover:text-red-500'
                      )}
                      aria-label={t('deletePage')}
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <button
          onClick={handleAddPage}
          className="rounded-lg border border-dashed border-theme-border bg-theme-card p-1.5 text-theme-secondary transition-colors hover:border-blue-500 hover:text-blue-500"
          aria-label={t('addPage')}
        >
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
