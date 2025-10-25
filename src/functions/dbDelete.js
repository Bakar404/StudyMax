import displayData from './dbData.js';

export function deleteData(storeName, id){
    let db
    const request = window.indexedDB.open('studyMax', 1);
    request.onsuccess = (event) => {
        db = event.target.result;
        const transaction = db.transaction(storeName, "readwrite")
        const objectStore = transaction.objectStore(storeName);
        const dbrequest = objectStore.delete(id);

        dbrequest.onsuccess = () => {
            console.log(`Record with id ${id} deleted from store ${storeName}.`);
            displayData(db, storeName);
        };

        dbrequest.onerror = (event) => {
            console.error('Error deleting record:', event.target.error);
        };
    }
}

export default function clearStore(storeName){
    let db
    const request = window.indexedDB.open('studyMax', 1);
    request.onsuccess = (event) => {
        db = event.target.result;
        const transaction = db.transaction(storeName, "readwrite")
        const objectStore = transaction.objectStore(storeName);
        const dbrequest = objectStore.clear();

        dbrequest.onsuccess = () => {
            console.log(`All records cleared from store ${storeName}.`);
            displayData(db, storeName);
        };

        dbrequest.onerror = (event) => {
            console.error('Error clearing store:', event.target.error);
        };
    }
}