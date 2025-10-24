export default function storeClass(db, storeName = "Classes", data) {
    const objectStore = db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true });
    objectStore.createIndex("courseTitle","courseTitle", { unique: true});
    objectStore.createIndex("courseDescription","courseDescription", { unique: false, required:false});
    objectStore.createIndex("days","days", { unique: false});
    objectStore.createIndex("time","time", { unique: false});

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

export function storeTask(db, storeName = "Tasks", data) {
    const objectStore = db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true });
    objectStore.createIndex("taskTitle","taskTitle", { unique: false});
    objectStore.createIndex("taskDescription","taskDescription", { unique: false, required:false});
    objectStore.createIndex("dueDate","dueDate", { unique: false});

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