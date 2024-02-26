export declare type PaginatedResult<T> = {
  total: number;
  list: T[];
  offset: number;
  limit: number;
};

type Query<T> = Partial<{ $not: Partial<T> } & T>;

export declare type PaginatedQuery<T> = {
  offset: number;
  limit: number;
  query: Query<T>;
};

export interface State {
  loading: boolean;
  errored: boolean;
}

export interface Location {
  longitude: number;
  latitude: number;
}

export interface Route {
  index?: boolean;
  pathname: string;
  link?: string;
  name: string;
  icon: JSX.Element;
  children?: Route[];
}
