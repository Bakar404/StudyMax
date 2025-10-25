import { displayData } from './displayData.js';
import { db } from './dbConnect.js';

export default function storeData(database = db, storeName, data) {
    const transaction = database.transaction(storeName, 'readwrite');
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
        displayData(database, storeName);
    }
}

export function storeUserData(database = db, storeName, data) {
    const transaction = database.transaction(storeName, 'readwrite');
    transaction.oncomplete = () => {
        console.log('Transaction completed: database modification finished.');
    }
    transaction.onerror = () => {
        console.error('Transaction not opened due to error: ', transaction.error);
    }

    const store = transaction.objectStore(storeName);
    const request = store.add(data);
    request.onsuccess = () => {
        console.log('User data added to the store: ', data);
    }
}