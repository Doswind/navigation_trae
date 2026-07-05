import { useState } from 'react';
import { Modal } from './Modal';
import { ColorPicker } from './ColorPicker';
import { useAppStore } from '@/store/useAppStore';
import { useI18n } from '@/hooks/useI18n';
import type { Group } from '@/types';

interface GroupFormProps {
  group?: Group;
  pageId?: string;
  onClose: () => void;
}

export function GroupForm({ group, pageId, onClose }: GroupFormProps) {
  const { t } = useI18n();
  const { addGroup, updateGroup, currentPageId } = useAppStore();
  const [name, setName] = useState(group?.name || '');
  const [color, setColor] = useState(group?.color || '#3b82f6');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    if (group) {
      updateGroup(pageId || currentPageId, group.id, { name: name.trim(), color });
    } else {
      addGroup({ name: name.trim(), color }, pageId || currentPageId);
    }
    onClose();
  };

  return (
    <Modal isOpen onClose={onClose} title={group ? t('editGroup') : t('addGroup')}>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-theme-secondary">{t('groupName')}</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-md border border-theme-border-strong bg-theme-input px-3 py-2 text-sm text-theme-primary placeholder:text-theme-muted outline-none focus:border-blue-500"
            placeholder={t('groupName')}
            autoFocus
          />
        </div>
        <ColorPicker value={color} onChange={setColor} label={t('groupColor')} />
        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-theme-border-strong px-3 py-1.5 text-xs font-medium text-theme-secondary hover:bg-theme-card-hover"
          >
            {t('cancel')}
          </button>
          <button
            type="submit"
            disabled={!name.trim()}
            className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-500 disabled:opacity-50"
          >
            {t('save')}
          </button>
        </div>
      </form>
    </Modal>
  );
}
