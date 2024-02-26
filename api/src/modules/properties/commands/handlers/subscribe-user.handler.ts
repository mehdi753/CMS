import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { SubscribeUserCommand } from '../impl/subscribe-user.command';
import { PropertyRepository } from '../../repository/property.repository';
import { UsersService } from 'src/modules/users/users.service';
import { NotFoundException } from '@nestjs/common';
import { PropertyRoot } from '../../models/property.model';

@CommandHandler(SubscribeUserCommand)
export class SubscribeUserHandler
  implements ICommandHandler<SubscribeUserCommand>
{
  constructor(
    private readonly propertyRepo: PropertyRepository,
    private readonly usersService: UsersService,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: SubscribeUserCommand): Promise<void> {
    const { subscribeDto } = command;
    const user = await this.usersService.getUserByEmail(subscribeDto.email);
    if (!user) {
      throw new NotFoundException(
        `User with email ${subscribeDto.email} is not found`,
      );
    }
    let propertyRoot: PropertyRoot;
    if (subscribeDto.subscribe) {
      propertyRoot = await this.propertyRepo.addUser(
        subscribeDto.propertyId,
        user._id,
      );
    } else {
      propertyRoot = await this.propertyRepo.addUser(
        subscribeDto.propertyId,
        user._id,
      );
    }
    if (propertyRoot) {
      const propertyPublisher = this.publisher.mergeObjectContext(propertyRoot);
      propertyPublisher.userSubscribed(subscribeDto);
      propertyPublisher.commit();
    }
  }
}
