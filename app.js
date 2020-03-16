// console.log('hello world!')
require('babel-register');
const mysql = require('promise-mysql');
const {trim, checkAndChange} = require('./assets/functions');
const morgan = require('morgan')('dev');
const config = require('./assets/config');
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./assets/swagger.json');
const bodyParser = require('body-parser');
const app = express();



//configuration de la connexion à la bdd
mysql.createConnection({
    host     : config.db.host,
    user     : config.db.user,
    password : config.db.password,
    database : config.db.database
}).then((connection) =>{

    console.error('connected.');
    // console.log(connection);

    let CandidaturesRouter = express.Router() //chergement du module routage des candidatures
    let UsersRouter = express.Router()  //chergement du module routage des user
    let Candidatures = require('./assets/classes/candidature_classe')(connection,config) // appel de la classe candidatures
    let Users = require('./assets/classes/user_classe')(connection,config) // appel de la classe users

    //les middles ware 
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended:true}));
    app.use(config.rootAPI+'api-docs',swaggerUi.serve,swaggerUi.setup(swaggerDocument));
    // app.use(morgan('dev'));

  //regroupement des routes sur les candidatures qui fonctionne l'id
  CandidaturesRouter.route('/:id')

    //supprime une candidature à l'aide de son id dans l'URL
    .delete(async(req,res) =>{  
      let deleteCandidature = await Candidatures.delete(req.params.id)
      res.json(checkAndChange(deleteCandidature))
    })

    //recupère une candidature à l'aide de son id
    .get(async(req,res) =>{ 

       let candidature = await Candidatures.getByID(req.params.id)
       res.json(checkAndChange(candidature))
    })


  //regroupement des routes sur les candidatures qui fonctionne sans id
  CandidaturesRouter.route('/')

  //modifie une candidature à l'aide de son id
  .put(async(req,res) =>{
    let updateCandidature = await Candidatures.update(req.body.id,req.body.entreprise, req.body.adresse,req.body.siteweb,req.body.datesoumission,req.body.dureetraitement,req.body.description,req.body.commentaire)
    res.json(checkAndChange(updateCandidature))
  })
    
  //affiche la liste des candidatures 
    .get(async(req,res) =>{
      let allCandidatures = await Candidatures.getAll(req.params.max)
      res.json(checkAndChange(allCandidatures))
    })

    //ajoute une candidatures 
    .post(async(req,res) =>{
      let addCandidature = await Candidatures.add(req.body.entreprise, req.body.adresse,req.body.siteweb,req.body.dureetraitement,
        req.body.description,req.body.commentaire,req.body.iduser)
      res.json(checkAndChange(addCandidature))
      
      })

  // gestion des routes pour les user
  UsersRouter.route('/login')
      // gestion de la route login/
      .post(async(req,res) =>{
      let loginUser = await Users.login(req.body.email, req.body.password)
      res.json(checkAndChange(loginUser))
      })
      UsersRouter.route('/register')
      // gestion de la route register/
      .post(async(req,res) =>{
        let registerUser = await Users.register(req.body.email, req.body.password)
        res.json(checkAndChange(registerUser))
        })


  //instruction permetant de definition la composition des routes
  app.use(config.rootAPI+'candidatures',CandidaturesRouter)
  app.use(config.rootAPI+'users',UsersRouter)

  //lancement du server 
  app.listen(config.port,() => console.log('le server est lancé au niveau du port '+config.port))

}).catch((err) =>{
  console.log('Error during database connection')
  // console.log(connection)
  console.log(err.message)
})






//fonction de success et d'erreur




