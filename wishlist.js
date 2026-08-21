// ---- Shared Wishlist Logic ----
// Stored in localStorage as an array of product ids: ["p01", "p05", ...]

function getWishlist(){
  return JSON.parse(localStorage.getItem("Caltivator Style_wishlist") || "[]");
}

function isInWishlist(id){
  return getWishlist().includes(id);
}

function toggleWishlist(id){
  let list = getWishlist();
  if(list.includes(id)){
    list = list.filter(x => x !== id);
  } else {
    list.push(id);
  }
  localStorage.setItem("Caltivator Style_wishlist", JSON.stringify(list));
  updateWishlistBadge();
  return list.includes(id);
}

function updateWishlistBadge(){
  const badge = document.getElementById("wishlistCount");
  if(badge) badge.textContent = getWishlist().length;
}

document.addEventListener("DOMContentLoaded", updateWishlistBadge);