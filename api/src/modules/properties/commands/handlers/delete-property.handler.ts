import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { DeletePropertyCommand } from '../impl/delete-property.command';
import { PropertyRepository } from '../../repository/property.repository';

@CommandHandler(DeletePropertyCommand)
export class DeletePropertyHandler
  implements ICommandHandler<DeletePropertyCommand>
{
  constructor(
    private readonly propertyRepo: PropertyRepository,
    public readonly publisher: EventPublisher,
  ) {}

  async execute(command: DeletePropertyCommand): Promise<void> {
    const { id } = command;
    const propertyRoot = await this.propertyRepo.delete(id);
    if (propertyRoot) {
      const propertyPublisher = this.publisher.mergeObjectContext(propertyRoot);
      propertyPublisher.deleteWebsite(id);
      propertyPublisher.commit();
    }
  }
}
