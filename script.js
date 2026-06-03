let selectedType = "";

function selectType(type) {
    selectedType = type;
    alert("Selected: " + type.toUpperCase());
}

function toggleDarkMode() {
    document.body.classList.toggle("dark");
}

let userCoords = ""


function getLocation() {

    let loader = document.getElementById("loader");
    let locationBox = document.getElementById("location");

    loader.style.display = "block";
    locationBox.value = "Fetching location...";

    navigator.geolocation.getCurrentPosition(async pos => {
        let lat = pos.coords.latitude;
        let lon = pos.coords.longitude;

        userCoords = `${lat},${lon}`;

        locationBox.value = userCoords;

        try {
            let response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
            );

            let data = await response.json();
            locationBox.value = data.display_name;

        } catch {
            locationBox.value = userCoords;
        }

        loader.style.display = "none";
    }, () => {
        loader.style.display = "none";
        alert("Location access denied!");
    });
}

function generateDecision() {

    let location = document.getElementById("location").value.trim();
    let map = document.getElementById("map");
    let resultBox = document.getElementById("result");
    let loader = document.getElementById("loader");

    if (selectedType === "" || location === "") {
        alert("Please select emergency and enter location!");
        return;
    }

    loader.style.display = "block";

    setTimeout(() => {

        let searchType = "";
        let label = "";
        let precautions = "";
        let helpline = "";

        if (selectedType === "medical") {
            searchType = "hospital";
            label = " Medical Emergency";
            helpline = "<b style='color:red;'> Ambulance: 102</b>";
            precautions = `
             Check breathing & pulse<br>
             Provide basic first aid<br>
             Keep patient calm<br>
             Do not give food/water if unconscious
            `;
        }
        else if (selectedType === "fire") {
            searchType = "fire station";
            label = "Fire Emergency";
            helpline = "<b style='color:red;'>Fire Brigade: 101</b>";
            precautions = `
             Evacuate immediately<br>
             Do not use elevators<br>
             Cover nose with cloth<br>
             Use extinguisher only if safe
            `;
        }
        else if (selectedType === "crime") {
            searchType = "police station";
            label = "Crime Emergency";
            helpline = "<b style='color:red;'>Police: 100</b>";
            precautions = `
            Stay in a safe place<br>
            Avoid confrontation<br>
            Call police immediately<br>
            Inform nearby people
            `;
        }
        else {
            searchType = "hospital";
            label = "Accident Emergency";
            helpline = "<b style='color:red;'>Ambulance: 102</b>";
            precautions = `
            Do not move injured person<br>
            Control bleeding<br>
            Call ambulance immediately<br>
            Keep victim conscious
            `;
        }

        resultBox.innerHTML = `
            <b>${label}</b><br><br>
            Location: ${location}<br>
            ${helpline}<br><br>

            🔎 Open the map to know the nearest ${searchType}<br><br>

            <b>Precautions:</b><br>
            ${precautions}<br><br>

            <button id="openMapBtn">Open Map</button>
        `;


        setTimeout(() => {
            let btn = document.getElementById("openMapBtn");
            if (btn) {
                btn.addEventListener("click", function () {
                    showNearby(searchType, location);
                });
            }
        }, 0);


        if (userCoords && location.includes(",")) {
            map.src = `https://www.google.com/maps?q=${userCoords}&z=15&output=embed`;
        } else {
            map.src = `https://www.google.com/maps?q=${searchType}+near+${encodeURIComponent(location)}&z=15&output=embed`;
        }

        loader.style.display = "none";

    }, 1000);
}

function showNearby(type, location) {
    let url = `https://www.google.com/maps/search/${type}+near+${encodeURIComponent(location)}`;

    
    let a = document.createElement("a");
    a.href = url;
    a.target = "_blank"; // open in new tab
    a.rel = "noopener noreferrer";

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}