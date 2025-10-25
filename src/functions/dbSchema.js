export function createClassStore(db, storeName = "Classes") {
    if (!db.objectStoreNames.contains(storeName)) {
        const objectStore = db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true });
        objectStore.createIndex("courseTitle","courseTitle", { unique: true});
        objectStore.createIndex("courseDescription","courseDescription", { unique: false, required:false});
        objectStore.createIndex("days","days", { unique: false});
        objectStore.createIndex("time","time", { unique: false});
        //objectStore.createIndex("userId","userId", { unique: true});
        console.log(`Object store '${storeName}' created.`);
    } else {
        console.log(`Object store '${storeName}' already exists.`);
    }
}
export function createTaskStore(db, storeName = "Tasks") {
    if (!db.objectStoreNames.contains(storeName)) {
        const objectStore = db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true });
        objectStore.createIndex("taskTitle","taskTitle", { unique: false});
        objectStore.createIndex("taskDescription","taskDescription", { unique: false, required:false});
        objectStore.createIndex("deadline","deadline", { unique: false});
        objectStore.createIndex("class","class", { unique: true});
        console.log(`Object store '${storeName}' created.`);
    } else {
        console.log(`Object store '${storeName}' already exists.`);
    }
}

export function createDocumentStore(db, storeName = "Documents") {
    if (!db.objectStoreNames.contains(storeName)) {
        const objectStore = db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true });
        objectStore.createIndex("documentTitle","documentTitle", { unique: false});
        objectStore.createIndex("documentType","documentType", { unique: false, required:false});
        objectStore.createIndex("uploadDate","uploadDate", { unique: false});
        objectStore.createIndex("class","class", { unique: true});
        console.log(`Object store '${storeName}' created.`);
    } else {
        console.log(`Object store '${storeName}' already exists.`);
    }
}

export function createUserStore(db, storeName = "Users") {
    if (!db.objectStoreNames.contains(storeName)) {
        const objectStore = db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true });
        objectStore.createIndex("firstName","firstName", { unique: false});
        objectStore.createIndex("lastName","lastName", { unique: false});
        objectStore.createIndex("school","school", { unique: false, required:false});
        objectStore.createIndex("major","major", { unique: false, required:false});
        objectStore.createIndex("email","email", { unique: true});
        objectStore.createIndex("password","password", { unique: false});
        console.log(`Object store '${storeName}' created.`);
    } else {
        console.log(`Object store '${storeName}' already exists.`);
    }
}