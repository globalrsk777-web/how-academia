// TypeScript-based in-memory data store
import type { Course, Exam, ExamSubmission, Schedule, LiveSession, Message, Institution } from "@/types";

type CollectionName = "courses" | "exams" | "examSubmissions" | "schedule" | "liveSessions" | "messages" | "institutions" | "users";

export type DocumentData = Course | Exam | ExamSubmission | Schedule | LiveSession | Message | Institution | any;

interface QueryConstraint {
  field: string;
  operator: "==" | "!=" | "<" | "<=" | ">" | ">=" | "array-contains" | "in" | "array-contains-any";
  value: any;
}

class DataStore {
  private collections: Map<CollectionName, Map<string, DocumentData>>;
  private listeners: Map<string, Set<(data: DocumentData[]) => void>>;
  private messageListeners: Map<string, Set<(data: Message[]) => void>>;

  constructor() {
    this.collections = new Map();
    this.listeners = new Map();
    this.messageListeners = new Map();
    
    // Initialize collections
    const collectionNames: CollectionName[] = [
      "courses",
      "exams",
      "examSubmissions",
      "schedule",
      "liveSessions",
      "messages",
      "institutions",
      "users",
    ];
    
    collectionNames.forEach((name) => {
      this.collections.set(name, new Map());
    });

    // Initialize with some mock data
    this.initializeMockData();
  }

