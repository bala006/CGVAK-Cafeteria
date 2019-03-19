importScripts('https://www.gstatic.com/firebasejs/5.8.2/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/5.8.2/firebase-messaging.js');
var config = {
    apiKey: "AIzaSyBJwSstldzZSLA_rOaa8TQdrzibTNCH1NQ",
    authDomain: "cg-vak-cafeteria.firebaseapp.com",
    databaseURL: "https://cg-vak-cafeteria.firebaseio.com",
    projectId: "cg-vak-cafeteria",
    storageBucket: "cg-vak-cafeteria.appspot.com",
    messagingSenderId: "344749173404"
  };

firebase.initializeApp(config);
const messaging = firebase.messaging();
