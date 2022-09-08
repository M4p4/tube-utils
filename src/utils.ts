import axios from 'axios';
import * as cheerio from 'cheerio';
import { ParserConfig } from './types';

export const extract_data = (data: string, start: string, end: string) => {
  if (data.indexOf(start) === -1) return '';
  const startPos = data.indexOf(start) + start.length;

  return data.substring(startPos, data.indexOf(end, startPos));
};

export const loadHtml = async (url: string, config: ParserConfig) => {
  const res = await axios.get(url, {
    headers: {
      'User-Agent': config.userAgent,
      Accept:
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
      'Accept-Encoding': 'gzip, deflate, br',
      'Accept-Language': 'en-US,en;q=0.6',
    },
  });

  return { $: cheerio.load(res.data), data: res.data };
};
