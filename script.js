// NEXORA - E-Commerce Store

const products = [
    {
        id: 1,
        name: "Classic White Sneakers",
        category: "Footwear",
        price: 2499,
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600",
        description: "Comfortable everyday sneakers with a clean, modern design."
    },
    {
        id: 2,
        name: "Premium Leather Bag",
        category: "Accessories",
        price: 3299,
        rating: 4.7,
        image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600",
        description: "A stylish everyday bag with a premium finish."
    },
    {
        id: 3,
        name: "Minimal Black Watch",
        category: "Accessories",
        price: 1899,
        rating: 4.6,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600",
        description: "A minimalist watch suitable for everyday wear."
    },
    {
        id: 4,
        name: "Casual Cotton T-Shirt",
        category: "Clothing",
        price: 899,
        rating: 4.5,
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600",
        description: "Soft cotton T-shirt designed for everyday comfort."
    },
    {
        id: 5,
        name: "Modern Sunglasses",
        category: "Accessories",
        price: 1499,
        rating: 4.6,
        image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600",
        description: "Modern sunglasses with a timeless look."
    },
    {
        id: 6,
        name: "Running Sports Shoes",
        category: "Footwear",
        price: 2799,
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=600",
        description: "Lightweight sports shoes for daily activities."
    },
    {
        id: 7,
        name: "Premium Denim Jacket",
        category: "Clothing",
        price: 2199,
        rating: 4.7,
        image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600",
        description: "A versatile denim jacket with a modern fit."
    },
    {
        id: 8,
        name: "Classic Backpack",
        category: "Accessories",
        price: 1799,
        rating: 4.5,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600",
        description: "A practical backpack for work, travel and everyday use."
    },
    {
        id: 9,
        name: "Casual Running Shoes",
        category: "Footwear",
        price: 2999,
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1495555961986-6d4c1ecb7be3?w=600",
        description: "Comfort-focused shoes with a sporty design."
    }
];

// Safe LocalStorage loading
function loadStorage(key, fallback) {
    try {
        const data = JSON.parse(localStorage.getItem(key));
        return Array.isArray(data) ? data : fallback;
    } catch {
        return fallback;
    }
}

let cart = loadStorage("nexoraCart", []);
let wishlist = loadStorage("nexoraWishlist", []);

cart = cart
    .filter(item => products.some(product => product.id === item.id))
    .map(item => ({
        id: item.id,
        quantity: Math.max(1, Number(item.quantity) || 1)
    }));

wishlist = wishlist.filter(id =>
    products.some(product => product.id === id)
);

let showWishlistOnly = false;

// Save data
function saveData() {
    localStorage.setItem("nexoraCart", JSON.stringify(cart));
    localStorage.setItem("nexoraWishlist", JSON.stringify(wishlist));
}

// Currency formatting
function formatPrice(price) {
    return "₹" + price.toLocaleString("en-IN");
}

// Product rendering
function renderProducts() {
    const container = document.getElementById("productContainer");

    if (!container) return;

    const search = document.getElementById("searchInput").value.toLowerCase();
    const category = document.getElementById("categoryFilter").value;
    const sort = document.getElementById("sortSelect").value;

    let filteredProducts = products.filter(product => {
        const matchesSearch =
            product.name.toLowerCase().includes(search) ||
            product.category.toLowerCase().includes(search);

        const matchesCategory =
            category === "all" || product.category === category;

        const matchesWishlist =
            !showWishlistOnly || wishlist.includes(product.id);

        return matchesSearch && matchesCategory && matchesWishlist;
    });

    if (sort === "low") {
        filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sort === "high") {
        filteredProducts.sort((a, b) => b.price - a.price);
    } else if (sort === "rating") {
        filteredProducts.sort((a, b) => b.rating - a.rating);
    }

    if (filteredProducts.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <h4>No products found</h4>
                <p class="text-muted">Try another search or category.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = filteredProducts.map(product => `
        <div class="col-lg-4 col-md-6 mb-4">
            <div class="product-card h-100">
                <div class="product-image-wrapper">
                    <img src="${product.image}"
                         alt="${product.name}"
                         class="product-image"
                         loading="lazy">

                    <button class="wishlist-btn"
                            onclick="toggleWishlist(${product.id})"
                            aria-label="Toggle wishlist">
                        <i class="bi ${wishlist.includes(product.id)
                            ? "bi-heart-fill"
                            : "bi-heart"}"></i>
                    </button>
                </div>

                <div class="product-info">
                    <p class="product-category">${product.category}</p>
                    <h5>${product.name}</h5>

                    <div class="product-rating">
                        <i class="bi bi-star-fill"></i>
                        ${product.rating}
                    </div>

                    <div class="product-bottom">
                        <strong>${formatPrice(product.price)}</strong>

                        <button class="btn btn-dark btn-sm"
                                onclick="addToCart(${product.id})">
                            Add to Cart
                        </button>
                    </div>

                    <button class="btn btn-link btn-sm p-0 mt-2"
                            onclick="showProductDetails(${product.id})">
                        View Details
                    </button>
                </div>
            </div>
        </div>
    `).join("");
}

// Search, category and sorting
document.getElementById("searchInput").addEventListener("input", renderProducts);
document.getElementById("categoryFilter").addEventListener("change", renderProducts);
document.getElementById("sortSelect").addEventListener("change", renderProducts);

// Wishlist
function toggleWishlist(id) {
    if (wishlist.includes(id)) {
        wishlist = wishlist.filter(item => item !== id);
        showToast("Removed from wishlist");
    } else {
        wishlist.push(id);
        showToast("Added to wishlist");
    }

    saveData();
    renderProducts();
    updateCounts();
}

function toggleWishlistView() {
    showWishlistOnly = !showWishlistOnly;

    document.getElementById("productContainer").scrollIntoView({
        behavior: "smooth"
    });

    renderProducts();
}

// Cart
function addToCart(id) {
    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ id, quantity: 1 });
    }

    saveData();
    updateCart();
    showToast("Product added to cart");
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);

    saveData();
    updateCart();
}

