import { CreateWebsiteHandler } from './create-website.handler';
import { DeleteWebsiteHandler } from './delete-website.handler';
import { UserSubscribedHandler } from './user-subscribed.handler';

export const EventHandlers = [
  CreateWebsiteHandler,
  UserSubscribedHandler,
  DeleteWebsiteHandler,
];
