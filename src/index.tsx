import { NativeModules, Platform } from 'react-native';

const LINKING_ERROR =
  `The package 'rn-fuzzy-search' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

const RnFuzzySearch = NativeModules.RnFuzzySearch
  ? NativeModules.RnFuzzySearch
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

const elementTypes = [
  'NAME',
  'TEXT',
  'ADDRESS',
  'EMAIL',
  'PHONE',
  'NUMBER',
  'DATE',
] as const;

type ElementType = (typeof elementTypes)[number];

type FuzzySearchOptionFieldObject<T> = {
  name: keyof T | null | undefined;
  weight?: number;
  type?: ElementType;
};

type FuseOptionField<T> =
  | FuzzySearchOptionFieldObject<T>
  | ReadonlyArray<FuzzySearchOptionFieldObject<T>>
  | keyof T
  | (keyof T)[];

interface FuzzySearchOptions<T> {
  keyField?: keyof T;
  fields?: FuseOptionField<T>;
  threshold?: number;
  limit?: number;
  /**
   * If true, only the id field will be returned in the result.
   * @default true
   * @platform android
   * @platform ios
   *
   * It is recommended to set this to true if you are only interested in the id field.
   */
  onlyIdReturned?: boolean;
}

const defaultOptions: FuzzySearchOptions<any> = {
  keyField: 'id',
  threshold: 0.4,
  onlyIdReturned: true,
};

export function search<T = any>(
  searchText: string,
  list: ReadonlyArray<T>,
  options?: FuzzySearchOptions<T>
): Promise<ReadonlyArray<T> | string[]> {
  const combinedOptions = { ...defaultOptions, ...options };
  return RnFuzzySearch.search(searchText, list, combinedOptions);
}
