// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyA-GQjxMYkXxl0Iq4VF4ub9FSKUwik3o3I",
    authDomain: "resumebuilder-962dc.firebaseapp.com",
    projectId: "resumebuilder-962dc",
    storageBucket: "resumebuilder-962dc.appspot.com",
    messagingSenderId: "914627543098",
    appId: "1:914627543098:web:92a3e2dd288ad040397503",
    measurementId: "G-KQFGS2CZMD"
  };
// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

