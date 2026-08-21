// ---- Centralized Product Data (INR) — Men's Collection ----
const SIZE_OPTIONS = {
  clothing: ["M", "L", "XL", "XXL"],
  waist: ["28", "30", "32", "34", "36"]
};

const ALL_PRODUCTS = [
  {
    id: "p01",
    name: "Vanguard Performance Shirt",
    price: 2499,
    section: "featured",
    category: "Men",
    stock: 1,
    sizeType: "waist",
    images: [
      "images/h1.jpg",
      "images/h2.jpg",
      "images/h3.jpg"
    ],
    description: "A tailored performance shirt built for all-day comfort, crafted from breathable premium fabric with a modern fit."
  },
  {
    id: "p02",
    name: "Trekker Expandable Travel Tote",
    price: 3299,
    section: "featured",
    category: "Men",
    stock: 1,
    sizeType: "waist",
    images: [
      "images/w1.jpg",
      "images/w2.jpg",
"images/w3.jpg"
    ],
    description: "A spacious expandable tote designed for travel, with reinforced handles and durable stitching."
  },
  {
    id: "p03",
    name: "Phoenix Leather Zip Wallet",
    price: 1799,
    oldPrice: 2999,
    section: "featured",
    category: "Men",
    stock: 1,
    sizeType: "waist",
    images: [
      "images/a1.jpg",
      "images/a2.jpg",
      "images/a3.jpg"
    ],
    description: "A slim genuine-leather zip wallet with multiple card slots and a coin pocket."
  },
  {
    id: "p04",
    name: "High-Waisted Cargo Shorts",
    price: 1299,
    section: "featured",
    category: "Men",
    stock: 1,
    sizeType: "waist",
    images: [
      "images/q1.jpg",
      "images/q2.jpg",
      "images/q3.jpg"
    ],
    description: "Rugged cargo shorts with a comfortable stretch fit, built for warm-weather everyday wear."
  },
  {
    id: "p05",
    name: "Summit Merino Wool Sweater",
    price: 3999,
    oldPrice: 4999,
    section: "latest",
    category: "Men",
    stock: 11,
    sizeType: "waist",
    images: [
      "images/e1.jpg",
      "images/e2.jpg",
      "images/e3.jpg"
    ],
    description: "A soft merino wool sweater that keeps you warm without the bulk. Timeless and versatile."
  },
  {
    id: "p06",
    name: "Jetsetter Rolling Duffel Bag",
    price: 5499,
    section: "latest",
    category: "Trending Outfits",
    stock: 6,
    sizeType: "waist",
    images: [
      "images/y1.jpg",
      "images/y2.jpg",
      "images/y3.jpg"
    ],
    description: "A rugged rolling duffel with smooth-glide wheels, built for frequent travelers."
  },
  {
    id: "p07",
    name: "Ember Wool Scarf",
    price: 899,
    section: "latest",
    category: "Women",
    stock: 20,
    sizeType: "waist",
    images: [
      "images/t1.jpg",
      "images/t2.jpg",
      "images/t3.jpg"
    ],
    description: "A hand-finished wool scarf that adds a warm, understated touch to any outfit."
  },
  {
    id: "p08",
    name: "Ridge Slim-Fit Chinos",
    price: 2199,
    section: "latest",
    category: "Men",
    stock: 16,
    sizeType: "waist",
    images: [
      "images/r1.jpg",
      "images/r2.jpg",
      "images/r3.jpg"
    ],
    description: "Slim-fit chinos with a clean, tailored line — equally sharp with a shirt or a tee."
  },
    {
    id: "p08",
    name: "Ridge Slim-Fit Chinos",
    price: 2199,
    section: "latest",
    category: "Trending Outfits",
    stock: 16,
    sizeType: "waist",
    images: [
      "images/u1.jpg",
      "images/u2.jpg",
      "images/u3.jpg"
    ],
    description: "Slim-fit chinos with a clean, tailored line — equally sharp with a shirt or a tee."
  },
  
];

function getProductById(id){
  return ALL_PRODUCTS.find(p => p.id === id);
}