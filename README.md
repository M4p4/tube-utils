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

// search results data
// params: tube, keyword, page
const searchResults = await parser.parseSearch(TUBES.XNXX, 'keyword', 1);
```

### Currently supported tubes

- xnxx
- xvideos
- xhamster
