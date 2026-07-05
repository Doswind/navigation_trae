import { getDomain, normalizeUrl } from './helpers';

export type IconService =
  | 'smart'
  | 'faviconsnap'
  | 'faviconis'
  | 'iconhorse'
  | 'clearbit'
  | 'google'
  | 'faviconkit'
  | 'duckduckgo'
  | 'direct'
  | 'yandex';

export const iconServices: IconService[] = [
  'smart',
  'faviconsnap',
  'faviconis',
  'iconhorse',
  'clearbit',
  'google',
  'faviconkit',
  'duckduckgo',
  'direct',
  'yandex',
];

// 智能选择时的请求顺序：优先清晰且稳定的服务，再兜底
const smartOrder: Exclude<IconService, 'smart'>[] = [
  'faviconsnap',
  'faviconis',
  'iconhorse',
  'clearbit',
  'google',
  'faviconkit',
  'duckduckgo',
  'direct',
  'yandex',
];

const knownIcons: Record<string, string> = {
  'baidu.com': 'https://www.baidu.com/favicon.ico',
  'google.com': 'https://www.google.com/favicon.ico',
  'youtube.com': 'https://www.youtube.com/favicon.ico',
  'github.com': 'https://github.com/favicon.ico',
  'twitter.com': 'https://twitter.com/favicon.ico',
  'x.com': 'https://abs.twimg.com/favicons/twitter.3.ico',
  'taobao.com': 'https://www.taobao.com/favicon.ico',
  'tmall.com': 'https://www.tmall.com/favicon.ico',
  'jd.com': 'https://www.jd.com/favicon.ico',
  'weibo.com': 'https://weibo.com/favicon.ico',
  'zhihu.com': 'https://www.zhihu.com/favicon.ico',
  'bilibili.com': 'https://www.bilibili.com/favicon.ico',
  'reddit.com': 'https://www.reddit.com/favicon.ico',
  'stackoverflow.com': 'https://stackoverflow.com/favicon.ico',
  'linkedin.com': 'https://www.linkedin.com/favicon.ico',
  'facebook.com': 'https://www.facebook.com/favicon.ico',
  'instagram.com': 'https://www.instagram.com/favicon.ico',
  'amazon.com': 'https://www.amazon.com/favicon.ico',
  'netflix.com': 'https://www.netflix.com/favicon.ico',
  'spotify.com': 'https://open.spotify.com/favicon.ico',
};

function getRootDomain(url: string): string {
  const normalized = normalizeUrl(url);
  const domain = getDomain(normalized);
  return domain.replace(/^www\./, '');
}

function buildServiceUrl(service: IconService, rootDomain: string, normalizedUrl: string): string {
  switch (service) {
    case 'faviconsnap':
      return `https://faviconsnap.com/api/favicon?url=${encodeURIComponent(rootDomain)}&size=128`;
    case 'faviconis':
      return `https://favicon.is/${rootDomain}?larger=true`;
    case 'iconhorse':
      return `https://icon.horse/icon/${rootDomain}`;
    case 'clearbit':
      return `https://logo.clearbit.com/${rootDomain}`;
    case 'google':
      return `https://www.google.com/s2/favicons?domain=${rootDomain}&sz=128`;
    case 'duckduckgo':
      return `https://icons.duckduckgo.com/ip3/${rootDomain}.ico`;
    case 'faviconkit':
      return `https://api.faviconkit.com/${rootDomain}/144`;
    case 'yandex':
      return `https://favicon.yandex.net/favicon/${rootDomain}`;
    case 'direct':
      return `${normalizedUrl.replace(/\/$/, '')}/favicon.ico`;
    default:
      return `https://faviconsnap.com/api/favicon?url=${encodeURIComponent(rootDomain)}&size=128`;
  }
}

function buildSmartUrls(url: string): string[] {
  const normalized = normalizeUrl(url);
  const rootDomain = getRootDomain(url);

  const urls: string[] = [];

  if (knownIcons[rootDomain]) {
    urls.push(knownIcons[rootDomain]);
  }

  smartOrder.forEach((service) => {
    urls.push(buildServiceUrl(service, rootDomain, normalized));
  });

  return urls;
}

function probeImage(src: string, timeout = 3000): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    let settled = false;
    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      cleanup();
      reject(new Error('timeout'));
    }, timeout);

    const cleanup = () => {
      clearTimeout(timer);
      img.onload = null;
      img.onerror = null;
    };

    img.onload = () => {
      if (settled) return;
      settled = true;
      cleanup();

      const isSvg = /\.svg(\?|$)/i.test(src);
      if (isSvg || (img.naturalWidth >= 16 && img.naturalHeight >= 16)) {
        resolve(src);
      } else {
        reject(new Error('too small'));
      }
    };

    img.onerror = () => {
      if (settled) return;
      settled = true;
      cleanup();
      reject(new Error('load error'));
    };

    img.src = src;
  });
}

async function tryInSequence(urls: string[]): Promise<string | null> {
  for (const url of urls) {
    try {
      return await probeImage(url);
    } catch {
      // 继续尝试下一个
    }
  }
  return null;
}

export async function fetchSiteIcon(url: string): Promise<string | null> {
  const urls = buildSmartUrls(url);
  return tryInSequence(urls);
}

export async function fetchSiteIconWithService(
  url: string,
  service: IconService
): Promise<string | null> {
  if (service === 'smart') {
    return fetchSiteIcon(url);
  }

  const normalized = normalizeUrl(url);
  const rootDomain = getRootDomain(url);
  const serviceUrl = buildServiceUrl(service, rootDomain, normalized);

  try {
    return await probeImage(serviceUrl);
  } catch {
    return null;
  }
}
