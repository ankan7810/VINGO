// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey:import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "food-delivery-32ffa.firebaseapp.com",
  projectId: "food-delivery-32ffa",
  storageBucket: "food-delivery-32ffa.firebasestorage.app",
  messagingSenderId: "663093314813",
  appId: "1:663093314813:web:1aadd64e638445cabbea94"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth=getAuth(app)
export {app,auth}



// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyDEPSXu3k-nWmbFETdE39cqYzQS96Zxjaw",
//   authDomain: "food-delivery-32ffa.firebaseapp.com",
//   projectId: "food-delivery-32ffa",
//   storageBucket: "food-delivery-32ffa.firebasestorage.app",
//   messagingSenderId: "663093314813",
//   appId: "1:663093314813:web:1aadd64e638445cabbea94"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const auth=getAuth(app)
// export {app,auth}