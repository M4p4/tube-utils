import xnxx from './tubes/xnxx';
import xvideos from './tubes/xvideos';
import xhamster from './tubes/xhamster';
import spankbang from './tubes/spankbang';
import eporner from './tubes/eporner';
import { RelatedKeywords, TubeSearch } from './types';

export enum TUBES {
  XVIDEOS,
  XNXX,
  XHAMSTER,
  SPANKBANG,
  EPORNER,
}

export class Parser {
  private _userAgent: string;
  private _allTubes = [
    TUBES.SPANKBANG,
    TUBES.XNXX,
    TUBES.XVIDEOS,
    TUBES.XHAMSTER,
    TUBES.EPORNER,
  ];
  constructor() {
    this._userAgent =
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36';
  }

  private _mapTube = (tube: TUBES) => {
    switch (tube) {
      case TUBES.XNXX:
        return xnxx;
      case TUBES.XVIDEOS:
        return xvideos;
      case TUBES.XHAMSTER:
        return xhamster;
      case TUBES.SPANKBANG:
        return spankbang;
      case TUBES.EPORNER:
        return eporner;
      default:
        throw new Error('Tube does not exists');
    }
  };

  getRelatedKeywords = async (
    keyword: string,
    tubes = this._allTubes
  ): Promise<RelatedKeywords[]> => {
    let res = [] as string[];

    for (let tube of tubes) {
      const tmpRes = (await this._mapTube(tube as unknown as TUBES).search(
        keyword,
        1,
        this._userAgent
      )) as TubeSearch;
      res = res.concat(tmpRes.relatedKeywords);
    }

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
    this._mapTube(tube).search(keyword, page, this._userAgent);
  };

  parseVideo = async (tube: TUBES, videoId: string) => {
    this._mapTube(tube).video(videoId, this._userAgent);
  };
}

export const parser = new Parser();
