import {
  ParserConfig,
  RelatedVideos,
  TubeSearch,
  TubeVideo,
  VideoSrc,
} from '../types';
import { loadHtml, extract_data } from '../utils';

const search = async (
  keyword: string,
  page: number,
  config: ParserConfig
): Promise<TubeSearch> => {
  let url = 'https://www.porntrex.com/search/';
  if (page === 1) {
    url += `${keyword.trim().replace(' ', '-')}/`;
  } else {
    url += `${keyword.trim().replace(' ', '-')}/${page}/`;
  }

  try {
    const { $, data } = await loadHtml(url, config);
    let videos = [] as RelatedVideos[];

    $('.video-item').map((i, element) => {
      const videoLink = $(element).find('a').attr('href');

      if (!videoLink || !videoLink.includes('/video/')) return;

      const id = extract_data(videoLink, '/video/', '/');
      const thumb = 'https:' + $(element).find('img').attr('data-src');
      const title = $(element).find('a').text().trim();
      const duration = $(element).find('div.durations').text().trim();
      const views = $(element)
        .find('div.viewsthumb')
        .text()
        .replace(' ', '')
        .replace('views', '')
        .trim();

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

    const result = { relatedKeywords, videos };
    return result;
  } catch (e: any) {
    console.error(e.message);
    return { relatedKeywords: [], videos: [] };
  }
};

const video = async (
  videoId: string,
  config: ParserConfig
): Promise<TubeVideo> => {
  const url = `https://www.porntrex.com/video/${videoId}/-`;
  try {
    const { $, data } = await loadHtml(url, config);

    const title = $('p.title-video').text().trim();
    const thumb = 'https:' + $('meta[property="og:image"]').attr('content');
    const poster = thumb;
    const infoArray = $('div.info-block').text().trim().split('\n');
    const duration = infoArray[infoArray.length - 1].trim();

    // tags
    let tags = [];
    $('.items-holder a').map((i, element) => {
      const tag = $(element).text().trim();
      const tagUrl = $(element).attr('href');
      if (
        tagUrl.includes('/tags/') &&
        !tag.includes('-') &&
        tag.length > 1 &&
        tags.indexOf(tag) == -1
      ) {
        tags.push(tag);
      }
    });

    // pornstars
    let pornstars = [];
    $('.items-holder a').map((i, element) => {
      const tag = $(element).text().trim();
      const tagUrl = $(element).attr('href');
      if (
        (tagUrl.includes('pornstars/') || tagUrl.includes('models/')) &&
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

      const id = extract_data(videoLink, '/video/', '/');
      const thumb = 'https:' + $(element).find('img').attr('data-src');
      const title = $(element).find('a').text().trim();
      const duration = $(element).find('div.durations').text().trim();
      const views = $(element)
        .find('div.viewsthumb')
        .text()
        .replace(' ', '')
        .replace('views', '')
        .trim();

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
  const url = `https://www.porntrex.com/video/${videoId}/-`;
  try {
    const { data } = await loadHtml(url, config);
    const videoSrcLow = extract_data(data, "video_url: '", "',");
    const videoSrcHigh = extract_data(data, "video_alt_url: '", "',");

    if (videoSrcLow || videoSrcHigh) {
      const res = {
        lowRes: videoSrcLow && videoSrcLow.length > 0 ? videoSrcLow : '',
        highRes: videoSrcHigh && videoSrcHigh.length > 0 ? videoSrcHigh : '',
        hls: '',
      } as VideoSrc;
      return res;
    }
    return {} as VideoSrc;
  } catch (e: any) {
    console.error(e.message);
  }
};

const porntrex = {
  search,
  video,
  videoSrc,
};
export default porntrex;
