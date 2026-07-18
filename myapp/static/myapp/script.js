let currentUserID = null;

function displayMessage(text, type = "info") {
    const container = document.getElementById("message-container");
    if (!container) return;

    const colorMap = {
        success: "bg-green-600 border-green-800",
        error: "bg-red-600 border-red-800",
        info: "bg-primary border-indigo-800",
    };

    const messageEl = document.createElement("div");
    messageEl.textContent = text;
    messageEl.className = `p-4 rounded-xl shadow-2xl text-white font-medium border-2 ${colorMap[type] || colorMap.info} transition-all duration-300 transform-gpu translate-y-0 opacity-100 mb-2`;

    container.prepend(messageEl);

    setTimeout(() => {
        messageEl.classList.add("opacity-0", "-translate-y-full");
        messageEl.addEventListener("transitionend", () => messageEl.remove(), {once: true});
    }, 3500);
}

function showView(viewId) {
    document.querySelectorAll(".view").forEach((view) => {
        view.style.display = "none";
    });

    const target = document.getElementById(viewId);
    if (target) {
        target.style.display = "block";
    }
}

function renderUserEvents(events) {
    const list = document.getElementById("events-list");
    if (!list) return;

    list.innerHTML = "";

    if (!events || events.length === 0) {
        list.innerHTML = `<li class="bg-gray-700 p-4 rounded-xl text-gray-400 border border-gray-600">
            No events recorded yet.
        </li>`;
        showView("past-events-view");
        return;
    }

    events.forEach((event) => {
        const riskLabel = event.probability >= 0.65
            ? "High rain risk"
            : event.probability >= 0.4
                ? "Moderate rain risk"
                : "Low rain risk";

        const item = document.createElement("li");
        item.className = "p-5 rounded-xl border-l-4 border-gray-500 bg-gray-800/50 mb-3 shadow-md";

        const row = document.createElement("div");
        row.className = "flex justify-between items-center gap-4";

        const details = document.createElement("div");
        const title = document.createElement("h3");
        title.className = "font-bold text-lg text-secondary";
        title.textContent = event.name;

        const city = document.createElement("p");
        city.className = "text-sm text-gray-300";
        city.textContent = event.city;

        const date = document.createElement("p");
        date.className = "text-xs text-gray-500";
        date.textContent = event.date;

        details.append(title, city, date);

        const summary = document.createElement("div");
        summary.className = "text-right";

        const probability = document.createElement("p");
        probability.className = "text-lg font-bold";
        probability.textContent = `${(event.probability * 100).toFixed(0)}%`;

        const label = document.createElement("p");
        label.className = "text-xs text-gray-400";
        label.textContent = riskLabel;

        summary.append(probability, label);
        row.append(details, summary);
        item.appendChild(row);
        list.appendChild(item);
    });

    showView("past-events-view");
    displayMessage(`Loaded ${events.length} saved event(s).`, "info");
}

async function fetchJson(url, options = {}) {
    const response = await fetch(url, {
        credentials: "same-origin",
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {}),
        },
    });
    const data = await response.json();
    return {response, data};
}

async function loadPastEvents() {
    const {response, data} = await fetchJson("/api/events/");
    if (response.ok) {
        renderUserEvents(data.events || []);
        return;
    }

    displayMessage(data.error || "Could not load saved events.", "error");
}

function displayResults(result, cityName, dateValue) {
    const probabilityPercentage = (result.probability * 100).toFixed(0);
    const predictionMessage = document.getElementById("prediction-message");
    const probabilityFill = document.getElementById("probability-fill");

    if (!predictionMessage || !probabilityFill) return;

    let message = "";
    let color = "";
    if (result.probability >= 0.65) {
        message = "High chance of rain. Consider indoor plans.";
        color = "red";
    } else if (result.probability >= 0.4) {
        message = "Moderate chance of rain. Stay cautious.";
        color = "orange";
    } else {
        message = "Low chance of rain. Great day for outdoor activities.";
        color = "green";
    }

    predictionMessage.replaceChildren();

    const title = document.createElement("strong");
    title.textContent = `Forecast for ${cityName}`;

    const dateLine = document.createTextNode(`Date: ${dateValue}`);
    const rainLine = document.createTextNode(`Rain Probability: ${probabilityPercentage}%`);
    const messageLine = document.createElement("span");
    messageLine.style.color = color;
    messageLine.style.fontWeight = "bold";
    messageLine.textContent = message;

    predictionMessage.append(title, document.createElement("br"));
    predictionMessage.append(dateLine, document.createElement("br"));
    predictionMessage.append(rainLine, document.createElement("br"));
    predictionMessage.append(messageLine);

    probabilityFill.style.width = `${probabilityPercentage}%`;
    probabilityFill.style.backgroundColor = color;
    probabilityFill.textContent = `${probabilityPercentage}%`;
}

