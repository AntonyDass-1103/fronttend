// Load cart from localStorage
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Get DOM elements
const cartContainer = document.getElementById("cart-items");
const totalElement = document.getElementById("cart-total");

// Render Cart
function renderCart() {
  cartContainer.innerHTML = "";
  let total = 0;

  if (cart.length === 0) {
    cartContainer.innerHTML = "<p>Your cart is empty 🛒</p>";
    totalElement.textContent = "0";
    return;
  }

  cart.forEach((item, index) => {
    total += Number(item.price);

    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `
      <img src="${item.img}" alt="${item.name}">
      <div class="cart-item-details">
        <h3>${item.name}</h3>
        <p>₹${item.price}</p>
      </div>
      <button class="remove-btn" onclick="removeFromCart(${index})">Remove</button>
    `;
    cartContainer.appendChild(div);
  });

  totalElement.textContent = total.toFixed(2);
}

// Remove item
function removeFromCart(index) {
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

// Clear cart
document.getElementById("clear-cart").addEventListener("click", () => {
  localStorage.removeItem("cart");
  cart = [];
  renderCart();
});

// Initialize
renderCart();
