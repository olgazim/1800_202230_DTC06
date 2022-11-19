
'use strict';

var currentUser;

//----------------------------------------
//  Get DOM nodes
//----------------------------------------
const buttonSignOut = document.getElementById('sign-out');
const buttonSave = document.getElementById('saveBtn');
const buttonEdit = document.getElementById('editBtn');
const avatarContainer = document.getElementById('avatar-image');
const inputImage = document.getElementById('avatar_upload');
const inputName = document.getElementById('userName');
const inputEmail = document.getElementById('email');
const inputProfile = document.getElementById('profileName');
const listProfile = document.getElementById('profile-list');
const fieldSetUserInfo = document.getElementById('userInfo');
const fieldSetUserProfiles = document.getElementById('user-profiles');

// Firebase actions

const signOut = () => {
  return authClient.signOut();
};



//----------------------------------------
//  Helpers
//----------------------------------------


const enterEditMode = () => {
  fieldSetUserInfo.disabled = false;
  fieldSetUserProfiles.disabled = false;

  buttonSave.removeAttribute('hidden');
  buttonEdit.setAttribute('hidden', '');
};

const exitEditMode = () => {
  fieldSetUserInfo.disabled = true;
  fieldSetUserProfiles.disabled = true;

  buttonSave.setAttribute('hidden', '');
  buttonEdit.removeAttribute('hidden');
};



//----------------------------------------
//  Event listeners
//----------------------------------------
const onSignOut = async () => {
  if (confirm('Do you want to sign out of MediTrack')) {
    try {
      const response = await signOut();

      console.log('Signed out:', response);
    } catch (error) {
      console.log('Sign out error:', error);
    }
  }
};



//----------------------------------------
//  Add event listeners
//----------------------------------------
buttonSignOut.addEventListener('click', onSignOut, false);
document.addEventListener('DOMContentLoaded', populateInfo);

function populateInfo() {
  firebase.auth().onAuthStateChanged(user => {
    //Check if user is signed in
    if (user) {
      currentUser = db.collection('users').doc(user.uid);
      currentUser.get().then(userDoc => {
        const userName = userDoc.data().name;
        const email = userDoc.data().email;
        const profiles = userDoc.data().profiles;

        console.log('!!!!', userDoc.data());
        // if the data fields are not empty , then enrich form with the data
        if (userName != null) {
          inputName.value = userName;
        }
        if (email != null) {
          inputEmail.value = email;
        }
        if (avatar) {
          avatarContainer.src = avatar;
        }

        updateProfileList(profiles);

        console.log('[populateInfo] user, email:', userName, email);
      });
    } else {
      // User is not signed in
      console.log('No user is signed in');

      window.location.href = 'sign-in-scr.html';
    }
  });
}

function editUserInfo() {
  // hide "edit" button by showing "save" button
  enterEditMode();
}

async function saveUserInfo() {
  // get current values
  let currentEmail;
  let currentName;

  // await for current values
  await currentUser
    .get()
    .then((doc) => {
      currentEmail = doc.data().email;
      currentName = doc.data().name;

    })
    .catch((error) => {
      console.log('[saveUserInfo] error getting current email', error);
    });

  // get updated values from html nodes
  const name = inputName.value;
  const email = inputEmail.value;

  // create array for multiple requests
  const promises = [];

  // update name if changed
  if (currentName !== name) {
    const updateUserCollectionNamePromise = currentUser.update({ name });

    promises.push(updateUserCollectionNamePromise);
  }

  // update email if changed
  if (currentEmail !== email) {
    // update user collection email
    const updateUserCollectionEmailPromise = currentUser.update({ email });

    promises.push(updateUserCollectionEmailPromise);

    // update auth data
    const user = window.authClient.currentUser;
    const updateEmailPromise = user.updateEmail(email);

    promises.push(updateEmailPromise);
  }

  // perform requests
  if (promises.length) {
    Promise.all(promises)
      .then((response) => {
        // the response is Array<undefined>
        console.log('[saveUserInfo] success:', response);
      })
      .catch((errors) => {
        // Array<Error>
        console.log('[saveUserInfo] error:', errors);

        // reset current state
        inputEmail.value = currentEmail;
        inputName.value = currentName;
      });
  } else {
    console.log('[saveUserInfo] nothing to update');
  }

  // hide "save" button by showing "edit" button
  exitEditMode();
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