  private initializeMockData() {
    // Initialize mock institutions with Ugandan examples
    const institutions = [
      {
        id: "inst1",
        name: "Makerere University",
        description: "A premier institution of higher learning, offering a wide range of undergraduate and postgraduate courses.",
        address: "Kampala, Uganda",
        phone: "+256-414-532-752",
        email: "info@mak.ac.ug",
        staffCount: 85,
        price: 1200,
        priceType: "yearly",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "inst2",
        name: "St. Mary's College Kisubi",
        description: "A leading secondary school known for excellence in sciences and holistic education for boys.",
        address: "Wakiso, Uganda",
        phone: "+256-312-350-880",
        email: "info@smack.ac.ug",
        staffCount: 60,
        price: 150,
        priceType: "monthly",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "inst3",
        name: "King's College Budo",
        description: "One of the oldest and most prestigious mixed secondary schools in Uganda, with a strong tradition in leadership.",
        address: "Wakiso, Uganda",
        phone: "+256-414-286-161",
        email: "info@kcb.ac.ug",
        staffCount: 65,
        price: 165,
        priceType: "monthly",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "inst4",
        name: "Gayaza High School",
        description: "The oldest all-girls school in Uganda, championing female education and empowerment.",
        address: "Wakiso, Uganda",
        phone: "+256-772-420-330",
        email: "info@gayaza.ac.ug",
        staffCount: 55,
        price: 145,
        priceType: "monthly",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "inst5",
        name: "Kyambogo University",
        description: "A public university known for teacher education, vocational studies, and special needs education.",
        address: "Kampala, Uganda",
        phone: "+256-414-286-161",
        email: "info@kyu.ac.ug",
        staffCount: 70,
        price: 1100,
        priceType: "yearly",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "inst6",
        name: "Mbarara University",
        description: "A leading science and technology university with a strong focus on health sciences and research.",
        address: "Mbarara, Uganda",
        phone: "+256-485-420-330",
        email: "info@must.ac.ug",
        staffCount: 50,
        price: 1300,
        priceType: "yearly",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "inst7",
        name: "OIT",
        description: "A hub for innovation and technology, offering practical skills in IT, business, and public health in Northern Uganda.",
        address: "Gulu, Uganda",
        phone: "+256-471-420-330",
        email: "info@oit.ac.ug",
        staffCount: 60,
        price: 0,
        priceType: "free",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    institutions.forEach((inst) => {
      this.collections.get("institutions")!.set(inst.id, inst);
    });

    // Initialize some sample courses with Ugandan context
    const sampleCourses = [
      {
        id: "course1",
        title: "Introduction to Agriculture in Uganda",
        description: "Learn about modern farming techniques, crop management, and agricultural practices specific to Uganda's climate and soil conditions.",
        instructorId: "sample-instructor-1",
        instructorName: "Dr. Nakato Mary",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "course2",
        title: "Luganda Language and Culture",
        description: "Master the Luganda language and understand Ugandan cultural traditions, customs, and heritage.",
        instructorId: "sample-instructor-2",
        instructorName: "Prof. Kigozi James",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "course3",
        title: "Entrepreneurship in East Africa",
        description: "Develop business skills and learn about the East African market, with focus on Uganda's business environment.",
        instructorId: "sample-instructor-3",
        instructorName: "Ms. Namukasa Sarah",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    sampleCourses.forEach((course) => {
      this.collections.get("courses")!.set(course.id, course);
    });
  }

  // Generate unique ID
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // Add document
  async addDocument(collection: CollectionName, data: Partial<DocumentData>): Promise<string> {
    const id = this.generateId();
    const document = {
      id,
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const collectionMap = this.collections.get(collection);
    if (!collectionMap) {
      throw new Error(`Collection ${collection} does not exist`);
    }

    collectionMap.set(id, document);
    await this.notifyListeners(collection);
    return id;
  }

  // Update document
  async updateDocument(collection: CollectionName, id: string, data: Partial<DocumentData>): Promise<void> {
    const collectionMap = this.collections.get(collection);
    if (!collectionMap) {
      throw new Error(`Collection ${collection} does not exist`);
    }

    const existing = collectionMap.get(id);
    if (!existing) {
      // If document doesn't exist, create it
      collectionMap.set(id, {
        id,
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    } else {
      collectionMap.set(id, {
        ...existing,
        ...data,
        updatedAt: new Date().toISOString(),
      });
    }

    await this.notifyListeners(collection);
  }

  // Delete document
  async deleteDocument(collection: CollectionName, id: string): Promise<void> {
    const collectionMap = this.collections.get(collection);
    if (!collectionMap) {
      throw new Error(`Collection ${collection} does not exist`);
    }

    collectionMap.delete(id);
    await this.notifyListeners(collection);
  }

  // Get document
  async getDocument(collection: CollectionName, id: string): Promise<DocumentData | null> {
    const collectionMap = this.collections.get(collection);
    if (!collectionMap) {
      return null;
    }

    return collectionMap.get(id) || null;
  }

  // Get collection with optional constraints
  async getCollection(
    collection: CollectionName,
    constraints?: QueryConstraint[]
  ): Promise<DocumentData[]> {
    const collectionMap = this.collections.get(collection);
    if (!collectionMap) {
      return [];
    }

    let documents = Array.from(collectionMap.values());

    // Apply constraints
    if (constraints && constraints.length > 0) {
      documents = documents.filter((doc) => {
        return constraints.every((constraint) => {
          const fieldValue = this.getNestedValue(doc, constraint.field);
          
          switch (constraint.operator) {
            case "==":
              return fieldValue === constraint.value;
            case "!=":
              return fieldValue !== constraint.value;
            case "<":
              return fieldValue < constraint.value;
            case "<=":
              return fieldValue <= constraint.value;
            case ">":
              return fieldValue > constraint.value;
            case ">=":
              return fieldValue >= constraint.value;
            case "array-contains":
              return Array.isArray(fieldValue) && fieldValue.includes(constraint.value);
            case "in":
              return Array.isArray(constraint.value) && constraint.value.includes(fieldValue);
            default:
              return true;
          }
        });
      });
    }

    return documents;
  }

  // Get nested value from object
  private getNestedValue(obj: any, path: string): any {
    return path.split(".").reduce((current, prop) => current?.[prop], obj);
  }

  // Subscribe to collection changes
  subscribe(
    collection: CollectionName,
    callback: (data: DocumentData[]) => void,
    constraints?: QueryConstraint[]
  ): () => void {
    const constraintsKey = constraints ? JSON.stringify(constraints) : "no-constraints";
    const key = `${collection}-${constraintsKey}`;
    
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set());
    }

    this.listeners.get(key)!.add(callback);

    // Initial call
    this.getCollection(collection, constraints).then((data) => {
      callback(data);
    });

    // Return unsubscribe function
    return () => {
      const listeners = this.listeners.get(key);
      if (listeners) {
        listeners.delete(callback);
        if (listeners.size === 0) {
          this.listeners.delete(key);
        }
      }
    };
  }

  // Subscribe to messages (for chat)
  subscribeMessages(
    sessionId: string,
    callback: (data: Message[]) => void
  ): () => void {
    if (!this.messageListeners.has(sessionId)) {
      this.messageListeners.set(sessionId, new Set());
    }

    this.messageListeners.get(sessionId)!.add(callback);

    // Initial call
    this.getCollection("messages", [{ field: "sessionId", operator: "==", value: sessionId }]).then((data) => {
      callback(data as Message[]);
    });

    // Return unsubscribe function
    return () => {
      const listeners = this.messageListeners.get(sessionId);
      if (listeners) {
        listeners.delete(callback);
        if (listeners.size === 0) {
          this.messageListeners.delete(sessionId);
        }
      }
    };
  }

  // Add message
  async addMessage(message: Partial<Message>): Promise<string> {
    return this.addDocument("messages", message);
  }

  // Notify listeners
  private async notifyListeners(collection: CollectionName) {
    this.listeners.forEach((callbacks, key) => {
      if (key.startsWith(collection)) {
        const constraints = this.parseConstraintsFromKey(key);
        this.getCollection(collection, constraints).then((data) => {
          callbacks.forEach((callback) => callback(data));
        });
      }
    });

    // Also notify message listeners if it's a messages collection
    if (collection === "messages") {
      // Get all unique sessionIds from messages
      const messages = await this.getCollection("messages");
      const sessionIds = new Set(messages.map((m: any) => m.sessionId));
      
      sessionIds.forEach((sessionId) => {
        const listeners = this.messageListeners.get(sessionId);
        if (listeners) {
          this.getCollection("messages", [
            { field: "sessionId", operator: "==", value: sessionId },
          ]).then((data) => {
            listeners.forEach((callback) => callback(data as Message[]));
          });
        }
      });
    }
  }

  private parseConstraintsFromKey(key: string): QueryConstraint[] | undefined {
    const parts = key.split("-");
    if (parts.length > 1) {
      const constraintsPart = parts.slice(1).join("-");
      if (constraintsPart === "no-constraints") {
        return undefined;
      }
      try {
        return JSON.parse(constraintsPart);
      } catch {
        return undefined;
      }
    }
    return undefined;
  }

  // Non-blocking operations (same as blocking for in-memory store, but async)
  async addDocumentNonBlocking(collection: CollectionName, data: Partial<DocumentData>): Promise<void> {
    await this.addDocument(collection, data);
  }

  async updateDocumentNonBlocking(collection: CollectionName, id: string, data: Partial<DocumentData>): Promise<void> {
    await this.updateDocument(collection, id, data);
  }

  async deleteDocumentNonBlocking(collection: CollectionName, id: string): Promise<void> {
    await this.deleteDocument(collection, id);
  }
}

// Singleton instance
export const dataStore = new DataStore();

