import xnxx from './tubes/xnxx';
import xvideos from './tubes/xvideos';
import xhamster from './tubes/xhamster';
import spankbang from './tubes/spankbang';
import eporner from './tubes/eporner';
import hdzog from './tubes/hdzog';
import porntrex from './tubes/porntrex';
import { ParserConfig, RelatedKeywords, TubeSearch } from './types';

export enum TUBES {
  XVIDEOS,
  XNXX,
  XHAMSTER,
  SPANKBANG,
  EPORNER,
  HDZOG,
  PORNTREX,
}

export const defaultParserConfig = {
  userAgent:
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36',
  useProxy: false,
  proxies: [],
  timeout: 4000,
};

export class Parser {
  private _config: ParserConfig = defaultParserConfig;
  private _allTubes = [
    TUBES.SPANKBANG,
    TUBES.XNXX,
    TUBES.XVIDEOS,
    TUBES.XHAMSTER,
    TUBES.EPORNER,
    TUBES.HDZOG,
    TUBES.PORNTREX,
  ];
  constructor() {}

  public setProxies = (proxies: string[]) => {
    this._config.proxies = proxies.slice();
    this._config.useProxy = true;
  };

  public disableProxies = () => {
    this._config.useProxy = false;
  };

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
      case TUBES.HDZOG:
        return hdzog;
      case TUBES.PORNTREX:
        return porntrex;
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
      try {
        const tmpRes = (await this._mapTube(tube as unknown as TUBES).search(
          keyword,
          1,
          this._config
        )) as TubeSearch;
        if (tmpRes) res = res.concat(tmpRes.relatedKeywords);
      } catch (e: any) {
        console.error(e.message);
      }
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
    return await this._mapTube(tube).search(keyword, page, this._config);
  };

  parseVideo = async (tube: TUBES, videoId: string) => {
    return await this._mapTube(tube).video(videoId, this._config);
  };

  parseVideoSrc = async (tube: TUBES, videoId: string) => {
    return await this._mapTube(tube).videoSrc(videoId, this._config);
  };
}

export const parser = new Parser();
