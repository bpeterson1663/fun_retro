import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_DATABASE_URL,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID
});

const db = firebaseApp.firestore();

const incrementCounter = firebase.firestore.FieldValue.increment(1);
const decrementCounter = firebase.firestore.FieldValue.increment(-1);
export { db, incrementCounter, decrementCounter };
