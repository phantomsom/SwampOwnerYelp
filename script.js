document.addEventListener("DOMContentLoaded", function () {
  const pushupsForm = document.getElementById("pushupForm");
  const princessNameInput = document.getElementById("princessName");
  const pushupsInput = document.getElementById("pushups");
  const statusMessage = document.getElementById("statusMessage");
  const totalPushupsDisplay = document.getElementById("totalPushups");
  const pushupsRequiredDisplay = document.getElementById("pushupsRequired");
  const requiredForReview = 100;
  const notifyForm = document.getElementById("notifyForm");  // Review form

  // Helper to get today's date in YYYY-MM-DD
  function getTodayDateStr() {
    return new Date().toISOString().split("T")[0];
  }

  // Load princess data from localStorage or initialize empty object
  let princessData = JSON.parse(localStorage.getItem("princessData")) || {};

  // Seed example princesses if none found
  if (!localStorage.getItem("princessData")) {
    const exampleData = {
      "Fiona": { totalPushups: 40, lastLoggedDate: null },
      "Farquaad": { totalPushups: 95, lastLoggedDate: null },
      "Dragon": { totalPushups: 100, lastLoggedDate: null }
    };
    localStorage.setItem("princessData", JSON.stringify(exampleData));
    princessData = exampleData;
  }

  // Set initial princess to display
  princessNameInput.value = "Jazzmiona";
  updateDisplayForPrincess("Jazzmiona");
  const princessStatusList = document.getElementById("princessStatusList");

  updatePrincessStatusList();
  // Function to update the display for the current princess
  function updateDisplayForPrincess(name) {
    if (!name || !princessData[name]) {
      totalPushupsDisplay.textContent = 0;
      pushupsRequiredDisplay.textContent = requiredForReview;
      statusMessage.textContent = "❗ Enter your name and log push-ups! ❗";
      return;
    }

    const totalPushups = princessData[name].totalPushups || 0;
    totalPushupsDisplay.textContent = totalPushups;

    const remaining = Math.max(0, requiredForReview - totalPushups);
    pushupsRequiredDisplay.textContent = remaining;

   if (remaining === 0) {
  statusMessage.innerHTML =
    `<strong>🎉 Congrats, ${name}! 👑</strong> You're eligible for the bi-yearly swamp review! 🐸💌`;
  notifyForm.style.display = 'block';
} else {
      statusMessage.textContent = `Only ${remaining} more push-ups to go, Princess ${name}! 🌚🎯`;
      notifyForm.style.display = 'none'; // Hide the form until 100 push-ups
    }
  }

pushupsForm.addEventListener("submit", function (e) {
  e.preventDefault();

  // Play fart sound on submit
  const fartAudio = document.getElementById("fartSound");
  fartAudio.currentTime = 0; // rewind to start so it plays every time
  fartAudio.play();

  const name = princessNameInput.value.trim();
  if (!name) {
    statusMessage.textContent = "Please enter your princess name!";
    return;
  }

  const dailyPushups = parseInt(pushupsInput.value);
  if (isNaN(dailyPushups) || dailyPushups <= 0) {
    statusMessage.textContent = "Please enter a valid number of push-ups.";
    return;
  }
  if (dailyPushups > 40) {
    statusMessage.textContent = "🤚 Max 40 push-ups per day! Don’t ogre-do it.";
    return;
  }

  const today = getTodayDateStr();

  if (!princessData[name]) {
    princessData[name] = { totalPushups: 0, lastLoggedDate: null };
  }

  if (princessData[name].lastLoggedDate === today) {
    statusMessage.textContent = `👀 Princess ${name}, you’ve already logged push-ups today. Come back tomorrow!`;
    return;
  }

  princessData[name].totalPushups += dailyPushups;
  princessData[name].lastLoggedDate = today;

  localStorage.setItem("princessData", JSON.stringify(princessData));

  // Update the display for the current princess
  updateDisplayForPrincess(name);
  updatePrincessStatusList();

  // Update hidden form message dynamically
  const message = `Swamp review ready for Princess ${name} [For real this time]! She completed her push-ups! She totally didn't cheat!`;
  notifyForm.querySelector('input[name="message"]').value = message;

  statusMessage.textContent = `💪 Logged successfully for today, Princess ${name}! 👑`;
  pushupsInput.value = "";
});


  // Update display when princess name input loses focus (or you can add a button or "change" event)
  princessNameInput.addEventListener("change", () => {
    const name = princessNameInput.value.trim();
    updateDisplayForPrincess(name);
  });

  // On load, try to update display for current input (if any)
  updateDisplayForPrincess(princessNameInput.value.trim());

  function updatePrincessStatusList() {
    princessStatusList.innerHTML = "";

    Object.entries(princessData).forEach(([name, data]) => {
      const remaining = Math.max(0, requiredForReview - data.totalPushups);
      const statusText = remaining === 0 ? "Done! ??" : `${remaining} push-ups left`;

      const li = document.createElement("li");
      li.textContent = `Princess ${name}: ${statusText}`;
      princessStatusList.appendChild(li);
    });
  }

  // Call this anytime princessData changes:
  updatePrincessStatusList();

  // Update the function that changes princessData to also call updatePrincessStatusList():
  // For example, add this line after localStorage.setItem() in form submit:
  updatePrincessStatusList();
});

