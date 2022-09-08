import {
  RelatedVideos,
  TubeSearch,
  TubeVideo,
  ParserConfig,
  VideoSrc,
} from '../types';
import { loadHtml, extract_data } from '../utils';

const search = async (
  keyword: string,
  page: number,
  config: ParserConfig
): Promise<TubeSearch> => {
  let url = 'https://spankbang.com/s/';
  if (page === 1) {
    url += `${keyword.trim().replace(' ', '%20')}`;
  } else {
    url += `${keyword.trim().replace(' ', '%20')}/${page}`;
  }

  try {
    const { $, data } = await loadHtml(url, config.userAgent);
    let videos = [] as RelatedVideos[];

    $('.video-item').map((i, element) => {
      const videoLink = $(element).find('a').attr('href');
      if (!videoLink || !videoLink.includes('/video/')) return;

      const id = extract_data(videoLink, '/', '/video/');
      const thumb = $(element).find('img').attr('data-src');
      const title = $(element).find('a.n').text().trim();
      const duration = $(element).find('span.l').text().trim();
      const views = $(element).find('span.v').text().trim();

      //remove premium content
      if (!views || !duration) return;

      const video = {
        id,
        thumb,
        title,
        views,
        duration,
      };
      videos.push(video);
    });

    let relatedKeywords = [] as string[];

    $('.related_keywords a').map((i, element) => {
      const tag = $(element).text().toLocaleLowerCase().trim();
      relatedKeywords.push(tag);
    });

    const result = { relatedKeywords, videos };
    return result;
  } catch (e: any) {
    console.error(e.message);
  }
};

const video = async (
  videoId: string,
  config: ParserConfig
): Promise<TubeVideo> => {
  const url = `https://spankbang.com/${videoId}/video/-`;
  try {
    const { $, data } = await loadHtml(url, config.userAgent);

    const title = $('h1').attr('title').trim();
    const thumb = $('meta[property="og:image"]').attr('content');
    const poster = thumb.replace('w:500', 'w:800');
    const duration = $('.hd-time span.i-length').text().trim();
    //const views = $('span.i-plays').text().replace('plays', '').trim();

    // tags
    let tags = [];
    $('div.cat a').map((i, element) => {
      const tag = $(element).text().replace('(18+)', '').trim();
      const tagUrl = $(element).attr('href');
      if (
        (tagUrl.includes('tag/') || tagUrl.includes('tags/')) &&
        tag.length > 1 &&
        tags.indexOf(tag) == -1
      ) {
        tags.push(tag);
      }
    });

    // pornstars
    let pornstars = [];
    $('div.cat a').map((i, element) => {
      const tag = $(element).text().trim();
      const tagUrl = $(element).attr('href');
      if (
        (tagUrl.includes('pornstars/') || tagUrl.includes('pornstar/')) &&
        tag.length > 3 &&
        tag.includes(' ') &&
        pornstars.indexOf(tag) == -1
      ) {
        pornstars.push(tag);
      }
    });

    // related videos
    let relatedVideos = [] as RelatedVideos[];

    $('.video-item').map((i, element) => {
      const videoLink = $(element).find('a').attr('href');
      if (!videoLink || !videoLink.includes('/video/')) return;

      const id = extract_data(videoLink, '/', '/video/');
      const thumb = $(element).find('img').attr('data-src');
      const title = $(element).find('a.n').text().trim();
      const duration = $(element).find('span.l').text().trim();
      const views = $(element).find('span.v').text().trim();

      //remove premium content
      if (!views || !duration) return;

      const video = {
        id,
        thumb,
        title,
        views,
        duration,
      };
      relatedVideos.push(video);
    });

    const video = {
      id: videoId,
      title,
      duration,
      thumb,
      poster,
      pornstars,
      tags,
      relatedVideos,
    } as TubeVideo;

    return video;
  } catch (e: any) {
    console.error(e.message);
  }
};

const videoSrc = async (
  videoId: string,
  config: ParserConfig
): Promise<VideoSrc> => {
  const url = `https://spankbang.com/${videoId}/video/-`;
  try {
    const { data } = await loadHtml(url, config.userAgent);

    const p240 = extract_data(data, "'240p': ['", "'],");
    const p320 = extract_data(data, "'320p': ['", "'],");
    const p480 = extract_data(data, "'480p': ['", "'],");
    const p720 = extract_data(data, "'720p': ['", "'],");

    const res = {
      lowRes: p480 || p320 || p240,
      highRes: p720,
    } as VideoSrc;
    return res;
  } catch (e: any) {
    console.error(e.message);
  }
};

const spankbang = {
  search,
  video,
  videoSrc,
};
export default spankbang;
