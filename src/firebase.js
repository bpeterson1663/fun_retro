import firebase from "firebase";

let apiKey,
    authDomain,
    databaseURL,
    projectId,
    storageBucket,
    messagingSenderId,
    appId;

if (process.env.NODE_ENV === 'production') {
    apiKey = process.env.REACT_APP_API_KEY;
    authDomain = process.env.REACT_APP_AUTH_DOMAIN;
    databaseURL = process.env.REACT_APP_DATABASE_URL;
    projectId = process.env.REACT_APP_PROJECT_ID;
    storageBucket = process.env.REACT_APP_STORAGE_BUCKET;
    messagingSenderId = process.env.REACT_APP_MESSAGING_SENDER_ID;
    appId = process.env.REACT_APP_APP_ID;
} else {
    apiKey = process.env.REACT_APP_STAGE_API_KEY;
    authDomain = process.env.REACT_APP_STAGE_AUTH_DOMAIN;
    databaseURL = process.env.REACT_APP_STAGE_DATABASE_URL;
    projectId = process.env.REACT_APP_STAGE_PROJECT_ID;
    storageBucket = process.env.REACT_APP_STAGE_STORAGE_BUCKET;
    messagingSenderId = process.env.REACT_APP_STAGE_MESSAGING_SENDER_ID;
    appId = process.env.REACT_APP_STAGE_APP_ID;
}

const firebaseApp = firebase.initializeApp({
    apiKey: apiKey,
    authDomain: authDomain,
    databaseURL: databaseURL,
    projectId: projectId,
    storageBucket: storageBucket,
    messagingSenderId: messagingSenderId,
    appId: appId
});

const db = firebaseApp.firestore();

const incrementCounter = firebase.firestore.FieldValue.increment(1);
const decrementCounter = firebase.firestore.FieldValue.increment(-1);
export { db, incrementCounter, decrementCounter };
