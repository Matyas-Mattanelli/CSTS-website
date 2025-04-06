// Import columns names
import { columns, uncheckedColumns } from "./columns.js"; // Import column names

// Get the div containing the column filters
const columnFilters = document.getElementById("column-filters");

// Define a function bulding the filters
function buildColumnFilters() {
    // Loop through the columns and create checkbox and label for each
    columns.forEach(col => {
        // Create checkbox
        const colClean = col.toLowerCase().replace(" ", "_").replace("/", "");
        const checkbox = document.createElement("input");
        checkbox.type = 'checkbox';
        checkbox.name = colClean;
        checkbox.value = colClean;
        checkbox.id = colClean;
        checkbox.className = "filter-checkbox";

        // Make sure only the intially selected columns are shown
        if (uncheckedColumns.indexOf(col) === -1) {
            checkbox.checked = true;
        } else {
            checkbox.checked = false;
        }

        // Assign the filtering function to the checkbox
        checkbox.onchange = () => { filterColumn(col) };

        // Add the checkbox to the layout
        columnFilters.appendChild(checkbox);

        // Create a label for the checkbox
        const label = document.createElement('label');
        label.for = colClean;
        label.textContent = col;
        label.className = "filters-label";
        columnFilters.appendChild(label);
    });
}

// Build the filters
buildColumnFilters();

// Define a function filtering showing or hiding a given column
function filterColumn(col) {
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

// Export the function for filtering the table
export default filterColumn;