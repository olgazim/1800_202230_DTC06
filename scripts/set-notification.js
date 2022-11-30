// configs
const TIME_SLOT_LIMIT = 5;

// state
let currentUserId;
const selectedDaysSet = new Set();
const timeSlots = [];

// DOM elements
const timeWrapper = document.getElementById("time-wrapper");
const dropdownOptions = document.getElementById("medication-options");
const inputDosage = document.getElementById("medication-dosage");
const inputStartDate = document.getElementById("notification-start-date");
const inputEndDate = document.getElementById("notification-end-date");
const inputSelectedDays = document.getElementById("radio-frequency-custom");
const inputEveryDay = document.getElementById("radio-frequency-every-day");
const buttonAddTime = document.getElementById("add-time");
const buttonDropDown = document.getElementById("medication-dropdown");
const daysCheckboxes = document.getElementById("days-checkboxes");
const dropDownToggle = document.querySelectorAll(".dropdown-toggle");

dropdownOptions.addEventListener("click", setMedication);
buttonAddTime.addEventListener("click", addTime);
inputSelectedDays.addEventListener("click", showCheckboxes);
inputEveryDay.addEventListener("click", hideCheckboxes);

// get the current logged-in user info
async function getLoggedUser() {
  await firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      console.log(`Logged in with email: ${user.email}, id: ${user.uid}`);

      currentUserId = user.uid;
      const inputTimeRef = document.getElementById("notification-time-0");
      timeSlots.push(inputTimeRef);

      $(dropDownToggle).dropdown();

      fillMedicationList(currentUserId);
    } else {
      window.alert("Forbidden. Redirecting to login page...");
      window.location.href = "sign_in_scr.html";
    }
  });
}

// toggle add and delete
function toggleDay(target) {
  if (target.checked) {
    selectedDaysSet.add(Number(target.value));
  } else {
    selectedDaysSet.delete(target.value);
  }
}

// delete time that the user previously added
function deleteTime(ref) {
  const input = ref.querySelector("input");
  const index = timeSlots.findIndex((item) => item === input);

  timeSlots.splice(index, 1);
  $(ref).remove();

  if (timeSlots.length < TIME_SLOT_LIMIT) {
    $(buttonAddTime).show();
  }
}

// add time that the user selects to the notification
function addTime() {
  // do not add more than 5 tiem slots
  if (timeSlots >= TIME_SLOT_LIMIT) {
    return;
  }

  // get random value to use as unique id
  const id = Math.random();

  // function to allow users to set a time to their notification and add it to the medication card
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

  // DOM elements for time
  const timeWrapperRef = document.getElementById(`additional-time-${id}`);
  const inputTimeRef = document.getElementById(`notification-time-${id}`);

  timeSlots.push(inputTimeRef);

  const deleteButton = document.getElementById(`delete-time-btn-${id}`);
  deleteButton.addEventListener("click", () => deleteTime(timeWrapperRef));

  // hide "add time" button if limit is reached
  if (timeSlots.length >= TIME_SLOT_LIMIT) {
    $(buttonAddTime).hide();
  }
}

// function to HIDE the days of the week checkboxes when the user selects "every day"
function hideCheckboxes() {
  $(daysCheckboxes).hide();
}

// function to SHOW the days of the week checkboxes when the user selects "select day"
function showCheckboxes() {
  $(daysCheckboxes).show();
}

// set the params of the current page
function setUrlParam(param, value) {
  const searchParams = new URLSearchParams(window.location.search);

  searchParams.set(param, value);

  const newRelativePathQuery =
    window.location.pathname + "?" + searchParams.toString();

  // update query params silently
  history.pushState(null, "", newRelativePathQuery);
}

// get the params of the current page
function getUrlParam(param) {
  const searchParams = new URLSearchParams(window.location.search);

  return searchParams.get(param);
}

