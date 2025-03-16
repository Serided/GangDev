    function togglePassword(fieldId) {
    var passwordField = document.getElementById(fieldId);
    var toggleIcon = passwordField.nextElementSibling;

    if (passwordField.type === "password") {
        passwordField.type = "text";
        toggleIcon.innerHTML = "[Hide]"; // Change to hide icon
    } else {
        passwordField.type = "password";
        toggleIcon.innerHTML = "[Show]"; // Change to show icon
    }
}