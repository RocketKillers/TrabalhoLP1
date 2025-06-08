const urlBase = 'http://localhost:4000/entregadores';

const formulario = document.getElementById("formCadEntregadores");
let listaDeEntregadores = [];

formulario.onsubmit=manipularSubmissao;

function manipularSubmissao(evento){
    if (formulario.checkValidity()){
        const cpf = document.getElementById("cpf").value;
        const nome = document.getElementById("nome").value;
        const telefone = document.getElementById("telefone").value;
        const cidade = document.getElementById("cidade").value;
        const mt = document.getElementById("mt").value;
        const placa = document.getElementById("placa").value;
        const Entregadores = {cpf,nome,telefone,cidade,mt,placa};
        cadastrarEntregadores(Entregadores);//enviar requisição p/ servidor
        formulario.reset();
        mostrarTabelaEntregadores();
    }
    else{
        formulario.classList.add('was-validated');
    }
    evento.preventDefault(); //cancelamento do evento
    evento.stopPropagation(); //impedindo que outros observem esse evento

}

function mostrarTabelaEntregadores(){
    const divTabela = document.getElementById("tabela");
    divTabela.innerHTML=""; //apagando o conteúdo da div
    if (listaDeEntregadores.length === 0){
        divTabela.innerHTML="<p class='alert alert-info text-center'>Não há Entregadores cadastrados</p>";
    }
    else{
        const tabela = document.createElement('table');
        tabela.className="table table-striped table-hover";

        const cabecalho = document.createElement('thead');
        const corpo = document.createElement('tbody');
        cabecalho.innerHTML=`
            <tr>
                <th>CPF</th>
                <th>Nome</th>
                <th>Telefone</th>
                <th>Cidade</th>
                <th>mt</th>
                <th>placa</th>
                <th>Ações</th>
            </tr>
        `;
        tabela.appendChild(cabecalho);
        for (let i=0; i < listaDeEntregadores.length; i++){
            const linha = document.createElement('tr');
            linha.id=listaDeEntregadores[i].id;
            linha.innerHTML=`
                <td>${listaDeEntregadores[i].cpf}</td>
                <td>${listaDeEntregadores[i].nome}</td>
                <td>${listaDeEntregadores[i].telefone}</td>
                <td>${listaDeEntregadores[i].cidade}</td>
                <td>${listaDeEntregadores[i].mt}</td>
                <td>${listaDeEntregadores[i].placa}</td>
                <td><button type="button" class="btn btn-danger" onclick="excluirEntregadores('${listaDeEntregadores[i].id}')"><i class="bi bi-trash"></i>Excluir</button></td>
            `;
            corpo.appendChild(linha);
        }
        tabela.appendChild(corpo);
        divTabela.appendChild(tabela);
    }
}

function excluirEntregadores(id){
    if(confirm("Deseja realmente excluir o Entregador " + id + "?")){
        fetch(urlBase + "/" + id,{
            method:"DELETE"
        }).then((resposta) => {
            if (resposta.ok){
                return resposta.json();
            }
        }).then((dados)=>{
            alert("Entregador excluído com sucesso!");
            listaDeEntregadores = listaDeEntregadores.filter((Entregadores) => { 
                return Entregadores.id !== id;
            });
            mostrarTabelaEntregadores(); 
            document.getElementById(id)?.remove(); //excluir a linha da tabela
        }).catch((erro) => {
            alert("Não foi possível excluir o Entregador: " + erro);
        });
    }
}

function obterDadosEntregadores(){
    //enviar uma requisição para a fonte servidora
    fetch(urlBase, {
        method:"GET"
    })
    .then((resposta)=>{
        if (resposta.ok){
            return resposta.json();
        }
    })
    .then((Entregadores)=>{
        listaDeEntregadores=Entregadores;
        mostrarTabelaEntregadores();
    })
    .catch((erro)=>{
        alert("Erro ao tentar recuperar Entregadores do servidor!");
    });
}


function cadastrarEntregadores(Entregadores){

    fetch(urlBase, {
       "method":"POST",
       "headers": {
          "Content-Type":"application/json",
       },
       "body": JSON.stringify(Entregadores)
    })
    .then((resposta)=>{
        if(resposta.ok){
            return resposta.json();
        }
    })
    .then((dados) =>{
        alert(`Entregador incluído com sucesso! ID:${dados.id}`);
        listaDeEntregadores.push(dados);
        mostrarTabelaEntregadores();
    })
    .catch((erro)=>{
        alert("Erro ao cadastrar o Entregador:" + erro);
    });

}

obterDadosEntregadores();