const apiUrl = 'https://cunml5n8ok.execute-api.sa-east-1.amazonaws.com/dev/medications';  // Substitua pela sua URL do API Gateway

document.getElementById('medicationForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const name = document.getElementById('name').value;
    const dosage = document.getElementById('dosage').value;
    
    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, dosage })
    });
    
    const result = await response.json();
    alert(result);
    loadMedications();  // Atualiza a lista após adicionar
});

async function loadMedications() {
    const response = await fetch(apiUrl);
    const medications = await response.json();
    
    const list = document.getElementById('medicationList');
    list.innerHTML = '';  // Limpa a lista antes de carregar novamente
    
    medications.forEach(med => {
        const item = document.createElement('li');
        item.textContent = `${med.name} - ${med.dosage}`;
        
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.classList.add('delete-btn');
        deleteButton.addEventListener('click', async () => {
            await deleteMedication(med.id);
            loadMedications();  // Atualiza a lista após a exclusão
        });

        item.appendChild(deleteButton);
        list.appendChild(item);
    });
}

async function deleteMedication(id) {
    const response = await fetch(apiUrl, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
    });
    
    const result = await response.json();
    alert(result);
}

// Carrega a lista de medicamentos ao abrir a página
loadMedications();
