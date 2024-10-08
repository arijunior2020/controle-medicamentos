const apiUrl = 'https://1et9sjodok.execute-api.sa-east-1.amazonaws.com/dev';  // Substitua pela sua URL do API Gateway

// Função para adicionar medicamentos
document.getElementById('medicationForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const name = document.getElementById('name').value;
    const dosage = document.getElementById('dosage').value;

    try {
        // Cria o body com o formato esperado
        const requestBody = {
            body: JSON.stringify({ name, dosage })
        };

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error(`Erro ao adicionar medicamento: ${response.statusText}`);
        }
        
        const result = await response.json();
        
        alert(result.message || 'Medicamento adicionado com sucesso!');
        
        // Atualiza a lista de medicamentos após adicionar
        loadMedications();
    } catch (error) {
        console.error('Erro ao adicionar medicamento:', error);
        alert(`Ocorreu um erro ao adicionar o medicamento: ${error.message}`);
    }
});

// Função para carregar medicamentos
async function loadMedications() {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        const medications = data.body || data;  // Verifica se a resposta está dentro de 'body'

        if (!Array.isArray(medications)) {
            console.error('A resposta não é um array:', medications);
            alert('Erro ao carregar medicamentos. Resposta inesperada.');
            return;
        }

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
    } catch (error) {
        console.error('Erro ao carregar medicamentos:', error);
        alert('Erro ao carregar a lista de medicamentos.');
    }
}

// Função para deletar medicamentos
async function deleteMedication(id) {
    try {
        // Cria o body com o formato esperado para o DELETE
        const requestBody = {
            body: JSON.stringify({ id })
        };

        const response = await fetch(apiUrl, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error(`Erro ao excluir medicamento: ${response.statusText}`);
        }

        const result = await response.json();
        alert(result.message || 'Medicamento excluído com sucesso!');
    } catch (error) {
        console.error('Erro ao excluir medicamento:', error);
        alert(`Erro ao excluir o medicamento: ${error.message}`);
    }
}

// Carrega a lista de medicamentos ao abrir a página
loadMedications();
