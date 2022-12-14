# Tube Utils

Here you find functions to parse video data and search results data from popular tubes.

List of supported Tubes.

- eporner.com
- hdzog.com
- porntrex.com
- spankbang.com
- xhamster.com
- xnxx.com
- xvideos.com

### Usage

First install per npm by running:

```
npm install tube-utils
```

then you can use the parser in your js/ts project:

```ts
import { TUBES, parser } from 'tube-utils';

// video data
// params: tube, videoId
const videoData = await parser.parseVideo(TUBES.XNXX, 'id');
/* Result:
{
  id: string;
  xvideosId?: string;
  title: string;
  duration: string;
  views: string;
  thumb: string;
  poster: string;
  tags: string[];
  pornstars: string[];
  relatedVideos: [
    {
      id: string;
      thumb: string;
      title: string;
      views: string;
      duration: string;
      channel?: string;
      poster?: string;
    },
    ...
  ];
}
*/

// search results data
// params: tube, keyword, page
const searchResults = await parser.parseSearch(TUBES.XNXX, 'keyword', 1);
/* Result:
{
  relatedKeywords: string[];
  videos: [
    {
      id: string;
      thumb: string;
      title: string;
      views: string;
      duration: string;
      channel?: string;
      poster?: string;
    },
    ...
  ];
}
*/

// get video Src (CDN Link)
// Note: This function bypass security of the tubes and need sometimes an proxy
// params: tube, videoId
const videoSrcData = await parser.parseVideoSrc(TUBES.XNXX, 'id');
/* Result:
{
  lowRes: 'https://cndlink.com/example_id.mp4',
  highRes: 'https://cndlink.com/example_id.mp4',
  hls: 'https://cdnlink.com/hls/v10/6293672-,240,360,480,720,1080,p.mp4.urlset/master.m3u8'
}
*/

// get related keywords for a given keyword by searching at all tubes
// params: keyword
const keywords = await parser.getRelatedKeywords('foo');
/*
[
  { keyword: 'foo', popularity: 4 },
  { keyword: 'foo bar', popularity: 3 },
  ...
]
*/
```
