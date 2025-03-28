// Select essential elements
const pancakeType = document.querySelector("#type");
const toppings = document.querySelectorAll(".topping");
const extras = document.querySelectorAll(".extra");
const pancakeForm = document.querySelector("#pancakeForm");
const totalPriceDisplay = document.querySelector("#totalPriceDisplay");
const totalPriceBanner = document.querySelector("#totalPrice");
const summaryText = document.querySelector("#summaryText");
const allOrdersButton = document.querySelector("#allOrder"); 

let orders = JSON.parse(localStorage.getItem("orders")) || [];


// Calculate total price
const changeHandler = (event) => {
  const basePrice = parseFloat(pancakeType.selectedOptions[0].dataset.price);

  const toppingsTotal = [...document.querySelectorAll(".topping:checked")].reduce(
    (acc, topping) => acc + parseFloat(topping.dataset.price),
    0
  );

  const extrasTotal = [...document.querySelectorAll(".extra:checked")].reduce(
    (acc, extra) => acc + parseFloat(extra.dataset.price),
    0
  );

  let deliveryFee = 0;
  const deliveryChecked = document.querySelector(".delivery:checked");
  if (deliveryChecked) {
    deliveryFee = parseFloat(deliveryChecked.dataset.price);
  }

  const totalPrice = basePrice + toppingsTotal + extrasTotal + deliveryFee;
  totalPriceDisplay.textContent = `${totalPrice} €`;
  totalPriceBanner.textContent = `${totalPrice} €`;
};



// Generate unique order ID
const generateOrderId = () => Date.now();


// confirm order and store it
const confirmOrderHandler = () => {
  const nameInput = document.getElementById("customerName");
  const name = nameInput.value || "Anonymous";
  const selectedPancakeType = pancakeType.selectedOptions[0].textContent;
  const deliveryMethod = pancakeForm
    .querySelector('input[name="delivery"]:checked')
    .parentNode.textContent.trim();

  const order = {
    id: generateOrderId(),
    customerName: name,
    selectedPancake: selectedPancakeType,
    toppings: [...document.querySelectorAll(".topping:checked")].map(
      (topping) => topping.parentNode.textContent.trim()
    ),
    extras: [...document.querySelectorAll(".extra:checked")].map(
      (extra) => extra.parentNode.textContent.trim()
    ),
    deliveryMethod,
    totalPrice: parseFloat(totalPriceDisplay.textContent),
    status: "waiting",
  };

  orders.push(order);
  localStorage.setItem("orders", JSON.stringify(orders));

  alert("Order confirmed!");



  // Display order summary
  summaryText.innerHTML = `
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Pancake:</strong> ${selectedPancakeType}</p>
    <p><strong>Toppings:</strong> ${order.toppings.length > 0 ? order.toppings.join(", ") : "No Toppings"}</p>
    <p><strong>Extras:</strong> ${order.extras.length > 0 ? order.extras.join(", ") : "No Extras"}</p>
    <p><strong>Delivery:</strong> ${deliveryMethod}</p>
    <p><strong>Total Price:</strong> ${order.totalPrice}€</p>
  `;
  nameInput.value = "";
};



// Display all orders
function displayAllOrders() {
  document.getElementById("goBackButton").style.display = "block";
  const ordersListDiv = document.getElementById("ordersList");
  ordersListDiv.innerHTML = "";

  orders.forEach((order) => {
    const orderDiv = document.createElement("div");
    orderDiv.classList.add("order-item", order.status);
    orderDiv.innerHTML = `
      <p><strong>ID:</strong> ${order.id}</p>
      <p><strong>Customer Name:</strong> ${order.customerName}</p>
      <p><strong>Pancake Type:</strong> ${order.selectedPancake}</p>
      <p><strong>Toppings:</strong> ${order.toppings.join(", ") || "None"}</p>
      <p><strong>Extras:</strong> ${order.extras.join(", ") || "None"}</p>
      <p><strong>Delivery:</strong> ${order.deliveryMethod}</p>
      <p><strong>Total Price:</strong> ${order.totalPrice}€</p>
      <label for="status">Status:</label>
      <select class="status-dropdown" data-order-id="${order.id}">
        <option value="waiting" ${order.status === "waiting" ? "selected" : ""}>Waiting</option>
        <option value="ready" ${order.status === "ready" ? "selected" : ""}>Ready</option>
        <option value="delivered" ${order.status === "delivered" ? "selected" : ""}>Delivered</option>
      </select>
    `;
    ordersListDiv.appendChild(orderDiv);
  });

  document.querySelectorAll(".status-dropdown").forEach((dropdown) => {
    dropdown.addEventListener("change", (event) => {
      updateOrderStatus(event.target.dataset.orderId, event.target.value);
    });
  });
}



// Update order status
function updateOrderStatus(orderId, newStatus) {
  let order = orders.find((o) => o.id == orderId);
  if (order) {
    order.status = newStatus;
    localStorage.setItem("orders", JSON.stringify(orders));
    displayAllOrders();
  }
}


// Event listener 
allOrdersButton.addEventListener("click", displayAllOrders);
pancakeForm.addEventListener("change", changeHandler);
document.getElementById("confirmOrder").addEventListener("click", confirmOrderHandler);



const themeToggle = document.getElementById("themeToggle");
themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    localStorage.setItem("darkMode", document.body.classList.contains("dark-mode"));
});

if (localStorage.getItem("darkMode") === "true") {
    document.body.classList.add("dark-mode");
}