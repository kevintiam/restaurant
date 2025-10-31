document.addEventListener("DOMContentLoaded", () => {
  const loginContainer = document.getElementById("login-container");
  const registerBascule = document.getElementById("register-bascule");
  const loginBascule = document.getElementById("login-bascule");
  const registerBack = document.getElementById("toggle-register-back");

  if (registerBascule) {
    registerBascule.addEventListener("click", (e) => {
      e.preventDefault();
      loginContainer.classList.add("show-register");
    });
  }

  const showLoginPanel = (e) => {
    e.preventDefault();
    loginContainer.classList.remove("show-register");
  };

  if (loginBascule) {
    loginBascule.addEventListener("click", showLoginPanel);
  }
  if (registerBack) {
    registerBack.addEventListener("click", showLoginPanel);
  }
});
