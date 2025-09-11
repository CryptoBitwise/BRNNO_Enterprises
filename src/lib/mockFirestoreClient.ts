// Mock Firestore client for development without Firebase
// This allows the app to run without Firebase credentials

export interface MockDocumentData {
    [field: string]: any;
}

export interface MockDocumentSnapshot {
    id: string;
    data(): MockDocumentData | undefined;
    exists: boolean;
}

export interface MockQuerySnapshot {
    docs: MockDocumentSnapshot[];
    empty: boolean;
    size: number;
}

export interface MockCollectionReference {
    doc(id?: string): MockDocumentReference;
    add(data: MockDocumentData): Promise<MockDocumentReference>;
    get(): Promise<MockQuerySnapshot>;
    where(field: string, operator: string, value: any): MockQuery;
}

export interface MockDocumentReference {
    id: string;
    get(): Promise<MockDocumentSnapshot>;
    set(data: MockDocumentData): Promise<void>;
    update(data: Partial<MockDocumentData>): Promise<void>;
    delete(): Promise<void>;
}

export interface MockQuery {
    get(): Promise<MockQuerySnapshot>;
    where(field: string, operator: string, value: any): MockQuery;
    orderBy(field: string, direction?: 'asc' | 'desc'): MockQuery;
    limit(limit: number): MockQuery;
}

class MockFirestoreClient {
    private data: Map<string, Map<string, MockDocumentData>> = new Map();

    collection(collectionPath: string): MockCollectionReference {
        if (!this.data.has(collectionPath)) {
            this.data.set(collectionPath, new Map());
        }

        return {
            doc: (id?: string) => this.doc(collectionPath, id),
            add: (data: MockDocumentData) => this.add(collectionPath, data),
            get: () => this.getCollection(collectionPath),
            where: (field: string, operator: string, value: any) =>
                this.where(collectionPath, field, operator, value)
        };
    }

    private doc(collectionPath: string, id?: string): MockDocumentReference {
        const docId = id || `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        return {
            id: docId,
            get: () => this.getDoc(collectionPath, docId),
            set: (data: MockDocumentData) => this.setDoc(collectionPath, docId, data),
            update: (data: Partial<MockDocumentData>) => this.updateDoc(collectionPath, docId, data),
            delete: () => this.deleteDoc(collectionPath, docId)
        };
    }

    private async add(collectionPath: string, data: MockDocumentData): Promise<MockDocumentReference> {
        const docId = `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        await this.setDoc(collectionPath, docId, data);
        return this.doc(collectionPath, docId);
    }

    private async getCollection(collectionPath: string): Promise<MockQuerySnapshot> {
        const collection = this.data.get(collectionPath) || new Map();
        const docs: MockDocumentSnapshot[] = Array.from(collection.entries()).map(([id, data]) => ({
            id,
            data: () => data,
            exists: true
        }));

        return {
            docs,
            empty: docs.length === 0,
            size: docs.length
        };
    }

    private async getDoc(collectionPath: string, docId: string): Promise<MockDocumentSnapshot> {
        const collection = this.data.get(collectionPath);
        const data = collection?.get(docId);

        return {
            id: docId,
            data: () => data,
            exists: !!data
        };
    }

    private async setDoc(collectionPath: string, docId: string, data: MockDocumentData): Promise<void> {
        if (!this.data.has(collectionPath)) {
            this.data.set(collectionPath, new Map());
        }
        this.data.get(collectionPath)!.set(docId, { ...data, id: docId });
        console.log('🔧 Mock Firestore: Document set', collectionPath, docId, data);
    }

    private async updateDoc(collectionPath: string, docId: string, data: Partial<MockDocumentData>): Promise<void> {
        const collection = this.data.get(collectionPath);
        if (collection?.has(docId)) {
            const existing = collection.get(docId)!;
            collection.set(docId, { ...existing, ...data });
            console.log('🔧 Mock Firestore: Document updated', collectionPath, docId, data);
        }
    }

    private async deleteDoc(collectionPath: string, docId: string): Promise<void> {
        const collection = this.data.get(collectionPath);
        if (collection?.has(docId)) {
            collection.delete(docId);
            console.log('🔧 Mock Firestore: Document deleted', collectionPath, docId);
        }
    }

    private where(collectionPath: string, field: string, operator: string, value: any): MockQuery {
        return {
            get: async () => {
                const collection = this.data.get(collectionPath) || new Map();
                const docs: MockDocumentSnapshot[] = Array.from(collection.entries())
                    .map(([id, data]) => ({ id, data: () => data, exists: true }))
                    .filter(doc => {
                        const docData = doc.data();
                        if (!docData) return false;

                        const fieldValue = docData[field];
                        switch (operator) {
                            case '==':
                                return fieldValue === value;
                            case '!=':
                                return fieldValue !== value;
                            case '>':
                                return fieldValue > value;
                            case '>=':
                                return fieldValue >= value;
                            case '<':
                                return fieldValue < value;
                            case '<=':
                                return fieldValue <= value;
                            case 'array-contains':
                                return Array.isArray(fieldValue) && fieldValue.includes(value);
                            default:
                                return false;
                        }
                    });

                return {
                    docs,
                    empty: docs.length === 0,
                    size: docs.length
                };
            },
            where: (field: string, operator: string, value: any) => this.where(collectionPath, field, operator, value),
            orderBy: (field: string, direction: 'asc' | 'desc' = 'asc') => ({
                get: async () => {
                    const result = await this.where(collectionPath, field, '!=', null).get();
                    result.docs.sort((a, b) => {
                        const aVal = a.data()?.[field];
                        const bVal = b.data()?.[field];
                        if (aVal < bVal) return direction === 'asc' ? -1 : 1;
                        if (aVal > bVal) return direction === 'asc' ? 1 : -1;
                        return 0;
                    });
                    return result;
                },
                where: (field: string, operator: string, value: any) => this.where(collectionPath, field, operator, value),
                orderBy: (field: string, direction?: 'asc' | 'desc') => this.where(collectionPath, field, '!=', null).orderBy(field, direction),
                limit: (limit: number) => this.where(collectionPath, field, '!=', null).limit(limit)
            }),
            limit: (limit: number) => ({
                get: async () => {
                    const result = await this.where(collectionPath, field, operator, value).get();
                    return {
                        ...result,
                        docs: result.docs.slice(0, limit)
                    };
                },
                where: (field: string, operator: string, value: any) => this.where(collectionPath, field, operator, value),
                orderBy: (field: string, direction?: 'asc' | 'desc') => this.where(collectionPath, field, '!=', null).orderBy(field, direction),
                limit: (limit: number) => this.where(collectionPath, field, '!=', null).limit(limit)
            })
        };
    }
}

// Create mock Firestore client
export const mockFirestoreClient = new MockFirestoreClient();

// Export as default for compatibility
export default mockFirestoreClient;
