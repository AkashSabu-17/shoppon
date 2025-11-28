// scripts.js - FINAL PERFECT VERSION (All Features Working)

const PRELOADED_PRODUCTS = [
    { id: 1, name: "iPhone 15 Pro", price: 134900, description: "Titanium design, A17 Pro chip", category: "Electronics", image: "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-1inch-bluetitanium?wid=1200&hei=1200&fmt=p-jpg&qlt=95" },
    { id: 2, name: "MacBook Pro M3", price: 169900, description: "14-inch Liquid Retina XDR", category: "Electronics", image: "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/mbp14-spaceblack-select-202310?wid=1800&hei=1800&fmt=jpeg&qlt=95" },
    { id: 3, name: "Samsung Galaxy S24 Ultra", price: 129999, description: "200MP camera, S Pen", category: "Electronics", image: "https://images.samsung.com/is/image/samsung/p6pim/in/2401/gallery/in-galaxy-s24-ultra-sm-s928-sm-s928bzteins-539573-2401?$650_519_PNG$" },
    { id: 4, name: "Sony WH-1000XM5", price: 34990, description: "Best noise cancellation", category: "Electronics", image: "https://www.sony.co.in/image/5d8f3e9b0e9f8d8e9f8d8e9f8d8e9f8d?fmt=png-alpha&wid=660" },
    { id: 5, name: "Nike Air Max 270", price: 12995, description: "Max Air cushioning", category: "Fashion", image: "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/6b66d9bb-41f9-4c70-9d5a-7e8e0c0b0b0a/air-max-270-mens-shoes-KkLcD4.png" },
    { id: 6, name: "Adidas Ultraboost 23", price: 18999, description: "Boost midsole", category: "Fashion", image: "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/f3d5d1e8e8f84e6f9c8aafb9010c7c8f/Ultraboost_23_Shoes_Black_GY7484_01_standard.jpg" },
    { id: 7, name: "Ray-Ban Aviator", price: 12990, description: "Classic gold frame", category: "Fashion", image: "https://static.ray-ban.com/images/ray-ban/product/medium/0RB3025_001_58.png" },
    { id: 8, name: "Dyson Supersonic", price: 36900, description: "Fast drying hair dryer", category: "Beauty", image: "https://media.dyson.com/media/images/v1/supersonic/hd08/supersonic-hd08-iron-fuchsia/hero/supersonic-hd08-iron-fuchsia-01.jpg" },
    { id: 9, name: "OnePlus 12", price: 69999, description: "Snapdragon 8 Gen 3", category: "Electronics", image: "https://image01.oneplus.net/ebp/202401/17/1-M00-51-1B-rB8LBmYd2t2AH3p7AAC4pV3m9eU887.png" },
    { id: 10, name: "boAt Airdopes 141", price: 1499, description: "50hrs playback", category: "Electronics", image: "https://www.boat-lifestyle.com/cdn/shop/files/Airdopes_141_Black_1_600x.png?v=1722580143" }
];

// Initialize Data
if (!localStorage.getItem('products')) {
    localStorage.setItem('products', JSON.stringify(PRELOADED_PRODUCTS));
}
if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify([
        { id: 1, name: "Admin", email: "admin@gmail.com", password: "admin123" }
    ]));
}

// Snackbar
function showSnackbar(msg, type = 'success') {
    const div = document.createElement('div');
    div.className = `alert alert-${type === 'danger' ? 'danger' : 'success'} position-fixed`;
    div.style.cssText = 'bottom:20px; right:20px; z-index:9999; border-radius:12px; min-width:320px; box-shadow:0 10px 30px rgba(0,0,0,0.4);';
    div.innerHTML = `${msg} <button type="button" class="btn-close" data-bs-dismiss="alert"></button>`;
    document.body.appendChild(div);
    setTimeout(() => div.remove(), 4000);
}

// Auth Functions
function checkLogin() {
    if (!localStorage.getItem('loggedInUser') && 
        !['login.html','register.html'].includes(location.pathname.split('/').pop())) {
        location.href = 'login.html';
    }
    updateNavbar();
}

function updateNavbar() {
    const nav = document.getElementById('addProductNav');
    if (nav && localStorage.getItem('loggedInUser') === 'admin@gmail.com') {
        nav.style.display = 'block';
    }
}

