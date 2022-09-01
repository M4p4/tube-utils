import axios from 'axios';
import * as cheerio from 'cheerio';
import { extract_data } from '../utils';

export const search = async (
  keyword: string,
  page: number,
  userAgent: string
) => {
  const queryPage = page - 1;
  let url = 'https://www.xnxx.com/search/';
  if (queryPage === 0) {
    url += `${keyword.trim().replace(' ', '+')}`;
  } else {
    url += `${keyword.trim().replace(' ', '+')}/${queryPage}`;
  }

  try {
    const res = await axios.get(url, {
      headers: {
        'User-Agent': userAgent,
      },
    });

    const $ = cheerio.load(res.data);

    let videos = [];

    $('.thumb-block').map((i, element) => {
      const $v = cheerio.load(element);

      const videoLink = $v('a').attr('href');
      if (!videoLink.includes('video-')) return;

      const id = extract_data(videoLink, 'video-', '/');
      const img = $v('img').attr('data-src');
      const channel = $v('span.name').text() || '';
      const title = $v('.thumb-under a').attr('title').trim();
      const metaData = $v('p.metadata').text();
      const d = metaData.split(' ');
      const views = d[0].trim();
      const duration = d[1].split('\n')[1].replace('min', ' min');

      const video = {
        id,
        img,
        channel,
        title,
        views,
        duration,
      };
      videos.push(video);
    });

    return videos;
  } catch (e: any) {
    console.error(e.message);
  }
};

search('xxx', 1, 'useragent');
