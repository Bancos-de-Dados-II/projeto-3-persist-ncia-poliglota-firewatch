async function carregarIncendios() {
    try {
        const resposta = await fetch('/api/incendios');
        const incendios = await resposta.json();

        const listaIncendios = document.getElementById('listaIncendios');
        listaIncendios.innerHTML = '';

        incendios.forEach((incendio) => {
            const box = document.createElement('div');
            box.classList.add('box');

            // Exibição breve com cidade, rua, data e gravidade
            box.innerHTML = `
                <p><strong>Cidade:</strong> ${incendio.cidade}</p>
                <p><strong>Rua:</strong> ${incendio.rua}</p>
                <p><strong>Data:</strong> ${new Date(incendio.data_registro).toLocaleString()}</p>
                <p><strong>Gravidade:</strong> ${incendio.gravidade}</p>
                <div class="actions">
                    <button class="btn-detalhes" onclick="verDetalhes('${incendio._id}')" title="Ver Detalhes">🔍</button>
                    <button class="btn-editar" onclick="editarIncendio('${incendio._id}')" title="Editar Incêndio">✏️</button>
                    <button class="btn-excluir" onclick="excluirIncendio('${incendio._id}')" title="Excluir Incêndio">🗑️</button>
                </div>
            `;

            listaIncendios.appendChild(box);
        });
    } catch (error) {
        console.error('Erro ao carregar incêndios:', error);
    }
}

async function verDetalhes(id) {
    try {
        const resposta = await fetch(`/api/incendios/${id}`);
        const incendio = await resposta.json();

        // Exibir informações detalhadas
        alert(`
            Nome: ${incendio.nome}
            CPF: ${incendio.cpf}
            Cidade: ${incendio.cidade}
            Rua: ${incendio.rua}
            Descrição: ${incendio.descricao}
        `);
    } catch (error) {
        console.error('Erro ao obter detalhes do incêndio:', error);
    }
}

function editarIncendio(id) {

    excluirIncendio(id);
    window.location.href = `alertarIncendio.html?id=${id}`;
}

async function excluirIncendio(id) {
    const confirmacao = confirm('Deseja realmente excluir este incêndio?');
    if (confirmacao) {
        try {
            await fetch(`/api/incendios/${id}`, { method: 'DELETE' });
            alert('Incêndio excluído com sucesso!');
            carregarIncendios(); // Atualizar a lista após exclusão
        } catch (error) {
            console.error('Erro ao excluir incêndio:', error);
        }
    }
}

// Carregar incêndios ao carregar a página
document.addEventListener('DOMContentLoaded', carregarIncendios);
