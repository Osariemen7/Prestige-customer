importScripts('https://www.gstatic.com/firebasejs/10.7.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.2/firebase-messaging-compat.js');

firebase.initiliazeApp= {
    apiKey: "AIzaSyAzI_pYNOig5crDJA2SkyglGFC0yi0nm3s",
    authDomain: "firstproject-fbc73.firebaseapp.com",
    projectId: "firstproject-fbc73",
    storageBucket: "firstproject-fbc73.appspot.com",
    messagingSenderId: "410151713751",
    appId: "1:410151713751:web:94e3e1883922caaac3a992",
    measurementId: "G-MPPWGV4EQ3"
};

const messaging = firebase.messaging()

messaging.onBackgroundMessage((payload) => {
    console.log(
      '[firebase-messaging-sw.js] Received background message ',
      payload
    );
    // Customize notification here
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
      body: payload.notification.body,
      icon: payload.notification.image
    };
  
    self.registration.showNotification(notificationTitle, notificationOptions);
  });