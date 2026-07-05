import { getDomain, normalizeUrl } from './helpers';

export type IconService =
  | 'smart'
  | 'google'
  | 'duckduckgo'
  | 'clearbit'
  | 'iconhorse'
  | 'faviconkit'
  | 'yandex'
  | 'direct';

export const iconServices: IconService[] = [
  'smart',
  'google',
  'duckduckgo',
  'clearbit',
  'iconhorse',
  'faviconkit',
  'yandex',
  'direct',
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
    case 'google':
      return `https://www.google.com/s2/favicons?domain=${rootDomain}&sz=128`;
    case 'duckduckgo':
      return `https://icons.duckduckgo.com/ip3/${rootDomain}.ico`;
    case 'clearbit':
      return `https://logo.clearbit.com/${rootDomain}`;
    case 'iconhorse':
      return `https://icon.horse/icon/${rootDomain}`;
    case 'faviconkit':
      return `https://api.faviconkit.com/${rootDomain}/144`;
    case 'yandex':
      return `https://favicon.yandex.net/favicon/${rootDomain}`;
    case 'direct':
      return `${normalizedUrl.replace(/\/$/, '')}/favicon.ico`;
    default:
      return `https://www.google.com/s2/favicons?domain=${rootDomain}&sz=128`;
  }
}

function buildIconUrls(url: string): string[] {
  const normalized = normalizeUrl(url);
  const rootDomain = getRootDomain(url);

  const urls: string[] = [];

  if (knownIcons[rootDomain]) {
    urls.push(knownIcons[rootDomain]);
  }

  urls.push(
    `https://logo.clearbit.com/${rootDomain}`,
    `https://icon.horse/icon/${rootDomain}`,
    `https://www.google.com/s2/favicons?domain=${rootDomain}&sz=128`,
    `https://favicon.yandex.net/favicon/${rootDomain}`,
    `https://api.faviconkit.com/${rootDomain}/144`,
    `https://icons.duckduckgo.com/ip3/${rootDomain}.ico`,
    `${normalized.replace(/\/$/, '')}/favicon.ico`
  );

  return urls;
}

function probeImage(src: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    const timer = setTimeout(() => reject(new Error('timeout')), 5000);
    img.onload = () => {
      clearTimeout(timer);
      resolve(src);
    };
    img.onerror = () => {
      clearTimeout(timer);
      reject(new Error('load error'));
    };
    img.src = src;
  });
}

async function raceSuccess<T>(promises: Promise<T>[]): Promise<T> {
  if (promises.length === 0) return Promise.reject(new Error('empty'));
  let rejectedCount = 0;
  return new Promise((resolve, reject) => {
    promises.forEach((p) => {
      p.then(resolve, () => {
        rejectedCount++;
        if (rejectedCount === promises.length) {
          reject(new Error('all failed'));
        }
      });
    });
  });
}

export async function fetchSiteIcon(url: string): Promise<string | null> {
  const urls = buildIconUrls(url);
  try {
    return await raceSuccess(urls.map(probeImage));
  } catch {
    return null;
  }
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
