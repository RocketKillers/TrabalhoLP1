const urlBase = 'http://localhost:4000/usuarios';

const formulario = document.getElementById("formCadUsuario");
let listaDeUsuarios = [];

function manipularSubmissao(evento){
    if (formulario.checkValidity()){
        const nome = document.getElementById("nomeUsuario").value;
        const usuario = document.getElementById("usuario").value;
        const senha = document.getElementById("senha").value;
        cadastrarusuario(usuario);//enviar requisição p/ servidor
        formulario.reset();
        mostrarTabelaUsuario();
    }
    else{
        formulario.classList.add('was-validated');
    }
    evento.preventDefault(); //cancelamento do evento
    evento.stopPropagation(); //impedindo que outros observem esse evento

}

function mostrarTabelaUsuario(){
    const divTabela = document.getElementById("tabela");
    divTabela.innerHTML=""; //apagando o conteúdo da div
    if (listaDeUsuarios.length === 0){
        divTabela.innerHTML="<p class='alert alert-info text-center'>Não há Usuarios cadastrados</p>";
    }
    else{
        const tabela = document.createElement('table');
        tabela.className="table table-striped table-hover";

        const cabecalho = document.createElement('thead');
        const corpo = document.createElement('tbody');
        cabecalho.innerHTML=`
            <tr>
                <th>Nome</th>
                <th>Usuario</th>
                <th>Senha</th>
            </tr>
        `;
        tabela.appendChild(cabecalho);
        for (let i=0; i < listaDeUsuarios.length; i++){
            const linha = document.createElement('tr');
            linha.id=listaDeUsuarios[i].id;
            linha.innerHTML=`
                <td>${listaDeUsuarios[i].nome}</td>
                <td>${listaDeFornecedores[i].usuario}</td>
                <td>${listaDeFornecedores[i].senha}</td>
                <td><button type="button" class="btn btn-danger" onclick="excluirUsuario('${listaDeUsuarios[i].id}')"><i class="bi bi-trash"></i>Excluir</button></td>
            `;
            corpo.appendChild(linha);
        }
        tabela.appendChild(corpo);
        divTabela.appendChild(tabela);
    }
}

function excluirUsuario(id){
    if(confirm("Deseja realmente excluir o usuario " + id + "?")){
        fetch(urlBase + "/" + id,{
            method:"DELETE"
        }).then((resposta) => {
            if (resposta.ok){
                return resposta.json();
            }
        }).then((dados)=>{
            alert("fornecedor excluído com sucesso!");
            listaDeUsuarios = listaDeUsuarios.filter((usuario) => { 
                return usuario.id !== id;
            });
            mostrarTabelaUsuario(); 
            document.getElementById(id)?.remove(); //excluir a linha da tabela
        }).catch((erro) => {
            alert("Não foi possível excluir o usuario: " + erro);
        });
    }
}

function obterDadosUsuario(){
    //enviar uma requisição para a fonte servidora
    fetch(urlBase, {
        method:"GET"
    })
    .then((resposta)=>{
        if (resposta.ok){
            return resposta.json();
        }
    })
    .then((usuario)=>{
        listaDeUsuarios=usuario;
        mostrarTabelaUsuario();
    })
    .catch((erro)=>{
        alert("Erro ao tentar recuperar usuario do servidor!");
    });
}