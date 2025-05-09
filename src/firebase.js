// Import the functions you need from the SDKs you need
// Import Firebase Modules
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDv5s5925wrogu6dCMJfLGrxSW1kWmzxaM",
  authDomain: "pharmacy-web-3feb3.firebaseapp.com",
  projectId: "pharmacy-web-3feb3",
  storageBucket: "pharmacy-web-3feb3.appspot.com",
  messagingSenderId: "86884750151",
  appId: "1:86884750151:web:91845ea76a091c0110b262",
  measurementId: "G-JD3M41PTFL",
};

const mobilefirebaseConfig = {
  apiKey: "AIzaSyD2oAzdp6A9pv4ln2pmKopujrxbKA10PQ4",
  authDomain: "pharmacy-cover-order-system-db.firebaseapp.com",
  projectId: "pharmacy-cover-order-system-db",
  storageBucket: "pharmacy-cover-order-system-db.firebasestorage.app",
  messagingSenderId: "75101508953",
  appId: "1:75101508953:web:35931db570a9668450a848",
  measurementId: "G-E4K4H7VYQR",
};

//Initialize Firebase App and Services

const app = initializeApp(firebaseConfig);
const mobileApp = initializeApp(mobilefirebaseConfig, "mobileApp");
//Initializes Firebase with the configuration object.

const analytics = getAnalytics(app);
// Initializes Analytics, enabling you to track app usage.

const auth = getAuth(app);
// Initializes the authentication service.

const db = getFirestore(app);
const mobileDb = getFirestore(mobileApp);
//Initializes Firestore, allowing the app to interact with a NoSQL database for storing and retrieving data.

export { auth, db, mobileDb }; //Export Auth and Firestore
