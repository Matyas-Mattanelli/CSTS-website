// Import columns names
import { columns, uncheckedColumns } from "./columns.js"; // Import column names

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
        checkbox.className = "filters";

        // Make sure only the intially selected columns are shown
        if (uncheckedColumns.indexOf(col) === -1) {
            checkbox.checked = true;
        } else {
            checkbox.checked = false;
        }

        // Assign the filtering function to the checkbox
        checkbox.onchange = () => { filterTable(col) };

        // Add the checkbox to the layout
        filters.appendChild(checkbox);

        // Create a label for the checkbox
        const label = document.createElement('label');
        label.for = colClean;
        label.textContent = col;
        label.className = "filters-label";
        filters.appendChild(label);
    });
}

// Build the filters
buildFilters();

// Define a function filtering the table based on a given filter
function filterTable(col) {
    // Find the filter
    const filter = document.getElementById(col.toLowerCase().replace(" ", "_").replace("/", ""));

    // Find the corresponding cells
    const cells = document.querySelectorAll(`table :is(td, th):nth-child(${columns.indexOf(col) + 1})`);

    // Hide or show the cells
    cells.forEach(cell => {
        // Show the column
        if (filter.checked === true) {
            cell.style.display = "table-cell"; // First display it
            setTimeout(() => { // Wait a bit and start the transition
                cell.classList.remove("cell-hidden");
                cell.classList.add("cell-shown");
            }, 10)

            // Hide the column
        } else {
            // Perform the transition
            cell.classList.remove("cell-shown");
            cell.classList.add("cell-hidden");

            // When the transition finishes, remove the element
            cell.addEventListener("transitionend", () => {
                cell.style.display = "none";
                console.log(col);
            }, { once: true });
        }
    });
}

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

// Export the function for filtering the table
export default filterTable;