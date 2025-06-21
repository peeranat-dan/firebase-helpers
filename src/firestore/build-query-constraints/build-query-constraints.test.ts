import { documentId, limit, orderBy, where } from "firebase/firestore";
import { buildQueryConstraints } from "./build-query-constraints";
import { describe, it, expect } from "vitest";

describe("buildQueryConstraints", () => {
  type TestType = {
    name: string;
    age: number;
    active: boolean;
  };

  it("should return empty array for empty input", () => {
    const result = buildQueryConstraints<TestType>({ filter: {} });
    expect(result).toEqual([]);
  });

  it("should handle simple equality filter", () => {
    const result = buildQueryConstraints<TestType>({
      filter: { name: "John" },
    });
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual(where("name", "==", "John"));
  });

  it("should handle filter with custom operator", () => {
    const result = buildQueryConstraints<TestType>({
      filter: { age: { op: ">", value: 18 } },
    });
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual(where("age", ">", 18));
  });

  it("should handle id field specially", () => {
    const result = buildQueryConstraints<TestType>({
      filter: { id: "test-id" },
    });
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual(where(documentId(), "==", "test-id"));
  });

  it("should handle id field with custom operator", () => {
    const result = buildQueryConstraints<TestType>({
      filter: { id: { op: "in", value: ["id1", "id2"] } },
    });
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual(where(documentId(), "in", ["id1", "id2"]));
  });

  it("should handle multiple filters", () => {
    const result = buildQueryConstraints<TestType>({
      filter: {
        name: "John",
        age: { op: ">", value: 18 },
        active: true,
      },
    });
    expect(result).toHaveLength(3);
    expect(result).toContainEqual(where("name", "==", "John"));
    expect(result).toContainEqual(where("age", ">", 18));
    expect(result).toContainEqual(where("active", "==", true));
  });

  it("should handle boolean false values", () => {
    const result = buildQueryConstraints<TestType>({
      filter: { active: false },
    });
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual(where("active", "==", false));
  });

  it("should handle ordering", () => {
    const result = buildQueryConstraints<TestType>({
      filter: {},
      order: { field: "name", direction: "desc" },
    });
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual(orderBy("name", "desc"));
  });

  it("should handle paging", () => {
    const result = buildQueryConstraints<TestType>({
      filter: {},
      paging: { limit: 10 },
    });
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual(limit(10));
  });

  it("should combine all options", () => {
    const result = buildQueryConstraints<TestType>({
      filter: {
        name: "John",
        age: { op: ">", value: 18 },
      },
      order: { field: "name", direction: "asc" },
      paging: { limit: 5 },
    });

    expect(result).toHaveLength(4);
    expect(result).toContainEqual(where("name", "==", "John"));
    expect(result).toContainEqual(where("age", ">", 18));
    expect(result).toContainEqual(orderBy("name", "asc"));
    expect(result).toContainEqual(limit(5));
  });

  it("should ignore null or undefined filter values", () => {
    const result = buildQueryConstraints<TestType>({
      filter: {
        name: undefined,
        age: null as any, // Testing runtime behavior with null
      },
    });
    expect(result).toEqual([]);
  });
});
