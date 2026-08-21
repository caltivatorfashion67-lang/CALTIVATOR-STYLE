// ---- Shared Cart Logic (used by every page) ----
// Cart is stored in localStorage as an array:
// [{ cartKey, id, name, price, image, qty, size }]
// `size` is null for products with no size (bags, Women).
// `cartKey` combines id + size so the same product in two different
// sizes shows as two separate lines in the cart.

function getCart(){
  return JSON.parse(localStorage.getItem("CALTIVATOR STYLE_cart") || "[]");
}

function saveCart(cart){
  localStorage.setItem("CALTIVATOR STYLE_cart", JSON.stringify(cart));
  updateCartBadge();
  renderCartDrawer();
}

function makeCartKey(id, size){
  return id + "|" + (size || "none");
}

function addToCart(product, qty = 1, size = null){
  const cart = getCart();
  const cartKey = makeCartKey(product.id, size);
  const existing = cart.find(item => item.cartKey === cartKey);
  if(existing){
    existing.qty += qty;
  } else {
    cart.push({
      cartKey,
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      qty,
      size: size || null
    });
  }
  saveCart(cart);
}

function removeFromCart(cartKey){
  const cart = getCart().filter(item => item.cartKey !== cartKey);
  saveCart(cart);
}

function updateCartQty(cartKey, qty){
  const cart = getCart();
  const item = cart.find(i => i.cartKey === cartKey);
  if(!item) return;
  if(qty <= 0){
    removeFromCart(cartKey);
    return;
  }
  item.qty = qty;
  saveCart(cart);
}

function getCartCount(){
  return getCart().reduce((sum, item) => sum + item.qty, 0);
}

function getCartTotal(){
  return getCart().reduce((sum, item) => sum + (item.price * item.qty), 0);
}

function updateCartBadge(){
  const badge = document.getElementById("cartCount");
  if(badge) badge.textContent = getCartCount();
}

// ---- Renders the cart drawer contents (called whenever the cart changes) ----
function renderCartDrawer(){
  const itemsEl = document.getElementById("cartItems");
  const subtotalEl = document.getElementById("cartSubtotalValue");
  if(!itemsEl) return; // this page doesn't have a cart drawer

  const cart = getCart();

  if(cart.length === 0){
    itemsEl.innerHTML = `<p class="cart-empty-msg">No items found.</p>`;
  } else {
    itemsEl.innerHTML = cart.map(item => `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}">
        <div class="cart-item-info">
          <h5>${item.name}</h5>
          ${item.size ? `<p class="cart-item-size">Size: ${item.size}</p>` : ""}
          <p>₹${item.price.toLocaleString("en-IN")}</p>
          <div class="qty-controls">
            <button class="qty-btn" data-key="${item.cartKey}" data-action="decrease">&minus;</button>
            <span>${item.qty}</span>
            <button class="qty-btn" data-key="${item.cartKey}" data-action="increase">+</button>
          </div>
        </div>
        <button class="remove-btn" data-key="${item.cartKey}">&times;</button>
      </div>
    `).join("");

    // Wire up quantity buttons
    itemsEl.querySelectorAll(".qty-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const cart2 = getCart();
        const item = cart2.find(i => i.cartKey === btn.dataset.key);
        if(!item) return;
        const newQty = btn.dataset.action === "increase" ? item.qty + 1 : item.qty - 1;
        updateCartQty(item.cartKey, newQty);
      });
    });

    // Wire up remove buttons
    itemsEl.querySelectorAll(".remove-btn").forEach(btn => {
      btn.addEventListener("click", () => removeFromCart(btn.dataset.key));
    });
  }

  if(subtotalEl) subtotalEl.textContent = "₹" + getCartTotal().toLocaleString("en-IN");
}

// ---- Run on every page load ----
document.addEventListener("DOMContentLoaded", () => {
  updateCartBadge();
  renderCartDrawer();

  const checkoutBtn = document.getElementById("checkoutBtn");
  if(checkoutBtn){
    checkoutBtn.addEventListener("click", () => {
      if(getCart().length === 0){
        alert("Your cart is empty. Add a product first.");
        return;
      }
      window.location.href = "checkout.html";
    });
  }
});