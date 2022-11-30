// configs
const TIME_SLOT_LIMIT = 5;

// state
let currentUserId;
const selectedDaysSet = new Set();
const timeSlots = [];

const timeWrapper = document.getElementById('time-wrapper');
const inputOption = document.getElementById('medication-options');
const inputDosage = document.getElementById('medication-dosage');
const inputStartDate = document.getElementById('notification-start-date');
const inputEndDate = document.getElementById('notification-end-date');
const inputSelectedDays = document.getElementById('radio-frequency-custom');
const inputEveryDay = document.getElementById('radio-frequency-every-day');
const buttonAddTime = document.getElementById('add-time');
const daysCheckboxes = document.getElementById('days-checkboxes');

buttonAddTime.addEventListener('click', addTime);
inputSelectedDays.addEventListener('click', showCheckboxes);
inputEveryDay.addEventListener('click', hideCheckboxes);

async function getLoggedUser() {
  await firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      console.log(`Logged in with email: ${user.email}, id: ${user.uid}`);

      currentUserId = user.uid;
      const inputTimeRef = document.getElementById('notification-time-0');
      timeSlots.push(inputTimeRef);

      fillMedicationList(currentUserId);
    } else {
      window.alert('Forbidden. Redirecting to login page...');
      window.location.href = 'sign_in_scr.html';
    }
  });
}

function toggleDay(target) {
  if (target.checked) {
    selectedDaysSet.add(Number(target.value));
  } else {
    selectedDaysSet.delete(target.value);
  }
}

function deleteTime(ref) {
  const input = ref.querySelector('input');
  const index = timeSlots.findIndex((item) => item === input);

  timeSlots.splice(index, 1);
  $(ref).remove();

  if (timeSlots.length < TIME_SLOT_LIMIT) {
    $(buttonAddTime).show();
  }
}

function addTime() {
  if (timeSlots >= TIME_SLOT_LIMIT) {
    return;
  }

  const id = Math.random();

  $(timeWrapper).append(`
    <div class="field-wrapper mb-2" id="additional-time-${id}">
      <label class="form-label" for="notification-time-${id}">Time:</label>
      <div class="d-flex">
        <input class="form-control" type="time" id="notification-time-${id}" name="notification-time-${id}" required/>
        <button class="btn btn-light delete-time-button" id="delete-time-btn-${id}">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="#406882"
            class="bi bi-trash3 delete-time-svg"
            viewBox="0 0 16 16"
          >
            <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"/>
          </svg>
        </button>
      </div>
               
    </div>
  `);

  const timeWrapperRef = document.getElementById(`additional-time-${id}`);
  const inputTimeRef = document.getElementById(`notification-time-${id}`);

  timeSlots.push(inputTimeRef);

  const deleteButton = document.getElementById(`delete-time-btn-${id}`);
  deleteButton.addEventListener('click', () => deleteTime(timeWrapperRef));

  if (timeSlots.length >= TIME_SLOT_LIMIT) {
    $(buttonAddTime).hide();
  }
}

function hideCheckboxes() {
  $(daysCheckboxes).hide();
}

function showCheckboxes() {
  $(daysCheckboxes).show();
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

function getDatesInRange(startDate, endDate, limitedDays) {
  const date = new Date(startDate.getTime());

  const dates = [];

  while (date <= endDate) {
    const day = date.getDay();
    const isDayAllowed = limitedDays ? limitedDays.has(day) : true;

    if (isDayAllowed) {
      dates.push(new Date(date));
    }

    date.setDate(date.getDate() + 1);
  }

  return dates;
}

function fillMedicationList(userId) {
  db.collection('users')
    .doc(userId)
    .collection('medications')
    .get()
    .then((allMeds) => {
      const medicationId = getUrlParam('medicationId');

      $('#medication-options').change((event) => {
        setUrlParam('medicationId', event.target.value);
      });

      allMeds.forEach((docRef) => {
        const doc = docRef.data();

        $('#medication-options').append(`
          <option ${medicationId === docRef.id ? 'selected' : ''} value="${
          docRef.id
        }">${doc.name}</option>
        `);
      });
    });
}

async function submitNotification() {
  const medicationId = inputOption.value;
  const dosage = inputDosage.value;
  const startDate = inputStartDate.value;
  const endDate = inputEndDate.value;
  const time = timeSlots
    .map((item) => item.value)
    .filter(Boolean);

  if (!medicationId || !dosage || !startDate || !endDate || !time.length) {
    const message = `Validation failed. Missing: ${!medicationId ? '\n  - Medication' : ''}${!dosage ? '\n  - Dosage' : ''}${!startDate ? '\n  - Start date' : ''}${!endDate ? '\n  - End Date' : ''}${!time.length ? '\n  - Time' : ''}`;

    return window.alert(message);
  }

  const limitedDays = inputEveryDay.checked ? null : selectedDaysSet;
  const dates = getDatesInRange(new Date(startDate), new Date(endDate), limitedDays);

  if (!dates.length) {
    return window.alert('Select days.');
  }

  const batch = db.batch();

  dates.forEach((date) => {
    const dateString = date.toISOString().split('T')[0];

    time.forEach((item) => {
      const dateTime = firebase
        .firestore
        .Timestamp
        .fromDate(new Date(`${dateString}T${item}`));

      const notificationsCollection = db
        .collection('users')
        .doc(currentUserId)
        .collection('medications')
        .doc(medicationId)
        .collection('notifications')
        .doc();

      batch.set(notificationsCollection, {
        dateTime,
        dosage,
        profile: '',
      });
    });
  });

  try {
    await batch.commit();

    window.alert(`${dates.length === 1 ? 'Notification was' : 'Notifications were'} successfully set.`);
    window.location = 'notification-scr.html';
  } catch (error) {
    console.error('Error:', error);
    window.alert(`Error: ${error?.message}`);
  }
}

$(document).ready(getLoggedUser);
