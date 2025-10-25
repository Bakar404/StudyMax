import { displayData } from './displayData.js';

export default function storeData(db, storeName, data) {
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
        displayData(db, storeName);
    }
}

export function storeUserData(db, storeName, data) {
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
        console.log('User data added to the store: ', data);
    }
}