function getNotificationsList() {
  firebase.auth().onAuthStateChanged(async (user) => {
    //Check if user is signed in
    if (user) {
      const medications = [];

      await db
        .collection("users")
        .doc(user.uid)
        .collection("medications")
        .get()
        .then((medSnapshot) => {
          medSnapshot.docs.forEach((doc) => {
            medications.push({
              id: doc.id,
              ...doc.data(),
            });
          });
        });

      const notificationCollections = medications.map((medication) => {
        return db
          .collection("users")
          .doc(user.uid)
          .collection("medications")
          .doc(medication.id)
          .collection("notifications")
          .orderBy("dateTime", "asc")
          .get();
      });

      Promise.all(notificationCollections)
        .then((response) => {
          response.forEach((notificationCollection, index) => {
            const medication = medications[index];

            notificationCollection.docs.forEach((notification) => {
              buildNotifications(
                notification.id,
                notification.data(),
                medication
              );
            });
          });
        })
        .catch((error) => {
          console.log("[getNotificationsList] error:", error);
        });
    } else {
      // User is not signed in
      console.log("No user is signed in");
    }
  });
}

getNotificationsList();
