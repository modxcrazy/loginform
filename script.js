// Firebase configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID",
    databaseURL: "YOUR_DATABASE_URL"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const database = firebase.database();

// DOM Elements
const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const forgotPassword = document.getElementById('forgotPassword');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMessage');

// Toggle between sign in and sign up forms
signUpButton.addEventListener('click', () => {
    container.classList.add('right-panel-active');
});

signInButton.addEventListener('click', () => {
    container.classList.remove('right-panel-active');
});

// Show toast notification
function showToast(message, isError = false) {
    toastMessage.textContent = message;
    toast.className = 'toast';
    toast.classList.add('show');
    
    if (isError) {
        toast.style.backgroundColor = '#ff4444';
    } else {
        toast.style.backgroundColor = '#333';
    }
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Register new user
registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    
    // Validate inputs
    if (!name || !email || !password) {
        showToast('Please fill in all fields', true);
        return;
    }
    
    if (password.length < 6) {
        showToast('Password must be at least 6 characters', true);
        return;
    }
    
    // Create user with Firebase Auth
    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // User created successfully
            const user = userCredential.user;
            
            // Save additional user data to Realtime Database
            database.ref('users/' + user.uid).set({
                name: name,
                email: email,
                createdAt: firebase.database.ServerValue.TIMESTAMP
            });
            
            showToast('Registration successful! Redirecting...');
            setTimeout(() => {
                window.location.href = 'dashboard.html'; // Redirect to dashboard
            }, 1500);
        })
        .catch((error) => {
            const errorMessage = error.message;
            showToast(errorMessage, true);
        });
});

// Login existing user
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Validate inputs
    if (!email || !password) {
        showToast('Please fill in all fields', true);
        return;
    }
    
    // Sign in with Firebase Auth
    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // User signed in successfully
            showToast('Login successful! Redirecting...');
            setTimeout(() => {
                window.location.href = 'dashboard.html'; // Redirect to dashboard
            }, 1500);
        })
        .catch((error) => {
            const errorMessage = error.message;
            showToast(errorMessage, true);
        });
});

// Password reset
forgotPassword.addEventListener('click', (e) => {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    
    if (!email) {
        showToast('Please enter your email first', true);
        return;
    }
    
    auth.sendPasswordResetEmail(email)
        .then(() => {
            showToast('Password reset email sent. Check your inbox.');
        })
        .catch((error) => {
            const errorMessage = error.message;
            showToast(errorMessage, true);
        });
});

// Check auth state
auth.onAuthStateChanged((user) => {
    if (user) {
        // User is signed in
        // You can redirect to dashboard here if you want
        // window.location.href = 'dashboard.html';
    } else {
        // User is signed out
    }
});
