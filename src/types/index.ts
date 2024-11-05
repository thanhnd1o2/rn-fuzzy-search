const elementTypes = [
  'NAME',
  'TEXT',
  'ADDRESS',
  'EMAIL',
  'PHONE',
  'NUMBER',
  'DATE',
] as const;

export type ElementType = (typeof elementTypes)[number];

export type FuzzySearchOptionFieldObject<T> = {
  name: keyof T | null | undefined;
  weight?: number;
  type?: ElementType;
};

export type FuseOptionField<T> =
  | FuzzySearchOptionFieldObject<T>
  | ReadonlyArray<FuzzySearchOptionFieldObject<T>>
  | keyof T
  | (keyof T)[];

export interface FuzzySearchOptions<T> {
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
