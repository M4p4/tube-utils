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
  let url = 'https://xhamster3.com/search/';
  if (page === 1) {
    url += `${keyword.trim().replace(' ', '+')}`;
  } else {
    url += `${keyword.trim().replace(' ', '+')}?page=${page}`;
  }

  try {
    const { $, data } = await loadHtml(url, config);
    let videos = [] as RelatedVideos[];

    $('.thumb-list__item').map((i, element) => {
      const videoLink = $(element).find('a').attr('href');
      if (!videoLink || !videoLink.includes('/videos/')) return;

      const id = videoLink.substring(videoLink.lastIndexOf('-') + 1);
      const thumb = $(element).find('img').attr('src');
      const title = $(element).find('a.video-thumb-info__name').text().trim();
      const duration = $(element)
        .find('span[data-role=video-duration]')
        .text()
        .trim();
      const views = $(element).find('div.views').text().trim();

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

    $('.categories-container span.item-name').map((i, element) => {
      const tag = $(element).text().toLocaleLowerCase().trim();
      relatedKeywords.push(tag);
    });

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
  const url = `https://xhamster3.com/videos/-${videoId}`;
  try {
    const { $, data } = await loadHtml(url, config);

    const title = $('meta[property="og:title"]')
      .attr('content')
      .replace('| xHamster', '')
      .trim();
    const thumb = $('meta[property="og:image"]').attr('content');
    const poster = thumb;
    const duration = extract_data(data, ',"duration":', ',"');

    // tags
    const blacklist = ['Popular', 'Ready to'];
    let tags = [];
    $('a.video-tag').map((i, element) => {
      const tag = $(element).text().replace('(18+)', '').trim();
      const tagUrl = $(element).attr('href');
      if (
        (tagUrl.includes('categories/') || tagUrl.includes('tags/')) &&
        !blacklist.includes(tag) &&
        tag.length > 1 &&
        tags.indexOf(tag) == -1
      ) {
        tags.push(tag);
      }
    });

    // pornstars
    let pornstars = [];
    $('a.video-tag').map((i, element) => {
      const tag = $(element).text().trim();
      const tagUrl = $(element).attr('href');
      if (
        (tagUrl.includes('pornstars/') || tagUrl.includes('pornstar/')) &&
        tag.length > 1 &&
        pornstars.indexOf(tag) == -1
      ) {
        pornstars.push(tag);
      }
    });

    // related videos
    let relatedVideos = [] as RelatedVideos[];
    $('.thumb-list__item').map((i, element) => {
      const videoLink = $(element).find('a').attr('href');
      if (!videoLink.includes('/videos/')) return;

      const id = videoLink.substring(videoLink.lastIndexOf('-') + 1);
      const thumb = $(element).find('img').attr('src');
      const title = $(element).find('a.video-thumb-info__name').text().trim();
      const duration = $(element)
        .find('span[data-role=video-duration]')
        .text()
        .trim();
      const views = $(element).find('div.views').text().trim();

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
  const res = {
    /* Protected by referer ...*/
  } as VideoSrc;
  return res;
};

const xhamster = {
  search,
  video,
  videoSrc,
};
export default xhamster;
