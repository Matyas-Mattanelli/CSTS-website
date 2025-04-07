// Import columns names
import { columns, uncheckedColumns } from "../src/columns.js"; // Import column names

// Get the div containing the row filters
const rowFilters = document.getElementById("row-filters");

// Define a function bulding the filters
function buildRowFilters() {
    // Loop through the columns and create the row filters
    columns.forEach(col => {
        // Create a container for the button and the list
        const div = document.createElement("div");
        div.className = "row-options-container";

        // Create a button
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "btn btn-row-filters";
        btn.textContent = col;
        btn.id = col.toLowerCase().replace(" ", "_").replace("/", "") + "-row";
        btn.addEventListener("click", (event) => {toggleOptions(event.target)});
        div.appendChild(btn);

        // Create a list of possible values
        const list = document.createElement('div');
        list.style.display = "none";
        list.className = "row-options";
        list.id = col.toLowerCase().replace(" ", "_").replace("/", "") + "-row-list";
        div.appendChild(list);        

        // Add the container to DOM
        rowFilters.appendChild(div);
    });
}

// Define a function showing the options for the given column
function toggleOptions(btn) {
    // Specify the id of the desired list
    const listID = btn.id + "-list";

    // Loop through all lists, hide any that are shown other than the considered one
    const lists = document.getElementsByClassName("row-options");
    for (let idx = 0; idx < lists.length; idx++) {
        // Get the current list
        const list = lists[idx];

        // Hide all lists unless it is the desired one
        if ((list.style.display === "block") && (list.id !== listID)) {
            list.style.display = "none";
            document.getElementById(list.id.replace("-list", "")).classList.remove("btn-row-filters-active");

        // Take care of the desired list
        } else if (list.id === listID) {
            // Show it if hidden
            if (list.style.display === "none") {
                list.style.display = "block";
                btn.classList.add("btn-row-filters-active"); // Change the background to signify that it is active
            
            // Hide it if visible
            } else {
                list.style.display = "none";
                btn.classList.remove("btn-row-filters-active");
            }
        }
    }
}

// Define a function adding all available options to each column
export function addOptions(optionsMapping) {
    // Loop through all columns
    Object.entries(optionsMapping).forEach(
        ([col, options]) => {
            // Get the associated element
            const colClean = col.toLowerCase().replace(" ", "_").replace("/", ""); // Clean the column name
            const list = document.getElementById(colClean + "-row-list"); // Get the list of options

            // Delete all existing options (if any)
            const currentOptions = list.getElementsByTagName("div");
            for (let idx = 0; idx < currentOptions.length; idx++) {
                currentOptions[idx].remove();
            }

            // Add the options
            Object.keys(options).forEach(option => {
                // Create a div container for the input and label
                const div = document.createElement("div");

                // Create a checkbox
                const checkbox = document.createElement("input");
                checkbox.type = 'checkbox';
                checkbox.name = colClean + "-row-option";
                checkbox.value = colClean + "-row-option";
                checkbox.id = colClean + "-row-option";
                checkbox.className = "row-checkbox filter-checkbox";
                checkbox.checked = true; // All checboxes are checked initially

                // Assign the filtering function to the checkbox
                checkbox.onchange = (event) => { filterRow(event.target, col, option, optionsMapping) };

                // Add the checkbox to the layout
                div.appendChild(checkbox);

                // Create a label for the checkbox
                const label = document.createElement("label");
                label.for = colClean + "-row-option";
                label.textContent = option;
                label.className = "filters-row-label";
                div.appendChild(label);

                // Add the container to the list
                list.appendChild(div);
            });
        }
    );
}

// Define function filtering the rows
function filterRow(checkbox, col, option, optionsMapping) {
    // Get all rows
    const rows = document.querySelectorAll("tbody tr");

    // Get rows to be kept
    const keepRows = optionsMapping[col][option];

    // Loop through the rows and hide/show the ones with the given option
    rows.forEach((row, idx) => {
        // Handle only rows containing the option in question
        if (keepRows.indexOf(idx) !== -1) {
            // Show the row
            if (checkbox.checked === true){
                row.style.display = "table-row"; // First display it
                setTimeout(() => { // Wait a bit and start the transition
                    row.classList.remove("row-hidden");
                    row.classList.add("row-shown");
                }, 10)

            // Hide the column
            } else {
                // When the transition finishes, remove the element
                row.addEventListener("transitionend", () => {
                    row.style.display = "none";
                }, { once: true });
                
                // Perform the transition
                row.classList.remove("row-shown");
                row.classList.add("row-hidden");
            }
        }
    });
}

// Build the row filters
buildRowFilters();

// Export the add options function
export default addOptions;