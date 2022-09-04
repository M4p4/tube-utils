import { RelatedVideos, TubeSearch, TubeVideo } from '../types';
import { loadHtml, extract_data } from '../utils';

const search = async (
  keyword: string,
  page: number,
  userAgent: string
): Promise<TubeSearch> => {
  let url = 'https://www.eporner.com/search/';
  if (page === 1) {
    url += `${keyword.trim().replace(' ', '-')}`;
  } else {
    url += `${keyword.trim().replace(' ', '-')}/${page}`;
  }

  try {
    const { $, data } = await loadHtml(url, userAgent);
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
  }
};

const video = async (
  videoId: string,
  userAgent: string
): Promise<TubeVideo> => {
  const url = `https://www.eporner.com/video-${videoId}/-`;
  try {
    const { $, data } = await loadHtml(url, userAgent);

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

const eporner = {
  search,
  video,
};
export default eporner;
