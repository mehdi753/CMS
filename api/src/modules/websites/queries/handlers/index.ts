import { FindWebsiteHandler } from './find-website.handler';
import { GetWebsiteInfoHandler } from './get-website-info.handler';
import { GetWebsitePagesHandler } from './get-website-pages.handler';
import { GetWebsitesHandler } from './get-websites.handler';

export const QueryHandlers = [
  GetWebsitePagesHandler,
  GetWebsiteInfoHandler,
  GetWebsitesHandler,
  FindWebsiteHandler,
];
