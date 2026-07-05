import { Modal } from './Modal';
import { useAppStore } from '@/store/useAppStore';
import { useI18n } from '@/hooks/useI18n';

export function ConfirmDialog({ onClose }: { onClose: () => void }) {
  const { t } = useI18n();
  const { confirmOptions, closeConfirm } = useAppStore();

  if (!confirmOptions) return null;

  const handleConfirm = () => {
    confirmOptions.onConfirm();
    closeConfirm();
    onClose();
  };

  return (
    <Modal isOpen onClose={onClose} title={t('confirmDelete')}>
      <div className="space-y-4">
        <p className="text-sm text-theme-secondary">{confirmOptions.message}</p>
        <div className="flex justify-end gap-2">
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
            className="rounded-md bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-500"
          >
            {t('confirm')}
          </button>
        </div>
      </div>
    </Modal>
  );
}
