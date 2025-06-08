const urlBase = 'http://localhost:4000/fornecedores';

const formulario = document.getElementById("formCadForn");
let listaDeFornecedores = [];

formulario.onsubmit=manipularSubmissao;

function manipularSubmissao(evento){
    if (formulario.checkValidity()){
        const cnpj = document.getElementById("cnpj").value;
        const nomeForn = document.getElementById("nomeForn").value;
        const telefoneForn = document.getElementById("telefoneForn").value;
        const logradouro = document.getElementById("logradouro").value;
        const numero = document.getElementById("numero").value;
        const pagamento = document.getElementById("pagamento").value;
        const fornecedor = {cnpj,nomeForn,telefoneForn,logradouro,numero,pagamento};
        cadastrarfornecedor(fornecedor);//enviar requisição p/ servidor
        formulario.reset();
        mostrarTabelafornecedor();
    }
    else{
        formulario.classList.add('was-validated');
    }
    evento.preventDefault(); //cancelamento do evento
    evento.stopPropagation(); //impedindo que outros observem esse evento

}

function mostrarTabelafornecedor(){
    const divTabela = document.getElementById("tabela");
    divTabela.innerHTML=""; //apagando o conteúdo da div
    if (listaDeFornecedores.length === 0){
        divTabela.innerHTML="<p class='alert alert-info text-center'>Não há fornecedor cadastrados</p>";
    }
    else{
        const tabela = document.createElement('table');
        tabela.className="table table-striped table-hover";

        const cabecalho = document.createElement('thead');
        const corpo = document.createElement('tbody');
        cabecalho.innerHTML=`
            <tr>
                <th>CNPJ</th>
                <th>nome do Fornecedor</th>
                <th>Telefone</th>
                <th>Logradouro</th>
                <th>numero</th>
                <th>pagamento</th>
                <th>Ações</th>
            </tr>
        `;
        tabela.appendChild(cabecalho);
        for (let i=0; i < listaDeFornecedores.length; i++){
            const linha = document.createElement('tr');
            linha.id=listaDeFornecedores[i].id;
            linha.innerHTML=`
                <td>${listaDeFornecedores[i].cnpj}</td>
                <td>${listaDeFornecedores[i].nomeForn}</td>
                <td>${listaDeFornecedores[i].telefoneForn}</td>
                <td>${listaDeFornecedores[i].logradouro}</td>
                <td>${listaDeFornecedores[i].numero}</td>
                <td>${listaDeFornecedores[i].pagamento}</td>
                <td><button type="button" class="btn btn-danger" onclick="excluirfornecedor('${listaDeFornecedores[i].id}')"><i class="bi bi-trash"></i>Excluir</button></td>
            `;
            corpo.appendChild(linha);
        }
        tabela.appendChild(corpo);
        divTabela.appendChild(tabela);
    }
}

function excluirfornecedor(id){
    if(confirm("Deseja realmente excluir o fornecedor " + id + "?")){
        fetch(urlBase + "/" + id,{
            method:"DELETE"
        }).then((resposta) => {
            if (resposta.ok){
                return resposta.json();
            }
        }).then((dados)=>{
            alert("fornecedor excluído com sucesso!");
            listaDeFornecedores = listaDeFornecedores.filter((fornecedor) => { 
                return fornecedor.id !== id;
            });
            mostrarTabelafornecedor(); 
            document.getElementById(id)?.remove(); //excluir a linha da tabela
        }).catch((erro) => {
            alert("Não foi possível excluir o fornecedor: " + erro);
        });
    }
}

function obterDadosfornecedor(){
    //enviar uma requisição para a fonte servidora
    fetch(urlBase, {
        method:"GET"
    })
    .then((resposta)=>{
        if (resposta.ok){
            return resposta.json();
        }
    })
    .then((fornecedor)=>{
        listaDeFornecedores=fornecedor;
        mostrarTabelafornecedor();
    })
    .catch((erro)=>{
        alert("Erro ao tentar recuperar fornecedor do servidor!");
    });
}


function cadastrarfornecedor(fornecedor){

    fetch(urlBase, {
       "method":"POST",
       "headers": {
          "Content-Type":"application/json",
       },
       "body": JSON.stringify(fornecedor)
    })
    .then((resposta)=>{
        if(resposta.ok){
            return resposta.json();
        }
    })
    .then((dados) =>{
        alert(`fornecedor incluído com sucesso! ID:${dados.id}`);
        listaDeFornecedores.push(dados);
        mostrarTabelafornecedor();
    })
    .catch((erro)=>{
        alert("Erro ao cadastrar o fornecedor:" + erro);
    });

}

obterDadosfornecedor();