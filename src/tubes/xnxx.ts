import { TubeSearch, TubeVideo } from '../types';
import { extract_data, loadHtml } from '../utils';

export const search = async (
  keyword: string,
  page: number,
  userAgent: string
): Promise<TubeSearch[]> => {
  const queryPage = page - 1;
  let url = 'https://www.xnxx.com/search/';
  if (queryPage === 0) {
    url += `${keyword.trim().replace(' ', '+')}`;
  } else {
    url += `${keyword.trim().replace(' ', '+')}/${queryPage}`;
  }

  try {
    const { $, data } = await loadHtml(url, userAgent);
    let videos = [] as TubeSearch[];

    $('.thumb-block').map((i, element) => {
      const videoLink = $(element).find('a').attr('href');
      if (!videoLink.includes('video-')) return;

      const id = extract_data(videoLink, 'video-', '/');
      const thumb = $(element).find('img').attr('data-src');
      const channel = $(element).find('span.name').text() || '';
      const title = $(element).find('.thumb-under a').attr('title').trim();
      const metaData = $(element).find('p.metadata').text();
      const d = metaData.split(' ');
      const views = d[0].trim();
      const duration = d[1].split('\n')[1].replace('min', ' min');
      const poster = thumb.replace('thumbs169xnxxll', 'thumbs169xnxxposter');

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

export const video = async (
  videoId: string,
  userAgent: string
): Promise<TubeVideo> => {
  const url = `https://www.xnxx.com/video-${videoId}/-`;

  try {
    const { $, data } = await loadHtml(url, userAgent);

    const title = $('meta[property="og:title"]').attr('content');
    const thumb = $('meta[property="og:image"]').attr('content');
    const poster = thumb.replace('thumbs169xnxxll', 'thumbs169xnxxposter');
    const duration = $('meta[property="og:duration"]').attr('content');
    const xvideosId = extract_data(
      $('#copy-video-embed').attr('value'),
      'https://www.xnxx.com/embedframe/',
      '"'
    );

    // tags
    let tags = [];
    $('.video-tags a').map((i, element) => {
      const tag = $(element).text().trim();
      const isPornstar = $(element).hasClass('is-pornstar');
      if (!isPornstar && tag.length > 1 && tags.indexOf(tag) == -1) {
        tags.push(tag);
      }
    });

    // pornstars
    let pornstars = [];
    $('.video-tags a').map((i, element) => {
      const tag = $(element).text().trim();
      const isPornstar = $(element).hasClass('is-pornstar');
      if (isPornstar && tag.length > 1 && pornstars.indexOf(tag) == -1) {
        pornstars.push(tag);
      }
    });

    // related videos
    const jsonData = extract_data(data, 'var video_related=', ';window.');
    const related = JSON.parse(jsonData);
    let relatedVideos = [] as TubeSearch[];
    related.map((relatedVideo) => {
      const video = {
        id: extract_data(relatedVideo['u'], 'video-', '/'),
        thumb: relatedVideo['i'].replace('thumbs169xnxx', 'thumbs169xnxxll'),
        poster: relatedVideo['i'].replace(
          'thumbs169xnxxll',
          'thumbs169xnxxposter'
        ),
        channel: '',
        title: relatedVideo['tf'],
        views: relatedVideo['n'],
        duration: relatedVideo['d'].replace('min', ' min'),
      } as TubeSearch;
      relatedVideos.push(video);
    });

    const video = {
      id: videoId,
      xvideosId,
      title,
      duration,
      thumb,
      poster,
      tags,
      relatedVideos,
    } as TubeVideo;
    return video;
  } catch (e: any) {
    console.error(e.message);
  }
};
