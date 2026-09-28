const cart = [];

const serviceButtons = document.querySelectorAll(".service button");
const cartItems = document.getElementById("cart-items");
const totalAmount = document.getElementById("total-amount");

serviceButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const service = button.dataset.service;
    const price = Number(button.dataset.price);

    const existingItem = cart.find((item) => item.service === service);

    if (existingItem) {
      removeFromCart(service);
      updateButton(button, false);
    } else {
      addToCart(service, price);
      updateButton(button, true);
    }
  });
});

function addToCart(service, price) {
  cart.push({
    service,
    price,
  });

  updateCart();
}

function removeFromCart(service) {
  const index = cart.findIndex((item) => item.service === service);

  if (index !== -1) {
    cart.splice(index, 1);
  }

  updateCart();
}

function updateButton(button, added) {
  if (added) {
    button.textContent = "Remove Item";
    button.classList.remove("add");
    button.classList.add("remove");
  } else {
    button.textContent = "Add Item";
    button.classList.remove("remove");
    button.classList.add("add");
  }
}

function updateCart() {
  cartItems.innerHTML = "";

  cart.forEach((item, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${item.service}</td>
      <td>₹${item.price.toFixed(2)}</td>
    `;

    cartItems.appendChild(row);
  });

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  totalAmount.textContent = `₹${total.toFixed(2)}`;
}
