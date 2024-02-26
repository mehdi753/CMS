import axios from 'axios';
import { GeoCodeResult } from 'src/@types/misc';

export const getGeoCoding = async (
  longitude: number,
  latitude: number,
): Promise<{
  country?: string;
  state?: string;
  locality?: string;
  countryCode?: string;
}> => {
  const url = new URL(`${process.env.GOOGLE_MAPS_API}/geocode/json`);
  url.searchParams.append('latlng', `${longitude},${latitude}`);
  url.searchParams.append('key', `${process.env.GOOGLE_APIS_KEY}`);
  return await axios
    .get<GeoCodeResult>(url.href)
    .then((res) => getGeoCodingInfo(res.data))
    .catch(() => ({}));
};

const getGeoCodingInfo = (
  data: GeoCodeResult,
): {
  country?: string;
  state?: string;
  locality?: string;
  countryCode?: string;
} => {
  const result: {
    country?: string;
    state?: string;
    locality?: string;
    countryCode?: string;
  } = {};
  if (data.results) {
    let resultsIndex = 0;
    while (
      resultsIndex < data.results.length &&
      (!result.country || !result.locality || !result.state)
    ) {
      let addressComponentsIndex = 0;
      while (
        addressComponentsIndex <
          data.results[resultsIndex].address_components.length &&
        (!result.country || !result.locality || !result.state)
      ) {
        if (
          data.results[resultsIndex].address_components[
            addressComponentsIndex
          ].types.includes('country')
        ) {
          result.country =
            data.results[resultsIndex].address_components[
              addressComponentsIndex
            ].long_name.toLocaleLowerCase();
          result.countryCode =
            data.results[resultsIndex].address_components[
              addressComponentsIndex
            ].short_name.toLocaleLowerCase();
        }
        if (
          data.results[resultsIndex].address_components[
            addressComponentsIndex
          ].types.includes('locality')
        ) {
          result.locality =
            data.results[resultsIndex].address_components[
              addressComponentsIndex
            ].long_name.toLocaleLowerCase();
        }
        if (
          data.results[resultsIndex].address_components[
            addressComponentsIndex
          ].types.includes('administrative_area_level_1')
        ) {
          result.state =
            data.results[resultsIndex].address_components[
              addressComponentsIndex
            ].long_name.toLocaleLowerCase();
        }
        addressComponentsIndex++;
      }
      resultsIndex++;
    }
  }
  return result;
};
