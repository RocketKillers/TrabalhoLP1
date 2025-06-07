const urlBaseProd = 'http://localhost:4000/produtos';

const formularioP = document.getElementById("formCadProd");
let listaDeProdutos = [];

if(localStorage.getItem("produtos")){
    listaDeProdutos=JSON.parse(localStorage.getItem("produtos"));
}

formularioP.onsubmit=manipularSubmissaoProd;

function obterCategoria(){
    const divCategoria = document.getElementById("divCategoria");
    
    const rotulo = document.createElement('label');
    rotulo.htmlFor='categoria';
    rotulo.className='form-label';
    rotulo.innerText="Categoria";
    divCategoria.appendChild(rotulo);

    const selecao = document.createElement('select');
    selecao.className='form-select';
    selecao.id='categoria';
    selecao.required = true;

    const opcaoInvalida = document.createElement('option');
    opcaoInvalida.selected = true;
    opcaoInvalida.disabled = true;
    opcaoInvalida.value="";
    opcaoInvalida.innerText="Selecione uma categoria";
    selecao.appendChild(opcaoInvalida);

    for(let i=0; i<listaDeCategorias.length; i++){
        const opcao = document.createElement('option');
        opcao.value = listaDeCategorias[i].nomeCat;
        opcao.innerText = listaDeCategorias[i].nomeCat;
        selecao.appendChild(opcao);
    }

    divCategoria.appendChild(selecao);
}

function obterFornecedor(){
    const divFornecedor = document.getElementById("divFornecedor");

    const rotulo = document.createElement('label');
    rotulo.htmlFor='fornecedor';
    rotulo.className='form-label';
    rotulo.innerText="Fornecedor";
    divFornecedor.appendChild(rotulo);

    const selecao = document.createElement('select');
    selecao.className='form-select';
    selecao.id='fornecedor';
    selecao.required=true;

    const opcaoInvalida = document.createElement('option');
    opcaoInvalida.selected = true;
    opcaoInvalida.disabled = true;
    opcaoInvalida.value="";
    opcaoInvalida.innerText="Selecione um fornecedor";
    selecao.appendChild(opcaoInvalida);

    for(let i=0; i<listaDeFornecedores.length; i++){
        const opcao = document.createElement('option');
        opcao.value=listaDeFornecedores[i].nomeForn;
        opcao.innerText=listaDeFornecedores[i].nomeForn;
        selecao.appendChild(opcao);
    }

    divFornecedor.appendChild(selecao);
}

function manipularSubmissaoProd(evento){
    if(formularioP.checkValidity()){
        const nomeProd = document.getElementById("nomeProd").value;
        const categoria = document.getElementById("categoria").value;
        const fornecedor = document.getElementById("fornecedor").value;
        const dataFab = document.getElementById("dataFab").value;
        const dataVal = document.getElementById("dataVal").value;
        const preco = document.getElementById("preco").value;
        const codigo = document.getElementById("codigo").value;
        const produto = {nomeProd,categoria,fornecedor,dataFab,dataVal,preco,codigo};
        cadastrarProduto(produto);
        formularioP.reset();
        mostrarTabelaProdutos();
    }
    else{
        formularioP.classList.add('was-validated');
    }
    evento.preventDefault();
    evento.stopPropagation();
}

function mostrarTabelaProdutos(){
    const divTabela = document.getElementById("tabelaProd");
    divTabela.innerHTML="";
    if(listaDeProdutos.length === 0){
        divTabela.innerHTML = "<p class='alert alert-info text-center'>Não há produtos cadastrados!</p>"
    }
    else{
        const tabela = document.createElement('table');
        tabela.className='table table-striped table-hover';

        const cabecalho = document.createElement('thead');
        const corpo = document.createElement('tbody');
        cabecalho.innerHTML=`
            <tr>
                <th>Nome do Produto</th>
                <th>Categoria</th>
                <th>Fornecedor</th>
                <th>Data Fab.</th>
                <th>Data Val.</th>
                <th>Preço</th>
                <th>Código</th>
                <th>Ações</th>
            </tr>
        `;
        tabela.appendChild(cabecalho);

        for(let i=0;i<listaDeProdutos.length; i++){
            const linha=document.createElement('tr');
            linha.id=listaDeProdutos[i].id;
            linha.innerHTML=`
                <td>${listaDeProdutos[i].nomeProd}</td>
                <td>${listaDeProdutos[i].categoria}</td>
                <td>${listaDeProdutos[i].fornecedor}</td>
                <td>${listaDeProdutos[i].dataFab}</td>
                <td>${listaDeProdutos[i].dataVal}</td>
                <td>${listaDeProdutos[i].preco}</td>
                <td>${listaDeProdutos[i].codigo}</td>
                <td>
                    <button type="button" class>
                        <i class="bi bi-trash"></i>
                    <button>
                </td>
            `;
            corpo.appendChild(linha);
        }

        tabela.appendChild(corpo);
        divTabela.appendChild(tabela);
    }
}

function excluirProduto(id){
    if(confirm("Deseja realmente excluir o produto " + id + "?")){
        fetch(urlBaseProd + "/" + id, {
            method:"DELETE"
        }).then((resposta) => {
            if(resposta.ok){
                return resposta.json();
            }
        }).then((dados) => {
            alert("Produto excluído com sucesso!");
            listaDeProdutos = listaDeProdutos.filter((produto) => {
                return produto.id !== id;
            });
            document.getElementById(id)?.remove();
        }).catch((erro) => {
            alert("Não foi possível excluir o produto: " + erro);
        });
    }
}

function obterDadosProdutos(){
    fetch(urlBaseProd, {
        method:"GET"
    }).then((resposta) => {
        if(resposta.ok){
            return resposta.json();
        }
    }).then((produtos) => {
        listaDeProdutos=produtos;
        mostrarTabelaProdutos();
    }).catch((erro) => {
        alert("Erro ao tentar recuperar produtos do servidor!");
    });
}

function cadastrarProduto(produto){
    fetch(urlBaseProd, {
        "method":"POST",
        "headers": {
            "Content-Type":"application/json",
        },
        "body": JSON.stringify(produto)
    }).then((resposta) => {
        if(resposta.ok){
            return resposta.json();
        }
    }).then((dados) => {
        alert(`Produto incluído com sucesso! ID: ${dados.id}`);
        listaDeProdutos.push(produto);
        mostrarTabelaProdutos();
    }).catch((erro) => {
        alert("Erro ao cadastrar o produto: "+erro);
    });
}

obterCategoria();
obterFornecedor();
obterDadosProdutos();
