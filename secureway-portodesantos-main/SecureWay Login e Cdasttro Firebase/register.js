// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBNHjLhyqkYtqO38KPYXM4Aaeo_GQ4mWcE",
  authDomain: "way-c6146.firebaseapp.com",
  projectId: "way-c6146",
  storageBucket: "way-c6146.firebasestorage.app",
  messagingSenderId: "742438130127",
  appId: "1:742438130127:web:cd1a7cbfc8de3db0f182ba",
  measurementId: "G-XE34W6ZCEJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // Inicialize o Auth aqui

// Formulário de registro
const submit = document.getElementById('submit');
submit.addEventListener("click", function(event) {
  event.preventDefault();
  
  // Pega os valores de email e senha ao clicar
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  // Verifica se os campos não estão vazios
  if (!email || !password) {
    alert("Por favor, preencha todos os campos.");
    return;
  }

  // Cria o usuário no Firebase
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      alert("Conta criada com sucesso!")
      window.location.href = "grand.html";
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert(`Erro: ${errorMessage}`);
    });
});
 