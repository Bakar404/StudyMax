import  displayData  from './dbData.js';

export default function storeData(storeName, data) {
    let db
    const request = window.indexedDB.open('studyMax', 1);
    request.onsuccess = (event) => {
        db = event.target.result;
        const transaction = db.transaction(storeName, 'readwrite');
        transaction.oncomplete = () => {
            console.log('Transaction completed: database modification finished.');
        }
        transaction.onerror = () => {
            console.error('Transaction not opened due to error: ', transaction.error);
        }

        const store = transaction.objectStore(storeName);
        const dbRequest = store.add(data);
        request.onsuccess = () => {
            console.log('Data added to the store: ', data);
            displayData(db, storeName);
        }
        request.onerror = () => {
            console.error('Error adding data to the store: ', dbRequest.error);
        }
    }
}

export function storeUserData( storeName, data) {
    let db
    const request = window.indexedDB.open('studyMax', 1);
    request.onsuccess = (event) => {
        db = event.target.result;
        const transaction = db.transaction(storeName, 'readwrite');
        transaction.oncomplete = () => {
            console.log('Transaction completed: database modification finished.');
        }
        transaction.onerror = () => {
            console.error('Transaction not opened due to error: ', transaction.error);
        }

        const store = transaction.objectStore(storeName);
        const dbRequest = store.add(data);
        request.onsuccess = () => {
            console.log('Data added to the store: ', data);
        }
        request.onerror = () => {
            console.error('Error adding data to the store: ', dbRequest.error);
        }
    }
}