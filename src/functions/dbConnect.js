import  displayData  from "./dbData.js";
import { createClassStore, createTaskStore, createUserStore, createDocumentStore } from "./dbSchema.js";
export default function dbConnect() {
    const request = window.indexedDB.open('studyMax', 1);
    let db;

    request.onerror = (event) => {
        db = event.target;
        console.error('Database error: ', db.errorCode);
    }

    request.onsuccess = (event) => {
        console.log('Database connected');
        db = event.target.result
        displayData(db, "Classes");
        displayData(db, "Tasks");
        displayData(db, "Documents");
    }

    request.onupgradeneeded = (event) => {
        db = event.target.result;
        db.onerror = (event) => {
            console.error('Database error: ', event.target.errorCode);
        }
        createClassStore(db, "Classes");
        createTaskStore(db, "Tasks");
        createDocumentStore(db, "Documents");
        createUserStore(db, "Users");
    }
    

}