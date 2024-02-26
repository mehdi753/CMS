export declare type Query<T> = Partial<{ $not: Partial<T> } & T>;

export declare type PaginatedQuery<T> = {
  offset: number;
  limit: number;
  query: Query<T>;
};

export declare type PaginatedResults<T> = {
  total: number;
  limit: number;
  offset: number;
  list: T[];
};

export interface PredictorResponse {
  topScoring: string;
  sortedList: TopicsList;
}

export type TopicsList = {
  [topic in TopicName]: number;
};

export interface GeoIPResponse {
  ip?: string;
  ok?: boolean;
  private?: boolean;
  country?: string;
  continent?: string;
  city?: string;
  location?: Location;
}

interface Location {
  accuracyRadius?: number;
  latitude?: number;
  longitude?: number;
  timeZone?: string;
}

interface GeoCodeResult {
  results: {
    address_components: {
      long_name: string;
      short_name: string;
      types: string[];
    }[];
  }[];
}
