emailjs.init({
  publicKey: "QQUWJhBHc4cvWvJx0",
});

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

function updateCart() {
  cartItems.innerHTML = "";

  if (cart.length === 0) {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td colspan="3" class="empty-cart">
        No items added to cart
      </td>
    `;

    cartItems.appendChild(row);
  } else {
    cart.forEach((item, index) => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${index + 1}</td>
        <td>${item.service}</td>
        <td>₹${item.price.toFixed(2)}</td>
      `;

      cartItems.appendChild(row);
    });
  }

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  totalAmount.textContent = `₹${total.toFixed(2)}`;
}

const bookingForm = document.getElementById("booking-form");
const bookingMessage = document.getElementById("booking-message");
bookingForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const fullName = document.getElementById("full-name").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();

  bookingMessage.textContent = "";
  bookingMessage.className = "";

  if (cart.length === 0) {
    bookingMessage.textContent = "Please add at least one service to the cart.";
    bookingMessage.classList.add("booking-error");
    return;
  }

  if (fullName === "") {
    bookingMessage.textContent = "Please enter your full name.";
    bookingMessage.classList.add("booking-error");
    return;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(email)) {
    bookingMessage.textContent = "Please enter a valid email address.";
    bookingMessage.classList.add("booking-error");
    return;
  }

  const phonePattern = /^[6-9]\d{9}$/;

  if (!phonePattern.test(phone)) {
    bookingMessage.textContent = "Please enter a valid 10-digit phone number.";
    bookingMessage.classList.add("booking-error");
    return;
  }

  const services = cart
    .map((item) => `${item.service} - ₹${item.price.toFixed(2)}`)
    .join("\n");

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  const templateParams = {
    customer_name: fullName,
    customer_email: email,
    customer_phone: phone,
    services: services,
    total_amount: `₹${total.toFixed(2)}`,
  };

  bookingMessage.textContent = "Sending booking confirmation...";
  bookingMessage.className = "";

  emailjs
    .send("service_ookoiby", "template_u0w3e7w", templateParams)
    .then(() => {
      bookingMessage.textContent =
        "Booking confirmed. Check your email for confirmation.";
      bookingMessage.classList.add("booking-success");

      bookingForm.reset();

      cart.length = 0;
      updateCart();

      document.querySelectorAll(".service button").forEach((button) => {
        updateButton(button, false);
      });
    })
    .catch((error) => {
      console.error(error);
      bookingMessage.textContent = "Booking failed. Please try again.";
      bookingMessage.classList.add("booking-error");
    });
});
