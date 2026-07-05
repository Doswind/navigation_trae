export function generateId(prefix = 'id'): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export function normalizeUrl(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return '';
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (/^(localhost|127\.\d+\.\d+\.\d+|192\.168\.\d+\.\d+|10\.\d+\.\d+\.\d+|172\.(1[6-9]|2\d|3[01])\.\d+\.\d+)/i.test(trimmed)) {
    return `http://${trimmed}`;
  }
  return `https://${trimmed}`;
}

export function getDomain(url: string): string {
  try {
    const normalized = normalizeUrl(url);
    const urlObj = new URL(normalized);
    return urlObj.hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

export function downloadJson(data: unknown, filename: string): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function formatDateForFilename(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export type FontSizeLevel = 'xs' | 'sm' | 'base' | 'lg' | 'xl';

export interface FontSizeConfig {
  labelKey: string;
  nameClass: string;
  urlClass: string;
  descClass: string;
  iconClass: string;
  cardPadding: string;
  groupPadding: string;
  groupHeaderPadding: string;
  gap: string;
  gridGap: string;
  siteCountClass: string;
}

export const fontSizeMap: Record<FontSizeLevel, FontSizeConfig> = {
  xs: {
    labelKey: 'fontSizeXs',
    nameClass: 'text-[11px]',
    urlClass: 'text-[9px]',
    descClass: 'text-[9px]',
    iconClass: 'h-3.5 w-3.5',
    cardPadding: 'px-1.5 py-1',
    groupPadding: 'p-1.5',
    groupHeaderPadding: 'px-2 py-1.5',
    gap: 'gap-1',
    gridGap: 'gap-1',
    siteCountClass: 'text-[9px]',
  },
  sm: {
    labelKey: 'fontSizeSm',
    nameClass: 'text-xs',
    urlClass: 'text-[10px]',
    descClass: 'text-[10px]',
    iconClass: 'h-4 w-4',
    cardPadding: 'p-2',
    groupPadding: 'p-2',
    groupHeaderPadding: 'px-3 py-2',
    gap: 'gap-1.5',
    gridGap: 'gap-1.5',
    siteCountClass: 'text-[10px]',
  },
  base: {
    labelKey: 'fontSizeBase',
    nameClass: 'text-sm',
    urlClass: 'text-xs',
    descClass: 'text-xs',
    iconClass: 'h-5 w-5',
    cardPadding: 'p-2.5',
    groupPadding: 'p-2.5',
    groupHeaderPadding: 'px-3 py-2.5',
    gap: 'gap-2',
    gridGap: 'gap-2',
    siteCountClass: 'text-xs',
  },
  lg: {
    labelKey: 'fontSizeLg',
    nameClass: 'text-base',
    urlClass: 'text-sm',
    descClass: 'text-sm',
    iconClass: 'h-6 w-6',
    cardPadding: 'p-3',
    groupPadding: 'p-3',
    groupHeaderPadding: 'px-4 py-3',
    gap: 'gap-2.5',
    gridGap: 'gap-2.5',
    siteCountClass: 'text-sm',
  },
  xl: {
    labelKey: 'fontSizeXl',
    nameClass: 'text-lg',
    urlClass: 'text-base',
    descClass: 'text-base',
    iconClass: 'h-7 w-7',
    cardPadding: 'p-3.5',
    groupPadding: 'p-3.5',
    groupHeaderPadding: 'px-4 py-3.5',
    gap: 'gap-3',
    gridGap: 'gap-3',
    siteCountClass: 'text-base',
  },
};

export function getFontSizeConfig(level: FontSizeLevel): FontSizeConfig {
  return fontSizeMap[level] || fontSizeMap.sm;
}
