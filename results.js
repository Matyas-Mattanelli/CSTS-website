import filterColumn from "./column-filters.js"; // Import the function for filtering the table
import { columns, uncheckedColumns } from "./columns.js"; // Import column names

// Get the div for showing the results
const divResults = document.getElementById("results");
const divMsg = document.getElementById("msg");

// Get the input element
const input = document.getElementById("input");

// Get the submit button
const submitBtn = document.getElementById("submit");

// Define a function building a table from the given data
function buildTable(data) {
    // Check if data was obtained
    if (data != null) {
        // Indicate that the results are displayed
        divMsg.textContent = `Zobrazuji ${data.length} soutěží pro ${input.value}`;

        // Destroy the table if it exists
        const currentTable = document.querySelector("table");
        if (currentTable != null) {
            currentTable.remove();
        }

        // Create a table to store the results
        const table = document.createElement("table");
        const thead = document.createElement("thead");
        const headerRow = document.createElement("tr"); // Create a header row

        // Add the headers
        columns.forEach(col => {
            const headerCol = document.createElement("th");
            headerCol.textContent = col;
            headerCol.className = "cell cell-hidden"; // At the start all cells are hidden
            headerCol.style.display = "none"; // At the start all cells are hidden
            headerRow.appendChild(headerCol);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);

        // Initiate a body for the table
        const tbody = document.createElement("tbody");

        // Add the data for each row
        data.forEach(
            row => {
                // Create the row
                const tr = document.createElement('tr');

                // Add the cells
                row.forEach(
                    cell => {
                        const td = document.createElement('td');
                        td.textContent = cell;
                        td.className = "cell cell-hidden"; // At the start all cells are hidden
                        td.style.display = "none"; // At the start all cells are hidden
                        tr.appendChild(td);
                    }
                );

                // Add the row to the table
                tbody.appendChild(tr);
            }
        );

        // Add the table to the DOM
        table.appendChild(tbody);
        divResults.appendChild(table);

        // Show the initial columns
        columns.forEach(col => {
            if (uncheckedColumns.indexOf(col) === -1) {
                filterColumn(col);
            }
        });
    }
}

// Define a function fetching the data 
function fetchData(input, callback) {
    // Specify the request based on whether IDT or name was specified
    let reqText;
    if (isNaN(input)) {
        reqText = `http://127.0.0.1:8000/name/${encodeURI(input)}`;
    } else {
        reqText = `http://127.0.0.1:8000/IDT/${input}`;
    };

    // Try to get the data
    fetch(reqText)
        .then(response => {
            if (!response.ok) { // If the response is not ok, print that no results are found
                printNoResults(input);
                return null;
            } else {
                return response.json(); // Return the json if everything is ok
            }
        })
        .then(data => {
            if (data.length === 0) { // If no results were found, print it
                printNoResults(input);
            } else {
                callback(data); // Build the table if some results were found
            }
        })
        .then(() => {
            submitBtn.disabled = false; // Enable the button again
        })
        .catch(error => { // In case any unexpected error happens
            printNoResults(input);
            console.error(`Failed to fetch: `, error);
            submitBtn.disabled = false; // Enable the button again
        });
}

// Define a function to run in case of an error
function printNoResults(input) {
    divMsg.textContent = `Výsledky pro ${input} nebyly nalezeny`;
}

// Define a function fetching the data and building the table upon a button click
function showResults() {
    // Disable the button to prevent spamming
    submitBtn.disabled = true;

    // Get the user input
    const inputText = input.value;

    // Specify that the results are being fetched
    divMsg.textContent = `Searching for ${inputText}...`;

    // Fetch the data and build the table
    fetchData(inputText, buildTable);
}

// Bind the showResults function to the appropriate button
submitBtn.addEventListener("click", showResults);
