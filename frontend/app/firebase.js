import 'firebase/compat/auth'
import 'firebase/database';
import 'firebase/compat/firestore';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyB25IT2JY6Avzzgnu2Pi9VKiqFgaGj4Q5Q",
  authDomain: "eldercareapp-7e8af.firebaseapp.com",
  projectId: "eldercareapp-7e8af",
  storageBucket: "eldercareapp-7e8af.firebasestorage.app",
  messagingSenderId: "100066008222",
  appId: "1:100066008222:web:863a7bb86c042e6ddb6f8f",
  measurementId: "G-CK9HKJBT00"
};


if (!firebase.apps.length){
    firebase.initializeApp(firebaseConfig);

}
export { firebase };