// function to allow users to set a start date and end date to their notification
function getDatesInRange(startDate, endDate, limitedDays) {
  const date = new Date(startDate.getTime());

  const dates = [];

  while (date <= endDate) {
    // check that the end date that user selected is not before the start date
    const day = date.getDay();
    const isDayAllowed = limitedDays ? limitedDays.has(day) : true;

    if (isDayAllowed) {
      dates.push(new Date(date));
    }

    date.setDate(date.getDate() + 1);
  }

  return dates;
}

function setMedication(event) {
  // set medicationId to query params for later use during submit
  setUrlParam("medicationId", event.target.dataset.id);

  // get all option DOM nodes
  const options = dropdownOptions.querySelectorAll(".dropdown-item");

  // remove "active" class name
  Array.from(options).forEach((option) => option.classList.remove("active"));

  // add "active" class name to selected option
  event.target.classList.add("active");

  // add medication name to dropdown button
  buttonDropDown.innerText = event.target.dataset.name;

  // add medicationId for later use during submit
  dropDownToggle.value = event.target.dataset.id;

  // hide dropdown
  $(dropDownToggle).dropdown("hide");
}

// add medication info to the medication subcollection under the user collection in firebase
function fillMedicationList(userId) {
  db.collection("users")
    .doc(userId)
    .collection("medications")
    .get()
    .then((allMeds) => {
      const medicationId = getUrlParam("medicationId");

      allMeds.forEach((docRef) => {
        const doc = docRef.data();

        // add list of medications that the user has added (get values from firebase collection) to the dropdown menu
        $("#medication-options").append(`
          <div
            class="dropdown-item${medicationId === docRef.id ? " active" : ""}"
            data-id="${docRef.id}"
            data-name="${doc.name}"
          >
            ${doc.name}
          </div>
        `);
      });
    });
}

// function so that users can fill out the form for which medication to set a notification (dates, time, frequency) and to add a dosage
async function submitNotification() {
  const medicationId = dropDownToggle.value;
  const dosage = inputDosage.value;
  const startDate = inputStartDate.value;
  const endDate = inputEndDate.value;
  const time = timeSlots.map((item) => item.value).filter(Boolean);

  if (!medicationId || !dosage || !startDate || !endDate || !time.length) {
    // check that all fields of the form are filled out
    const message = `Validation failed. Missing: ${
      !medicationId ? "\n  - Medication" : ""
    }${!dosage ? "\n  - Dosage" : ""}${!startDate ? "\n  - Start date" : ""}${
      !endDate ? "\n  - End Date" : ""
    }${!time.length ? "\n  - Time" : ""}`;

    return window.alert(message); // alert message if there are fields that are not filled out
  }

  // check that the dates user selects are valid
  const limitedDays = inputEveryDay.checked ? null : selectedDaysSet;
  const dates = getDatesInRange(
    new Date(startDate),
    new Date(endDate),
    limitedDays
  );

  if (!dates.length) {
    return window.alert("Select days.");
  }

  const batch = db.batch();

  // add date and time for each notification to firebase collection
  dates.forEach((date) => {
    const dateString = date.toISOString().split("T")[0];

    time.forEach((item) => {
      const dateTime = firebase.firestore.Timestamp.fromDate(
        new Date(`${dateString}T${item}`)
      );

      const notificationsCollection = db
        .collection("users")
        .doc(currentUserId)
        .collection("medications")
        .doc(medicationId)
        .collection("notifications")
        .doc();

      batch.set(notificationsCollection, {
        dateTime,
        dosage,
        profile: "",
      });
    });
  });

  // display a window alert to let users know that the notification has been successfully set or to display an error if it was not
  try {
    await batch.commit();

    window.alert(
      `${
        dates.length === 1 ? "Notification was" : "Notifications were"
      } successfully set.`
    );
    window.location = "notification-scr.html";
  } catch (error) {
    console.error("Error:", error);
    window.alert(`Error: ${error?.message}`);
  }
}

$(document).ready(getLoggedUser);
