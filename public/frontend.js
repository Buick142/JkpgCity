document.addEventListener('DOMContentLoaded', async function () {
    const storeContainer = document.getElementById('store-container');
    const storeForm = document.getElementById('store-form');
    const districtFilter = document.getElementById('district-filter');

    async function fetchStores(filter = "") {
        try {
            const response = await fetch('./api/stores');
            let data = await response.json();

            if (filter) {
                data = data.filter(store => store.district === filter);
            }

            storeContainer.innerHTML = ""; // Clear previous entries

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
            });
        } catch (error) {
            console.error('Error fetching store data:', error);
            storeContainer.innerHTML = '<p>Failed to load store data.</p>';
        }
    }

    // Event delegation: Single event listener for delete and edit buttons
    storeContainer.addEventListener('click', async (event) => {
        const target = event.target;
        const id = target.getAttribute('data-id');

        if (target.classList.contains('delete-btn')) {
            await deleteStore(id);
        } else if (target.classList.contains('edit-btn')) {
            const name = target.getAttribute('data-name');
            const url = target.getAttribute('data-url');
            const district = target.getAttribute('data-district');
            await editStore(id, name, url, district);
        }
    });

    async function deleteStore(id) {
        if (confirm("Are you sure you want to delete this store?")) {
            try {
                const response = await fetch(`/api/stores/${id}`, { method: "DELETE" });

                if (!response.ok) {
                    throw new Error("Failed to delete store");
                }
                fetchStores(); // Refresh list after deletion
            } catch (error) {
                console.error("Error deleting store:", error);
            }
        }
    }

    async function editStore(id, name, url, district) {
        const newName = prompt("Edit store name:", name);
        const newUrl = prompt("Edit store URL:", url);
        const newDistrict = prompt("Edit district:", district);

        if (newName && newUrl) {
            try {
                const response = await fetch(`/api/stores/${id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name: newName, url: newUrl, district: newDistrict }),
                });

                if (!response.ok) {
                    throw new Error("Failed to update store");
                }
                fetchStores(); // Refresh list
            } catch (error) {
                console.error("Error updating store:", error);
            }
        }
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

    districtFilter.addEventListener("change", (event) => {
        fetchStores(event.target.value);
    });

    fetchStores(); // Load stores when the page loads
});
