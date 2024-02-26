import { AddPropertyHandler } from './add-property.handler';
import { DeletePropertyHandler } from './delete-property.handler';
import { EditPropertyHandler } from './edit-property.handler';
import { SubscribeUserHandler } from './subscribe-user.handler';

export const CommandHandlers = [
  AddPropertyHandler,
  SubscribeUserHandler,
  DeletePropertyHandler,
  EditPropertyHandler,
];
