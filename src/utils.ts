import axios from 'axios';
import * as cheerio from 'cheerio';
import { ParserConfig } from './types';

export const extract_data = (data: string, start: string, end: string) => {
  if (data.indexOf(start) === -1) return '';
  const startPos = data.indexOf(start) + start.length;

  return data.substring(startPos, data.indexOf(end, startPos));
};

export const getProxyData = (useProxy, proxies: string[]) => {
  //https://proxy:port@user:pass or https://proxy:port

  if (proxies.length === 0 || !useProxy) return false as false;

  let proxy = proxies[Math.floor(Math.random() * proxies.length)];
  const useHttps = proxy.includes('https://');
  proxy = proxy.replace('https://', '').replace('http://', '');
  const hasAuth = proxy.includes('@');

  if (hasAuth) {
    const proxyData = proxy.split('@')[0].split(':');
    const authData = proxy.split('@')[1].split(':');
    return {
      protocol: useHttps ? 'https' : 'http',
      host: proxyData[0],
      port: parseInt(proxyData[1]),
      auth: {
        username: authData[0],
        password: authData[1],
      },
    };
  }

  const proxyData = proxy.split(':');
  return {
    protocol: useHttps ? 'https' : 'http',
    host: proxyData[0],
    port: parseInt(proxyData[1]),
  };
};

export const loadHtml = async (url: string, config: ParserConfig) => {
  const res = await axios.get(url, {
    timeout: config.timeout,
    withCredentials: true,
    headers: {
      'User-Agent': config.userAgent,
      Accept:
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.6',
    },
    proxy: getProxyData(config.useProxy, config.proxies),
  });

  return { $: cheerio.load(res.data), data: res.data };
};
