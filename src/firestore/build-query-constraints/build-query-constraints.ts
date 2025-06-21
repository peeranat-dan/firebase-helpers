import {
  documentId,
  limit,
  orderBy,
  where,
  type QueryConstraint,
  type WhereFilterOp,
} from "firebase/firestore";
import { type FirestoreSearchInput } from "../types";

type Condition = { op: WhereFilterOp; value: unknown };

/**
 * Create a where constraint for the ID field
 */
function createIdConstraint(condition: Condition): QueryConstraint {
  if (
    typeof condition === "object" &&
    condition &&
    "op" in condition &&
    "value" in condition
  ) {
    return where(documentId(), condition.op, condition.value);
  }
  return where(documentId(), "==", condition);
}

/**
 * Create a where constraint for a regular field
 */
function createFieldConstraint(
  field: string,
  condition: Condition
): QueryConstraint | null {
  if (condition === undefined || condition === null) {
    return null;
  }

  if (
    typeof condition === "object" &&
    condition &&
    "op" in condition &&
    "value" in condition
  ) {
    return where(field, condition.op, condition.value);
  }
  return where(field, "==", condition);
}

/**
 * Process filter conditions and add them to constraints
 */
function processFilterConditions<T extends Record<string, unknown>>(
  filter: FirestoreSearchInput<T>["filter"],
  constraints: QueryConstraint[]
): void {
  for (const [field, condition] of Object.entries(filter)) {
    console.log(field, condition);

    const constraint =
      field === "id"
        ? createIdConstraint(condition as Condition)
        : createFieldConstraint(field, condition as Condition);

    if (constraint) {
      constraints.push(constraint);
    }
  }
}

/**
 * Build query constraints from a search input
 *
 * @param input The search input
 * @param input.filter The filter conditions
 * @param input.order The order conditions
 * @param input.paging The paging conditions
 *
 * @returns The query constraints
 */
export function buildQueryConstraints<T extends Record<string, unknown>>(
  input: FirestoreSearchInput<T>
): QueryConstraint[] {
  const { filter, order, paging } = input;
  const constraints: QueryConstraint[] = [];

  processFilterConditions(filter, constraints);

  if (order) {
    constraints.push(orderBy(order.field as string, order.direction));
  }

  if (paging) {
    constraints.push(limit(paging.limit));
  }

  return constraints;
}
