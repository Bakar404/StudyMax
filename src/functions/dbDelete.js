import { displayData } from './displayData.js';

export default function deleteData(db,storeName, id){
    const transaction = db.transaction(storeName, "readwrite")
    const objectStore = transaction.objectStore(storeName);
    const request = objectStore.delete(id);

    request.onsuccess = () => {
        console.log(`Record with id ${id} deleted from store ${storeName}.`);
        displayData(db, storeName);
    };

    request.onerror = (event) => {
        console.error('Error deleting record:', event.target.error);
    };
}