function logout() {
    localStorage.removeItem('loggedInUser');
    showSnackbar('Logged out successfully');
    setTimeout(() => location.href = 'login.html', 1000);
}

function registerUser(e) {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirm = document.getElementById('confirm_password').value;

    if (password !== confirm) return showSnackbar('Passwords do not match', 'danger');
    if (password.length < 6) return showSnackbar('Password must be 6+ characters', 'danger');

    let users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.find(u => u.email === email)) return showSnackbar('Email already registered', 'danger');

    users.push({ id: Date.now(), name, email, password });
    localStorage.setItem('users', JSON.stringify(users));
    showSnackbar('Registration successful!');
    setTimeout(() => location.href = 'login.html', 2000);
}

function loginUser(e) {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        localStorage.setItem('loggedInUser', email);
        showSnackbar('Welcome back!');
        setTimeout(() => location.href = 'index.html', 1500);
    } else {
        showSnackbar('Invalid email or password', 'danger');
    }
}

// Cart Key
function getCartKey() {
    return 'cart_' + (localStorage.getItem('loggedInUser') || 'guest');
}

// Load Products (with "Already in Cart")
function loadProducts(filter = 'all') {
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const container = document.getElementById('productGrid') || document.getElementById('featuredGrid');
    if (!container) return;
    container.innerHTML = '';

    const cart = JSON.parse(localStorage.getItem(getCartKey()) || '[]');
    const isAdmin = localStorage.getItem('loggedInUser') === 'admin@gmail.com';
    const filtered = filter === 'all' ? products : products.filter(p => p.category === filter);

    filtered.forEach(p => {
        const inCart = cart.some(i => i.productId == p.id);
        container.innerHTML += `
            <div class="col-md-6 col-lg-4 mb-4">
                <div class="card h-100">
                    <img src="${p.image}" class="card-img-top" alt="${p.name}"
                         onerror="this.src='https://via.placeholder.com/400x300/cfd8dc/555555?text=${encodeURIComponent(p.name)}'">
                    <div class="card-body d-flex flex-column text-dark">
                        <h5 class="card-title">${p.name}</h5>
                        <span class="badge mb-2">${p.category}</span>
                        <p class="card-text flex-grow-1">${p.description}</p>
                        <h4 class="text-primary mb-3">₹${p.price.toLocaleString('en-IN')}</h4>
                        <button class="btn ${inCart ? 'btn-secondary' : 'btn-primary'} mt-auto"
                                ${inCart ? 'disabled' : `onclick="addToCart(${p.id})"`}>
                            ${inCart ? 'Already in Cart' : 'Add to Cart'}
                        </button>
                        ${isAdmin ? `
                        <div class="mt-3 text-center">
                            <a href="edit_product.html?id=${p.id}" class="btn btn-warning btn-sm">Edit</a>
                            <button class="btn btn-danger btn-sm ms-2" onclick="deleteProduct(${p.id})">Delete</button>
                        </div>` : ''}
                    </div>
                </div>
            </div>`;
    });
}

// Cart Functions
function addToCart(id) {
    let cart = JSON.parse(localStorage.getItem(getCartKey()) || '[]');
    const item = cart.find(i => i.productId == id);
    if (item) item.quantity += 1;
    else cart.push({ productId: parseInt(id), quantity: 1 });
    localStorage.setItem(getCartKey(), JSON.stringify(cart));
    showSnackbar('Added to cart!');
    loadProducts();
}

function loadCart() {
    const cart = JSON.parse(localStorage.getItem(getCartKey()) || '[]');
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const tbody = document.getElementById('cartBody');
    if (!tbody) return;

    tbody.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        const p = products.find(pr => pr.id == item.productId);
        if (p) {
            const subtotal = p.price * item.quantity;
            total += subtotal;
            tbody.innerHTML += `
                <tr>
                    <td>${p.name}</td>
                    <td>₹${p.price.toLocaleString('en-IN')}</td>
                    <td><input type="number" value="${item.quantity}" min="1" class="form-control w-50" onchange="updateQty(${p.id}, this.value)"></td>
                    <td>₹${subtotal.toLocaleString('en-IN')}</td>
                    <td><button class="btn btn-danger btn-sm" onclick="removeFromCart(${p.id})">Remove</button></td>
                </tr>`;
        }
    });
    document.getElementById('totalPrice').textContent = total.toLocaleString('en-IN');
}

