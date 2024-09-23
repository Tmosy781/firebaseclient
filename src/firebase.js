// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCU4SOF5rhXUsbgmeEkmF_wb6IrmCQs4Js",
  authDomain: "bakeryapp-a05a3.firebaseapp.com",
  projectId: "bakeryapp-a05a3",
  storageBucket: "bakeryapp-a05a3.appspot.com",
  messagingSenderId: "1010916628612",
  appId: "1:1010916628612:web:7268dd8e4f723836628ad1",
  measurementId: "G-7BEBRYSLZ1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);

export default app;