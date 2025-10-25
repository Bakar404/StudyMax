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
export function getAllData(storeName) {
    return new Promise((resolve, reject) => {
        const request = window.indexedDB.open('studyMax', 1);
        
        request.onsuccess = (event) => {
            const db = event.target.result;
            const transaction = db.transaction(storeName, 'readonly');
            const objectStore = transaction.objectStore(storeName);
            const getAllRequest = objectStore.getAll();
            
            getAllRequest.onsuccess = () => {
                resolve(getAllRequest.result || []);
            };
            
            getAllRequest.onerror = () => {
                reject(getAllRequest.error);
            };
        };
        
        request.onerror = () => {
            reject(request.error);
        };
    });
}
