import { DeletePageFeaturesHandler } from './delete-page-features.handler';
import { InitHomePageFeaturesHandler } from './init-home-page-features.handler';
import { UpdatePageFeaturesHandler } from './update-page-features.handler';

export const EventHandlers = [
  InitHomePageFeaturesHandler,
  DeletePageFeaturesHandler,
  UpdatePageFeaturesHandler,
];
