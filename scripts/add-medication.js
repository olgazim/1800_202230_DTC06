let userId;

function getLoggedUser() {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      console.log(
        `user logged in with email [${user.email}], id [${user.uid}]`
      );
      userId = user.uid;
    } else {
      alert("no logged in user");
    }
  });
}

$("form#newmed").submit(function (e) {
  e.preventDefault();

  const name = document.getElementById("medName").value;
  const dosage = document.getElementById("medDosage").value;
  const descr = document.getElementById("medDescr").value;

  db.collection("users")
    .doc(userId)
    .collection("medications")
    .add({
      name: name,
      dosage: dosage,
      description: descr,
    })
    .then((docRef) => {
      console.log(`New medication document added with ID: [${docRef.id}]`);
      window.location.assign("pills_list.html");
      window.alert("New medication added to your list!");
    })
    .catch((error) => {
      console.error("Error adding document: ", error);
    });
});

getLoggedUser();
