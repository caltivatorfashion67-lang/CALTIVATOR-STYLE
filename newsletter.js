// ============================================================
// NEWSLETTER — saves subscriber emails into Firestore so you
// (the store owner) can see them in the Firebase Console under
// the "newsletter" collection.
// ============================================================

import { db } from "./firebase-config.js";
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const newsletterForm = document.getElementById("newsletterForm");
if (newsletterForm) {
  newsletterForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    const emailInput = this.querySelector("input[type='email']");
    const email = emailInput.value.trim().toLowerCase();
    const msgEl = document.getElementById("formMsg");

    try {
      await addDoc(collection(db, "newsletter"), {
        email: email,
        subscribedAt: serverTimestamp()
      });
      msgEl.textContent = "Thank you! Your submission has been received!";
      this.reset();
    } catch (err) {
      msgEl.textContent = "Something went wrong. Please try again.";
    }
  });
}