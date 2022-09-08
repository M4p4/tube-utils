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
    },
  });

  return { $: cheerio.load(res.data), data: res.data };
};
