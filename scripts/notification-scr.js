var months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
var n = new Date();
var y = n.getFullYear();
var m = n.getMonth();
var d = n.getDate();

document.getElementById('date').innerHTML = d + ' ' + months[m] + ' ' + y;

function getNotificationsList() {
  firebase.auth().onAuthStateChanged(async user => {
    //Check if user is signed in
    if (user) {
      const medicationsIds = [];

      await db
        .collection('users')
        .doc(user.uid)
        .collection('medications')
        .get()
        .then((medSnapshot) => {
          medSnapshot.docs.forEach(doc => {
            medicationsIds.push(doc.id);
          });
        });

      const notificationCollections = medicationsIds.map((medicationId) => {
        return db
          .collection('users')
          .doc(user.uid)
          .collection('medications')
          .doc(medicationId)
          .collection('notifications')
          .get();

      });

      Promise.all(notificationCollections)
        .then((response) => {
          response.forEach((notificationCollection) => {
            notificationCollection.docs.forEach((notification, index) => {
              buildNotifications(notification.id, notification.data(), medicationsIds[index]);
            });
          });
        })
        .catch((error) => {
          console.log('[getNotificationsList] error:', error);
        });

    } else {
      // User is not signed in
      console.log('No user is signed in');
    }
  });
}

function buildNotifications(id, data, medicationId) {
  const [date, time] = data.dateTime.toDate().toLocaleString().split(',');

  $('#notification-list')
    .append(`
      <div class="notification-wrapper">
        
        <div class="notification-actions">
          <button class = "icons" id="delete-btn-${id}"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"/>
              </svg></button>
          <button class = "icons" id="edit-btn-${id}"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
              </svg></button>
        </div>
        <div class="notification-dosage">Dosage: ${data.dosage}</div>
        <div class="notification-date">Date: ${date}</div>
        <div class="notification-time">Time: ${time}</div>
        <div class="notification-profile">Profile: ${data.profile}</div>
      </div>
    `);
  $(`#delete-btn-${id}`).click(() => {
    deleteNotification(id, medicationId);
  });

  $(`#edit-btn-${id}`).click(() => {
    editNotification(id, medicationId);
  });
}

function deleteNotification(notificationId, medicationId) {
  if (confirm('Do you want to delete this notification?')) {
    firebase.auth().onAuthStateChanged(async user => {
      if (user) {
        db
          .collection('users')
          .doc(user.uid)
          .collection('medications')
          .doc(medicationId)
          .collection('notifications')
          .doc(notificationId)
          .delete()
          .then(response => {
            // the response in undefined
            console.log('[deleteNotification] success:', response);
          })
          .catch((error) => {
            console.log('[deleteNotification] error', error);
          })
          .finally(() => {
            window.location.reload();
          });
      }
    });
  }
}

// TODO: collect data from HTML
function editNotification(notificationId, medicationId) {
  // in progress
  window.alert('Do not use from UI');
  window.location.href=`set-notification.html?medicationId=${medicationId}&notificationId=${notificationId}`
  return;

  firebase.auth().onAuthStateChanged(async user => {
    if (user) {
      db
        .collection('users')
        .doc(user.uid)
        .collection('medications')
        .doc(medicationId)
        .collection('notifications')
        .doc(notificationId)
        .set({
          // pass data to edit current notification
          dosage: '',
          dateTime: '',
          profile: '',
        })
        .then(response => {
          // the response in undefined
          console.log('[editNotification] success:', response);
        })
        .catch((error) => {
          console.log('[editNotification] error', error);
        })
        .finally(() => {
          window.location.reload();
        });
    }
  });
}

getNotificationsList();
// window.location.href='edit-medication.html?docId=${docRef.id}'
