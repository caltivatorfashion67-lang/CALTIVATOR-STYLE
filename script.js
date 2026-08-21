// Note: this file expects products.js to be loaded first (see index.html script order)

function fmt(n){ return "₹" + n.toLocaleString("en-IN"); }

function renderProducts(section, containerId){
  const grid = document.getElementById(containerId);
  if(!grid) return;
  const list = ALL_PRODUCTS.filter(p => p.section === section);
  grid.innerHTML = list.map(p => `
    <a class="product-card" href="product.html?id=${p.id}">
      <div class="img-wrap"><img src="${p.images[0]}" alt="${p.name}" loading="lazy"></div>
      <div class="product-info">
        <h4>${p.name}</h4>
        <div class="price">${fmt(p.price)}${p.oldPrice ? `<span class="old">${fmt(p.oldPrice)}</span>` : ""}</div>
      </div>
    </a>
  `).join("");
}

renderProducts("featured", "featuredGrid");
renderProducts("latest", "latestGrid");

// ---- Cart Drawer ----
const cartDrawer = document.getElementById("cartDrawer");
const overlay = document.getElementById("overlay");
if(document.getElementById("cartToggle")){
  document.getElementById("cartToggle").addEventListener("click", () => {
    cartDrawer.classList.add("open");
    overlay.classList.add("show");
  });
  document.getElementById("cartClose").addEventListener("click", closeCart);
  overlay.addEventListener("click", closeCart);
}
function closeCart(){
  cartDrawer.classList.remove("open");
  overlay.classList.remove("show");
}

// Note: newsletter form is now handled by newsletter.js (saves to Firestore)

// ---- Hamburger Menu (mobile) ----
if(document.getElementById("hamburgerBtn")){
  document.getElementById("hamburgerBtn").addEventListener("click", () => {
    document.getElementById("mainNav").classList.toggle("open");
    document.getElementById("hamburgerBtn").classList.toggle("open");
  });
}

// ---- Search Bar: on shop.html it filters in place (handled inline there); elsewhere it redirects ----
if(document.getElementById("searchForm") && !document.getElementById("shopGrid")){
  document.getElementById("searchForm").addEventListener("submit", function(e){
    e.preventDefault();
    const term = document.getElementById("searchInput").value.trim();
    if(term) window.location.href = "shop.html?search=" + encodeURIComponent(term);
  });
}
const mainImage = document.getElementById("mainImage");
const thumbBtns = document.querySelectorAll(".thumb-btn");
let currentImgIndex = 0;

function showGalleryImage(index){
  if(index < 0) index = thumbBtns.length - 1;
  if(index >= thumbBtns.length) index = 0;
  currentImgIndex = index;
  mainImage.src = thumbBtns[currentImgIndex].dataset.img;
  thumbBtns.forEach((b, i) => b.classList.toggle("active", i === currentImgIndex));
}

thumbBtns.forEach((btn, i) => {
  btn.addEventListener("click", () => showGalleryImage(i));
});

let touchStartX = 0, touchEndX = 0;
const SWIPE_THRESHOLD = 40;

mainImage.addEventListener("touchstart", (e) => {
  touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

mainImage.addEventListener("touchend", (e) => {
  touchEndX = e.changedTouches[0].screenX;
  const distance = touchEndX - touchStartX;
  if(Math.abs(distance) < SWIPE_THRESHOLD) return;
  if(distance < 0) showGalleryImage(currentImgIndex + 1);
  else showGalleryImage(currentImgIndex - 1);
}, { passive: true });

const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const admin = require("firebase-admin");
const Razorpay = require("razorpay");
const crypto = require("crypto");

admin.initializeApp();

const razorpayKeyId = defineSecret("RAZORPAY_KEY_ID");
const razorpaySecret = defineSecret("RAZORPAY_KEY_SECRET");

// ---- 1. Create a Razorpay Order (called from checkout before opening the popup) ----
exports.createRazorpayOrder = onCall(
  { secrets: [razorpayKeyId, razorpaySecret] },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "You must be logged in to place an order.");
    }

    const amountInRupees = request.data.amount;
    if (!amountInRupees || amountInRupees <= 0) {
      throw new HttpsError("invalid-argument", "Invalid order amount.");
    }

    const razorpay = new Razorpay({
      key_id: razorpayKeyId.value(),
      key_secret: razorpaySecret.value(),
    });

    const order = await razorpay.orders.create({
      amount: Math.round(amountInRupees * 100), // Razorpay expects paise, not rupees
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    });

    return {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: razorpayKeyId.value(), // safe to send back — Key ID is public, only the secret isn't
    };
  }
);

// ---- 2. Verify the payment signature after checkout completes ----
exports.verifyRazorpayPayment = onCall(
  { secrets: [razorpaySecret] },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "You must be logged in.");
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = request.data;

    const expectedSignature = crypto
      .createHmac("sha256", razorpaySecret.value())
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    const isValid = expectedSignature === razorpay_signature;

    if (!isValid) {
      throw new HttpsError("invalid-argument", "Payment verification failed.");
    }

    return { verified: true, paymentId: razorpay_payment_id };
  }
);

// Note: header login-state (Sign Up / Hi, Name) is now handled by auth-header.js