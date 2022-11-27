'use strict';

var currentUser;
// var currentUserAuth = authClient.user

//----------------------------------------
//  Get DOM nodes
//----------------------------------------
const buttonSignOut = document.getElementById('sign-out');
const buttonSave = document.getElementById('saveBtn');
const buttonEdit = document.getElementById('editBtn');
const buttonAddProfile = document.getElementById('addProfile');
const avatarContainer = document.getElementById('avatar-image');
const inputImage = document.getElementById('avatar_upload');
const inputName = document.getElementById('userName');
const inputEmail = document.getElementById('email');
const inputProfile = document.getElementById('profileName');
const listProfile = document.getElementById('profile-list');
const fieldSetUserInfo = document.getElementById('userInfo');
const fieldSetUserProfiles = document.getElementById('user-profiles');
const avatarEditLabel = document.getElementById('avatar-edit-label');

// Firebase actions

const signOut = () => {
  return authClient.signOut();
};

const removeProfile = (profileName) => () => {
  if (profileName) {
    currentUser.update({
      profiles: firebase.firestore.FieldValue.arrayRemove(profileName),
    })
      .then((response) => {
        console.log(`[removeProfile] success: profile "${profileName}" has been added`, response);
        // clear input state
        inputProfile.value = '';
      })
      .catch((error) => {
        console.error('[removeProfile] error:', error);
      })
      .finally(() => {
        // update profile list
        populateInfo();
      });
  }
};

//----------------------------------------
//  Helpers
//----------------------------------------

const convertToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;

    reader.readAsDataURL(file);
  });
};

const enterEditMode = () => {
  fieldSetUserInfo.disabled = false;
  fieldSetUserProfiles.disabled = false;

  avatarEditLabel.classList.remove('avatar-label-hide');
  buttonSave.removeAttribute('hidden');
  buttonEdit.setAttribute('hidden', '');
  buttonAddProfile.removeAttribute('hidden');
};

const exitEditMode = () => {
  fieldSetUserInfo.disabled = true;
  fieldSetUserProfiles.disabled = true;

  avatarEditLabel.classList.add('avatar-label-hide');
  buttonSave.setAttribute('hidden', '');
  buttonEdit.removeAttribute('hidden');
  buttonAddProfile.setAttribute('hidden', '');
};

const updateProfileList = (profileList) => {
  listProfile.innerHTML = null;

  if (Array.isArray(profileList)) {
    profileList.forEach((item) => {
      const listElement = document.createElement('li');
      const textSpan = document.createElement('span');
      const button = document.createElement('button');

      listElement.classList.add('profile-list-item');
      button.classList.add('remove-profile-button');
      button.innerText = 'X';
      button.addEventListener('click', removeProfile(item), false);

      textSpan.innerText = item;
      listElement.append(textSpan, button);
      listProfile.appendChild(listElement);
    });
  }
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

const onImageUpdate = async (event) => {
  try {
    const file = event.target.files[0];
    const base64String = await convertToBase64(file);
    const user = window.authClient.currentUser;

    if (user) {
      db
        .collection('users')
        .doc(user.uid)
        .set(
          { ['account-photo']: base64String },
          { merge: true },
        )
        .then((response) => {
          // the response is undefined
          console.log('[onImageUpdate] success:', response);
        })
        .catch((error) => {
          console.log('[onImageUpdate] error:', error);
        })
        .finally(() => {
          // update form
          populateInfo();
        });
    }
  } catch (error) {
    console.log('[onImageUpdate] error:', error);
  } finally {
    // hide "save" button by showing "edit" button
    exitEditMode();
  }
};

//----------------------------------------
//  Add event listeners
//----------------------------------------
buttonSignOut.addEventListener('click', onSignOut, false);
inputImage.addEventListener('change', onImageUpdate, false);
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
        const avatar = userDoc.data()['account-photo'];

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
  if (inputProfile.value) {
    currentUser.update({
      profiles: firebase.firestore.FieldValue.arrayUnion(inputProfile.value),
    })
      .then((response) => {
        console.log('[addProfile] success: New profile name has been added', response);
        // clear input state
        inputProfile.value = '';
      })
      .catch((error) => {
        console.error('[addProfile] error:', error);
      })
      .finally(() => {
        // update profile list
        populateInfo();
      });
  }
}

db
  .collection('users')
  .doc(user.uid)
.then()