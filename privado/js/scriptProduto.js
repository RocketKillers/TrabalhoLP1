const urlBase = 'http://localhost:4000/produtos';

const formulario = document.getElementById("formCadProd");
let listaDeprodutos = [];

formulario.onsubmit=manipularSubmissao;

function manipularSubmissao(evento){
    if (formulario.checkValidity()){
        const dataFab = document.getElementById("dataFab").value;
        const nomeProd = document.getElementById("nomeProd").value;
        const dataVal = document.getElementById("dataVal").value;
        const preco = document.getElementById("preco").value;
        const codigo = document.getElementById("codigo").value;
        const produto = {dataFab,nomeProd,dataVal,preco,codigo};
        cadastrarproduto(produto);//enviar requisição p/ servidor
        formulario.reset();
        mostrarTabelaproduto();
    }
    else{
        formulario.classList.add('was-validated');
    }
    evento.preventDefault(); //cancelamento do evento
    evento.stopPropagation(); //impedindo que outros observem esse evento

}

function mostrarTabelaproduto(){
    const divTabela = document.getElementById("tabela");
    divTabela.innerHTML=""; //apagando o conteúdo da div
    if (listaDeprodutos.length === 0){
        divTabela.innerHTML="<p class='alert alert-info text-center'>Não há produto cadastrados</p>";
    }
    else{
        const tabela = document.createElement('table');
        tabela.className="table table-striped table-hover";

        const cabecalho = document.createElement('thead');
        const corpo = document.createElement('tbody');
        cabecalho.innerHTML=`
            <tr>
                <th>nome do produto</th>
                <th>Data de Fabricação</th>
                <th>Data de Validade</th>
                <th>Preço</th>
                <th>Código</th>
                <th>Ações</th>
            </tr>
        `;
        tabela.appendChild(cabecalho);
        for (let i=0; i < listaDeprodutos.length; i++){
            const linha = document.createElement('tr');
            linha.id=listaDeprodutos[i].id;
            linha.innerHTML=`
                <td>${listaDeprodutos[i].nomeProd}</td>
                <td>${listaDeprodutos[i].dataFab}</td>
                <td>${listaDeprodutos[i].dataVal}</td>
                <td>${listaDeprodutos[i].preco}</td>
                <td>${listaDeprodutos[i].codigo}</td>
                <td><button type="button" class="btn btn-danger" onclick="excluirproduto('${listaDeprodutos[i].id}')"><i class="bi bi-trash"></i>Excluir</button></td>
            `;
            corpo.appendChild(linha);
        }
        tabela.appendChild(corpo);
        divTabela.appendChild(tabela);
    }
}

function excluirproduto(id){
    if(confirm("Deseja realmente excluir o produto " + id + "?")){
        fetch(urlBase + "/" + id,{
            method:"DELETE"
        }).then((resposta) => {
            if (resposta.ok){
                return resposta.json();
            }
        }).then((dados)=>{
            alert("produto excluído com sucesso!");
            listaDeprodutos = listaDeprodutos.filter((produto) => { 
                return produto.id !== id;
            });
            mostrarTabelaproduto(); 
            document.getElementById(id)?.remove(); //excluir a linha da tabela
        }).catch((erro) => {
            alert("Não foi possível excluir o produto: " + erro);
        });
    }
}

function obterDadosproduto(){
    //enviar uma requisição para a fonte servidora
    fetch(urlBase, {
        method:"GET"
    })
    .then((resposta)=>{
        if (resposta.ok){
            return resposta.json();
        }
    })
    .then((produto)=>{
        listaDeprodutos=produto;
        mostrarTabelaproduto();
    })
    .catch((erro)=>{
        alert("Erro ao tentar recuperar produto do servidor!");
    });
}


function cadastrarproduto(produto){

    fetch(urlBase, {
       "method":"POST",
       "headers": {
          "Content-Type":"application/json",
       },
       "body": JSON.stringify(produto)
    })
    .then((resposta)=>{
        if(resposta.ok){
            return resposta.json();
        }
    })
    .then((dados) =>{
        alert(`produto incluído com sucesso! ID:${dados.id}`);
        listaDeprodutos.push(dados);
        mostrarTabelaproduto();
    })
    .catch((erro)=>{
        alert("Erro ao cadastrar o produto:" + erro);
    });

}

obterDadosproduto();