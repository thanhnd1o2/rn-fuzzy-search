export interface KeyType {
  name: string;
  weight: number;
}

export interface Options {
  threshold?: number;
  keys?: KeyType[] | string[];
  includeScore?: boolean;
  orderByScore?: boolean;
  limit?: number | null;
  fullSearch?: boolean;
}

export interface WithScore<T> {
  item: T;
  score: number;
}
