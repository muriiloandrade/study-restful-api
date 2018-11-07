//Servidor começa por aqui

//Chamando os pacotes necessários
const express = require('express') //Chama o express
const app = express() //Define o app usando express
const bodyParser = require('body-parser')
const mongoose = require('mongoose') //Chamando o módulo do mongoose

//Configurando o app para usar bodyParser()
//Isso vai fazer pegar os dados de um POST
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(bodyParser.json())
const porta = process.env.PORT || 3003 //Setando a porta

//Conecta ao banco do MLab
mongoose.connect('mongodb://murilo:123456mu@ds019886.mlab.com:19886/restful-api', {
  useNewUrlParser: true
})

//Trata a conexão
const db = mongoose.connection
db.on('Erro', console.error.bind(console, 'Erro de conexão:'))

db.once('Aberto', () => {
  console.log('Conexão do db feita com sucesso!')
})

const Nome = require('./models/ModelNome')

// ------------- ROTAS ---------------
const router = express.Router() //Cria uma instância de um Router express

//Middleware que será ativado a cada request
router.use(function (req, res, next) {
  console.log('Alguma coisa está acontecendo!')
  next() //Garante que saia para outras rotas e que não fique pare aqui
})

//Teste a rota para ter certeza que tudo está funcionando 
//Acessível por GET em http://localhost:3003

router.get('/', (req, res) => {
  res.json({
    message: 'Bem vindo à API!'
  })
})

//Endpoint /nomes
router.route('/nomes')
  //Grava um nome no banco
  .post((req, res) => {
    var nome = new Nome() //Cria uma nova instância da model Nome
    nome.name = req.body.name //Seta  o nome (vem do request)

    //Salva o nome e checa os erros
    nome.save(err => {
      if (err)
        res.send(err)

      res.json({
        message: 'Nome criado!'
      })
    })
  })
  .get((req, res) => {
    Nome.find((err, nomes) => {
      if (err)
        res.send(err)

      res.json(nomes)
    })
  })

//Rotas terminadas em /nomes/idNome
router.route('/nomes/:idNome')
  //Pega os dados de um pessoa específica
  .get((req, res) => {
    //Retorna um nome passando seu id
    Nome.findById(req.params.idNome, (err, nome) => {
      if (err)
        res.send(err)

      res.json(nome)
    })
  })
  .put((req, res, next) => {
    var idNome = req.params.idNome
    var update = req.body.name

    Nome.findByIdAndUpdate(idNome, {
      name: update
    }, {
      new: true
    }, (err, nome) => {
      if (err)
        res.status(500).send(err)

      res.send({
        message: 'Nome alterado com sucesso!'
      })
    })
  })
  .delete((req, res) => {
    Nome.findByIdAndRemove(req.params.idNome, (err, nome) => {
      if (err)
        res.send(err)

      res.json({
        message: 'Nome deletado com sucesso!'
      })
    })
  })
//---------------- FIM ROTAS ---------------------

//Todas as rotas serão precedidas por /api
app.use('/', router)

//Inicia o servidor
app.listen(porta)
console.log('Servidor rodando na porta: ' + porta)