// ============================================================
// AUTH HEADER — shared across every page.
// Watches Firebase login state and updates the header + logout button.
// ============================================================

import { auth, db } from "./firebase-config.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

onAuthStateChanged(auth, async (user) => {
  const signupLink = document.getElementById("signupLink");
  const logoutBtn = document.getElementById("logoutBtn");

  if (user) {
    let firstName = (user.displayName || "").split(" ")[0];

    // Fallback: fetch name from Firestore if displayName isn't set on the auth object
    if (!firstName) {
      try {
        const snap = await getDoc(doc(db, "users", user.uid));
        if (snap.exists()) firstName = snap.data().name.split(" ")[0];
      } catch (e) { /* ignore */ }
    }

    if (signupLink) {
      signupLink.textContent = "Hi, " + (firstName || "there");
      signupLink.href = "account.html";
    }
  } else {
    if (signupLink) {
      signupLink.textContent = "Sign Up";
      signupLink.href = "signup.html";
    }
    // If we're on a page that requires login (account.html), send them to login
    if (document.body.dataset.requiresAuth === "true") {
      window.location.href = "login.html";
    }
  }
});

if (document.getElementById("logoutBtn")) {
  document.getElementById("logoutBtn").addEventListener("click", async () => {
    await signOut(auth);
    window.location.href = "index.html";
  });
}