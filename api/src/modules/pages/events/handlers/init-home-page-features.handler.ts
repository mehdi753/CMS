import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { InitHomePageFeaturesEvent } from '../impl/init-home-page-features.event';
import { FeaturesService } from 'src/modules/features/features.service';
import { FEATURE } from 'src/@types/features';

@EventsHandler(InitHomePageFeaturesEvent)
export class InitHomePageFeaturesHandler
  implements IEventHandler<InitHomePageFeaturesEvent>
{
  constructor(private readonly featuresService: FeaturesService) {}

  async handle(event: InitHomePageFeaturesEvent): Promise<void> {
    const { page } = event;
    await this.featuresService.addFeature({
      name: FEATURE.CONTENT,
      title: { en: 'Hello World', fr: 'Salut tout le monde' },
      description: {
        en: 'This is your first content',
        fr: 'ceci est votre premier continu',
      },
      page,
      index: 0,
    });
  }
}
