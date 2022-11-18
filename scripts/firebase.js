"use strict";

const { auth, initializeApp } = window.firebase;

//----------------------------------------
//  Firebase configuration
//----------------------------------------
const firebaseConfig = {
  apiKey: "AIzaSyDDJ9Pa2j2d6HWpUyv87_1rGE3yugiOO48",
  authDomain: "meditrack-1a12b.firebaseapp.com",
  projectId: "meditrack-1a12b",
  storageBucket: "meditrack-1a12b.appspot.com",
  messagingSenderId: "118473868125",
  appId: "1:118473868125:web:ce8177952102a88e029eb4",
};

//--------------------------------------------
// initialize the Firebase app
// initialize Firestore database
//--------------------------------------------
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const authClient = auth();
window.authClient = authClient;
// var storage = firebase.storage();
