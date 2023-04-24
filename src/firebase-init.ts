import { FirebaseOptions, getApp, initializeApp } from "firebase/app";

const firebaseConfig: FirebaseOptions = {
  apiKey: "AIzaSyAsVXFrYLAbXr4mdcbP5XImcMyIG1MvErg",
  authDomain: "tv-show-tracker-c3ca2.firebaseapp.com",
  projectId: "tv-show-tracker-c3ca2",
  storageBucket: "tv-show-tracker-c3ca2.appspot.com",
  messagingSenderId: "834327826358",
  appId: "1:834327826358:web:b1678301bc8c61ae837b17",
  measurementId: "G-STF4WN2LCD"
};

export const createOrReturnFirebaseApp = () => {
  try {
    return getApp();
  } catch {
    return initializeApp(firebaseConfig);
  }
};
