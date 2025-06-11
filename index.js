//npm install express-session
//npm install express
//npm install json-server
//npm install nodemon 
//json-server -p 4000 --watch db/dados.js

// npm init e posteriormente adicionar "type": "module" em package.json e o script "start" : "index.js"
// npm install express

import express from 'express'; // "type": "module"
// const express = require("express"); "type": "commonjs"
import session from 'express-session'
import verificarAutenticacao from "./seguranca/autenticacao.js";

const host = "0.0.0.0";
const porta = 3000;
const app = express(); // app web passa a ouvir a porta 3000

// Possibilitando a comunicação com estado (stateful)

app.use(session({
    secret: "M1nH4Ch4v3S3cR3t4",
    resave: true,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 30, // 30 minutos
        httpOnly: true
    }
}));

// configurar o express para processar os parâmetros contidos na url
// qs: true - mais poderosa para lidar com parâmetros da requisição
// querystring
app.use(express.urlencoded({extended: true})); // midware
// compartilhando publicamente os arquivos existentes na pasta "publico"
app.use(express.static("publico")); // assets ou conteúdo estático

const urlBase = 'http://localhost:4000/usuarios';
let listaDeUsuarios = []; 
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
    })
    .catch((erro)=>{
        console.error("Erro ao tentar recuperar Usuarios do servidor!", erro);
    });
}
obterDadosUsuarios()
app.post("/login", (requisicao, resposta) => {
    const { usuario, senha } = requisicao.body;
    for (let i = 0; i < listaDeUsuarios.length; i++) {
        if (usuario === listaDeUsuarios[i].usuario && senha === listaDeUsuarios[i].senha) {
            requisicao.session.autenticado = true;
            return resposta.redirect("/menu.html");
        }
    }

    let conteudo = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="/css/login.css"/>
        <link rel="stylesheet" href="/css/bootstrap.min.css"/>
        <title>Página de login</title>
    </head>
    <body>
        <div class="container">
            <div class="row">
            <div class="col-md-6 offset-md-3">
                <h2 class="text-center text-dark mt-5">Bem-vindo</h2>
                <div class="text-center mb-5 text-dark">Faça o login</div>
                <div class="card my-5">
        
                <form action="/login" method="POST" class="card-body cardbody-color p-lg-5">
        
                    <div class="text-center">
                    <img src="/imagens/user_icon.png" class="img-fluid profile-image-pic img-thumbnail rounded-circle my-3"
                        width="200px" alt="profile">
                    </div>
        
                    <div class="mb-3">
                    <input type="text" class="form-control" id="usuario" name="usuario" aria-describedby="emailHelp"
                        placeholder="usuário">
                    </div>
                    <div class="mb-3">
                    <input type="password" class="form-control" id="senha" name="senha" placeholder="senha">
                    </div>
                    <div class="text-center mb-5 text-dark">
                    <p>Não tem uma conta? <a href="cadastro.html">Cadastre-se</a></p>
                    </div>
                    <div class="text-center"><button type="submit" class="btn btn-color px-5 mb-5 w-100">Login</button>
                    <a href="index.html" class="btn btn-secondary">Voltar</a>
                    </div><br>
                    <div class="alert alert-danger">Usuário ou senha incorretos!</div>
                </form>
                </div>
        
            </div>
            </div>
        </div>
    </body>
    </html>
    `;
    resposta.send(conteudo);
    resposta.end();
});
    

// compartilhando conteúdo privado mediante autenticação
app.use(verificarAutenticacao, express.static("privado"));
// daqui para baixo, os endpoints só serão acessados mediante autenticação.

app.get("/logout", (requisicao, resposta) => {
    requisicao.session.destroy(); // exclui a sessão de um usuário (aquele que escolheu acessar o endereço)
    resposta.redirect("/login.html"); // lembre-se que esse recurso é público
    resposta.end();
});

app.listen(porta, host, () => {
    console.log(`Servidor em execução em http://${host}:${porta}`);
});
