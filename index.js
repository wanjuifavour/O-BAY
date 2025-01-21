document.addEventListener("DOMContentLoaded", () => {
    const popup = document.getElementById("popup");
    const regPopup = document.getElementById("regPopup");
    const adminPopup = document.getElementById("adminPopup");

    const adminLoginBtn = document.getElementById("adminLoginBtn");
    const registerBtns = document.querySelectorAll(".rg-btn");
    const loginBtn = document.querySelector(".lg-btn");
    const closePopup = document.getElementById("closePopup");
    const closeRegPopup = document.getElementById("closeRegPopup");
    const closeAdminPopup = document.getElementById("closeAdminPopup");

    const registerForm = document.getElementById("registerForm");
    const loginForm = document.getElementById("loginForm");
    const adminForm = document.getElementById("adminForm");

    const API_URL = "http://localhost:3000";

    // Toast
    const showToast = (message, type = "success") => {
        const toastContainer = document.getElementById("toast-container");
        const toast = document.createElement("div");
        toast.className = `toast ${type}`;
        toast.textContent = message;

        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, 3000); 
    };

    // Close popups
    const closeAllPopups = () => {
        [popup, regPopup, adminPopup].forEach((el) => {
            if (el) el.style.display = "none";
        });
    };

    // Show popup
    const showPopup = (popupToShow) => {
        closeAllPopups();
        if (popupToShow) popupToShow.style.display = "block";
    };

    // Login
    const login = async (email, password, isAdmin = false) => {
        try {
            const endpoint = isAdmin ? "/admins" : "/users";
            const response = await fetch(`${API_URL}${endpoint}`);
            const accounts = await response.json();

            const account = accounts.find(
                (a) => a.email === email && a.password === password
            );

            if (account) {
                localStorage.setItem("currentUser", JSON.stringify(account));
                window.location.href = "products.html"; // Redirect to products page
            } else {
                showToast("Invalid credentials! Please try again.", "error");
            }
        } catch (error) {
            console.error("Login error:", error);
            showToast("Login failed. Please try again later.", "error");
        }
    };

    // Event listeners
    if (registerForm) {
        registerForm.addEventListener("submit", async (event) => {
            event.preventDefault();
            const name = registerForm.querySelector('input[type="text"]').value.trim();
            const email = registerForm.querySelector('input[type="email"]').value.trim();
            const password = registerForm.querySelector('input[type="password"]').value;

            try {
                const response = await fetch(`${API_URL}/users`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ name, email, password, role: "user", cart: [] }),
                });

                if (response.ok) {
                    showToast("Registration successful! Proceed to login.", "success");
                    showPopup(popup); // Open login popup after registration
                } else {
                    showToast("Registration failed. Email may already be in use.", "error");
                }
            } catch (error) {
                console.error("Registration error:", error);
                showToast("Registration failed. Please try again.", "error");
            }
        });
    }

    if (loginForm) {
        loginForm.addEventListener("submit", async (event) => {
            event.preventDefault();
            const email = loginForm.querySelector('input[type="email"]').value.trim();
            const password = loginForm.querySelector('input[type="password"]').value;
            await login(email, password, false); // User login
        });
    }

    if (adminForm) {
        adminForm.addEventListener("submit", async (event) => {
            event.preventDefault();
            const email = adminForm.querySelector('input[type="email"]').value.trim();
            const password = adminForm.querySelector('input[type="password"]').value;
            await login(email, password, true); // Admin login
        });
    }

    // Event listeners (popups)
    registerBtns.forEach((btn) =>
        btn.addEventListener("click", () => showPopup(regPopup))
    );

    if (loginBtn) loginBtn.addEventListener("click", () => showPopup(popup));

    if (adminLoginBtn) {
        adminLoginBtn.addEventListener("click", () => showPopup(adminPopup));
    }

    [closePopup, closeRegPopup, closeAdminPopup].forEach((btn) => {
        if (btn) btn.addEventListener("click", closeAllPopups);
    });

    // Close popups
    window.onclick = (event) => {
        if ([popup, regPopup, adminPopup].includes(event.target)) {
            closeAllPopups();
        }
    };
});
