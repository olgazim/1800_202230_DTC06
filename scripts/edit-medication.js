let currentUserId;
let docId;

//Checks if a user is logged in
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

//Displays filled form of a medication's description based on the ID of the medication and user
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
      document.getElementById("medExpDate").value = doc.expiration;
    });
}

//updates the specified medication
function updateMed(e) {
  //prevents the default action of the form
  e.preventDefault();

  //using the value of each html element ->
  const name = document.getElementById("medName").value;
  const dosage = document.getElementById("medDosage").value;
  const descr = document.getElementById("medDescr").value;
  const expiration = document.getElementById("medExpDate").value;

  //the firestore medication collection is then updated
  db.collection("users")
    .doc(currentUserId)
    .collection("medications")
    .doc(docId)
    .update({
      name: name,
      dosage: dosage,
      description: descr,
      expiration: expiration,
    })
    //once medication successfully updates user is automatically brought back to their pills list screen
    .then(() => {
      console.log("Document successfully written!");
      window.location.href = "pills-list.html";
    })
    .catch((error) => {
      console.error("Error writing document: ", error);
    });
}

//Providing handler to submit event of the form
$("form#editmed").submit(updateMed);

getLoggedUser();
