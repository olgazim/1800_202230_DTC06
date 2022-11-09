import { initializeApp } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-firestore.js";

//ToDo: update to use firebaseConfig from firebase.js
  const firebaseConfig = {
    apiKey: "AIzaSyDDJ9Pa2j2d6HWpUyv87_1rGE3yugiOO48",
    authDomain: "meditrack-1a12b.firebaseapp.com",
    projectId: "meditrack-1a12b",
    storageBucket: "meditrack-1a12b.appspot.com",
    messagingSenderId: "118473868125",
    appId: "1:118473868125:web:ce8177952102a88e029eb4"
  };

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);