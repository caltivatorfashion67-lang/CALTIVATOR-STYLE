// ============================================================
// AUTH (Firebase) — replaces the old localStorage-based system.
// Passwords are now handled entirely by Firebase (encrypted,
// never stored or visible in plain text anywhere).
// ============================================================

import { auth, db } from "./firebase-config.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  doc, setDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ---- Sign Up ----
const signupForm = document.getElementById("signupForm");
if (signupForm) {
  signupForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    const fullName = document.getElementById("fullName").value.trim();
    const email = document.getElementById("email").value.trim().toLowerCase();
    const phone = document.getElementById("phone").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const errorEl = document.getElementById("signupError");
    errorEl.textContent = "";

    if (password !== confirmPassword) {
      errorEl.textContent = "Passwords do not match.";
      return;
    }
    if (!/^[0-9]{10}$/.test(phone)) {
      errorEl.textContent = "Please enter a valid 10-digit phone number.";
      return;
    }

    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName: fullName });

      // Save extra profile info (phone) in Firestore, keyed by the user's uid
      await setDoc(doc(db, "users", cred.user.uid), {
        name: fullName,
        email: email,
        phone: phone
      });

      redirectAfterAuth();
    } catch (err) {
      errorEl.textContent = friendlyError(err.code);
    }
  });
}

// ---- Login ----
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value.trim().toLowerCase();
    const password = document.getElementById("loginPassword").value;
    const errorEl = document.getElementById("loginError");
    errorEl.textContent = "";

    try {
      await signInWithEmailAndPassword(auth, email, password);
      redirectAfterAuth();
    } catch (err) {
      errorEl.textContent = friendlyError(err.code);
    }
  });
}

// ---- Forgot Password ----
const forgotBtn = document.getElementById("forgotPasswordBtn");
if (forgotBtn) {
  forgotBtn.addEventListener("click", async () => {
    const email = document.getElementById("loginEmail").value.trim().toLowerCase();
    const errorEl = document.getElementById("loginError");
    if (!email) {
      errorEl.textContent = "Enter your email above first, then tap 'Forgot password?'.";
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      errorEl.style.color = "#1e6b3a";
      errorEl.textContent = "Password reset link sent! Check your email inbox.";
    } catch (err) {
      errorEl.style.color = "";
      errorEl.textContent = friendlyError(err.code);
    }
  });
}

// ---- Redirect after successful login/signup: send the customer back to
//      wherever they were trying to go (e.g. checkout), or the shop by default. ----
function redirectAfterAuth() {
  const redirectTo = sessionStorage.getItem("redirectAfterLogin");
  sessionStorage.removeItem("redirectAfterLogin");
  window.location.href = redirectTo || "shop.html";
}

// ---- Convert Firebase error codes into simple messages ----
function friendlyError(code) {
  switch (code) {
    case "auth/email-already-in-use": return "An account with this email already exists.";
    case "auth/invalid-email": return "Please enter a valid email address.";
    case "auth/weak-password": return "Password should be at least 6 characters.";
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential": return "Invalid email or password.";
    default: return "Something went wrong. Please try again.";
  }
}