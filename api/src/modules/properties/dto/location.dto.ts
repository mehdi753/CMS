import { IsLatitude, IsLongitude } from 'class-validator';

export class LocationDto {
  @IsLongitude()
  longitude: number;
  @IsLatitude()
  latitude: number;
}
