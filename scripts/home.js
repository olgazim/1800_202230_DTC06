let currentUserId;
let docId;

// authenticate user
function getLoggedUser() {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      console.log(
        `user logged in with email [${user.email}], id [${user.uid}]`
      );
      currentUserId = user.uid;
      docId = getDocIdFromParams();
      displayMedicationDescription(currentUserId, docId);
    } else {
      alert("no logged in user");
    }
  });
}

function getDocIdFromParams() {
  const urlSearchParams = new URLSearchParams(window.location.search);
  const params = Object.fromEntries(urlSearchParams.entries());
  return params.docId;
}

// display medication descriptions
function displayMedicationDescription(userId, medId) {
  db.collection("users")
    .doc(userId)
    .collection("medications")
    .doc(medId)
    .get()
    .then((aMedication) => {
      const doc = aMedication.data();
      document.getElementById("medName").value = doc.name;
      document.getElementById("medDosage").value = doc.dosage;
      document.getElementById("medDescr").value = doc.description;
      document.getElementById("medExpDate").value = doc.expiration;
    });
}

getLoggedUser();
