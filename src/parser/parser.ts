import { search, video } from './tubes/xnxx';

export enum TUBES {
  XVIDEOS,
  XNXX,
}

export class Parser {
  private userAgent: string;
  constructor() {
    this.userAgent =
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36';
  }

  parseSearch = async (tube: TUBES, keyword: string, page: number) => {
    switch (tube) {
      case TUBES.XNXX:
        return await search(keyword, page, this.userAgent);
      case TUBES.XVIDEOS:
        return 'lol';
      default:
        throw new Error('Tube does not exists');
    }
  };

  parseVideo = async (tube: TUBES, videoId: string) => {
    switch (tube) {
      case TUBES.XNXX:
        return await video(videoId, this.userAgent);
      case TUBES.XVIDEOS:
        return 'lol';
      default:
        throw new Error('Tube does not exists');
    }
  };
}

export const parser = new Parser();
