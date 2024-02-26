import { FeatureCreatedHandler } from './feature-created.handler';
import { FeatureDeletedHandler } from './feature-deleted.handler';
import { FeatureUpdatedHandler } from './feature-updated.handler';

export const EventHandlers = [
  FeatureCreatedHandler,
  FeatureDeletedHandler,
  FeatureUpdatedHandler,
];
