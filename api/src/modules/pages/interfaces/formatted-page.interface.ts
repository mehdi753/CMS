import { FormattedFeature } from 'src/modules/features/interfaces/formatted-feature.interface';

export interface FormattedPage {
  name: string;
  index: number;
  features: FormattedFeature[];
}
