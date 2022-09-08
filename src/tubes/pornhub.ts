import {
  RelatedVideos,
  TubeSearch,
  TubeVideo,
  ParserConfig,
  VideoSrc,
} from '../types';
import { extract_data, loadHtml } from '../utils';

const search = async (
  keyword: string,
  page: number,
  config: ParserConfig
): Promise<TubeSearch> => {
  let url = 'https://www.pornhub.com/video/search?search=';
  if (page === 1) {
    url += `${keyword.trim().replace(' ', '+')}`;
  } else {
    url += `${keyword.trim().replace(' ', '+')}&page=${page}`;
  }

  try {
    const { $, data } = await loadHtml(url, config);
    let videos = [] as RelatedVideos[];

    $('li.videoBox').map((i, element) => {
      const videoLink = $(element).find('a').attr('href');
      if (!videoLink || !videoLink.includes('view_video.php?viewkey')) return;

      const id = videoLink.substring(videoLink.indexOf('=') + 1);
      const thumb = $(element).find('img').attr('data-src');
      const channel = $(element).find('.usernameWrap').text().trim() || '';
      const title = $(element).find('a').attr('title').trim();
      const views = $(element).find('span.views var').text().trim();
      const duration = $(element).find('var.duration').text().trim();
      const poster = thumb;

      const video = {
        id,
        thumb,
        poster,
        channel,
        title,
        views,
        duration,
      };
      videos.push(video);
    });
    let relatedKeywords = [] as string[];

    $('.relatedSearchTermsBottom a').map((i, element) => {
      const tag = $(element).text().trim();
      if (tag.length > 1 && tag !== 'more...' && tag !== 'undefined') {
        relatedKeywords.push(tag);
      }
    });

    const result = { relatedKeywords, videos };
    console.log(result);
    return result;
  } catch (e: any) {
    console.error(e.message);
  }
};

const video = async (
  videoId: string,
  config: ParserConfig
): Promise<TubeVideo> => {
  const url = `https://pornhub.com/view_video.php?viewkey=${videoId}`;

  try {
    const { $, data } = await loadHtml(url, config);

    /* TODO */

    const video = {} as TubeVideo;
    return video;
  } catch (e: any) {
    console.error(e.message);
  }
};

const videoSrc = async (
  videoId: string,
  config: ParserConfig
): Promise<VideoSrc> => {
  try {
    const res = {} as VideoSrc;
    return res;
  } catch (e: any) {
    console.error(e.message);
  }
};

const pornhub = {
  search,
  video,
  videoSrc,
};

export default pornhub;
