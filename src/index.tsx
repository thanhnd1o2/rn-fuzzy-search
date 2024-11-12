import { NativeModules, Platform } from 'react-native';
import type { Options, WithScore } from './types';

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

const defaultOptions: Options = {
  threshold: 0.5,
  includeScore: false,
  orderByScore: false,
  limit: null,
  fullSearch: false,
};

export function search<T = any>(
  searchText: string,
  list: ReadonlyArray<T>,
  options?: Options
): Promise<ReadonlyArray<T> | ReadonlyArray<WithScore<T>>> {
  const combinedOptions = { ...defaultOptions, ...options };
  Object.keys(combinedOptions).forEach(
    (key) => combinedOptions[key] == null && delete combinedOptions[key]
  );
  return RnFuzzySearch.search(searchText, list, combinedOptions);
}
