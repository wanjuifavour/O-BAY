// Login and Register
let popup = document.getElementById("popup");
let registerBtns = document.querySelectorAll(".rg-btn");
let loginBtn = document.querySelector(".lg-btn");
let closePopup = document.getElementById("closePopup");
let adminPopup = document.getElementById("adminPopup");
let adminLoginBtn = document.getElementById("adminLoginBtn");
let closeAdminPopup = document.getElementById("closeAdminPopup");
let regPopup = document.getElementById("regPopup");
let closeRegPopup = document.getElementById("closeRegPopup");
let adminPushLoginBtn = document.querySelector(".admin-push-login");
let regForm = document.getElementById("registerForm");

function closeAllPopups() {
    popup.style.display = "none";
    adminPopup.style.display = "none";
    regPopup.style.display = "none";
}

registerForm.addEventListener ('submit', (event) => {
    event.preventDefault();
    closeAllPopups();
    // Save User Data

    popup.style.display = "block";
});

registerBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        closeAllPopups();
        regPopup.style.display = "block";
    });
});

loginBtn.onclick = () => {
    closeAllPopups();
    popup.style.display = "block"; 
};

adminLoginBtn.onclick = () => {
    closeAllPopups();
    adminPopup.style.display = "block";
};

closePopup.onclick = () => {
    popup.style.display = "none";
};

closeAdminPopup.onclick = () => {
    adminPopup.style.display = "none";
};

closeRegPopup.onclick = () => {
    regPopup.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == popup) {
        popup.style.display = "none";
    } else if (event.target == adminPopup) {
        adminPopup.style.display = "none";
    } else if (event.target == regPopup) {
        regPopup.style.display = "none";
    }
};

adminPushLoginBtn.onclick = () => {
    window.location.href = "/products.html"
}