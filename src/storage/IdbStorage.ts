import { GameResult, GameStorage } from "../types";

export class IdbStorage implements GameStorage {
    constructor(private databaseName: string) { }

    getResults() {
        return this.performQuery<GameResult[]>((store) => {
            return store.getAll();
        });
    }

    async saveResult(result: GameResult) {
        await this.performQuery((store) => {
            return store.add(result, new Date());
        });
    }

    private async performQuery<T>(executeQuery: (transaction: IDBObjectStore) => IDBRequest<T>): Promise<T> {
        const connection = await this.connect();
        const database = connection.result;

        const tableName = this.getTableName();

        let result: T;
        try {
            const transaction = database.transaction(tableName, "readwrite");
            const objectStore = transaction.objectStore(tableName);
            result = (await this.waitForRequestResult(executeQuery(objectStore))).result;
            await new Promise((resolve, reject) => {
                transaction.oncomplete = resolve;
                transaction.onerror = reject;
            });
        } finally {
            database.close();
        }

        return result;
    }

    private waitForRequestResult<T>(request: IDBRequest<T>): Promise<IDBRequest<T>> {
        return new Promise((resolve, reject) => {
            request.onsuccess = function onRequestSuccess() {
                resolve(this);
            };
            request.onerror = reject;
        });
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

        await this.waitForRequestResult(connection);

        return connection;
    }

    private getTableName() {
        return "score";
    }
}