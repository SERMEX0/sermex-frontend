// Importa lo necesario de Firebase
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Tu configuración de Firebase (no cambies nada aquí)
const firebaseConfig = {
  apiKey: "AIzaSyBqRcgbFgLRK1X6POAnCZAi0XNQZ0NaCyg",
  authDomain: "help-desk-sermex.firebaseapp.com",
  projectId: "help-desk-sermex",
  storageBucket: "help-desk-sermex.firebasestorage.app",
  messagingSenderId: "543319017517",
  appId: "1:543319017517:web:d1e0179a08b90dbafe50a4",
  measurementId: "G-ECTHXE41KY"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Inicializa Firestore (base de datos)
export const db = getFirestore(app);