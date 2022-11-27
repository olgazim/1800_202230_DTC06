let currentUserId;

const inputDate = document.getElementById("StartDate");
const inputTime = document.getElementById("StartTime");
const inputOption = document.getElementById("medication-options");
const inputDosage = document.getElementById('medication-dosage');
const buttonSubmit = document.getElementById('add-notification');

function hideCheckbox() {
  $("#checkboxDays").hide();
}

function showCheckbox() {
  $("#checkboxDays").show();
}

function setup() {
  var checkbox = document.getElementById("checkboxDays");
  checkbox.style.display = "none";

  $("#form-check-input-selectDays").on("click", showCheckbox);
  $("#form-check-input-everyDay").on("click", hideCheckbox);
  
  if (getUrlParam('notificationId')) {
    // edit flow
    buttonSubmit.innerText = 'Edit notification';

    if (currentUserId) {
      fillValues(currentUserId);
    }
  } else {
    // add flow
    inputOption.disabled = false;
  }
}

function getLoggedUser() {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      console.log(
        `user logged in with email [${user.email}], id [${user.uid}]`
      );
      currentUserId = user.uid;
      fillMedicationList(currentUserId);
      fillValues(currentUserId);
    } else {
      alert("no logged in user");
    }
  });
}

function setUrlParam(param, value) {
  const searchParams = new URLSearchParams(window.location.search);

  searchParams.set(param, value);

  const newRelativePathQuery =
    window.location.pathname + "?" + searchParams.toString();

  history.pushState(null, "", newRelativePathQuery);
}

function getUrlParam(param) {
  const searchParams = new URLSearchParams(window.location.search);

  return searchParams.get(param);
}

function fillValues(userId) {
  const medicationId = getUrlParam('medicationId');
  const notificationId = getUrlParam('notificationId');

  if (medicationId && notificationId) {
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

function fillMedicationList(userId) {
  db
    .collection('users')
    .doc(userId)
    .collection('medications')
    .get()
    .then((allMeds) => {
      const medicationId = getUrlParam('medicationId');

      $('#medication-options')
        .change((event) => {
          setUrlParam('medicationId', event.target.value);
        });

      allMeds.forEach((docRef) => {
        const doc = docRef.data();

        $('#medication-options').append(`
          <option ${medicationId === docRef.id ? 'selected' : ''} value="${docRef.id}">${doc.name}</option>
        `);
      });
    });
}

function submitNotification() {
  const date = inputDate.value;
  const time = inputTime.value;
  const dosage = inputDosage.value;
  const dateTime = firebase.firestore.Timestamp.fromDate(new Date(`${date}T${time}`));
  const medicationId = inputOption.value;
  const notificationId = getUrlParam('notificationId');

  if (!date || !time || !dosage || !medicationId) {
    return;
  }

  const payload = {
    dateTime,
    dosage,
    profile: '',
  };
  let result;

  // Get notifications collection
  const notificationsCollection = db
    .collection('users')
    .doc(currentUserId)
    .collection('medications')
    .doc(medicationId)
    .collection('notifications');

  if (notificationId) {
    // updateFlow
    result = notificationsCollection
      .doc(notificationId)
      .set(payload);
  } else {
    // add flow
    result = notificationsCollection
      .add(payload);
  }

  result
    .then((response) => {
      console.log('Success:', response);
      window.alert(
          "Notification is set"
      );
      window.location = 'notification-scr.html';
      // if (confirm('Set another notification?')) {
      //   inputDate.value = '';
      //   inputDosage.value = '';
      //   inputTime.value = '';
      // } else {
      //   window.location = 'notification-scr.html';
      // }
    })
    .catch((error) => {
      console.error('Error: ', error);
    });
}

getLoggedUser();

$("#setAnotherButton").on("click", function () {
  $("#setAnotherReminder").append(
    `
    <div id="pillsListTitle">
    <div>
      <label for="medication-options">Select medication:</label>
      <select id="medication-options">
        <option disabled selected value> -- select medicate -- </option>
      </select>
    </div>
    `
  );
});

$(document).ready(setup);
