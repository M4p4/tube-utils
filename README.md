# tube-utils

Here you find functions to parse video data and search results data from popular tubes.

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

### Currently supported tubes

- xnxx
- xvideos
- xhamster
- spankbang
- eporner
