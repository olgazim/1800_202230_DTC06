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
]
var n = new Date()
var y = n.getFullYear()
var m = n.getMonth()
var d = n.getDate()

document.getElementById('date').innerHTML = d + ' ' + months[m] + ' ' + y

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
          })
        })

      const notificationCollections = medicationsIds.map((medicationId) => {
        return db
          .collection('users')
          .doc(user.uid)
          .collection('medications')
          .doc(medicationId)
          .collection('notifications')
          .get()
      
      });

      Promise.all(notificationCollections)
        .then((response) => {
          response.forEach((notificationCollection) => {
            notificationCollection.docs.forEach(notification => {
              buildNotifications(notification.id, notification.data())
            });
          })
        })
        .catch((error) => {
          console.log('[getNotificationsList] error:', error);
        })

    }
    else {
      // User is not signed in
      console.log('No user is signed in')
    }
  })
}

function buildNotifications(id, data) {
  const [date, time] = data.dateTime.toDate().toLocaleString().split(',');

  $('#notification-list')
    .append(`
      <div class="notification-wrapper">
        <div class="notification-dosage">Dosage: ${data.dosage}</div>
        <div class="notification-date">Date: ${date}</div>
        <div class="notification-time">Time: ${time}</div>
        <div class="notification-profile">Profile: ${data.profile}</div>
      </div>
    `);
}

function deleteNotification() {}

function editNotification() {}

getNotificationsList();
