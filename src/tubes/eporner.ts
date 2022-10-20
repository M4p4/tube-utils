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
  let url = 'https://www.eporner.com/search/';
  if (page === 1) {
    url += `${keyword.trim().replace(' ', '-')}`;
  } else {
    url += `${keyword.trim().replace(' ', '-')}/${page}`;
  }

  try {
    const { $, data } = await loadHtml(url, config);
    let videos = [] as RelatedVideos[];

    $('.mb').map((i, element) => {
      const videoLink = $(element).find('a').attr('href');

      if (
        !videoLink ||
        (!videoLink.includes('/video-') && !videoLink.includes('/hd-porn'))
      )
        return;

      const id = extract_data(
        videoLink.replace('/hd-porn/', '/video-'),
        '/video-',
        '/'
      );
      const thumb = $(element).find('img').attr('data-src');
      const title = $(element).find('p.mbtit').text().trim();
      const duration = $(element).find('span.mbtim').text().trim();
      const views = $(element)
        .find('span.mbvie')
        .text()
        .replace(',', '')
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

    $('li.bottomrelateditem a').map((i, element) => {
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
  const url = `https://www.eporner.com/video-${videoId}/-`;
  try {
    const { $, data } = await loadHtml(url, config);

    const title = $('meta[property="og:title"]')
      .attr('content')
      .replace('- EPORNER', '')
      .trim();
    const thumb = $('meta[property="og:image"]').attr('content');
    const poster = thumb.replace('_240', '_360');
    const duration = $('span.vid-length').text().trim();

    // tags
    let tags = [];
    $('.video-info-tags a').map((i, element) => {
      const tag = $(element).text().trim();
      const tagUrl = $(element).attr('href');
      if (
        (tagUrl.includes('cat/') || tagUrl.includes('search/')) &&
        tag.length > 1 &&
        tags.indexOf(tag) == -1
      ) {
        tags.push(tag);
      }
    });

    // pornstars
    let pornstars = [];
    $('.video-info-tags a').map((i, element) => {
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

    $('.mb').map((i, element) => {
      const videoLink = $(element).find('a').attr('href');

      if (
        !videoLink ||
        (!videoLink.includes('/video-') && !videoLink.includes('/hd-porn'))
      )
        return;

      const id = extract_data(
        videoLink.replace('/hd-porn/', '/video-'),
        '/video-',
        '/'
      );
      const thumb = $(element).find('img').attr('data-src');
      const title = $(element).find('p.mbtit').text().trim();
      const duration = $(element).find('span.mbtim').text().trim();
      const views = $(element)
        .find('span.mbvie')
        .text()
        .replace(',', '')
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

const bypassEporner = (hash: string) => {
  // this code bypass eporner security, hidden in js file
  return (
    parseInt(hash.substring(0, 8), 16).toString(36) +
    parseInt(hash.substring(8, 16), 16).toString(36) +
    parseInt(hash.substring(16, 24), 16).toString(36) +
    parseInt(hash.substring(24, 32), 16).toString(36)
  );
};

const videoSrc = async (
  videoId: string,
  config: ParserConfig
): Promise<VideoSrc> => {
  const url = `https://www.eporner.com/video-${videoId}/-`;
  try {
    const { data } = await loadHtml(url, config);
    const hash = extract_data(data, "EP.video.player.hash = '", "'");
    const { data: rawData } = await loadHtml(
      `https://www.eporner.com/xhr/video/MmsdAikXmdW?hash=${bypassEporner(
        hash
      )}&domain=www.eporner.com&pixelRatio=2&playerWidth=0&playerHeight=0&fallback=false&embed=false&supportedFormats=hls,dash,mp4`,
      config
    );

    if (rawData && rawData.available) {
      console.log(rawData);
      const res = {
        lowRes:
          rawData.sources.mp4['480p']?.src ||
          rawData.sources.mp4['360p']?.src ||
          rawData.sources.mp4['240p']?.src ||
          '',
        highRes: rawData.sources.mp4['720p HD']?.src || '',
        hls: rawData.sources.hls?.['auto']?.src || '',
      } as VideoSrc;
      return res;
    }
    return {} as VideoSrc;
  } catch (e: any) {
    console.error(e.message);
  }
};

const eporner = {
  search,
  video,
  videoSrc,
};
export default eporner;
