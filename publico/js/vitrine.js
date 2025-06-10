function carregarProdutos() {
    fetch('http://localhost:4000/produtos', {
        method: "GET"
    })
    .then((resposta) => {
        if (resposta.ok) {
            return resposta.json();
        }
    })
    .then((listaDeProdutos) => {
        const divVitrine = document.getElementById("vitrine");
        divVitrine.innerHTML = "";

        for (const produto of listaDeProdutos) {
            let card = document.createElement('div');
            card.className = 'card';  // só a classe card, o grid já define a coluna
            card.innerHTML = `
            <div class="card-body d-flex flex-column align-items-center">
                <h5 class="card-title">${produto.nomeProd}</h5>
                <p class="card-text">Preço: R$ ${produto.preco}</p>
                <a href="#" class="btn btn-primary mt-auto">Comprar</a>
            </div>
            `;
            divVitrine.appendChild(card);
        }
    })
    .catch((erro) => {
        alert("Não foi possível carregar os produtos para a vitrine: " + erro);
    });
}

carregarProdutos();
