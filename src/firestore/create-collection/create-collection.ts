import {
  collection,
  DocumentData,
  CollectionReference,
  Firestore,
} from "firebase/firestore";

/**
 * Create a collection reference
 *
 * @param db The Firestore instance
 * @param collectionName The name of the collection
 *
 * @returns The collection reference
 */
export function createCollection<
  TDocumentData extends DocumentData = DocumentData
>(db: Firestore, collectionName: string) {
  return collection(db, collectionName) as CollectionReference<TDocumentData>;
}
