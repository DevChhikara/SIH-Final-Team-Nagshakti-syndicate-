// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { GoogleAuthProvider, getAuth, signInWithPopup} from "firebase/auth";
import { Navigate } from "react-router-dom";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: "AIzaSyADC__jmH0Ysd34qZCJ6pnwIm6Jpt14hGQ",
  authDomain: "invoice-8c73e.firebaseapp.com",
  projectId: "invoice-8c73e",
  storageBucket: "invoice-8c73e.appspot.com",
  messagingSenderId: "1015270806452",
  appId: "1:1015270806452:web:5ac1ad93ced13e59c8d8e1",
  measurementId: "G-MJ4FDNCMMF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

export default auth;

const provider=new GoogleAuthProvider();

/* export const signInWithGoogle = () =>{

  
    signInWithPopup(auth, provider).then((result)=>{
      if(result){
      }
    }).catch((error)=>{
      console.log(error);
    })
}; */