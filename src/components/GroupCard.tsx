import { useSortable, SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Plus, Pencil, Trash2, GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store/useAppStore';
import { useI18n } from '@/hooks/useI18n';
import { getFontSizeConfig } from '@/utils/helpers';
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
  const fs = getFontSizeConfig(config.fontSize);
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

  const siteColumnClass = (() => {
    const { groupsPerRow, cardLayout } = config;
    if (cardLayout === 'horizontal') {
      const map: Record<number, string> = {
        1: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6',
        2: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4',
        3: 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3',
        4: 'grid-cols-2 sm:grid-cols-2 md:grid-cols-2',
        5: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-2',
        6: 'grid-cols-1 sm:grid-cols-2',
      };
      return map[groupsPerRow] || 'grid-cols-2 sm:grid-cols-3';
    }
    if (cardLayout === 'vertical') {
      const map: Record<number, string> = {
        1: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
        2: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-2',
        3: 'grid-cols-1 sm:grid-cols-1 md:grid-cols-2',
        4: 'grid-cols-1 sm:grid-cols-1',
        5: 'grid-cols-1',
        6: 'grid-cols-1',
      };
      return map[groupsPerRow] || 'grid-cols-1 sm:grid-cols-2';
    }
    const map: Record<number, string> = {
      1: 'grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-12',
      2: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6',
      3: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4',
      4: 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3',
      5: 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3',
      6: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-2',
    };
    return map[groupsPerRow] || 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4';
  })();

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
        className={cn('flex items-center justify-between rounded-t-lg', fs.groupHeaderPadding)}
        style={{ backgroundColor: `${group.color}18`, borderBottom: `1px solid ${group.color}40` }}
      >
        <div className={cn('flex items-center', fs.gap)}>
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
          <h3 className={cn('font-display font-semibold', fs.nameClass)} style={{ color: group.color }}>
            {group.name}
          </h3>
          <span className={cn('text-theme-muted', fs.siteCountClass)}>({group.sites.length})</span>
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

      <div className={fs.groupPadding}>
        {group.sites.length === 0 ? (
          <div className={cn('py-4 text-center text-theme-muted', fs.urlClass)}>{t('emptyGroup')}</div>
        ) : (
          <SortableContext items={group.sites.map((s) => s.id)} strategy={rectSortingStrategy}>
            <div className={cn('grid', config.cardLayout === 'compact' ? 'gap-1' : fs.gridGap, siteColumnClass)}>
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
