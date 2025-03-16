    function togglePassword(fieldId) {
    var passwordField = document.getElementById(fieldId);
    let togglePassword = document.getElementById('togglePassword');

    if (passwordField.type === "password") {
        passwordField.type = "text";
        togglePassword.innerHTML = "[Hide]"; // Change to hide icon
    } else {
        passwordField.type = "password";
        togglePassword.innerHTML = "[Show]"; // Change to show icon
    }
}