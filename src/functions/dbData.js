export default function displayData(db, storeName){
    const transaction = db.transaction(storeName, 'readonly');
    const objectStore = transaction.objectStore(storeName);
    const request = objectStore.getAll();

    request.onsuccess = (event) => {
        const allRecords = event.target.result;
        console.log('All records from store:', allRecords);
    };

    request.onerror = (event) => {
        console.error('Error retrieving data from store:', event.target.error);
    };
}