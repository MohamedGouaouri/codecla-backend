// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: "code-cla.firebaseapp.com",
    projectId: "code-cla",
    storageBucket: "code-cla.appspot.com",
    messagingSenderId: "767383476401",
    appId: "1:767383476401:web:a2e45d01ac8e337f14ea90"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);