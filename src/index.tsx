import { NativeModules, Platform } from 'react-native';
import type { FuzzySearchOptions } from './types';

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
