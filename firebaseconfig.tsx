import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import Config from "react-native-config";

const firebaseConfig = {
  apiKey: Config.REACT_APP_api_key,
  authDomain: Config.REACT_APP_authDomain,
  projectId: Config.REACT_APP_projectId,
  storageBucket: Config.REACT_APP_storageBucket,
  messagingSenderId: Config.REACT_APP_messagingSenderId,
  appId: Config.REACT_APP_appId,
  measurementId: Config.REACT_APP_measurementId
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Initialize Firestore
export { db };

