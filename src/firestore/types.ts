import { type WhereFilterOp } from "firebase/firestore";

export type FilterCondition<Value> =
  | { op: "in" | "not-in"; value: Value[] }
  | { op: Exclude<WhereFilterOp, "in" | "not-in">; value: Value }
  | Value;

export type FirestoreFilter<T> = {
  [K in keyof T]?: FilterCondition<T[K]>;
} & {
  id?: FilterCondition<string>;
};

export interface FirestoreSearchInput<T extends Record<string, unknown>> {
  filter: FirestoreFilter<T>;
  order?: {
    field: keyof T;
    direction: "asc" | "desc";
  };
  paging?: {
    limit: number;
  };
}
