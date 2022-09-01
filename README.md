# tube-utils

Here you find functions to parse videos and searchresults from popular tubes.

### Usage

```ts
import { TUBES, parser } from 'tube-utils';

// video data
const videos = await parser.parseVideo(TUBES.XNXX, 'id');

// searchresult data
const videos = await parser.parseSearch(TUBES.XNXX, 'keyword', 1);
```

### Currently supported tubes

- xnxx
- xvideos
- xhamster
