// Import columns names
import columns from "./columns.js"; // Import column names

// Define initially unchecked columns
const uncheckedColumns = ["IDT", "Stát", "ID soutěže", "ID eventu", "Kategorie", "Jméno eventu"];

// Get the div containing the filters
const filters = document.getElementById("filters");

// Get the show filters button
const filterBtn = document.getElementById('show-filters');

// Define a function bulding the filters
function buildFilters() {
    // Loop through the columns and create checkbox and label for each
    columns.forEach(col => {
        // Create checkbox
        const colClean = col.toLowerCase().replace(" ", "_").replace("/", "");
        const checkbox = document.createElement("input");
        checkbox.type = 'checkbox';
        checkbox.name = colClean;
        checkbox.value = colClean;
        checkbox.id = colClean;
        if (uncheckedColumns.indexOf(col) === -1) {
            checkbox.checked = true;
        } else {
            checkbox.checked = false;
        }
        checkbox.className = "filters";
        checkbox.onchange = () => {filterTable(col)};
        filters.appendChild(checkbox);

        // Create label
        const label = document.createElement('label');
        label.for = colClean;
        label.textContent = col;
        label.className = "filters-label";
        filters.appendChild(label);
    });
}

// Define a function filtering the table based on a given filter
function filterTable(col) {
    // Find the filter
    const filter = document.getElementById(col.toLowerCase().replace(" ", "_").replace("/", ""));
    
    // Find the corresponding cells
    const cells = document.querySelectorAll(`table :is(td, th):nth-child(${columns.indexOf(col)+1})`);
    
    // Hide or show the cells
    cells.forEach(cell => {
        cell.style.display = filter.checked === true ? 'table-cell' : 'none'
    });
}

// Define a function showing or hiding the filters
function showFilters() {
    // Hide if shown
    if (filters.style.display === 'block') {
        filters.style.display = 'none';
        filterBtn.textContent = 'Ukázat filtry';

    // Show if hidden
    } else {
        filters.style.display = 'block';
        filterBtn.textContent = 'Skrýt filtry';
    }
}

// Build the filters
buildFilters();

// Bind the showFilters function to the button
filterBtn.addEventListener("click", showFilters);

// Export the function for filtering the table
export default filterTable;