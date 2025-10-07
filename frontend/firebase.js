// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey:import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "vingo-food-delivery-13b9e.firebaseapp.com",
  projectId: "vingo-food-delivery-13b9e",
  storageBucket: "vingo-food-delivery-13b9e.firebasestorage.app",
  messagingSenderId: "237458808298",
  appId: "1:237458808298:web:95d7934bfc6859c97d6693"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth=getAuth(app)
export {app,auth}



// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAuth, GoogleAuthProvider } from "firebase/auth";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey:import.meta.env.VITE_FIREBASE_APIKEY,
//   authDomain: "vingo-food-delivery-13b9e.firebaseapp.com",
//   projectId: "vingo-food-delivery-13b9e",
//   storageBucket: "vingo-food-delivery-13b9e.firebasestorage.app",
//   messagingSenderId: "237458808298",
//   appId: "1:237458808298:web:95d7934bfc6859c97d6693"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const auth=getAuth(app)
// const provider=new GoogleAuthProvider()
// export {provider,auth}