function changeQuantity(id, amount) {
    const item = cart.find(item => item.id === id);

    if (!item) return;

    item.quantity += amount;

    if (item.quantity <= 0) {
        removeFromCart(id);
        return;
    }

    saveData();
    updateCart();
}

function updateCart() {
    const cartItems = document.getElementById("cartItems");
    const cartTotal = document.getElementById("cartTotal");

    const totalItems = cart.reduce(
        (sum, item) => sum + item.quantity, 0
    );

    document.getElementById("cartCount").textContent = totalItems;

    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="text-center py-5">
                <i class="bi bi-bag fs-1"></i>
                <p class="mt-3">Your cart is empty.</p>
            </div>
        `;

        cartTotal.textContent = formatPrice(0);
        return;
    }

    cartItems.innerHTML = cart.map(item => {
        const product = products.find(p => p.id === item.id);

        return `
            <div class="cart-item">
                <img src="${product.image}" alt="${product.name}">

                <div class="cart-item-info">
                    <h6>${product.name}</h6>
                    <strong>${formatPrice(product.price)}</strong>

                    <div class="quantity-controls">
                        <button onclick="changeQuantity(${product.id}, -1)">−</button>
                        <span>${item.quantity}</span>
                        <button onclick="changeQuantity(${product.id}, 1)">+</button>
                    </div>
                </div>

                <button class="btn btn-sm text-danger"
                        onclick="removeFromCart(${product.id})"
                        aria-label="Remove product">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        `;
    }).join("");

    const total = cart.reduce((sum, item) => {
        const product = products.find(p => p.id === item.id);
        return sum + product.price * item.quantity;
    }, 0);

    cartTotal.textContent = formatPrice(total);
}

// Cart drawer
function openCart() {
    document.getElementById("cartDrawer").classList.add("open");
    document.getElementById("cartOverlay").classList.add("show");
}

function closeCart() {
    document.getElementById("cartDrawer").classList.remove("open");
    document.getElementById("cartOverlay").classList.remove("show");
}

// Product details
function showProductDetails(id) {
    const product = products.find(item => item.id === id);

    if (!product) return;

    document.getElementById("modalContent").innerHTML = `
        <div class="row align-items-center">
            <div class="col-md-6">
                <img src="${product.image}"
                     alt="${product.name}"
                     class="img-fluid rounded">
            </div>

            <div class="col-md-6 mt-3 mt-md-0">
                <p class="text-muted">${product.category}</p>
                <h3>${product.name}</h3>

                <p>
                    <i class="bi bi-star-fill text-warning"></i>
                    ${product.rating}
                </p>

                <h4>${formatPrice(product.price)}</h4>
                <p>${product.description}</p>

                <button class="btn btn-dark"
                        onclick="addToCart(${product.id})">
                    Add to Cart
                </button>
            </div>
        </div>
    `;

    const modal = new bootstrap.Modal(
        document.getElementById("productModal")
    );

    modal.show();
}

// Toast notification
function showToast(message) {
    const toast = document.getElementById("toastMessage");

    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}

// Checkout
document.getElementById("checkoutForm").addEventListener("submit", function(event) {
    event.preventDefault();

    if (!this.checkValidity()) {
        this.reportValidity();
        return;
    }

    if (cart.length === 0) {
        showToast("Your cart is empty");
        return;
    }

    alert("Thank you for shopping at NEXORA! Your demo order has been placed.");

    cart = [];
    saveData();
    updateCart();

    this.reset();

    const checkoutModal = bootstrap.Modal.getInstance(
        document.getElementById("checkoutModal")
    );

    if (checkoutModal) {
        checkoutModal.hide();
    }

    closeCart();
});

// Open checkout
function openCheckout() {
    if (cart.length === 0) {
        showToast("Please add products to your cart first");
        return;
    }

    closeCart();

    const modal = new bootstrap.Modal(
        document.getElementById("checkoutModal")
    );

    modal.show();
}

// Initial setup
function updateCounts() {
    document.getElementById("wishlistCount").textContent = wishlist.length;
    document.getElementById("cartCount").textContent =
        cart.reduce((sum, item) => sum + item.quantity, 0);
}

renderProducts();
updateCounts();
updateCart();

// Cart navigation buttons
document.getElementById("cartNav").addEventListener("click", openCart);

document.getElementById("closeCart").addEventListener("click", closeCart);

document.getElementById("cartOverlay").addEventListener("click", closeCart);

// Checkout button
document.getElementById("checkoutBtn").addEventListener("click", openCheckout);

// Wishlist navigation
document.getElementById("wishlistNav").addEventListener("click", toggleWishlistView);

// Close cart with Escape key
document.addEventListener("keydown", function(event) {
    if (event.key === "Escape") {
        closeCart();
    }
});