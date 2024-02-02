document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.getElementById("registerForm");
    const errorText = document.getElementById("error");

    registerForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const formData = new FormData(registerForm);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch("/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) throw new Error('Fehler beim Senden der Anfrage');

            const result = await response.json();
            if (result.success) {
                window.location.href = "./login.html";
            } else {
                errorText.innerText = "Registrierung fehlgeschlagen!";
            }
        } catch (error) {
            errorText.innerText = error.message;
        }
    });
});
