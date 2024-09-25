// Fetching Sunrise-Sunset Data
function fetchSunData(lat, lon) {
    const url = `https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lon}&formatted=0`;
    
    fetch(url)
        .then(response => response.json())
        .then(data => {
            const currentTime = new Date();
            const sunrise = new Date(data.results.sunrise);
            const sunset = new Date(data.results.sunset);
            
            const period = getDayPeriod(currentTime, sunrise, sunset);
            document.getElementById("day-period").innerText = period;
            setDayImage(period); // Set the image for the current time period
            fetchSongData(period);
        })
        .catch(error => console.error("Error fetching sunrise/sunset data:", error));
}

// Set the image based on the time period
function setDayImage(period) {
    const dayImage = document.getElementById("day-image");
    dayImage.src = `${period}.jpg`; // Assuming image names are 'Morgen.jpg', 'Mittag.jpg', etc.
}

// Fetch Song Data from SRF API
function fetchSongData(dayPeriod) {
    const url = `https://il.srgssr.ch/integrationlayer/2.0/srf/songList/radio/byChannel/69e8ac16-4327-4af4-b873-fd5cd6e895a7?limit=1000&fromDate=${getLastTwoMonthsDate()}&toDate=${getTodayDate()}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (!data.songList || data.songList.length === 0) {
                console.error("Keine Songs gefunden.");
                return;
            }
            const filteredSongs = filterAndGroupSongsByPeriod(data.songList, dayPeriod);
            displaySongs(filteredSongs);
            fetchTopArtists();
        })
        .catch(error => console.error("Error fetching song data:", error));
}

// Display top 5 songs
function displaySongs(songs) {
    const songList = document.getElementById("song-list");
    songList.innerHTML = "";

    if (songs.length === 0) {
        const li = document.createElement("li");
        li.textContent = "Keine Song-Empfehlungen für diese Tageszeit.";
        songList.appendChild(li);
        return;
    }

    songs.forEach(song => {
        const li = document.createElement("li");
        li.textContent = song;
        songList.appendChild(li);
    });
}

// Fetch Top Artists
function fetchTopArtists() {
    // Implement the API calls to get the top artists for week, month, and year
    const weekUrl = `...`; // URL for weekly top artists
    const monthUrl = `...`; // URL for monthly top artists
    const yearUrl = `...`; // URL for yearly top artists

    // Fetch each of the URLs and display the results
    Promise.all([
        fetch(weekUrl).then(response => response.json()),
        fetch(monthUrl).then(response => response.json()),
        fetch(yearUrl).then(response => response.json())
    ]).then(([weekData, monthData, yearData]) => {
        displayTopArtists(weekData, "top-artists-week");
        displayTopArtists(monthData, "top-artists-month");
        displayTopArtists(yearData, "top-artists-year");
    });
}

// Display Top Artists
function displayTopArtists(data, elementId) {
    const artistList = document.getElementById(elementId);
    artistList.innerHTML = "";

    const topArtists = data.artists; // Assuming the API returns a list of artists
    topArtists.forEach(artist => {
        const li = document.createElement("li");
        li.textContent = artist.name; // Adjust according to the actual data structure
        artistList.appendChild(li);
    });
}

// Helper functions to get date ranges
function getTodayDate() {
    const today = new Date();
    return today.toISOString().split('T')[0];
}

function getLastTwoMonthsDate() {
    const lastTwoMonths = new Date();
    lastTwoMonths.setMonth(lastTwoMonths.getMonth() - 2);
    return lastTwoMonths.toISOString().split('T')[0];
}