function updateQty(id, qty) {
    if (qty < 1) return;
    let cart = JSON.parse(localStorage.getItem(getCartKey()) || '[]');
    const item = cart.find(i => i.productId == id);
    if (item) {
        item.quantity = parseInt(qty);
        localStorage.setItem(getCartKey(), JSON.stringify(cart));
        loadCart();
    }
}

function removeFromCart(id) {
    let cart = JSON.parse(localStorage.getItem(getCartKey()) || '[]');
    cart = cart.filter(i => i.productId != id);
    localStorage.setItem(getCartKey(), JSON.stringify(cart));
    loadCart();
    loadProducts();
    showSnackbar('Item removed');
}

// Admin Functions
function deleteProduct(id) {
    if (confirm('Are you sure you want to delete this product?')) {
        let products = JSON.parse(localStorage.getItem('products') || '[]');
        products = products.filter(p => p.id != id);
        localStorage.setItem('products', JSON.stringify(products));
        loadProducts();
        showSnackbar('Product deleted');
    }
}

function addProduct(e) {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const price = parseFloat(document.getElementById('price').value);
    const desc = document.getElementById('description').value.trim();
    const imageUrl = document.getElementById('imageUrl')?.value.trim() || '';
    const imageFile = document.getElementById('imageFile')?.files[0];
    const category = document.getElementById('category').value;

    if (!name || !price || !desc || !category || (!imageUrl && !imageFile)) {
        return showSnackbar('All fields are required', 'danger');
    }

    const saveProduct = (imageData) => {
        let products = JSON.parse(localStorage.getItem('products') || '[]');
        products.push({ id: Date.now(), name, price, description: desc, image: imageData, category });
        localStorage.setItem('products', JSON.stringify(products));
        showSnackbar('Product added successfully!');
        setTimeout(() => location.href = 'shop.html', 1500);
    };

    if (imageFile) {
        const reader = new FileReader();
        reader.onload = e => saveProduct(e.target.result);
        reader.readAsDataURL(imageFile);
    } else {
        saveProduct(imageUrl);
    }
}

function loadProductForEdit() {
    const id = new URLSearchParams(location.search).get('id');
    if (!id) return location.href = 'shop.html';
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const p = products.find(x => x.id == id);
    if (!p) return location.href = 'shop.html';

    document.getElementById('productId').value = id;
    document.getElementById('name').value = p.name;
    document.getElementById('price').value = p.price;
    document.getElementById('description').value = p.description;
    document.getElementById('imageUrl').value = p.image.startsWith('http') ? p.image : '';
    document.getElementById('preview').src = p.image;
    document.getElementById('preview').style.display = 'block';
    document.getElementById('category').value = p.category;
}

function editProduct(e) {
    e.preventDefault();
    const id = document.getElementById('productId').value;
    const name = document.getElementById('name').value.trim();
    const price = parseFloat(document.getElementById('price').value);
    const desc = document.getElementById('description').value.trim();
    const imageUrl = document.getElementById('imageUrl').value.trim();
    const imageFile = document.getElementById('imageFile').files[0];
    const category = document.getElementById('category').value;

    const saveUpdate = (imageData) => {
        let products = JSON.parse(localStorage.getItem('products') || '[]');
        const index = products.findIndex(p => p.id == id);
        products[index] = { id: parseInt(id), name, price, description: desc, image: imageData, category };
        localStorage.setItem('products', JSON.stringify(products));
        showSnackbar('Product updated!');
        setTimeout(() => location.href = 'shop.html', 1500);
    };

    if (imageFile) {
        const reader = new FileReader();
        reader.onload = e => saveUpdate(e.target.result);
        reader.readAsDataURL(imageFile);
    } else if (imageUrl) {
        saveUpdate(imageUrl);
    } else {
        const oldImage = JSON.parse(localStorage.getItem('products') || '[]').find(p => p.id == id).image;
        saveUpdate(oldImage);
    }
}