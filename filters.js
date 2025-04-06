// Get the div containing the filters
const filters = document.getElementById("filters");

// Get the show filters button
const filterBtn = document.getElementById('show-filters');

// Define a function showing or hiding the filters
function showFilters() {
    // Hide if shown
    if (filters.style.display === "block") {
        filters.style.display = "none";
        filterBtn.textContent = "Ukázat filtry";

        // Show if hidden
    } else {
        filters.style.display = "block";
        filterBtn.textContent = "Skrýt filtry";
    }
}

// Bind the showFilters function to the button
filterBtn.addEventListener("click", showFilters);