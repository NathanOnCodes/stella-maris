document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('togglePassword');
    const passwordInput = document.querySelector('input[type="password"], input[type="text"]#id_senha');

    if (toggleBtn && passwordInput) {
        toggleBtn.addEventListener('click', () => {
            const isPassword = passwordInput.type === 'password';
            passwordInput.type = isPassword ? 'text' : 'password';
            toggleBtn.querySelector('i').classList.toggle('bi-eye');
            toggleBtn.querySelector('i').classList.toggle('bi-eye-slash');
        });
    }
});