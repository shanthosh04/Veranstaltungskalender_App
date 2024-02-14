document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    const errorText = document.getElementById("error");

    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const formData = new FormData(loginForm);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch("/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) throw new Error('Fehler beim Senden der Anfrage');

            const { token } = await response.json();
            if (token) {
                localStorage.setItem('token', token);
                window.location.href = "./register.html";
            } else {
                errorText.innerText = "Login fehlgeschlagen!";
            }
        } catch (error) {
            errorText.innerText = error.message;
        }
    });
});
