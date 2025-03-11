// console.log(getAllStores());

document.addEventListener('DOMContentLoaded', async function () {
    const storeContainer = document.getElementById('store-container');

    if (!storeContainer) {
        console.error("Error: store-container element not found.");
        return;
    }

    // Fetch the store data from the server
    fetch('./api/stores')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json(); 
    })
    .then(data => {
        data.forEach(store => {
            const storeDiv = document.createElement('div');
            storeDiv.classList.add('store'); // Class for styling

            // You can display the store's data in any way you want
            storeDiv.innerHTML = `
                <h2>${store.name}</h2>
                <p>Location: ${store.district}</p>
                <a href="${store.url}" target="_blank">Visit</a>
            `;

            storeContainer.appendChild(storeDiv);
        });
    })
    .catch(error => {
        console.error('Error fetching store data:', error);
        storeContainer.innerHTML = '<p>Failed to load store data.</p>';
    });
});