export function createClassStore(db, storeName = "Classes") {
    if (!db.objectStoreNames.contains(storeName)) {
        const objectStore = db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true });
        objectStore.createIndex("courseTitle","courseTitle", { unique: true});
        objectStore.createIndex("courseDescription","courseDescription", { unique: false, required:false});
        objectStore.createIndex("days","days", { unique: false});
        objectStore.createIndex("time","time", { unique: false});
        console.log(`Object store '${storeName}' created.`);
    } else {
        console.log(`Object store '${storeName}' already exists.`);
    }
}
export function createTaskStore(db, storeName = "Tasks") {
    if (!db.objectStoreNames.contains(storeName)) {
        const objectStore = db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true });
        objectStore.createIndex("taskTitle","taskTitle", { unique: false});
        objectStore.createIndex("taskDescription","taskDescription", { unique: false, required:false});
        objectStore.createIndex("deadline","deadline", { unique: false});
        console.log(`Object store '${storeName}' created.`);
    } else {
        console.log(`Object store '${storeName}' already exists.`);
    }
}

export function storeData(db, storeName, data) {
    const transaction = db.transaction(storeName, 'readwrite');
    transaction.oncomplete = () => {
        console.log('Transaction completed: database modification finished.');
    }
    transaction.onerror = () => {
        console.error('Transaction not opened due to error: ', transaction.error);
    }

    const store = transaction.objectStore(storeName);
    const request = store.add(data);
    request.onsuccess = () => {
        console.log('Data added to the store: ', data);
    }
}