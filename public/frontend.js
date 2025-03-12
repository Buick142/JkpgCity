document.addEventListener('DOMContentLoaded', async function() {
    const storeContainer = document.getElementById('store-container');
    const storeForm = document.getElementById('store-form');
    const districtFilter = document.getElementById('district-filter');

    async function fetchStores(filter = "") {
        try {
            const response = await fetch('./api/stores');
            let data = await response.json();

            if (filter) {
                data = data.filter(store => store.district === filter)
            }

            storeContainer.innerHTML = "";

            data.forEach(store => {
                const storeDiv = document.createElement('div');
                storeDiv.classList.add('store');

                storeDiv.innerHTML = `
                    <h2>${store.name}</h2>
                    <p>Location: ${store.district || "Not specified"}</p>
                    <a href="${store.url}" target="_blank">Visit</a>
                    <button type="button" class="delete-btn" data-id="${store.id}">Delete</button>
                    <button type="button" class="edit-btn" data-id="${store.id}" data-name="${store.name}" data-url="${store.url}" data-district="${store.district || ''}">Edit</button>
                `;

                
                storeContainer.appendChild(storeDiv);

                attachEventListeners();
            })
        } catch (error) {
            console.error('Error fetching store data:', error);
            storeContainer.innerHTML = '<p>Failed to load store data.</p>';
        }
    }

    function attachEventListeners() {

        const deleteButton = document.querySelectorAll('.delete-btn');
        deleteButton.forEach(button => {
            button.addEventListener('click', async (event) => {
                const id = event.target.getAttribute('data-id');
                await deleteStore(id);
            });
        });
        
        const editButton = document.querySelectorAll('.edit-btn');
        editButton.forEach(button => {
            button.addEventListener('click', async (event) => {
                const id = event.target.getAttribute('data-id');
                const name = event.target.getAttribute('data-name');
                const url = event.target.getAttribute('data-url');
                const district = event.target.getAttribute('data-district');
                await editStore(id, name, url, district);
            });
        });  
    }

    storeForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const name = document.getElementById("name").value.trim();
        const url = document.getElementById("url").value.trim();
        const district = document.getElementById("district").value || null;

        if (!name) {
            alert("Store name cannot be empty.");
            return;
        }

        try {
            const response = await fetch("/api/stores", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, url, district }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to add store");
            }

            storeForm.reset();
            fetchStores(); // Refresh store list
        } catch (error) {
            console.error("Error adding store:", error);
        }
    });

    if (!storeContainer) {
        console.error("Error: store-container element not found.");
        return;
    }

    window.editStore = async function (id, name, url, district) {
        const newName = prompt("Edit store name:", name);
        const newUrl = prompt("Edit store URL:", url);
        const newDistrict = prompt("Edit district:", district);

        if (newName && newUrl) {
            await fetch(`/api/stores/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: newName, url: newUrl, district: newDistrict }),
            });
            fetchStores(); // Refresh list
        }
    }

    window.deleteStore = async function (id) {
        if (confirm("Are you sure you want to delete this store?")) {

            try {
                const deleteButton = document.querySelector(`[data-id="${id}"]`)
                if (deleteButton) deleteButton.disabled = true;

                const response = await fetch(`/api/stores/${id}`, { method: "DELETE" });

                if (!response.ok) {
                    throw new Error('Failed to delete store');
                } 
                fetchStores();

            } catch (error) {
                console.error('Error deleting store': error);
                alert('Failed to delete store');
            }
        }
    }

    districtFilter.addEventListener("change", (event) => {
        fetchStores(event.target.value);
    });

    fetchStores(); // Load stores when the page loads

});