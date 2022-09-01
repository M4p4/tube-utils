export type TubeVideo = {
  id: string;
  xvideosId?: string;
  title: string;
  duration: string;
  thumb: string;
  poster: string;
  tags: string[];
  relatedVideos: TubeSearch[];
};

export type TubeSearch = {
  id: string;
  thumb: string;
  poster?: string;
  channel?: string;
  title: string;
  views: string;
  duration: string;
};
