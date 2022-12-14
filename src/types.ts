export type TubeVideo = {
  id: string;
  xvideosId?: string;
  title: string;
  duration: string;
  thumb: string;
  poster: string;
  tags: string[];
  pornstars: string[];
  relatedVideos: RelatedVideos[];
};

export type RelatedVideos = {
  id: string;
  thumb: string;
  title: string;
  views: string;
  duration: string;
  channel?: string;
  poster?: string;
};

export type TubeSearch = {
  relatedKeywords: string[];
  videos: RelatedVideos[];
};

export type RelatedKeywords = {
  keyword: string;
  popularity: number;
};

export type ParserConfig = {
  userAgent: string;
  useProxy: boolean;
  proxies: string[];
  timeout: number;
};

export type VideoSrc = {
  lowRes?: string;
  highRes?: string;
  hls?: string;
};
