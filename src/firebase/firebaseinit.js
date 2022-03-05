import firebase from "firebase/app";
import "firebase/firestore";


// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBxGlwWNLCgpHyxbhMwoByxM0-B5WHxpe0",
    authDomain: "invoice-app-c26be.firebaseapp.com",
    projectId: "invoice-app-c26be",
    storageBucket: "invoice-app-c26be.appspot.com",
    messagingSenderId: "517771138319",
    appId: "1:517771138319:web:4653a4f9ce4fb17803da7a"
};


// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig);

export default firebaseApp.firestore();