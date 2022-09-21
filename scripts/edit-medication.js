let currentUserId;
let docId;

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

function displayMedicationDescription(userId, medId) {
  //   console.log("hello");
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
    });
}

function updateMed(e) {
  e.preventDefault();

  const name = document.getElementById("medName").value;
  const dosage = document.getElementById("medDosage").value;
  const descr = document.getElementById("medDescr").value;

  db.collection("users")
    .doc(currentUserId)
    .collection("medications")
    .doc(docId)
    .update({
      name: name,
      dosage: dosage,
      description: descr,
    })
    .then(() => {
      console.log("Document successfully written!");
      window.location.href = "pills-list.html";
    })
    .catch((error) => {
      console.error("Error writing document: ", error);
    });
}

$("form#editmed").submit(updateMed);

getLoggedUser();
