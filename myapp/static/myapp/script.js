// --- GLOBALS AND UTILITIES ---
let rainCanvas, rainManager;
const RAIN_DROPS_COUNT = 300; 
let currentUserID = null; 
let suggestionTimeout = null;
let map = null;
let marker = null;

// Default to Sakarya University
const DEFAULT_COORDS = [40.742476, 30.330814]; 
const DEFAULT_LOCATION_NAME = "Sakarya University (Default)";
function renderUserEvents(events) {
    const list = document.getElementById('events-list');
    if (!list) {
        console.error("❌ #events-list not found in DOM");
        return;
    }

    // Clear the list first
    list.innerHTML = "";

    if (!events || events.length === 0) {
        list.innerHTML = `<li class="bg-gray-700 p-4 rounded-xl text-gray-400 border border-gray-600">
            No events recorded yet.
        </li>`;
        return;
    }

    // Build each event card
    events.forEach(event => {
        const emoji = event.probability >= 0.65 ? "⛈️" :
                      event.probability >= 0.4 ? "🌦️" : "☀️";

        const item = document.createElement("li");
        item.className = "p-5 rounded-xl border-l-4 border-gray-500 bg-gray-800/50 mb-3 shadow-md";
        item.innerHTML = `
            <div class="flex justify-between items-center">
                <div>
                    <h3 class="font-bold text-lg text-secondary">${event.name}</h3>
                    <p class="text-sm text-gray-300">${event.city}</p>
                    <p class="text-xs text-gray-500">${event.date}</p>
                </div>
                <div class="text-right">
                    <p class="text-lg font-bold">${(event.probability * 100).toFixed(0)}% ${emoji}</p>
                    <p class="text-xs text-gray-400">Chance of rain</p>
                </div>
            </div>
        `;
        list.appendChild(item);
    });

    // Switch to past-events-view
    showView('past-events-view');
    displayMessage(`📖 Loaded ${events.length} saved events.`, "info");
}


// --- Custom Message Display ---
function displayMessage(text, type = 'info') {
    const container = document.getElementById('message-container');
    const colorMap = {
        success: 'bg-green-600 border-green-800',
        error: 'bg-red-600 border-red-800',
        info: 'bg-primary border-indigo-800'
    };
    
    const messageEl = document.createElement('div');
    messageEl.textContent = text;
    messageEl.className = `p-4 rounded-xl shadow-2xl text-white font-medium border-2 ${colorMap[type]} transition-all duration-300 transform-gpu translate-y-0 opacity-100 mb-2`;

    container.prepend(messageEl);

    setTimeout(() => {
        messageEl.classList.add('opacity-0', '-translate-y-full');
        messageEl.addEventListener('transitionend', () => messageEl.remove());
    }, 3500);
}

// --- VIEW MANAGEMENT ---
// Enhance showView to also reattach event listeners
function showView(viewId) {
    // Hide all views first
    document.querySelectorAll('.view').forEach(view => {
        view.style.display = 'none';
    });

    // Show the selected view
    const target = document.getElementById(viewId);
    if (target) {
        target.style.display = 'block';
    }

    // 🔁 Reattach Back button each time we change view
    const backBtn = document.getElementById('back-to-dashboard-history-top');
    if (backBtn) {
        console.log("✅ Reattached back button");
        backBtn.onclick = () => {
            console.log("⬅️ Back button clicked");
            showView('dashboard-view');
        };
    }
}


document.addEventListener("DOMContentLoaded", () => {
   document.getElementById('login-form').addEventListener('submit', function(event) {
       event.preventDefault();
       const username = document.getElementById('username').value;
       displayMessage(`Welcome, ${username}! Let's plan some events.`, 'success');
       showView('dashboard-view');

       // --- Dashboard buttons ---
       document.getElementById('add-event-btn').addEventListener('click', () => {
           showView('event-form-view'); // go to weather form
       });

       document.getElementById('view-events-btn').addEventListener('click', () => {
           showView('past-events-view'); // go to history
       });

       document.getElementById('logout-btn').addEventListener('click', () => {
           showView('auth-view'); // back to login
           displayMessage("You have been logged out.", "info");
       });
   }); // <-- closes the login-form submit handler
});     // <-- closes the DOMContentLoaded


document.getElementById('show-signup').addEventListener('click', (e) => {
    e.preventDefault();
    const signupForm = document.getElementById('signup-form');
    signupForm.style.display = signupForm.style.display === 'none' ? 'block' : 'none';
});

document.getElementById('signup-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('new-username').value;
    const password = document.getElementById('new-password').value;

    const res = await fetch('/api/signup/', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({username, password})
    });
    const data = await res.json();

if (res.ok) {
    displayMessage("✅ Account created! Please log in.", "success");
    document.getElementById('signup-form').style.display = 'none';
    document.getElementById('login-form').reset();
}

});


document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const res = await fetch('/api/login/', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({username, password})
    });
    const data = await res.json();

    if (res.ok) {
        currentUserID = data.user_id;
        displayMessage("🎉 Welcome, " + username + "!", "success");
        showView('dashboard-view');
    } else displayMessage("❌ " + data.error, "error");
});
document.getElementById('view-events-btn').addEventListener('click', async () => {
    const res = await fetch('/api/events/');
    const data = await res.json();
    if (res.ok) renderUserEvents(data.events);
    else displayMessage("❌ " + data.error, "error");
});



