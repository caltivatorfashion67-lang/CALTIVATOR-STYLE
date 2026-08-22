// Note: this file expects products.js to be loaded first (see index.html script order)

function fmt(n){ return "₹" + n.toLocaleString("en-IN"); }

function renderProducts(section, containerId){
  const grid = document.getElementById(containerId);
  if(!grid) return;
  const list = ALL_PRODUCTS.filter(p => p.section === section);
  grid.innerHTML = list.map(p => `
    <a class="product-card" href="product.html?id=${p.id}">
      <button type="button" class="wish-heart ${typeof isInWishlist === "function" && isInWishlist(p.id) ? "active" : ""}" data-id="${p.id}" onclick="event.preventDefault(); this.classList.toggle('active', toggleWishlist('${p.id}'));">&#9825;</button>
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

// Note: header login-state (Sign Up / Hi, Name) is now handled by auth-header.js