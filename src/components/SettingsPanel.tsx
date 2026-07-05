import { Moon, Sun, Monitor } from 'lucide-react';
import { Modal } from './Modal';
import { useAppStore } from '@/store/useAppStore';
import { useI18n, type Language } from '@/hooks/useI18n';
import type { AppConfig, CardLayout, PageDisplay, ThemeMode } from '@/types';

export function SettingsPanel({ onClose }: { onClose: () => void }) {
  const { t, language, setLanguage } = useI18n();
  const { config, setConfig } = useAppStore();

  const update = <K extends keyof AppConfig>(key: K, value: AppConfig[K]) => {
    setConfig({ ...config, [key]: value });
  };

  const themeOptions: { key: ThemeMode; icon: React.ReactNode; label: string }[] = [
    { key: 'light', icon: <Sun size={13} />, label: t('themeLight') },
    { key: 'dark', icon: <Moon size={13} />, label: t('themeDark') },
    { key: 'system', icon: <Monitor size={13} />, label: t('themeSystem') },
  ];

  return (
    <Modal isOpen onClose={onClose} title={t('settings')} className="max-w-md">
      <div className="space-y-4">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-theme-secondary">{t('theme')}</label>
          <div className="flex gap-2">
            {themeOptions.map(({ key, icon, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => update('theme', key)}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-md border px-2 py-2 text-xs font-medium transition-colors ${
                  config.theme === key
                    ? 'border-blue-500/50 bg-blue-500/10 text-blue-500'
                    : 'border-theme-border bg-theme-input text-theme-secondary hover:bg-theme-card-hover'
                }`}
              >
                {icon}
                {label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-theme-secondary">{t('pageDisplay')}</label>
          <div className="flex gap-2">
            {(['dropdown', 'tabs'] as PageDisplay[]).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => update('pageDisplay', mode)}
                className={`flex-1 rounded-md border px-3 py-2 text-xs font-medium transition-colors ${
                  config.pageDisplay === mode
                    ? 'border-blue-500/50 bg-blue-500/10 text-blue-500'
                    : 'border-theme-border bg-theme-input text-theme-secondary hover:bg-theme-card-hover'
                }`}
              >
                {t(mode)}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-theme-secondary">
            {t('groupsPerRow')}: {config.groupsPerRow}
          </label>
          <input
            type="range"
            min={1}
            max={6}
            value={config.groupsPerRow}
            onChange={(e) => update('groupsPerRow', parseInt(e.target.value, 10))}
            className="w-full accent-blue-500"
          />
          <div className="mt-1 flex justify-between text-[10px] text-theme-muted">
            <span>1</span>
            <span>6</span>
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-theme-secondary">{t('language')}</label>
          <div className="flex gap-2">
            {(['zh-CN', 'en'] as Language[]).map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => setLanguage(lang)}
                className={`flex-1 rounded-md border px-3 py-2 text-xs font-medium transition-colors ${
                  language === lang
                    ? 'border-blue-500/50 bg-blue-500/10 text-blue-500'
                    : 'border-theme-border bg-theme-input text-theme-secondary hover:bg-theme-card-hover'
                }`}
              >
                {t(lang === 'zh-CN' ? 'chinese' : 'english')}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-theme-secondary">{t('cardDisplay')}</label>
          <div className="grid grid-cols-2 gap-2">
            {([
              { key: 'showIcon', label: t('showIcon') },
              { key: 'showName', label: t('showName') },
              { key: 'showUrl', label: t('showUrl') },
              { key: 'showDescription', label: t('showDescription') },
            ] as { key: keyof AppConfig; label: string }[]).map(({ key, label }) => (
              <label
                key={key}
                className="flex cursor-pointer items-center gap-2 rounded-md border border-theme-border bg-theme-input px-3 py-2 text-xs text-theme-secondary hover:bg-theme-card-hover"
              >
                <input
                  type="checkbox"
                  checked={!!config[key]}
                  onChange={(e) => update(key, e.target.checked as AppConfig[typeof key])}
                  className="accent-blue-500"
                />
                {label}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-theme-secondary">{t('cardLayout')}</label>
          <div className="grid grid-cols-3 gap-2">
            {(['compact', 'horizontal', 'vertical'] as CardLayout[]).map((layout) => (
              <button
                key={layout}
                type="button"
                onClick={() => update('cardLayout', layout)}
                className={`rounded-md border px-2 py-2 text-xs font-medium transition-colors ${
                  config.cardLayout === layout
                    ? 'border-blue-500/50 bg-blue-500/10 text-blue-500'
                    : 'border-theme-border bg-theme-input text-theme-secondary hover:bg-theme-card-hover'
                }`}
              >
                {t(`layout${layout.charAt(0).toUpperCase() + layout.slice(1)}` as never)}
              </button>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}
