const urlBase = 'http://localhost:4000/usuarios';

const formulario = document.getElementById("formCadUsuario");
let listaDeUsuarios = [];

formulario.onsubmit=manipularSubmissao;

function manipularSubmissao(evento){
    if (formulario.checkValidity()){
        const senha = document.getElementById("senha").value;
        const usuario = document.getElementById("usuario").value;
        const Usuario = {usuario,senha};
        cadastrarUsuario(Usuario);//enviar requisição p/ servidor
        formulario.reset();
    }
    else{
        formulario.classList.add('was-validated');
    }
    evento.preventDefault(); //cancelamento do evento
    evento.stopPropagation(); //impedindo que outros observem esse evento

}

// function mostrarTabelaUsuarios(){
//     const divTabela = document.getElementById("tabela");
//     divTabela.innerHTML=""; //apagando o conteúdo da div
//     if (listaDeUsuarios.length === 0){
//         divTabela.innerHTML="<p class='alert alert-info text-center'>Não há clientes cadastrados</p>";
//     }
//     else{
//         const tabela = document.createElement('table');
//         tabela.className="table table-striped table-hover";

//         const cabecalho = document.createElement('thead');
//         const corpo = document.createElement('tbody');
//         cabecalho.innerHTML=`
//             <tr>
//                 <th>Usuario</th>
//                 <th>Senha</th>
//                 <th>Ações</th>
//             </tr>
//         `;
//         tabela.appendChild(cabecalho);
//         for (let i=0; i < listaDeUsuarios.length; i++){
//             const linha = document.createElement('tr');
//             linha.id=listaDeUsuarios[i].id;
//             linha.innerHTML=`
//                 <td>${listaDeUsuarios[i].usuario}</td>
//                 <td>${listaDeUsuarios[i].senha}</td>
//                 <td><button type="button" class="btn btn-danger" onclick="excluirUsuario('${listaDeUsuarios[i].id}')"><i class="bi bi-trash"></i>Excluir</button></td>
//             `;
//             corpo.appendChild(linha);
//         }
//         tabela.appendChild(corpo);
//         divTabela.appendChild(tabela);
//     }
// }

function obterDadosUsuarios(){
    //enviar uma requisição para a fonte servidora
    fetch(urlBase, {
        method:"GET"
    })
    .then((resposta)=>{
        if (resposta.ok){
            return resposta.json();
        }
    })
    .then((Usuarios)=>{
        listaDeUsuarios=Usuarios;
        //mostrarTabelaUsuarios();
    })
    .catch((erro)=>{
        alert("Erro ao tentar recuperar Usuarios do servidor!" + erro);
    });
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
            alert("Cliente excluído com sucesso!");
            listaDeUsuarios = listaDeUsuarios.filter((usuario) => { 
                return usuario.id !== id;
            });
            //mostrarTabelaUsuarios(); 
            document.getElementById(id)?.remove(); //excluir a linha da tabela
        }).catch((erro) => {
            alert("Não foi possível excluir o usuario: " + erro);
        });
    }
}


function cadastrarUsuario(Usuario){

    fetch(urlBase, {
       "method":"POST",
       "headers": {
          "Content-Type":"application/json",
       },
       "body": JSON.stringify(Usuario)
    })
    .then((resposta)=>{
        if(resposta.ok){
            return resposta.json();
        }
    })
    .then((dados) =>{
        alert(`Usuario incluído com sucesso! ID:${dados.id}`);
        listaDeUsuarios.push(dados);
        window.location.href = "login.html";
        //mostrarTabelaUsuarios();
    })
    .catch((erro)=>{
        alert("Erro ao cadastrar o Usuario:" + erro);
    });

}

obterDadosUsuarios();