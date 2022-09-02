# tube-utils

Here you find functions to parse video data and search results data from popular tubes.

### Usage

```ts
import { TUBES, parser } from 'tube-utils';

// video data
const videoData = await parser.parseVideo(TUBES.XNXX, 'id');

// search results data
const searchResults = await parser.parseSearch(TUBES.XNXX, 'keyword', 1);
```

### Currently supported tubes

- xnxx
- xvideos
- xhamster
