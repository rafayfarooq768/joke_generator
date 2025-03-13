document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("generate").addEventListener("click", function () {
        // User inputs
        let category = document.getElementById("category").value;
        let amount = document.getElementById("amount").value;
        let language = document.getElementById("language").value;
        let searchTerm = document.getElementById("search").value;

        // Handling custom categories
        if (category === "Custom") {
            let selectedCategories = [];
            document.querySelectorAll("#customCategories input:checked").forEach((checkbox) => {
                selectedCategories.push(checkbox.value);
            });
            category = selectedCategories.length > 0 ? selectedCategories.join(",") : "Any";
        }

        // Blacklist flags
        let blacklistFlags = [];
        document.querySelectorAll("#blacklistFlags input:checked").forEach((checkbox) => {
            blacklistFlags.push(checkbox.value);
        });

        // API URL
        let apiUrl = `https://v2.jokeapi.dev/joke/${category}?amount=${amount}&lang=${language}`;
        if (blacklistFlags.length > 0) {
            apiUrl += `&blacklistFlags=${blacklistFlags.join(",")}`;
        }
        if (searchTerm.trim() !== "") {
            apiUrl += `&contains=${encodeURIComponent(searchTerm)}`;
        }

        // XMLHttpRequest
        let xhr = new XMLHttpRequest();
        xhr.open("GET", apiUrl, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                let response = JSON.parse(xhr.responseText);
                displayJokes(response);
            }
        };
        xhr.send();
    });
});

// Display Jokes
function displayJokes(response) {
    let jokeResults = document.getElementById("jokeResults");
    jokeResults.innerHTML = "";

    if (response.error) {
        jokeResults.innerHTML = `<p style="color: red;">Error: Could not fetch jokes.</p>`;
        return;
    }

    if (Array.isArray(response.jokes)) {
        response.jokes.forEach((joke, index) => {
            jokeResults.innerHTML += `<p><strong>${index + 1}.</strong> ${formatJoke(joke)}</p>`;
        });
    } else {
        jokeResults.innerHTML = `<p><strong>1.</strong> ${formatJoke(response)}</p>`;
    }
}

// Format Jokes
function formatJoke(joke) {
    if (joke.type === "twopart") {
        return `<p><strong>Q:</strong> ${joke.setup}<br><strong>A:</strong> ${joke.delivery}</p>`;
    } else {
        return `<p>${joke.joke}</p>`;
    }
}
