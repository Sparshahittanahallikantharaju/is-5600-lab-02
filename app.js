document.addEventListener('DOMContentLoaded', () => {
    // Parsing JSON data for users and stocks
    const stocksData = JSON.parse(stockContent);
    const userData = JSON.parse(userContent);

    // Selecting buttons and generating the initial user list
    const deleteButton = document.querySelector('#btnDelete');
    const saveButton = document.querySelector('#btnSave');
    generateUserList(userData, stocksData);

    // Setting up the Delete button event listener
    deleteButton.addEventListener('click', (event) => {
        event.preventDefault();  // Prevent form submission
        const userId = document.querySelector('#userID').value;
        const userIndex = userData.findIndex(user => user.id == userId);
        userData.splice(userIndex, 1); // Remove user from data array
        generateUserList(userData, stocksData); // Refresh the user list
    });

    // Setting up the Save button event listener
    saveButton.addEventListener('click', (event) => {
        event.preventDefault();  // Prevent form submission
        const id = document.querySelector('#userID').value;
        userData.forEach(user => {
            if (user.id == id) {
                // Update user data from form inputs
                user.user.firstname = document.querySelector('#firstname').value;
                user.user.lastname = document.querySelector('#lastname').value;
                user.user.address = document.querySelector('#address').value;
                user.user.city = document.querySelector('#city').value;
                user.user.email = document.querySelector('#email').value;
                generateUserList(userData, stocksData); // Refresh the user list
            }
        });
    });
});

// Function to generate and display a list of users
function generateUserList(users, stocks) {
    const userList = document.querySelector('.user-list');
    userList.innerHTML = ''; // Clear existing list items
    users.forEach(({ user, id }) => {
        const listItem = document.createElement('li');
        listItem.innerText = `${user.lastname}, ${user.firstname}`;
        listItem.setAttribute('id', id);
        userList.appendChild(listItem);
    });

    // Adding click event listener to the user list
    userList.addEventListener('click', (event) => handleUserListClick(event, users, stocks));
}

// Handles clicks on the user list to display user details
function handleUserListClick(event, users, stocks) {
    const userId = event.target.id;
    const user = users.find(user => user.id == userId);
    populateForm(user);
    renderPortfolio(user, stocks);
}

// Populates form fields with user data
function populateForm(data) {
    const { user, id } = data;
    document.querySelector('#userID').value = id;
    document.querySelector('#firstname').value = user.firstname;
    document.querySelector('#lastname').value = user.lastname;
    document.querySelector('#address').value = user.address;
    document.querySelector('#city').value = user.city;
    document.querySelector('#email').value = user.email;
}

// Displays the user's stock portfolio
function renderPortfolio(user, stocks) {
    const portfolioDetails = document.querySelector('.portfolio-list');
    portfolioDetails.innerHTML = ''; // Clear previous entries
    user.portfolio.forEach(({ symbol, owned }) => {
        const symbolEl = document.createElement('p');
        const sharesEl = document.createElement('p');
        const actionEl = document.createElement('button');
        symbolEl.innerText = symbol;
        sharesEl.innerText = owned;
        actionEl.innerText = 'View';
        actionEl.setAttribute('id', symbol);
        portfolioDetails.append(symbolEl, sharesEl, actionEl);
    });

    // Add click event listener to view stock details
    portfolioDetails.addEventListener('click', (event) => {
        if (event.target.tagName === 'BUTTON') {
            viewStock(event.target.id, stocks);
        }
    });
}

// Function to display detailed information for a selected stock
function viewStock(symbol, stocks) {
    const stockArea = document.querySelector('.stock-form');
    if (stockArea) {
        const stock = stocks.find(s => s.symbol == symbol);
        document.querySelector('#stockName').textContent = stock.name;
        document.querySelector('#stockSector').textContent = stock.sector;
        document.querySelector('#stockIndustry').textContent = stock.subIndustry;
        document.querySelector('#stockAddress').textContent = stock.address;
        document.querySelector('#logo').src = `logos/${symbol}.svg`;
    }
}
