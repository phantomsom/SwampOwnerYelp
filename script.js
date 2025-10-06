document.addEventListener("DOMContentLoaded", function () {
    const pushupsForm = document.getElementById("pushupForm");
    const pushupsInput = document.getElementById("pushups");
    const statusMessage = document.getElementById("statusMessage");
    const totalPushupsDisplay = document.getElementById("totalPushups");
    const pushupsRequiredDisplay = document.getElementById("pushupsRequired");

    const requiredForReview = 100;

    // Load from localStorage
    let totalPushups = parseInt(localStorage.getItem("totalPushups")) || 0;
    let lastLoggedDate = localStorage.getItem("lastLoggedDate"); // format: YYYY-MM-DD

    function getTodayDateStr() {
        return new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"
    }

    function updateDisplay() {
        totalPushupsDisplay.textContent = totalPushups;
        const remaining = Math.max(0, requiredForReview - totalPushups);
        pushupsRequiredDisplay.textContent = remaining;

		const notifyForm = document.getElementById("notifyForm");
		if (remaining === 0) {
			notifyForm.style.display = "block";
		} else {
			notifyForm.style.display = "none";
		}

        if (remaining === 0) {
            statusMessage.innerHTML =
                "<strong>🎉 Congrats!</strong> You're eligible for the bi-yearly swamp review!";
        } else {
            statusMessage.textContent = `Only ${remaining} more push-ups to go!`;
        }
    }

    pushupsForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const today = getTodayDateStr();

        if (lastLoggedDate === today) {
            statusMessage.textContent =
                "⏳ You’ve already logged push-ups today. Come back tomorrow!";
            return;
        }

        const dailyPushups = parseInt(pushupsInput.value);
        if (dailyPushups > 0) {
            totalPushups += dailyPushups;
            lastLoggedDate = today;

            localStorage.setItem("totalPushups", totalPushups);
            localStorage.setItem("lastLoggedDate", lastLoggedDate);

            updateDisplay();
            statusMessage.textContent = "✅ Logged successfully for today!";
            pushupsInput.value = "";
        } else {
            statusMessage.textContent = "Please enter a valid number of push-ups.";
        }
    });

    updateDisplay();
});
