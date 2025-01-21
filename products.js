document.addEventListener("DOMContentLoaded", () => {
    const API_URL = "http://localhost:3000";
    const productsContainer = document.querySelector(".products-page");
    const addProductNav = document.getElementById("addProductNav");
    const productDetailsPopup = document.getElementById("productDetailsPopup");
    const productFormPopup = document.getElementById("productFormPopup");
    const productForm = document.getElementById("productForm");
    const adminControls = document.getElementById("adminControls");

    const productNamePopup = document.getElementById("productNamePopup");
    const productImagePopup = document.getElementById("productImagePopup");
    const productDescriptionPopup = document.getElementById("productDescriptionPopup");
    const productPricePopup = document.getElementById("productPricePopup");
    const productStockPopup = document.getElementById("productStockPopup");
    const productCategoryPopup = document.getElementById("productCategoryPopup");

    const closeProductDetails = document.getElementById("closeProductDetails");
    const closeProductForm = document.getElementById("closeProductForm");
    const addProductBtn = document.getElementById("addProductBtn");
    const updateProductBtn = document.getElementById("updateProductBtn");
    const deleteProductBtn = document.getElementById("deleteProductBtn");

    let currentProductId = null;

    const getFromLocalStorage = (key) => {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : null;
    };

    const openPopup = (popup) => popup.style.display = "block";
    const closePopup = (popup) => popup.style.display = "none";

    const showToast = (message, type = "success") => {
        const toastContainer = document.getElementById("toast-container");
        const toast = document.createElement("div");
        toast.className = `toast ${type}`;
        toast.textContent = message;
        toastContainer.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    };

    const loadProducts = async () => {
        try {
            const response = await fetch(`${API_URL}/products`);
            const products = await response.json();
            displayProducts(products);
        } catch (error) {
            console.error("Error loading products:", error);
            showToast("Failed to load products. Try again.", "error");
        }
    };

    const displayProducts = (products) => {
        const currentUser = getFromLocalStorage("currentUser");
        const isAdmin = currentUser?.role === "admin";

        productsContainer.innerHTML = products
            .map(
                (product) => `
            <div class="product-card">
                <img src="${product.imageUrl}" alt="${product.name}">
                <h3>${product.name}</h3>
                <button class="btn" onclick="viewProduct('${product.id}')">View</button>
            </div>`
            )
            .join("");

        if (isAdmin) {
            addProductNav.classList.remove("hidden");
        }
    };

    window.viewProduct = async (id) => {
        try {
            const response = await fetch(`${API_URL}/products/${id}`);
            const product = await response.json();

            // Populate product details
            productNamePopup.textContent = product.name;
            productImagePopup.src = product.imageUrl;
            productDescriptionPopup.textContent = product.description;
            productPricePopup.textContent = product.price;
            productStockPopup.textContent = product.stock;
            productCategoryPopup.textContent = product.category;
            currentProductId = product.id;

            const currentUser = getFromLocalStorage("currentUser");
            if (currentUser?.role === "admin") {
                adminControls.classList.remove("hidden");
            } else {
                adminControls.classList.add("hidden");
            }

            openPopup(productDetailsPopup);
        } catch (error) {
            console.error("Error loading product:", error);
            showToast("Failed to load product. Try again.", "error");
        }
    };

    // Update Product
    updateProductBtn.addEventListener("click", async () => {
        const response = await fetch(`${API_URL}/products/${currentProductId}`);
        const product = await response.json();

        document.getElementById("productId").value = product.id;
        document.getElementById("productName").value = product.name;
        document.getElementById("productDescription").value = product.description;
        document.getElementById("productPrice").value = product.price;
        document.getElementById("productStock").value = product.stock;
        document.getElementById("productCategory").value = product.category;
        document.getElementById("productImageUrl").value = product.imageUrl;

        closePopup(productDetailsPopup);
        openPopup(productFormPopup);
    });

    // Delete Product
    deleteProductBtn.addEventListener("click", async () => {
        if (!confirm("Are you sure you want to delete this product?")) return;

        try {
            await fetch(`${API_URL}/products/${currentProductId}`, { method: "DELETE" });
            closePopup(productDetailsPopup);
            loadProducts();
            showToast("Product deleted successfully!", "success");
        } catch (error) {
            console.error("Error deleting product:", error);
            showToast("Failed to delete product. Try again.", "error");
        }
    });

    // Add New Product
    addProductBtn.addEventListener("click", () => {
        document.getElementById("productForm").reset();
        openPopup(productFormPopup);
    });

    // Close Buttons
    closeProductDetails.addEventListener("click", () => closePopup(productDetailsPopup));
    closeProductForm.addEventListener("click", () => closePopup(productFormPopup));

    loadProducts();
});