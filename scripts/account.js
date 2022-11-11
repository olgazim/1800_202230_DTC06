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
      console.log("user document successfully updated")
    }
  )
  document.getElementById("saveBtn").setAttribute("hidden", true);
  document.getElementById("editBtn").removeAttribute("hidden")
}


// function addProfile() {
//   firebase.auth().onAuthStateChanged(user => {
//     if (user) {
//       // const profilesRef = db.collection("users").document("profiles");
//       currentUser = db.collection("users").doc(user.uid).collection("profiles")
//       const profile = document.getElementById("profileName").value;

//       currentUser.get().then(profileDoc => {
//         var profileName = profileDoc.data().name

//         if (profileName != null) {
//           document.getElementById("profileName").value = profileName;
//         }

//       })

//         .then(docRef => {
//           console.log('New profile name has been added', docRef.id)
//         })
  
//         .catch(error => {
//           console.error("Error adding profile name: ", error)
//         })
//     } else {
//       console.log("No user is signed in")
//     }
//   });
// }


// R E G U L A R COLLECTION - THIS WORKS
// function addProfile() {
//   // const profilesRef = db.collection("users").document("profiles");
//   const profile = document.getElementById("profileName").value;

//   db.collection("profiles").add({
//     name: profile
//   })

//     .then(docRef => {
//     console.log('New profile name has been added')
//     })

//     .catch(error => {
//     console.error("Error adding profile name: ", error)
//   })
  
// }

// S U B C O L L E C T I O N - THIS DOES NOT WORK, ERROR IS useruid is not defined
// function addProfile() {
//   // const profilesRef = db.collection("users").document("profiles");
//   const profile = document.getElementById("profileName").value;

//   db.collection("users").doc(user.uid).collection("profiles").add({
//     name: profile
//   })

//     .then(docRef => {
//     console.log('New profile name has been added')
//     })

//     .catch(error => {
//     console.error("Error adding profile name: ", error)
//   })
  
// }

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