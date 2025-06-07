const urlBase = 'http://localhost:4000/categorias';

const formulario = document.getElementById("formCadCategoria");
let listaDeCategorias = [];

formulario.onsubmit=manipularSubmissao;

function manipularSubmissao(evento){
    if (formulario.checkValidity()){
        const nome = document.getElementById("nome").value;
        const desc = document.getElementById("desc").value;
        const categoriaPai = document.getElementById("categoriaPai").value;
        const Categoria = {nome,desc,categoriaPai};
        cadastrarCategoria(Categoria);//enviar requisição p/ servidor
        formulario.reset();
        mostrarTabelaCategorias();
    }
    else{
        formulario.classList.add('was-validated');
    }
    evento.preventDefault(); //cancelamento do evento
    evento.stopPropagation(); //impedindo que outros observem esse evento

}

function mostrarTabelaCategorias(){
    const divTabela = document.getElementById("tabela");
    divTabela.innerHTML=""; //apagando o conteúdo da div
    if (listaDeCategorias.length === 0){
        divTabela.innerHTML="<p class='alert alert-info text-center'>Não há Categorias cadastrados</p>";
    }
    else{
        const tabela = document.createElement('table');
        tabela.className="table table-striped table-hover";

        const cabecalho = document.createElement('thead');
        const corpo = document.createElement('tbody');
        cabecalho.innerHTML=`
            <tr>
                <th>Nome</th>
                <th>Descrição</th>
                <th>Categoria Pai</th>
                <th>Ações</th>
            </tr>
        `;
        tabela.appendChild(cabecalho);
        for (let i=0; i < listaDeCategorias.length; i++){
            const linha = document.createElement('tr');
            linha.id=listaDeCategorias[i].id;
            linha.innerHTML=`
                <td>${listaDeCategorias[i].nome}</td>
                <td>${listaDeCategorias[i].desc}</td>
                <td>${listaDeCategorias[i].categoriaPai}</td>
                <td><button type="button" class="btn btn-danger" onclick="excluirCategoria('${listaDeCategorias[i].id}')"><i class="bi bi-trash"></i>Excluir</button></td>
            `;
            corpo.appendChild(linha);
        }
        tabela.appendChild(corpo);
        divTabela.appendChild(tabela);
    }
}

function excluirCategoria(id){
    if(confirm("Deseja realmente excluir o Categoria " + id + "?")){
        fetch(urlBase + "/" + id,{
            method:"DELETE"
        }).then((resposta) => {
            if (resposta.ok){
                return resposta.json();
            }
        }).then((dados)=>{
            alert("Categoria excluído com sucesso!");
            listaDeCategorias = listaDeCategorias.filter((Categoria) => { 
                return Categoria.id !== id;
            });
            mostrarTabelaCategorias();
            document.getElementById(id)?.remove(); //excluir a linha da tabela
        }).catch((erro) => {
            alert("Não foi possível excluir o Categoria: " + erro);
        });
    }
}

function obterDadosCategorias(){
    //enviar uma requisição para a fonte servidora
    fetch(urlBase, {
        method:"GET"
    })
    .then((resposta)=>{
        if (resposta.ok){
            return resposta.json();
        }
    })
    .then((Categorias)=>{
        listaDeCategorias=Categorias;
        mostrarTabelaCategorias();
    })
    .catch((erro)=>{
        alert("Erro ao tentar recuperar Categorias do servidor!");
    });
}


function cadastrarCategoria(Categoria){

    fetch(urlBase, {
       "method":"POST",
       "headers": {
          "Content-Type":"application/json",
       },
       "body": JSON.stringify(Categoria)
    })
    .then((resposta)=>{
        if(resposta.ok){
            return resposta.json();
        }
    })
    .then((dados) =>{
        alert(`Categoria incluído com sucesso! ID:${dados.id}`);
        listaDeCategorias.push(dados);
        mostrarTabelaCategorias();
    })
    .catch((erro)=>{
        alert("Erro ao cadastrar o Categoria:" + erro);
    });
}

obterDadosCategorias();