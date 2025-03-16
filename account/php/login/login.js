function togglePassword() {
    let passwordField = document.getElementById('password');
    let confirmPasswordField = document.getElementById('confirmPassword');
    let togglePasswordBtn = document.getElementById('togglePassword');

    if (passwordField.type === "password") {
        passwordField.type = "text";
        confirmPasswordField.type = "text";
        togglePasswordBtn.innerHTML = "[Hide]";
    } else {
        passwordField.type = "password";
        confirmPasswordField.type = "password";
        togglePasswordBtn.innerHTML = "[Show]";
    }
}