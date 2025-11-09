"use client";

import { useState, useEffect, useMemo } from "react";
import { dataStore } from "@/lib/store/dataStore";
import type { DocumentData } from "@/lib/store/dataStore";

export interface QueryConstraint {
  field: string;
  operator: "==" | "!=" | "<" | "<=" | ">" | ">=" | "array-contains" | "in" | "array-contains-any";
  value: any;
}

// useMemoFirebase hook for performance optimization
export function useMemoFirebase<T>(deps: any[], fn: () => T): T {
  return useMemo(fn, deps);
}

// Non-blocking write operations
export async function addDocumentNonBlocking(
  collectionPath: string,
  data: any
): Promise<void> {
  try {
    await dataStore.addDocumentNonBlocking(collectionPath as any, data);
  } catch (error) {
    console.error("Error adding document: ", error);
    throw error;
  }
}

export async function updateDocumentNonBlocking(
  collectionPath: string,
  id: string,
  data: any
): Promise<void> {
  try {
    await dataStore.updateDocumentNonBlocking(collectionPath as any, id, data);
  } catch (error) {
    console.error("Error updating document: ", error);
    throw error;
  }
}

export async function deleteDocumentNonBlocking(
  collectionPath: string,
  id: string
): Promise<void> {
  try {
    await dataStore.deleteDocumentNonBlocking(collectionPath as any, id);
  } catch (error) {
    console.error("Error deleting document: ", error);
    throw error;
  }
}

// useCollection hook
export function useCollection<T = DocumentData>(
  collectionPath: string,
  constraints?: QueryConstraint[]
): {
  data: T[];
  loading: boolean;
  error: Error | null;
} {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const setupSubscription = () => {
      try {
        setLoading(true);
        
        unsubscribe = dataStore.subscribe(
          collectionPath as any,
          (docs) => {
            setData(docs as T[]);
            setLoading(false);
            setError(null);
          },
          constraints
        );
      } catch (err) {
        setError(err as Error);
        setLoading(false);
      }
    };

    setupSubscription();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [collectionPath, JSON.stringify(constraints)]);

  return { data, loading, error };
}

// useDoc hook
export function useDoc<T = DocumentData>(
  collectionPath: string,
  docId: string | null
): {
  data: T | null;
  loading: boolean;
  error: Error | null;
} {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!docId) {
      setData(null);
      setLoading(false);
      return;
    }

    const fetchDoc = async () => {
      try {
        setLoading(true);
        const doc = await dataStore.getDocument(collectionPath as any, docId);
        setData(doc as T | null);
        setLoading(false);
        setError(null);
      } catch (err) {
        setError(err as Error);
        setLoading(false);
      }
    };

    fetchDoc();

    // Subscribe to changes
    const unsubscribe = dataStore.subscribe(collectionPath as any, (docs) => {
      const doc = docs.find((d: any) => d.id === docId);
      if (doc) {
        setData(doc as T);
      } else {
        setData(null);
      }
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, [collectionPath, docId]);

  return { data, loading, error };
}

// Helper to get a single document
export async function getDocument<T = DocumentData>(
  collectionPath: string,
  docId: string
): Promise<T | null> {
  try {
    const doc = await dataStore.getDocument(collectionPath as any, docId);
    return doc as T | null;
  } catch (error) {
    console.error("Error getting document: ", error);
    throw error;
  }
}

// Helper to get collection with constraints
export async function getCollection<T = DocumentData>(
  collectionPath: string,
  constraints?: QueryConstraint[]
): Promise<T[]> {
  try {
    const docs = await dataStore.getCollection(collectionPath as any, constraints);
    return docs as T[];
  } catch (error) {
    console.error("Error getting collection: ", error);
    throw error;
  }
}

// Export where function for compatibility
export function where(field: string, operator: QueryConstraint["operator"], value: any): QueryConstraint {
  return { field, operator, value };
}
