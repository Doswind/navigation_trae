import { useSortable, SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Plus, Pencil, Trash2, GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store/useAppStore';
import { useI18n } from '@/hooks/useI18n';
import { SiteCard } from './SiteCard';
import type { Group } from '@/types';

interface GroupCardProps {
  group: Group;
  pageId: string;
  index: number;
}

export function GroupCard({ group, pageId, index }: GroupCardProps) {
  const { t } = useI18n();
  const { config, editMode, openModal, openConfirm, deleteGroup } = useAppStore();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: group.id,
    data: { type: 'group', groupId: group.id, pageId },
    disabled: !editMode,
  });

  const handleAddSite = () => {
    openModal('siteForm', { groupId: group.id, pageId });
  };

  const handleEditGroup = () => {
    openModal('groupForm', { group, pageId });
  };

  const handleDeleteGroup = () => {
    openConfirm({
      title: t('confirmDelete'),
      message: t('deleteGroupConfirm', { name: group.name }),
      onConfirm: () => deleteGroup(pageId, group.id),
    });
  };

  const siteColumnClass =
    config.cardLayout === 'horizontal'
      ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'
      : config.cardLayout === 'vertical'
      ? 'grid-cols-1 sm:grid-cols-2'
      : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        animationDelay: `${index * 40}ms`,
        zIndex: isDragging ? 40 : undefined,
      }}
      {...attributes}
      className={cn(
        'animate-fade-in-up flex flex-col rounded-lg border border-theme-border bg-theme-card shadow-sm backdrop-blur-sm',
        editMode && 'cursor-grab active:cursor-grabbing',
        isDragging && 'opacity-50'
      )}
    >
      <div
        className="flex items-center justify-between rounded-t-lg px-3 py-2"
        style={{ backgroundColor: `${group.color}18`, borderBottom: `1px solid ${group.color}40` }}
      >
        <div className="flex items-center gap-2">
          {editMode && (
            <button
              {...listeners}
              className="cursor-grab text-theme-muted hover:text-theme-secondary active:cursor-grabbing"
              aria-label={t('dragToSort')}
            >
              <GripVertical size={14} />
            </button>
          )}
          <div className="h-2 w-2 rounded-full" style={{ backgroundColor: group.color }} />
          <h3 className="font-display text-sm font-semibold" style={{ color: group.color }}>
            {group.name}
          </h3>
          <span className="text-[10px] text-theme-muted">({group.sites.length})</span>
        </div>

        {editMode && (
          <div className="flex items-center gap-1">
            <button
              onClick={handleAddSite}
              className="rounded p-1 text-theme-secondary hover:bg-theme-card-hover hover:text-blue-500"
              aria-label={t('addSite')}
            >
              <Plus size={14} />
            </button>
            <button
              onClick={handleEditGroup}
              className="rounded p-1 text-theme-secondary hover:bg-theme-card-hover hover:text-yellow-500"
              aria-label={t('editGroup')}
            >
              <Pencil size={14} />
            </button>
            <button
              onClick={handleDeleteGroup}
              className="rounded p-1 text-theme-secondary hover:bg-theme-card-hover hover:text-red-500"
              aria-label={t('deleteGroup')}
            >
              <Trash2 size={14} />
            </button>
          </div>
        )}
      </div>

      <div className="p-2">
        {group.sites.length === 0 ? (
          <div className="py-4 text-center text-xs text-theme-muted">{t('emptyGroup')}</div>
        ) : (
          <SortableContext items={group.sites.map((s) => s.id)} strategy={rectSortingStrategy}>
            <div className={cn('grid gap-1.5', siteColumnClass)}>
              {group.sites.map((site, idx) => (
                <SiteCard key={site.id} site={site} groupId={group.id} pageId={pageId} index={idx} />
              ))}
            </div>
          </SortableContext>
        )}
      </div>
    </div>
  );
}
