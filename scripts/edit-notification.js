let currentUserId;

const inputDate = document.getElementById('notification-date');
const inputTime = document.getElementById('notification-time');
const inputOption = document.getElementById('medication-options');
const inputDosage = document.getElementById('medication-dosage');

async function getLoggedUser() {
  await firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      console.log(`Logged in with email: ${user.email}, id: ${user.uid}`);

      currentUserId = user.uid;

      setup();
    } else {
      window.alert('Forbidden. Redirecting to login page...');
      window.location.href = 'sign_in_scr.html';
    }
  });
}

function getUrlParam(param) {
  const searchParams = new URLSearchParams(window.location.search);

  return searchParams.get(param);
}

function fillMedicationList(userId, medicationId) {
  db
    .collection('users')
    .doc(userId)
    .collection('medications')
    .get()
    .then((medicationsCollection) => {
      medicationsCollection.forEach((docRef) => {
        const {name} = docRef.data();
        const selected = medicationId === docRef.id ? 'selected' : '';

        $('#medication-options').append(`
          <option ${selected} value="${docRef.id}">${name}</option>
        `);
      });
    });
}

function fillValues(userId, medicationId, notificationId) {
  if (!userId || !medicationId || !notificationId) {
    window.alert('Error getting notification data.');
  } else {
    db
      .collection('users')
      .doc(userId)
      .collection('medications')
      .doc(medicationId)
      .collection('notifications')
      .doc(notificationId)
      .get()
        .then((response) => {
        const data = response.data();
        const date = data.dateTime.toDate();
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');

        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');

        inputDosage.value = data.dosage;
        inputDate.value = `${year}-${month}-${day}`;
        inputTime.value = `${hours}:${minutes}`;
      })
      .catch((error) => {
        console.log('[fillValues] error:', error);
      });
  }
}

function setup() {
  const medicationId = getUrlParam('medicationId');
  const notificationId = getUrlParam('notificationId');

  if (!medicationId || !notificationId || !currentUserId) {
    window.alert('Not enough data to edit notification. Redirecting back...');
    // return window.history.back();
  }

  fillMedicationList(currentUserId, medicationId);
  fillValues(currentUserId, medicationId, notificationId);
}

function editNotification() {
  const date = inputDate.value;
  const time = inputTime.value;
  const dosage = inputDosage.value;
  const dateTime = firebase.firestore.Timestamp.fromDate(new Date(`${date}T${time}`));
  const medicationId = inputOption.value;
  const notificationId = getUrlParam('notificationId');

  if (!date || !time || !dosage || !medicationId || !currentUserId) {
    return;
  }

  const payload = {
    dateTime,
    dosage,
    profile: '',
  };

  db
    .collection('users')
    .doc(currentUserId)
    .collection('medications')
    .doc(medicationId)
    .collection('notifications')
    .doc(notificationId)
    .set(payload)
    .then(() => {
      window.alert('Notification updated successfully.');
      window.location = 'notification-scr.html';
    })
    .catch((error) => {
      console.error('Error: ', error);
    });
}

$(document).ready(getLoggedUser);
