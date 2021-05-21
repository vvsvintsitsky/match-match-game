import { GameResult, GameStorage } from "../types";

export class IdbStorage implements GameStorage {
    constructor(private databaseName: string) {}

    getResults() {
        return this.performQuery<GameResult[]>((store) => {
            return store.getAll().result;
        });
    }

    saveResult(result: GameResult) {
        return this.performQuery((store) => {
            store.add(result, new Date());
        });
    }

    private async performQuery<T>(executeQuery: (transaction: IDBObjectStore) => T) {
        const connection = await this.connect();
        const database = connection.result;

        const tableName = this.getTableName();
        
        let result: T;
        try {
            const transaction = database.transaction(tableName, "readwrite");
            const objectStore = transaction.objectStore(tableName);
            result = executeQuery(objectStore);
            await new Promise((resolve, reject) => {
                transaction.oncomplete = resolve;
                transaction.onerror = reject;
            });
        } finally {
            database.close();
        }

        return result;
    }

    private async connect() {
        const connection = indexedDB.open(this.databaseName);
        
        connection.onupgradeneeded = () => {
            const tableName = this.getTableName();
            const database = connection.result;
            
            if (!database.objectStoreNames.contains(tableName)) {
                database.createObjectStore(tableName);
            }
        }
        
        await new Promise((resolve, reject) => {
            connection.onsuccess = resolve;
            connection.onerror = reject;
        });
        
        return connection;
    }

    private getTableName() {
        return "score";
    }
}