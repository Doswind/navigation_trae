import { useState } from 'react';
import { Modal } from './Modal';
import { useAppStore } from '@/store/useAppStore';
import { useI18n } from '@/hooks/useI18n';
import { cn } from '@/lib/utils';
import { fetchSiteIconWithService, iconServices, type IconService } from '@/utils/iconFetch';
import { normalizeUrl } from '@/utils/helpers';
import type { Site, SiteEffects } from '@/types';
import { Sparkles, Flame, Rocket, AlertTriangle, Loader2 } from 'lucide-react';

interface SiteFormProps {
  site?: Site;
  pageId?: string;
  groupId?: string;
  onClose: () => void;
}

const emptyEffects: SiteEffects = {};

export function SiteForm({ site, pageId, groupId, onClose }: SiteFormProps) {
  const { t } = useI18n();
  const { addSite, updateSite, currentPageId, getCurrentPage } = useAppStore();
  const currentPage = getCurrentPage();

  const [name, setName] = useState(site?.name || '');
  const [url, setUrl] = useState(site?.url || '');
  const [description, setDescription] = useState(site?.description || '');
  const [icon, setIcon] = useState(site?.icon || '');
  const [effects, setEffects] = useState<SiteEffects>(site?.effects || emptyEffects);
  const [iconService, setIconService] = useState<IconService>('smart');
  const [fetching, setFetching] = useState(false);

  const targetGroupId = groupId || currentPage?.groups[0]?.id || '';

  const handleFetchIcon = async () => {
    if (!url.trim()) return;
    setFetching(true);
    try {
      const fetched = await fetchSiteIconWithService(url, iconService);
      if (fetched) setIcon(fetched);
    } finally {
      setFetching(false);
    }
  };

  const toggleEffect = (key: keyof SiteEffects) => {
    setEffects((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !url.trim()) return;

    const payload: Omit<Site, 'id'> = {
      name: name.trim(),
      url: normalizeUrl(url.trim()),
      description: description.trim(),
      icon: icon.trim(),
      effects,
    };

    if (site) {
      updateSite(pageId || currentPageId, targetGroupId, site.id, payload);
    } else {
      addSite(pageId || currentPageId, targetGroupId, payload);
    }
    onClose();
  };

  const effectOptions: { key: keyof SiteEffects; label: string; icon: React.ReactNode }[] = [
    { key: 'highlight', label: t('effectHighlight'), icon: <Sparkles size={12} /> },
    { key: 'blink', label: t('effectBlink'), icon: <Flame size={12} /> },
    { key: 'bounce', label: t('effectBounce'), icon: <Rocket size={12} /> },
    { key: 'shake', label: t('effectShake'), icon: <AlertTriangle size={12} /> },
  ];

  const inputClass =
    'w-full rounded-md border border-theme-border-strong bg-theme-input px-3 py-2 text-sm text-theme-primary placeholder:text-theme-muted outline-none focus:border-blue-500';

  return (
    <Modal isOpen onClose={onClose} title={site ? t('editSite') : t('addSite')} className="max-w-lg">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-theme-secondary">
            {t('siteName')}
            <span className="ml-0.5 text-red-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
            placeholder={t('siteName')}
            autoFocus
            required
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-theme-secondary">
            {t('siteUrl')}
            <span className="ml-0.5 text-red-500">*</span>
          </label>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className={inputClass}
            placeholder="example.com"
            required
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-theme-secondary">{t('siteDescription')}</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={cn(inputClass, 'min-h-[80px] resize-y')}
            placeholder={t('siteDescription')}
            rows={3}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-theme-secondary">{t('siteIcon')}</label>
          <div className="mb-2 grid grid-cols-2 gap-2">
            <select
              value={iconService}
              onChange={(e) => setIconService(e.target.value as IconService)}
              className={inputClass}
            >
              {iconServices.map((s) => (
                <option key={s} value={s}>
                  {s === 'smart'
                    ? t('iconServiceSmart')
                    : s === 'direct'
                    ? t('iconServiceDirect')
                    : s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={handleFetchIcon}
              disabled={fetching || !url.trim()}
              className="flex items-center justify-center gap-1.5 rounded-md border border-theme-border-strong bg-theme-card px-3 py-2 text-xs font-medium text-theme-secondary hover:bg-theme-card-hover disabled:opacity-50"
            >
              {fetching ? <Loader2 size={12} className="animate-spin" /> : null}
              {t('fetchIcon')}
            </button>
          </div>
          <input
            type="text"
            value={icon}
            onChange={(e) => setIcon(e.target.value)}
            className={inputClass}
            placeholder="https://..."
          />
          {icon && (
            <div className="mt-2 flex items-center gap-2">
              <span className="text-xs text-theme-muted">{t('preview')}:</span>
              <img src={icon} alt="icon" className="h-5 w-5 rounded object-contain" />
            </div>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-theme-secondary">{t('effects')}</label>
          <div className="grid grid-cols-2 gap-2">
            {effectOptions.map(({ key, label, icon }) => (
              <button
                key={key}
                type="button"
                onClick={() => toggleEffect(key)}
                className={`flex items-center gap-2 rounded-md border px-3 py-2 text-left text-xs transition-colors ${
                  effects[key]
                    ? 'border-blue-500/50 bg-blue-500/10 text-blue-500'
                    : 'border-theme-border-strong bg-theme-input text-theme-secondary hover:bg-theme-card-hover'
                }`}
              >
                {icon}
                {label}
              </button>
            ))}
          </div>
        </div>

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
            disabled={!name.trim() || !url.trim()}
            className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-500 disabled:opacity-50"
          >
            {t('save')}
          </button>
        </div>
      </form>
    </Modal>
  );
}
