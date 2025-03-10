import { getAllStores } from './database.js';

console.log(getAllStores());

document.addEventListener('DOMContentLoaded', async function () {
    const container = document.getElementById('store-container');

    try {
        const response = await fetch('/api/stores');
        const stores = await response.json();

        stores.forEach(store => {
            const card = document.createElement('div');
            card.classList.add('store-card'); 
            card.innerHTML =
                <h2>${store.name}</h2>
                <p>${store.description}</p>
                <p><strong>Location</strong>${store.location}</p>
            ;
        
        container.appendChild(card);
        });
    } catch (error) {
        console.error('Error fetching stores from database:', error);
    }
});