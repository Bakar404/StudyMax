import { displayData } from "./dbData.js";
export default function dbConnect() {
    const request = window.indexedDB.open('studyMax', 1);

    request.onerror = (event) => {
        const db = event.target;
        console.error('Database error: ', db.errorCode);
    }

    request.onsuccess = () => {
        console.log('Database connected');
        const db = request.result
        displayData(db, "Classes");
        displayData(db, "Tasks");
    }

}