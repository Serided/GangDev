function togglePassword(fieldId) {
    var passwordField = document.getElementById(fieldId);
    let togglePasswordBtn = document.getElementById('togglePassword');

    if (passwordField.type === "password") {
        passwordField.type = "text";
        togglePasswordBtn.innerHTML = "[Hide]"; // Change to hide icon
    } else {
        passwordField.type = "password";
        togglePasswordBtn.innerHTML = "[Show]"; // Change to show icon
    }
}