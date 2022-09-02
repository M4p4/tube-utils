import { TubeSearch, TubeVideo } from '../types';
import { loadHtml, extract_data } from '../utils';

const search = async (
  keyword: string,
  page: number,
  userAgent: string
): Promise<TubeSearch[]> => {
  const queryPage = page - 1;
  let url = 'https://www.xvideos.com/?k=';
  if (queryPage === 0) {
    url += `${keyword.trim().replace(' ', '+')}`;
  } else {
    url += `${keyword.trim().replace(' ', '+')}&p=${queryPage}`;
  }
  try {
    const { $, data } = await loadHtml(url, userAgent);
    let videos = [] as TubeSearch[];

    $('.thumb-block').map((i, element) => {
      const videoLink = $(element).find('a').attr('href');
      if (!videoLink.includes('/video')) return;

      const id = extract_data(videoLink, '/video', '/');
      const thumb = $(element)
        .find('img')
        .attr('data-src')
        .replace('THUMBNUM', '5');
      const channel = $(element).find('span.name').text() || '';
      const title = $(element).find('.thumb-under a').attr('title').trim();
      const metaData = $(element).find('span.bg').text();
      const duration = $(element).find('span.bg .duration').text().trim();
      const d = metaData.split('-');
      const views = d[1].replace('Views', '').trim();
      const poster = thumb.replace('thumbs169ll', 'thumbs169poster');

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
    return videos;
  } catch (e: any) {
    console.error(e.message);
  }
};

const video = async (
  videoId: string,
  userAgent: string
): Promise<TubeVideo> => {
  const url = `https://www.xvideos.com/video${videoId}/-`;

  try {
    const { $, data } = await loadHtml(url, userAgent);

    const title = $('meta[property="og:title"]').attr('content');
    const thumb = $('meta[property="og:image"]').attr('content');
    const poster = thumb.replace('thumbs169ll', 'thumbs169poster');
    const duration = $('meta[property="og:duration"]').attr('content');

    // tags
    let tags = [];
    $('.video-tags-list a').map((i, element) => {
      const tag = $(element).text().trim();
      const tagUrl = $(element).attr('href');
      if (
        tagUrl.includes('tags/') &&
        tag.length > 1 &&
        tags.indexOf(tag) == -1
      ) {
        tags.push(tag);
      }
    });

    // pornstars
    let pornstars = [];
    $('.video-tags-list a').map((i, element) => {
      const tag = $(element).find('.name').text().trim();
      const tagUrl = $(element).attr('href');
      if (
        (tagUrl.includes('models/') || tagUrl.includes('model/')) &&
        tag.length > 1 &&
        pornstars.indexOf(tag) == -1
      ) {
        pornstars.push(tag);
      }
    });

    // related videos
    const jsonData = extract_data(data, 'var video_related=', ';window.');
    const related = JSON.parse(jsonData);
    let relatedVideos = [] as TubeSearch[];
    related.map((relatedVideo) => {
      const video = {
        id: relatedVideo['id'].toString(),
        thumb: relatedVideo['i'].replace('thumbs169', 'thumbs169ll'),
        poster: relatedVideo['i'].replace('thumbs169ll', 'thumbs169poster'),
        channel: relatedVideo['pn'] || '',
        title: relatedVideo['tf'],
        views: relatedVideo['n'],
        duration: relatedVideo['d'],
      } as TubeSearch;
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

const xvideos = {
  search,
  video,
};

export default xvideos;