document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('weather-form');
    if (!form) return;

    form.addEventListener('submit', async function(event) {
        event.preventDefault();

        const eventName = document.getElementById('event-name').value;
        const eventDetails = document.getElementById('event-details').value;
        const dateInput = document.getElementById('target-date').value;

        // 👇 the actual city input field in your HTML
        const cityInput = document.getElementById('location-query').value.trim();
        console.log({ eventName, dateInput, cityInput });


        if (!eventName || !dateInput || !cityInput) {
            displayMessage("⚠️ Please enter all the fields ", 'error');
            return;
        }

        const date = new Date(dateInput);
        const month = date.getMonth() + 1;
        const day = date.getDate();

        try {
            displayMessage(`🌦 Fetching forecast for ${cityInput}...`, 'info');

            // call your Django API using city name
            const response = await fetch(`/api/climatology/?city=${encodeURIComponent(cityInput)}&month=${month}&day=${day}`);
            const result = await response.json();

            if (!response.ok) throw new Error(result.error || "Backend returned error");

            // interpret backend result
            const backendResult = {
                probability: result.rain_prob,
                isRainy: result.rain_prob > 0.5
            };

            // display forecast on screen
            displayResults(backendResult, cityInput, dateInput);

            // then POST the event to /api/events/
            await fetch('/api/events/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: currentUserID,
                    name: eventName,
                    details: eventDetails,
                    date: dateInput,
                    city: cityInput,
                    probability: result.rain_prob
                })
            });

            displayMessage(`✅ Event "${eventName}" saved successfully!`, 'success');
        } catch (err) {
            console.error(err);
            displayMessage("❌ Could not fetch forecast data. Please try again.", 'error');
        }
    });
});
function displayResults(result, cityName, dateValue) {
    const probabilityPercentage = (result.probability * 100).toFixed(0);
    const predictionMessage = document.getElementById('prediction-message');
    const probabilityFill = document.getElementById('probability-fill');

    if (!predictionMessage || !probabilityFill) {
        console.error("Missing prediction UI elements in HTML!");
        return;
    }

    // Choose message and color
    let message = "";
    let color = "";
    if (result.probability >= 0.65) {
        message = "🌧 High chance of rain. Consider indoor plans!";
        color = "red";
    } else if (result.probability >= 0.4) {
        message = "🌦 Moderate chance of rain. Stay cautious!";
        color = "orange";
    } else {
        message = "☀️ Low chance of rain. Great day for outdoor activities!";
        color = "green";
    }

    // Update UI
    predictionMessage.innerHTML = `
        <strong>Forecast for ${cityName}</strong><br>
        Date: ${dateValue}<br>
        Rain Probability: ${probabilityPercentage}%<br>
        <span style="color:${color}; font-weight:bold;">${message}</span>
    `;

    probabilityFill.style.width = `${probabilityPercentage}%`;
    probabilityFill.style.backgroundColor = color;
}




// --- EVENT HISTORY ---
async function fetchPastEvents(userID) {
    const eventsList = document.getElementById('events-list');
    eventsList.innerHTML = '<li>Loading events...</li>';

    try {
        const response = await fetch(`/api/events/`);
        if (!response.ok) throw new Error("Events fetch failed");
        const events = await response.json();

        if (events.length === 0) {
            eventsList.innerHTML = '<li>No events added yet.</li>';
            return;
        }

        eventsList.innerHTML = '';
        events.forEach(event => {
            const li = document.createElement('li');
            const status = event.probability >= 0.65 ? 'High Rain Risk' :
                          event.probability >= 0.40 ? 'Moderate Risk' : 'Low Risk';
            li.innerHTML = `
                <strong>${event.name}</strong> on ${event.date} in ${event.location}
                <br>Rain Probability: ${(event.probability * 100).toFixed(0)}% (${status})
            `;
            eventsList.appendChild(li);
        });

    } catch (err) {
        console.error(err);
        eventsList.innerHTML = '<li>❌ Failed to load events.</li>';
    }
}


document.addEventListener('DOMContentLoaded', () => {
    // rainCanvas = document.getElementById('rainCanvas');
    // rainManager = new RainCanvas(rainCanvas);
    showView('auth-view');
});
function setupBackButton() {
  const btn = document.getElementById("back-to-dashboard-history-top");
  if (!btn) {
    console.warn("⚠️ Button not found yet, retrying...");
    return setTimeout(setupBackButton, 500);
  }

  console.log("✅ Back button found:", btn);
  btn.addEventListener("click", () => {
    console.log("⬅️ Back button clicked");
    showView("dashboard-view");
  });
}

document.addEventListener("DOMContentLoaded", setupBackButton);

document.addEventListener("DOMContentLoaded", () => {
  try {
    function attachBackButton() {
      const btn = document.getElementById("back-to-dashboard-history-top");
      if (btn) {
        console.log("✅ Back button found:", btn);
        btn.addEventListener("click", () => {
          console.log("⬅️ Back button clicked");
          showView("dashboard-view");
        });
      } else {
        console.warn("⚠️ Back button not found yet, retrying...");
        setTimeout(attachBackButton, 500);
      }
    }
    attachBackButton();
  } catch (err) {
    console.error("⚠️ Error in back button handler:", err);
  }
});


