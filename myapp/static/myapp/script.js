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
function showView(viewId) {
    document.querySelectorAll('.view').forEach(view => {
        view.classList.add('hidden');
    });
    document.getElementById(viewId).classList.remove('hidden');
    if (viewId !== 'event-form-view' && rainManager) {
        rainManager.stop();
    }
    if (viewId === 'event-form-view' && map) {
        map.invalidateSize();
    }
    window.scrollTo(0, 0); 
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



document.getElementById('signup-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    const username = document.getElementById('new-username').value;
    const password = document.getElementById('new-password').value;
});

document.getElementById('logout-btn').addEventListener('click', () => {
    currentUserID = null;
    showView('auth-view');
    document.getElementById('login-form').reset();
    displayMessage('Logged out.', 'info');
});

document.addEventListener('DOMContentLoaded', () => {
    console.log("✅ Prediction handled ");
    document.getElementById('weather-form').addEventListener('submit', async function(event) {
        console.log("🚀  before Weather form submitted...");
        event.preventDefault();
console.log("🚀 Weather form submitted...");
        const eventName = document.getElementById('event-name').value;
        const eventDetails = document.getElementById('event-details').value;
        const dateInput = document.getElementById('target-date').value;
        const lat = document.getElementById('final-location-lat').value;
        const lon = document.getElementById('final-location-lng').value;
        const locationName = document.getElementById('final-location-name').value;

        if (!eventName || !dateInput || !lat || !lon) {
            displayMessage("⚠️ Please complete all fields.", 'error');
            return;
        }

        const targetDate = new Date(dateInput);
        const month = targetDate.getMonth() + 1;
        const day = targetDate.getDate();

        try {
            console.log("✅ Prediction handled 1");
            const response = await fetch(`/api/climatology/?lat=${lat}&lon=${lon}&month=${month}&day=${day}`);
            if (!response.ok) throw new Error("Prediction API error");
            const result = await response.json();

            const backendResult = {
                probability: result.rain_prob,
                isRainy: result.rain_prob > 0.5
            };

            displayResults(backendResult, locationName, dateInput);

            // Save event to backend
            await fetch('/api/events/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: currentUserID,
                    name: eventName,
                    details: eventDetails,
                    date: dateInput,
                    latitude: lat,
                    longitude: lon,
                    probability: result.rain_prob
                })
            });

            displayMessage(`Event "${eventName}" saved successfully!`, 'success');

        } catch (err) {
            console.error(err);
            displayMessage("❌ Failed to fetch prediction.", 'error');
        }
    });
});


// --- EVENT HISTORY ---
async function fetchPastEvents(userID) {
    const eventsList = document.getElementById('events-list');
    eventsList.innerHTML = '<li>Loading events...</li>';

    try {
        const response = await fetch(`/api/events/?user_id=${userID}`);
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

// --- INIT ---
document.addEventListener('DOMContentLoaded', () => {
    rainCanvas = document.getElementById('rainCanvas');
    rainManager = new RainCanvas(rainCanvas);
    showView('auth-view');
});
