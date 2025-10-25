import { displayData } from "./dbData.js";
import { createClassStore, createTaskStore, createUserStore } from "./dbSchema.js";
export default function dbConnect() {
    const request = window.indexedDB.open('studyMax', 1);
    let db;

    request.onerror = (event) => {
        db = event.target;
        console.error('Database error: ', db.errorCode);
    }

    request.onsuccess = () => {
        console.log('Database connected');
        db = request.result
        displayData(db, "Classes");
        displayData(db, "Tasks");
    }

    request.onupgradeneeded = (event) => {
        db = event.target.result;
        db.onerror = (event) => {
            console.error('Database error: ', event.target.errorCode);
        }
        createClassStore(db, "Classes");
        createTaskStore(db, "Tasks");
        createUserStore(db, "Users");
    }
    

}