function setupNavigation() {
    document.getElementById("add-event-btn")?.addEventListener("click", () => {
        showView("event-form-view");
    });

    document.getElementById("view-events-btn")?.addEventListener("click", async () => {
        try {
            await loadPastEvents();
        } catch (err) {
            console.error(err);
            displayMessage("Could not load saved events.", "error");
        }
    });

    document.querySelectorAll(".back-btn").forEach((button) => {
        button.addEventListener("click", () => showView("dashboard-view"));
    });

    document.getElementById("logout-btn")?.addEventListener("click", async () => {
        try {
            await fetchJson("/api/logout/");
        } catch (err) {
            console.error(err);
        }

        currentUserID = null;
        showView("auth-view");
        displayMessage("You have been logged out.", "info");
    });
}

function setupAuthForms() {
    document.getElementById("show-signup")?.addEventListener("click", (event) => {
        event.preventDefault();
        const signupForm = document.getElementById("signup-form");
        signupForm.style.display = signupForm.style.display === "none" ? "block" : "none";
    });

    document.getElementById("signup-form")?.addEventListener("submit", async (event) => {
        event.preventDefault();
        const username = document.getElementById("new-username").value;
        const password = document.getElementById("new-password").value;

        const {response, data} = await fetchJson("/api/signup/", {
            method: "POST",
            body: JSON.stringify({username, password}),
        });

        if (response.ok) {
            displayMessage("Account created. Please log in.", "success");
            document.getElementById("signup-form").style.display = "none";
            document.getElementById("login-form").reset();
        } else {
            displayMessage(data.error || "Signup failed.", "error");
        }
    });

    document.getElementById("login-form")?.addEventListener("submit", async (event) => {
        event.preventDefault();
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        const {response, data} = await fetchJson("/api/login/", {
            method: "POST",
            body: JSON.stringify({username, password}),
        });

        if (response.ok) {
            currentUserID = data.user_id;
            displayMessage(`Welcome, ${username}!`, "success");
            showView("dashboard-view");
        } else {
            displayMessage(data.error || "Login failed.", "error");
        }
    });
}

function setupWeatherForm() {
    const form = document.getElementById("weather-form");
    if (!form) return;

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const eventName = document.getElementById("event-name").value.trim();
        const eventDetails = document.getElementById("event-details").value.trim();
        const dateInput = document.getElementById("target-date").value;
        const cityInput = document.getElementById("location-query").value.trim();

        if (!eventName || !dateInput || !cityInput) {
            displayMessage("Please enter the event name, date, and location.", "error");
            return;
        }

        const [, month, day] = dateInput.split("-").map(Number);

        try {
            displayMessage(`Fetching historical weather data for ${cityInput}...`, "info");

            const climatologyUrl = `/api/climatology/?city=${encodeURIComponent(cityInput)}&month=${month}&day=${day}`;
            const {response, data} = await fetchJson(climatologyUrl, {headers: {}});

            if (!response.ok) {
                throw new Error(data.error || "Backend returned an error.");
            }

            displayResults({probability: data.rain_prob}, cityInput, dateInput);

            const saveResult = await fetchJson("/api/events/", {
                method: "POST",
                body: JSON.stringify({
                    user_id: currentUserID,
                    name: eventName,
                    details: eventDetails,
                    date: dateInput,
                    city: cityInput,
                    probability: data.rain_prob,
                }),
            });

            if (!saveResult.response.ok) {
                throw new Error(saveResult.data.error || saveResult.data.message || "Could not save event.");
            }

            displayMessage(`Event "${eventName}" saved successfully.`, "success");
        } catch (err) {
            console.error(err);
            displayMessage(err.message || "Could not fetch forecast data.", "error");
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    setupNavigation();
    setupAuthForms();
    setupWeatherForm();
    showView("auth-view");
});
