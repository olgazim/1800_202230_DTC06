import {
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
} from "https://www.gstatic.com/firebasejs/9.13.0/firebase-firestore.js";
import { collection } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-firestore.js";
import { db } from "./firebase.js";

const collectionName = "medications";

export async function getMedicationList() {
  const medicationsCollection = collection(db, collectionName);
  const querySnapshot = await getDocs(medicationsCollection);

  return querySnapshot.docs;
}

