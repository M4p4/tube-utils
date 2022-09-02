import xnxx from './tubes/xnxx';
import xvideos from './tubes/xvideos';
import xhamster from './tubes/xhamster';
import { RelatedKeywords } from './types';

export enum TUBES {
  XVIDEOS,
  XNXX,
  XHAMSTER,
}

export class Parser {
  private userAgent: string;
  constructor() {
    this.userAgent =
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36';
  }

  getRelatedKeywords = async (keyword: string): Promise<RelatedKeywords[]> => {
    let res = [] as string[];
    const xnxxRes = await xnxx.search(keyword, 1, this.userAgent);
    res = res.concat(xnxxRes.relatedKeywords);
    const xvideosRes = await xvideos.search(keyword, 1, this.userAgent);
    res = res.concat(xvideosRes.relatedKeywords);
    const xhamsterRes = await xhamster.search(keyword, 1, this.userAgent);
    res = res.concat(xhamsterRes.relatedKeywords);

    const filteredRelatedKeywords = [] as RelatedKeywords[];
    [...new Set(res)].forEach((item) => {
      const popularity = res.filter(function (resItem) {
        return resItem === item;
      }).length;
      filteredRelatedKeywords.push({ keyword: item, popularity });
    });
    filteredRelatedKeywords.sort((a, b) => {
      return b.popularity - a.popularity;
    });
    return filteredRelatedKeywords;
  };

  parseSearch = async (tube: TUBES, keyword: string, page: number = 1) => {
    switch (tube) {
      case TUBES.XNXX:
        return await xnxx.search(keyword, page, this.userAgent);
      case TUBES.XVIDEOS:
        return await xvideos.search(keyword, page, this.userAgent);
      case TUBES.XHAMSTER:
        return await xhamster.search(keyword, page, this.userAgent);
      default:
        throw new Error('Tube does not exists');
    }
  };

  parseVideo = async (tube: TUBES, videoId: string) => {
    switch (tube) {
      case TUBES.XNXX:
        return await xnxx.video(videoId, this.userAgent);
      case TUBES.XVIDEOS:
        return await xvideos.video(videoId, this.userAgent);
      case TUBES.XHAMSTER:
        return await xhamster.video(videoId, this.userAgent);
      default:
        throw new Error('Tube does not exists');
    }
  };
}

export const parser = new Parser();
parser.getRelatedKeywords('pinay');
