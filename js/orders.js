
function displayAllOrders() {
    const ordersListDiv = document.getElementById("ordersList");
    ordersListDiv.innerHTML = "";

    let orders = JSON.parse(localStorage.getItem("orders")) || [];

    orders.forEach((order) => {
        const orderDiv = document.createElement("div");
        orderDiv.classList.add("order-item", order.status);
        orderDiv.dataset.orderId = order.id;
        orderDiv.innerHTML = `
            <p><strong>ID:</strong> ${order.id}</p>
            <p><strong>Customer:</strong> ${order.customerName}</p>
            <p><strong>Pancake:</strong> ${order.selectedPancake}</p>
            <p><strong>Delivery:</strong> ${order.deliveryMethod}</p>
            <p><strong>Total Price:</strong> ${order.totalPrice}€</p>
            <label>Status:
                <select class="status-dropdown" data-order-id="${order.id}">
                    <option value="waiting" ${order.status === "waiting" ? "selected" : ""}>Waiting</option>
                    <option value="ready" ${order.status === "ready" ? "selected" : ""}>Ready</option>
                    <option value="delivered" ${order.status === "delivered" ? "selected" : ""}>Delivered</option>
                    <option value="canceled" ${order.status === "canceled" ? "selected" : ""}>Canceled</option>
                </select>
            </label>
        `;
        ordersListDiv.appendChild(orderDiv);
    });


    document.querySelectorAll(".status-dropdown").forEach((dropdown) => {
        dropdown.addEventListener("change", (event) => {
            updateOrderStatus(event.target.dataset.orderId, event.target.value);
        });
    });
}

function updateOrderStatus(orderId, newStatus) {
    let orders = JSON.parse(localStorage.getItem("orders")) || [];
    let order = orders.find((o) => o.id == orderId);

    if (order) {
        if (newStatus === "delivered") {
            removeOrder(orderId);
        } else {
            order.status = newStatus;
            localStorage.setItem("orders", JSON.stringify(orders));

            const orderDiv = document.querySelector(`.order-item[data-order-id="${orderId}"]`);
            if (orderDiv) {
                orderDiv.className = `order-item ${newStatus}`;
            }
        }
    }
}


function removeOrder(orderId) {
    let orders = JSON.parse(localStorage.getItem("orders")) || [];

    orders = orders.filter((order) => order.id !== parseInt(orderId));
    localStorage.setItem("orders", JSON.stringify(orders));
    displayAllOrders();  
}


displayAllOrders();

const allOrdersButton = document.getElementById("allOrder");
allOrdersButton.addEventListener("click", displayAllOrders);





