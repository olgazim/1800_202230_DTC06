'use strict';

var currentUser

//----------------------------------------
//  Get DOM nodes
//----------------------------------------
const buttonSignOut = document.getElementById('sign-out');

// Firebase actions

const signOut = () => {
  return authClient.signOut();
};


//----------------------------------------
//  Event listeners
//----------------------------------------
const onSignOut = async () => {
  try {
    const response = await signOut();

    console.log('Signed out:', response);
  } catch (error) {
    console.log('Sign out error:', error);
  } finally {
    window.alert('Do you want to sign out of MediTrack');
    window.location.href = "../onboarding.html";
  }
};


//----------------------------------------
//  Add event listeners
//----------------------------------------
buttonSignOut.addEventListener('click', onSignOut, false);



function populateInfo() {
  firebase.auth().onAuthStateChanged(user => {
    //Check if user is signed in
    if (user) {
      currentUser = db.collection("users").doc(user.uid)
      currentUser.get().then(userDoc => {
        var userName = userDoc.data().name;
        var email = userDoc.data().email;
        var profiles = userDoc.data().profiles;

        // if the data fields are not empty , then enrich form with the data
        if (userName != null) {
          document.getElementById("userName").value = userName;
        }
        if (email != null) {
          document.getElementById("email").value = email;
        }

      console.log(userName, email)
      })
    } else {
      // User is not signed in
      console.log("No user is signed in")
    }
  });
}

populateInfo();

function editUserInfo() {
  document.getElementById("userInfo").disabled = false;
  // change buttons
  document.getElementById("saveBtn").removeAttribute("hidden");
  document.getElementById("editBtn").setAttribute("hidden", true);
}

function saveUserInfo() {
  var userName = document.getElementById("userName").value;
  var email = document.getElementById("email").value;
  currentUser.update({
    name: userName,
    email: email
  }).then(
    () => {
      console.log("user document successfully updated");
    }
  )
  document.getElementById("saveBtn").setAttribute("hidden", true);
  document.getElementById("editBtn").removeAttribute("hidden")
}



function addProfile() {
  const profile = document.getElementById("profileName").value;

  currentUser.collection("profiles").add({
    name: profile
  })

    .then(docRef => {
    console.log('New profile name has been added')
    })

    .catch(error => {
    console.error("Error adding profile name: ", error)
  })
  
}