import filterColumn from "./column-filters.js"; // Import the function for filtering the table
import addOptions from "./row-filters.js"; // Import the function adding options to the row filters
import { columns, uncheckedColumns } from "../src/columns.js"; // Import column names

// Get the div for showing the results
const divResults = document.getElementById("results");
const divMsg = document.getElementById("msg");

// Get the input element
const input = document.getElementById("input");
const advancedSearch = document.getElementById("advanced-search"); // Get the checkbox with the indicator whether to perform advanced search

// Get the submit button
const submitBtn = document.getElementById("submit");

// Initialize an object for storing unique options for each column
const optionsMapping = {};

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

        // Clear the options mapping for the new table
        for (let col of columns) { // Each column has an entry with an empty object
            optionsMapping[col] = {};
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
            (row, idx_row) => {
                // Create the row
                const tr = document.createElement('tr');
                tr.className = "row";
                if (Number(row[columns.indexOf("Datum")].slice(0, 4)) >= 2018) { // Competition results are available only from 2018 onwards (blue website)
                    tr.onclick = () => openCompetitionResults(row[columns.indexOf("ID eventu")], row[columns.indexOf("ID soutěže")]); // Open competition results upon clicking
                    tr.classList.add("row-with-link"); // Adding a cursor pointer to signify link
                }
                

                // Add the cells
                row.forEach(
                    (cell, idx) => {
                        // Create the cell
                        const td = document.createElement('td');
                        td.textContent = cell;
                        td.className = "cell cell-hidden"; // At the start all cells are hidden
                        td.style.display = "none"; // At the start all cells are hidden
                        tr.appendChild(td);

                        // Add the value to the options mapping
                        if (cell in optionsMapping[columns[idx]]) {
                            optionsMapping[columns[idx]][cell].push(idx_row); // Add the index of the current row to the mapping
                        } else {
                            optionsMapping[columns[idx]][cell] = [idx_row]; // Initialize the array with row indices and add the current index
                        }
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
            filterColumn(col);
        });

        // Add all options to row filters
        addOptions(optionsMapping);
    }
}

// Define a function fetching the data 
function fetchData(input, callback) {
    fetch("src/config.json").then(response => {
        if (!response.ok) {
            throw new Error('Failed to load config');
        }
        return response.json();  // Parse the config JSON
    })
        .then(config => {
            // Specify query parameters
            let queryParams = "";
            if (advancedSearch.checked === true) { // Specify adavanced search if required
                queryParams = queryParams + "?advanced=1"
            }

            // Specify the request based on whether IDT or name was specified
            let reqText;
            if (isNaN(input)) {
                reqText = `${config["api_url"]}/name/${encodeURI(input)}${queryParams}`;
            } else {
                reqText = `${config["api_url"]}/IDT/${input}${queryParams}`;
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
        })
        .catch(error => {
            console.error('Error:', error);  // Handle errors
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

    // Check if the input is not empty
    if (inputText === "") {
        // Specify that the input is empty
        divMsg.textContent = "Vyhledávací pole je prázdné";
        submitBtn.disabled = false; // Enable the submit button again

    } else {
        // Specify that the results are being fetched
        divMsg.textContent = `Vyhledávám výsledky pro ${inputText}...`;

        // Fetch the data and build the table
        fetchData(inputText, buildTable);
    }
}

// Bind the showResults function to the appropriate button
submitBtn.addEventListener("click", showResults);


// Define a function opening a new tab with competition results based on the event and competition ID
function openCompetitionResults(eventId, compId) {
    const link = `https://www.csts.cz/dancesport/vysledky_soutezi/event/${eventId}/competition/${compId}`; // Define the link
    window.open(link, "_blank"); // Open a new tab with the competition results

}