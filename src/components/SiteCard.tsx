import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Pencil, Trash2, GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store/useAppStore';
import { useI18n } from '@/hooks/useI18n';
import { getDomain, normalizeUrl, getFontSizeConfig } from '@/utils/helpers';
import type { Site } from '@/types';

interface SiteCardProps {
  site: Site;
  groupId: string;
  pageId: string;
  index: number;
}

export function SiteCard({ site, groupId, pageId, index }: SiteCardProps) {
  const { t } = useI18n();
  const { config, editMode, openModal, openConfirm, deleteSite } = useAppStore();
  const fs = getFontSizeConfig(config.fontSize);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: site.id,
    data: { type: 'site', siteId: site.id, groupId, pageId },
    disabled: !editMode,
  });

  const handleClick = () => {
    if (!editMode) {
      window.open(normalizeUrl(site.url), '_blank', 'noopener,noreferrer');
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    openModal('siteForm', { site, groupId, pageId });
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    openConfirm({
      title: t('confirmDelete'),
      message: t('deleteSiteConfirm', { name: site.name }),
      onConfirm: () => deleteSite(pageId, groupId, site.id),
    });
  };

  const NameHandle = ({
    as: Component = 'span',
    className,
  }: {
    as?: 'span' | 'div';
    className?: string;
  }) =>
    showName ? (
      <Component
        {...attributes}
        {...listeners}
        className={cn(
          'truncate font-medium text-theme-primary',
          fs.nameClass,
          editMode && 'cursor-grab active:cursor-grabbing',
          className
        )}
      >
        {site.name}
      </Component>
    ) : null;

  const effectClasses = cn(
    site.effects.highlight && 'effect-highlight',
    site.effects.blink && 'effect-blink',
    site.effects.bounce && 'effect-bounce',
    site.effects.shake && 'effect-shake'
  );

  const showIcon = config.showIcon;
  const showName = config.showName;
  const showUrl = config.showUrl;
  const showDesc = config.showDescription;

  const iconEl = showIcon && (
    <img
      src={site.icon || `https://www.google.com/s2/favicons?domain=${getDomain(site.url)}&sz=64`}
      alt=""
      className={cn('flex-shrink-0 rounded-sm object-contain', fs.iconClass)}
      onError={(e) => {
        (e.target as HTMLImageElement).src = 'https://www.google.com/s2/favicons?domain=example.com&sz=64';
      }}
    />
  );

  const layout = config.cardLayout;

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        animationDelay: `${index * 20}ms`,
        zIndex: isDragging ? 50 : undefined,
      }}
      className={cn(
        'group relative animate-fade-in-up rounded-md border border-theme-border bg-theme-card transition-all hover:-translate-y-0.5 hover:border-theme-border-strong hover:bg-theme-card-hover hover:shadow-md',
        fs.cardPadding,
        isDragging && 'opacity-50',
        effectClasses
      )}
      onClick={handleClick}
    >
      {editMode && (
        <div
          {...listeners}
          className="absolute -left-1.5 top-1/2 -translate-y-1/2 cursor-grab text-theme-muted opacity-0 group-hover:opacity-100 active:cursor-grabbing"
        >
          <GripVertical size={12} />
        </div>
      )}

      <div className={cn('flex items-center', fs.gap)}>
        {layout === 'compact' && (
          <>
            {iconEl}
            <NameHandle className="flex-1" />
          </>
        )}
        {layout === 'horizontal' && (
          <div className={cn('flex w-full flex-col items-center text-center', fs.gap)}>
            {iconEl}
            <NameHandle className="w-full" />
          </div>
        )}
        {layout === 'vertical' && (
          <div className={cn('flex w-full items-start', fs.gap)}>
            {iconEl}
            <div className="min-w-0 flex-1">
              <NameHandle as="div" className="w-full" />
              {showUrl && <div className={cn('truncate text-theme-muted', fs.urlClass)}>{getDomain(site.url)}</div>}
              {showDesc && site.description && <div className={cn('truncate text-theme-muted', fs.descClass)}>{site.description}</div>}
            </div>
          </div>
        )}
      </div>

      {(layout === 'compact' || layout === 'horizontal') && (
        <div className={cn('min-w-0', layout === 'horizontal' && 'w-full text-center')}>
          {showUrl && (layout === 'compact' || layout === 'horizontal') && (
            <div className={cn('truncate text-theme-muted', fs.urlClass)}>{getDomain(site.url)}</div>
          )}
          {showDesc && site.description && (layout === 'compact' || layout === 'horizontal') && (
            <div className={cn('truncate text-theme-muted', fs.descClass)}>{site.description}</div>
          )}
        </div>
      )}

      {editMode && (
        <div className="absolute right-1 top-1 flex gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            onClick={handleEdit}
            className="rounded bg-theme-card-hover p-1 text-theme-secondary hover:bg-blue-500 hover:text-white"
            aria-label={t('editSite')}
          >
            <Pencil size={10} />
          </button>
          <button
            onClick={handleDelete}
            className="rounded bg-theme-card-hover p-1 text-theme-secondary hover:bg-red-500 hover:text-white"
            aria-label={t('deleteSite')}
          >
            <Trash2 size={10} />
          </button>
        </div>
      )}
    </div>
  );
}
