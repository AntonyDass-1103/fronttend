// ===== API Base URL =====
const API_URL = "https://my-backend-b2lj.onrender.com/api";

// ===== Category Icons & Pages =====
const categoryIcons = {
  "Minutes": "https://cdn-icons-png.flaticon.com/512/2936/2936631.png",
  "Mobiles & Tablets": "https://cdn-icons-png.flaticon.com/512/929/929564.png",
  "TVs & Appliances": "https://cdn-icons-png.flaticon.com/512/1041/1041916.png",
  "Electronics": "https://cdn-icons-png.flaticon.com/512/3607/3607444.png",
  "Fashion": "https://cdn-icons-png.flaticon.com/512/892/892458.png",
  "Home & Kitchen": "https://cdn-icons-png.flaticon.com/512/3176/3176363.png",
  "Beauty & Toys": "https://cdn-icons-png.flaticon.com/512/4359/4359870.png",
  "Furniture": "https://cdn-icons-png.flaticon.com/512/2921/2921822.png",
  "Flight Bookings": "https://cdn-icons-png.flaticon.com/512/3448/3448610.png",
  "Grocery": "https://cdn-icons-png.flaticon.com/512/1046/1046874.png"
};

const categoryPages = {
  "Minutes": "minutes.html",
  "Mobiles & Tablets": "mobiles.html",
  "TVs & Appliances": "tvs.html",
  "Electronics": "electronics.html",
  "Fashion": "fashion.html",
  "Home & Kitchen": "home.html",
  "Beauty & Toys": "beauty.html",
  "Furniture": "furniture.html",
  "Flight Bookings": "flights.html",
  "Grocery": "grocery.html"
};

// ===== Load Categories to Navbar =====
const categoryContainer = document.getElementById("categories");

async function loadCategories() {
  try {
    const res = await fetch(`${API_URL}/products/categories`);
    const categories = await res.json();

    categories.forEach(cat => {
      const div = document.createElement("div");
      div.className = "category-item";
      const icon = categoryIcons[cat] || "https://via.placeholder.com/50";

      div.innerHTML = `
        <div class="icon-wrap"><img src="${icon}" alt="${cat}"></div>
        <p class="category-name">${cat}</p>
      `;

      div.addEventListener("click", () => {
        const page = categoryPages[cat] || "index.html";
        window.location.href = page;
      });

      categoryContainer.appendChild(div);
    });
  } catch (err) {
    console.error("Error loading categories:", err);
  }
}

loadCategories();

// ===== Banner Slider =====
const bannerImages = [
  "/EaseShop/firstbanner.jpg",
  "/EaseShop/banner1.jpg",
  "/EaseShop/banner2.jpg",
  "/EaseShop/banner3.jpg"
];

const bannerSlider = document.getElementById("bannerSlider");
let currentBanner = 0;

bannerImages.forEach((src, i) => {
  const img = document.createElement("img");
  img.src = src;
  img.alt = `Banner ${i + 1}`;
  img.style.opacity = i === 0 ? 1 : 0;
  img.classList.add("banner-image");
  bannerSlider.appendChild(img);
});

setInterval(() => {
  const imgs = bannerSlider.querySelectorAll("img");
  imgs[currentBanner].style.opacity = 0;
  currentBanner = (currentBanner + 1) % imgs.length;
  imgs[currentBanner].style.opacity = 1;
}, 3000);

// ===== Fetch & Render Products =====
let products = [];
const productGrid = document.getElementById("productGrid");

const pageCategory = (() => {
  const params = new URLSearchParams(window.location.search);
  return params.get("cat");
})();

async function loadProducts() {
  try {
    const res = await fetch(`${API_URL}/products`);
    products = await res.json();

    let filtered = products;
    if (pageCategory) {
      filtered = products.filter(p => p.category.toLowerCase() === pageCategory.toLowerCase());
      const header = document.getElementById("categoryHeader");
      if (header) header.textContent = pageCategory;
    }

    renderProducts(filtered);
  } catch (err) {
    console.error("Error loading products:", err);
    productGrid.innerHTML = "<p>Failed to load products.</p>";
  }
}

function renderProducts(list) {
  productGrid.innerHTML = "";
  if (list.length === 0) {
    productGrid.innerHTML = "<p>No products found.</p>";
    return;
  }
  list.forEach(p => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <div class="img-wrap"><img src="${p.img || 'https://via.placeholder.com/150'}" alt="${p.name}"></div>
      <div class="meta">
        <h3>${p.name}</h3>
        <p class="price">₹${p.price}</p>
        <p class="desc">${p.description || ''}</p>
      </div>
      <button class="add-cart">Add to Cart</button>
    `;
    card.querySelector(".add-cart").addEventListener("click", () => addToCart(p));
    productGrid.appendChild(card);
  });
}

loadProducts();

// ===== Cart Functions =====
function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (cart.find(item => item._id === product._id)) {
    alert("This item is already in your cart!");
    return;
  }
  cart.push(product);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  alert(`${product.name} added to cart!`);
}

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  document.getElementById("cartCount").innerText = cart.length;
}

updateCartCount();

// ===== Search =====
document.getElementById("searchBtn").addEventListener("click", () => {
  const term = document.getElementById("searchBox").value.toLowerCase();
  renderProducts(products.filter(p => p.name.toLowerCase().includes(term)));
});

document.getElementById("clearSearch").addEventListener("click", () => {
  document.getElementById("searchBox").value = "";
  renderProducts(products);
});

const userLoggedIn = false;

if(userLoggedIn){
  document.querySelector(".login-btn").style.display = "none";
} else {
  document.querySelector(".login-btn").style.display = "inline-block";
}
