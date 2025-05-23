function togglePassword() {
    let passwordField = document.getElementById('password');
    let confirmPasswordField = document.getElementById('confirmPassword');
    let togglePasswordBtn = document.getElementById('togglePassword');

    if (passwordField.type === "password") {
        passwordField.type = "text";
        if (confirmPasswordField) {
            confirmPasswordField.type = "text";
        }
        togglePasswordBtn.innerHTML = "[Hide]";
    } else {
        passwordField.type = "password";
        if (confirmPasswordField) {
            confirmPasswordField.type = "password";
        }
        togglePasswordBtn.innerHTML = "[Show]";
    }
}


document.addEventListener('DOMContentLoaded', function() {
    const fields = ['displayname', 'username', 'email'];

    fields.forEach(function(fieldId) {
        const field = document.getElementById(fieldId);
        if (field && sessionStorage.getItem(fieldId)) {
            field.value = sessionStorage.getItem(fieldId);
        }
        if (field) {
            field.addEventListener('input', function() {
                sessionStorage.setItem(fieldId, field.value);
            });
        }
    });
});
