import { useMemo, useState } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';
import { Header } from '@/components/Header';
import { GroupCard } from '@/components/GroupCard';
import { SiteCard } from '@/components/SiteCard';
import { PageForm } from '@/components/PageForm';
import { GroupForm } from '@/components/GroupForm';
import { SiteForm } from '@/components/SiteForm';
import { SettingsPanel } from '@/components/SettingsPanel';
import { ImportPanel } from '@/components/ImportPanel';
import { ExportPanel } from '@/components/ExportPanel';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { useAppStore } from '@/store/useAppStore';
import { useI18n } from '@/hooks/useI18n';
import { cn } from '@/lib/utils';
import type { Group, Site } from '@/types';

export default function Home() {
  const { t } = useI18n();
  const {
    data,
    config,
    currentPageId,
    editMode,
    activeModal,
    modalData,
    confirmOptions,
    closeModal,
    closeConfirm,
    addGroup,
    reorderGroups,
    reorderSites,
    moveSite,
  } = useAppStore();

  const currentPage = data.pages.find((p) => p.id === currentPageId);

  const [activeGroup, setActiveGroup] = useState<Group | null>(null);
  const [activeSite, setActiveSite] = useState<Site | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  const groupIds = useMemo(() => currentPage?.groups.map((g) => g.id) || [], [currentPage]);

  const colsMap: Record<number, string> = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6',
  };

  const getGroupCols = () => colsMap[config.groupsPerRow] || 'grid-cols-4';

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const type = active.data.current?.type;
    if (type === 'group') {
      const group = currentPage?.groups.find((g) => g.id === active.id);
      if (group) setActiveGroup(group);
    } else if (type === 'site') {
      const site = currentPage?.groups
        .flatMap((g) => g.sites)
        .find((s) => s.id === active.id);
      if (site) setActiveSite(site);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeType = active.data.current?.type;
    const overType = over.data.current?.type;

    if (activeType !== 'site') return;

    const activeGroupId = active.data.current?.groupId;
    let overGroupId = over.data.current?.groupId;
    if (overType === 'group') {
      overGroupId = over.id;
    }
    if (!overGroupId || activeGroupId === overGroupId) return;

    const activeSiteId = active.data.current?.siteId;
    if (!activeSiteId) return;

    moveSite(currentPageId, activeGroupId, overGroupId, activeSiteId);
    active.data.current = { ...active.data.current, groupId: overGroupId };
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveGroup(null);
    setActiveSite(null);

    if (!over) return;

    const activeType = active.data.current?.type;

    if (activeType === 'group') {
      if (active.id === over.id) return;
      const oldIndex = groupIds.indexOf(String(active.id));
      const newIndex = groupIds.indexOf(String(over.id));
      if (oldIndex === -1 || newIndex === -1) return;
      const newGroupIds = [...groupIds];
      const [moved] = newGroupIds.splice(oldIndex, 1);
      newGroupIds.splice(newIndex, 0, moved);
      reorderGroups(currentPageId, newGroupIds);
    } else if (activeType === 'site') {
      const groupId = active.data.current?.groupId;
      const group = currentPage?.groups.find((g) => g.id === groupId);
      if (!group) return;
      const siteIds = group.sites.map((s) => s.id);
      const oldIndex = siteIds.indexOf(String(active.id));
      const newIndex = over.data.current?.type === 'site' ? siteIds.indexOf(String(over.id)) : siteIds.length - 1;
      if (oldIndex === -1) return;
      const newSiteIds = [...siteIds];
      const [moved] = newSiteIds.splice(oldIndex, 1);
      newSiteIds.splice(newIndex, 0, moved);
      reorderSites(currentPageId, groupId, newSiteIds);
    }
  };

  const renderModals = () => {
    if (activeModal === 'pageForm') {
      const data = modalData as { page?: typeof currentPage } | undefined;
      return <PageForm page={data?.page} onClose={closeModal} />;
    }
    if (activeModal === 'groupForm') {
      const data = modalData as { group?: Group; pageId?: string } | undefined;
      return <GroupForm group={data?.group} pageId={data?.pageId} onClose={closeModal} />;
    }
    if (activeModal === 'siteForm') {
      const data = modalData as { site?: Site; groupId?: string; pageId?: string } | undefined;
      return (
        <SiteForm
          site={data?.site}
          groupId={data?.groupId}
          pageId={data?.pageId}
          onClose={closeModal}
        />
      );
    }
    if (activeModal === 'settings') {
      return <SettingsPanel onClose={closeModal} />;
    }
    if (activeModal === 'import') {
      return <ImportPanel onClose={closeModal} />;
    }
    if (activeModal === 'export') {
      return <ExportPanel onClose={closeModal} />;
    }
    return null;
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="min-h-screen bg-theme-page">
        <Header />

        <main className="mx-auto w-full px-4 py-3">
          {currentPage ? (
            <SortableContext items={groupIds} strategy={rectSortingStrategy}>
              <div className={cn('grid gap-3', getGroupCols())}>
                {currentPage.groups.map((group, index) => (
                  <GroupCard key={group.id} group={group} pageId={currentPage.id} index={index} />
                ))}
                {editMode && (
                  <button
                    onClick={() => addGroup({ name: t('addGroup'), color: '#3b82f6' }, currentPage.id)}
                    className="flex min-h-[120px] animate-fade-in-up flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-theme-border-strong bg-theme-card/50 text-theme-muted transition-colors hover:border-blue-500/50 hover:bg-theme-card hover:text-blue-500"
                  >
                    <Plus size={20} />
                    <span className="text-xs font-medium">{t('addGroup')}</span>
                  </button>
                )}
              </div>
            </SortableContext>
          ) : (
            <div className="py-20 text-center text-sm text-theme-muted">{t('noPages')}</div>
          )}
        </main>
      </div>

      <DragOverlay dropAnimation={null}>
        {activeGroup ? (
          <div className="rounded-lg border border-theme-border-strong bg-theme-card p-3 opacity-90 shadow-xl">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full" style={{ backgroundColor: activeGroup.color }} />
              <span className="text-sm font-medium text-theme-primary">{activeGroup.name}</span>
            </div>
          </div>
        ) : null}
        {activeSite ? (
          <div className="rounded-md border border-theme-border-strong bg-theme-card p-2 opacity-90 shadow-xl">
            <div className="flex items-center gap-2">
              <img
                src={`https://www.google.com/s2/favicons?domain=${activeSite.url}&sz=64`}
                alt=""
                className="h-4 w-4 rounded-sm object-contain"
              />
              <span className="text-xs font-medium text-theme-primary">{activeSite.name}</span>
            </div>
          </div>
        ) : null}
      </DragOverlay>

      {renderModals()}
      {confirmOptions && <ConfirmDialog onClose={closeConfirm} />}
    </DndContext>
  );
}
