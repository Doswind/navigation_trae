import { Github } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';

export function Footer() {
  const { t } = useI18n();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-theme-border bg-theme-card px-4 py-2">
      <div className="mx-auto flex w-full max-w-[1600px] flex-col items-center justify-between gap-1 sm:flex-row">
        <div className="text-[10px] text-theme-muted">
          © {currentYear} {t('appTitle')}. All rights reserved.
        </div>
        <div className="flex items-center gap-3 text-[10px] text-theme-muted">
          <span>v1.1.0</span>
          <a
            href="https://github.com/Doswind/navigation_trae"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-theme-secondary transition-colors hover:text-blue-500"
          >
            <Github size={11} />
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
