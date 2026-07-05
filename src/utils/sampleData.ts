import type { AppData } from '@/types';

export const sampleData: AppData = {
  pages: [
    {
      id: 'page_default',
      name: '常用导航',
      color: '#3b82f6',
      groups: [
        {
          id: 'group_search',
          name: '搜索引擎',
          color: '#3b82f6',
          sites: [
            { id: 'site_google', name: 'Google', url: 'https://www.google.com', description: '全球最大搜索引擎', effects: { highlight: true } },
            { id: 'site_baidu', name: '百度', url: 'https://www.baidu.com', description: '中文搜索引擎', effects: {} },
            { id: 'site_bing', name: 'Bing', url: 'https://www.bing.com', description: '微软搜索引擎', effects: {} },
            { id: 'site_duckduckgo', name: 'DuckDuckGo', url: 'https://duckduckgo.com', description: '隐私搜索引擎', effects: {} },
          ],
        },
        {
          id: 'group_social',
          name: '社交媒体',
          color: '#ec4899',
          sites: [
            { id: 'site_twitter', name: 'Twitter', url: 'https://twitter.com', description: '社交网络平台', effects: { bounce: true } },
            { id: 'site_weibo', name: '微博', url: 'https://weibo.com', description: '中文社交媒体', effects: {} },
            { id: 'site_reddit', name: 'Reddit', url: 'https://www.reddit.com', description: '社区论坛', effects: {} },
            { id: 'site_linkedin', name: 'LinkedIn', url: 'https://www.linkedin.com', description: '职业社交', effects: {} },
          ],
        },
        {
          id: 'group_dev',
          name: '开发工具',
          color: '#10b981',
          sites: [
            { id: 'site_github', name: 'GitHub', url: 'https://github.com', description: '代码托管平台', effects: { highlight: true } },
            { id: 'site_stackoverflow', name: 'Stack Overflow', url: 'https://stackoverflow.com', description: '开发者问答', effects: {} },
            { id: 'site_vscode', name: 'VS Code', url: 'https://code.visualstudio.com', description: '代码编辑器', effects: {} },
            { id: 'site_npm', name: 'npm', url: 'https://www.npmjs.com', description: 'Node 包管理器', effects: {} },
            { id: 'site_vercel', name: 'Vercel', url: 'https://vercel.com', description: '前端部署平台', effects: { blink: true } },
          ],
        },
        {
          id: 'group_news',
          name: '新闻资讯',
          color: '#f59e0b',
          sites: [
            { id: 'site_hackernews', name: 'Hacker News', url: 'https://news.ycombinator.com', description: '科技新闻', effects: {} },
            { id: 'site_zhihu', name: '知乎', url: 'https://www.zhihu.com', description: '中文问答社区', effects: {} },
            { id: 'site_bbc', name: 'BBC', url: 'https://www.bbc.com', description: '国际新闻', effects: {} },
          ],
        },
        {
          id: 'group_tools',
          name: '在线工具',
          color: '#8b5cf6',
          sites: [
            { id: 'site_translate', name: 'Google 翻译', url: 'https://translate.google.com', description: '在线翻译', effects: {} },
            { id: 'site_canva', name: 'Canva', url: 'https://www.canva.com', description: '在线设计', effects: {} },
            { id: 'site_figma', name: 'Figma', url: 'https://www.figma.com', description: '界面设计协作', effects: { shake: true } },
            { id: 'site_notion', name: 'Notion', url: 'https://www.notion.so', description: '笔记与协作', effects: {} },
          ],
        },
        {
          id: 'group_cloud',
          name: '云服务',
          color: '#06b6d4',
          sites: [
            { id: 'site_aws', name: 'AWS', url: 'https://aws.amazon.com', description: '亚马逊云服务', effects: {} },
            { id: 'site_aliyun', name: '阿里云', url: 'https://www.aliyun.com', description: '阿里云计算', effects: {} },
            { id: 'site_tencentcloud', name: '腾讯云', url: 'https://cloud.tencent.com', description: '腾讯云服务', effects: {} },
          ],
        },
      ],
    },
  ],
};
