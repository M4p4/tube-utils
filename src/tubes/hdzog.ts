import {
  ParserConfig,
  RelatedVideos,
  TubeSearch,
  TubeVideo,
  VideoSrc,
} from '../types';
import { loadHtml, extract_data, universalBtoa, universalAtob } from '../utils';

const search = async (
  keyword: string,
  page: number,
  config: ParserConfig
): Promise<TubeSearch> => {
  const iframeName = 'ifr' + Math.round(99999999 * Math.random());

  let apiUrl = `/api/videos.php?params=259200/str/relevance/60/search..${page}.all..&s=${keyword
    .trim()
    .replace(' ', '%20')}}`;
  const url =
    'https://hdzog.com/engine_interface.php?i=' +
    iframeName +
    '|' +
    encodeURIComponent(universalBtoa(apiUrl));

  try {
    const { data } = await loadHtml(url, config);

    const apiData = JSON.parse(
      decodeURIComponent(
        universalAtob(extract_data(data, "'", "';").split('|')[1])
      )
    );
    let videos = [] as RelatedVideos[];

    apiData?.videos?.map((apiVideo) => {
      const video = {
        id: apiVideo.video_id,
        thumb: apiVideo.scr,
        title: apiVideo.title,
        views: apiVideo.video_viewed,
        duration: apiVideo.duration,
      };
      videos.push(video);
    });

    let relatedKeywords = (apiData?.related_searches || []) as string[];

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
  try {
    const apiUrl = `/api/json/video/86400/0/${
      videoId.slice(0, videoId.length - 3) + '000'
    }/${videoId}.json`;
    const iframeName = 'ifr' + Math.round(99999999 * Math.random());
    const url =
      'https://hdzog.com/engine_interface.php?i=' +
      iframeName +
      '|' +
      encodeURIComponent(universalBtoa(apiUrl));
    const { data } = await loadHtml(url, config);
    const apiData = JSON.parse(
      decodeURIComponent(
        universalAtob(extract_data(data, "'", "';").split('|')[1])
      )
    );

    const title = apiData.video.title.trim();

    const thumb = apiData.video.thumb;
    const poster = apiData.video.title.thumbsrc;
    const duration = apiData.video.duration;

    // tags
    let tags = [];
    for (const key in apiData.video.categories) {
      if (apiData.video.categories[key].title !== 'HD') {
        tags.push(apiData.video.categories[key].title);
      }
    }
    // pornstars
    let pornstars = [];
    for (const key in apiData.video.models) {
      pornstars.push(apiData.video.models[key].title);
    }

    ///api/json/videos_related/20200611/str/relevance/120/0/39000/39719.all.1.jso
    //"/api/json/videos_related/20200611/str/relevance/120/0/231000/231047.all.1.json"
    const apiRelatedUrl = `/api/json/videos_related/20200611/str/relevance/120/0/${
      videoId.slice(0, videoId.length - 3) + '000'
    }/${videoId}.all.1.json`;
    const iframeRelatedName = 'ifr' + Math.round(99999999 * Math.random());
    const urlRelated =
      'https://hdzog.com/engine_interface.php?i=' +
      iframeRelatedName +
      '|' +
      encodeURIComponent(universalBtoa(apiRelatedUrl));
    const { data: dataRelated } = await loadHtml(urlRelated, config);
    const apiRelatedData = JSON.parse(
      decodeURIComponent(
        universalAtob(extract_data(dataRelated, "'", "';").split('|')[1])
      )
    );

    // related videos
    let relatedVideos = [] as RelatedVideos[];

    apiRelatedData?.videos?.map((relatedVideo) => {
      const video = {
        id: relatedVideo.video_id,
        thumb: relatedVideo.scr,
        title: relatedVideo.title,
        views: relatedVideo.video_viewed,
        duration: relatedVideo.duration,
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

const videoDecoder = (src: string) => {
  var t = 'АВСDЕFGHIJKLМNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.,~',
    n = '',
    i = 0;
  do {
    var o = t.indexOf(src.charAt(i++)),
      r = t.indexOf(src.charAt(i++)),
      a = t.indexOf(src.charAt(i++)),
      s = t.indexOf(src.charAt(i++));
    (o = (o << 2) | (r >> 4)), (r = ((15 & r) << 4) | (a >> 2));
    var l = ((3 & a) << 6) | s;
    (n += String.fromCharCode(o)),
      64 != a && (n += String.fromCharCode(r)),
      64 != s && (n += String.fromCharCode(l));
  } while (i < src.length);
  return unescape(n);
};

const videoSrc = async (
  videoId: string,
  config: ParserConfig
): Promise<VideoSrc> => {
  try {
    const apiUrl = `/api/videofile.php?video_id=${videoId}&lifetime=8640000`;
    const iframeName = 'ifr' + Math.round(99999999 * Math.random());
    const url =
      'https://hdzog.com/engine_interface.php?i=' +
      iframeName +
      '|' +
      encodeURIComponent(universalBtoa(apiUrl));
    const { data } = await loadHtml(url, config);
    const apiData = JSON.parse(
      decodeURIComponent(
        universalAtob(extract_data(data, "'", "';").split('|')[1])
      )
    );

    if (apiData && apiData.length > 0) {
      const videoUrl = 'https://hdzog.com' + videoDecoder(apiData[0].video_url);
      const res = {
        lowRes: videoUrl,
        highRes: videoUrl,
        hls: '',
      } as VideoSrc;
      return res;
    }

    return {} as VideoSrc;
  } catch (e: any) {
    console.error(e.message);
  }
};

const hdzog = {
  search,
  video,
  videoSrc,
};
export default hdzog;
