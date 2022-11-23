let currentUserId;

const inputDate = document.getElementById('StartDate');
const inputTime = document.getElementById('StartTime');
const inputOption = document.getElementById('medication-options');

inputDate.addEventListener('change', onDateChange);
inputTime.addEventListener('change', onTimeChange);

function onDateChange(event) {
  console.log('DATE:', event.target.value, inputOption.value);
}

function onTimeChange(event) {
  console.log('TIME:', event.target.value);
}

function hideCheckbox() {
  $('#checkboxDays').hide();
}

function showCheckbox() {
  $('#checkboxDays').show();
}

function setup() {
  var checkbox = document.getElementById('checkboxDays');
  checkbox.style.display = 'none';

  $('#form-check-input-selectDays').on('click', showCheckbox);
  $('#form-check-input-everyDay').on('click', hideCheckbox);
}

function getLoggedUser() {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      console.log(
        `user logged in with email [${user.email}], id [${user.uid}]`,
      );
      currentUserId = user.uid;
      fillMedicationList(currentUserId);
    } else {
      alert('no logged in user');
    }
  });
}

function setUrlParam(param, value) {
  const searchParams = new URLSearchParams(window.location.search);

  searchParams.set(param, value);

  const newRelativePathQuery = window.location.pathname + '?' + searchParams.toString();

  history.pushState(null, '', newRelativePathQuery);
}

function getUrlParam(param) {
  const searchParams = new URLSearchParams(window.location.search);

  return searchParams.get(param);
}

function fillMedicationList(userId) {
  db.collection('users')
    .doc(userId)
    .collection('medications')
    .get()
    .then((allMeds) => {
      const medicationId = getUrlParam('medicationId');
      console.log('MedicationId', medicationId);
      $('#medication-options')
        // .append(`
        //   <option disabled selected value> -- select medicate -- </option>
        // `)
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

function validateNotificationParams(params) {
  const { dateTime, dosage } = params;

}

function addNotification() {
  console.log("add notification");
  const date = inputDate.value;
  const time = inputTime.value;
  const dateTime = firebase.firestore.Timestamp.fromDate(new Date(`${date}T${time}`));
  const medicationId = inputOption.value;
  const notificationId = getUrlParam('notificationId');

//   if (notificationId) {
//     // updateFlow
//   } else {
    // add flow
    db.collection("users")
      .doc(currentUserId)
      .collection("medications")
      .doc(medicationId)
      .collection("notifications")
      .add({
        dateTime,
        dosage: '123mg',
        profile: '',
      })
      .then((response) => {
          console.log('Added:', response);
          window.alert("Notification is set!");
      window.location.assign("notification-scr.html");
      })
      .catch((error) => {
        console.error("Error: ", error);
      });
//   }

}

getLoggedUser();

$(document).ready(setup);
