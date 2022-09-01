import axios from 'axios';
import * as cheerio from 'cheerio';

export const extract_data = (data: string, start: string, end: string) => {
  const startPos = data.indexOf(start) + start.length;
  return data.substring(startPos, data.indexOf(end, startPos));
};

export const loadHtml = async (url: string, userAgent: string) => {
  const res = await axios.get(url, {
    headers: {
      'User-Agent': userAgent,
    },
  });

  return { $: cheerio.load(res.data), data: res.data };
};
