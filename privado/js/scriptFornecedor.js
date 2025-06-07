const urlBaseForn = 'http://localhost:4000/fornecedores';

const formulario = document.getElementById("formCadForn");
let listaDeFornecedores = [];

//placeholder (substituir pelo vetor de objeto no scriptCategoria depois)
let listaDeCategorias = [
    { nomeCat:"Categoria 1" }, 
    { nomeCat:"Categoria 2" },
    { nomeCat:"Categoria 3" }
];

if(localStorage.getItem("fornecedores")){
    listaDeFornecedores=JSON.parse(localStorage.getItem("fornecedores"));
}

formulario.onsubmit=manipularSubmissaoForn;

function manipularSubmissaoForn(evento){
    if(formulario.checkValidity()){
        const nomeForn = document.getElementById("nomeForn").value;
        const cnpj = document.getElementById("cnpj").value;
        const telefoneForn = document.getElementById("telefoneForn").value;
        const logradouro = document.getElementById("logradouro").value;
        const numero = document.getElementById("numero").value;
        const pagamento = document.getElementById("pagamento").value;
        const fornecedor = {nomeForn,cnpj,telefoneForn,logradouro,numero,pagamento};
        cadastrarFornecedor(fornecedor);
        formulario.reset();
        mostrarTabelaFornecedores();
    }
    else{
        formulario.classList.add('was-validated');
    }
    evento.preventDefault();
    evento.stopPropagation();
}

function mostrarTabelaFornecedores(){
    const divTabela = document.getElementById("tabelaForn");
    divTabela.innerHTML="";
    if(listaDeFornecedores.length === 0){
        divTabela.innerHTML = "<p class='alert alert-info text-center'>Não há fornecedores cadastrados!</p>";
    }
    else{
        const tabela = document.createElement('table');
        tabela.className = 'table table-striped table-hover';

        const cabecalho = document.createElement('thead');
        const corpo = document.createElement('tbody');
        cabecalho.innerHTML=`
            <tr>
                <th>Nome Fornecedor</th>
                <th>CNPJ</th>
                <th>Tel. Fornecedor</th>
                <th>Logradouro</th>
                <th>Número</th>
                <th>Método Pagamento</th>
                <th>Ações</th>
            </tr>
        `;
        tabela.appendChild(cabecalho);

        for(let i=0; i<listaDeFornecedores.length; i++){
            const linha=document.createElement('tr');
            linha.id=listaDeFornecedores[i].id;
            linha.innerHTML=`
                <td>${listaDeFornecedores[i].nomeForn}</td>
                <td>${listaDeFornecedores[i].cnpj}</td>
                <td>${listaDeFornecedores[i].telefoneForn}</td>
                <td>${listaDeFornecedores[i].logradouro}</td>
                <td>${listaDeFornecedores[i].numero}</td>
                <td>${listaDeFornecedores[i].pagamento}</td>
                <td>
                    <button type="button" class="btn btn-danger" onclick="excluirFornecedor('${listaDeFornecedores[i]}')">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            `;
            corpo.appendChild(linha);
        }
        tabela.appendChild(corpo);
        divTabela.appendChild(tabela);
    }
}

function excluirFornecedor(id){
    if(confirm("Deseja realmente excluir o fornecedor " + id + "?")){
        fetch(urlBaseForn + "/" + id,{
            method:"DELETE"
        }).then((resposta) => {
            if(resposta.ok){
                return resposta.json();
            }
        }).then((dados) => {
            alert("Fornecedor excluído com sucesso!");
            listaDeFornecedores = listaDeFornecedores.filter((fornecedor) => {
                return fornecedor.id !== id;
            });
            document.getElementById(id)?.remove();
        }).catch((erro) => {
            alert("Não foi possível excluir o fornecedor: " + erro);
        });
    }
}

function obterDadosFornecedores(){
    fetch(urlBaseForn, {
        method:"GET"
    }).then((resposta) => {
        if(resposta.ok){
            return resposta.json();
        }
    }).then((fornecedores) => {
        listaDeFornecedores=fornecedores;
        mostrarTabelaFornecedores();
    }).catch((erro) => {
        alert("Erro ao tentar recuperar fornecedores do servidor!");
    });
}

function cadastrarFornecedor(fornecedor){
    fetch(urlBaseForn, {
        "method": "POST",
        "headers": {
            "Content-Type": "application/json",
        },
        "body": JSON.stringify(fornecedor)
    }).then((resposta) => {
        if(resposta.ok){
            return resposta.json();
        }
    }).then((dados) => {
        alert(`Fornecedor incluído com sucesso! ID: ${dados.id}`);
        listaDeFornecedores.push(fornecedor);
        mostrarTabelaFornecedores();
    }).catch((erro) => {
        alert("Erro ao cadastrar o cliente: " + erro);
    });
}

obterDadosFornecedores();