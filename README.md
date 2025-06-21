# Firebase Helpers

A collection of TypeScript utility functions to simplify Firebase operations.

## Installation

```bash
npm install @peeranat-dan/firebase-helpers --registry=https://npm.pkg.github.com
```

## Features

### Firestore Helpers

- **Query Builder**: Build complex Firestore queries with type safety
- **Collection Helper**: Create typed collection references

## Usage

### Build Query Constraints

Create Firestore query constraints from a structured input:

```typescript
import { buildQueryConstraints } from "@peeranat-dan/firebase-helpers";

const constraints = buildQueryConstraints({
  filter: {
    status: "active",
    age: { op: ">=", value: 18 },
    id: { op: "in", value: ["id1", "id2"] },
  },
  order: {
    field: "createdAt",
    direction: "desc",
  },
  paging: {
    limit: 10,
  },
});

// Use with Firestore query
const q = query(collection(db, "users"), ...constraints);
```

### Create Typed Collection

Create a typed collection reference:

```typescript
import { createCollection } from "@peeranat-dan/firebase-helpers";

interface User {
  name: string;
  email: string;
  age: number;
}

const usersCollection = createCollection<User>(db, "users");
```

## API Reference

### `buildQueryConstraints<T>(input: FirestoreSearchInput<T>): QueryConstraint[]`

Builds an array of Firestore query constraints from a structured input.

**Parameters:**

- `input.filter`: Object with field conditions
- `input.order`: Sort configuration with field and direction
- `input.paging`: Pagination with limit

**Filter Conditions:**

- Simple equality: `{ field: value }`
- Complex conditions: `{ field: { op: 'operator', value: any } }`
- Supported operators: `==`, `!=`, `<`, `<=`, `>`, `>=`, `in`, `not-in`, `array-contains`, `array-contains-any`

### `createCollection<T>(db: Firestore, collectionName: string): CollectionReference<T>`

Creates a typed collection reference.

**Parameters:**

- `db`: Firestore instance
- `collectionName`: Name of the collection

## Development

```bash
# Install dependencies
pnpm install

# Run tests
pnpm test

# Build package
pnpm build
```
