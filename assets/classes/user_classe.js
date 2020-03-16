const jwtutils = require('../jwt.utils');
const bcrypt = require('bcrypt');

let connection, config;

module.exports = ( _connection, _config) =>{
    connection = _connection
    config = _config
    return Users
}

let Users = class {   

  static emailChek (data){
    var regex = new RegExp('/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/') ;
    if(!regex.test(data))
      { 
        return false;
      }
      else
      {
         return true;
      }

  }
 
    // recuperer la cndidature à l'aide de l'ID ||
  static login(email,password){
   

    // var testedEmail = emailChek(email)
    var password = password
    return new  Promise ((next) =>{
      if ( email != undefined &&  password != undefined ) {
        connection.query('SELECT * FROM `user` WHERE `email` =?',[email])
        .then((result) => {
          if (result[0] != undefined) {
            // next(result[0].password)
            // console.log(result[0].password)
            bcrypt.compare(password,result[0].password,function(errBcrypt,resBcrypt){
              if (resBcrypt) {
                // next(result[0].id)
                 next ({
                'userId': result[0].id,
                'token': jwtutils.generateTokenForUser(result)
                })
              } else {
                next(new Error('Le cryptage a échoué'))
              }
            })
          }
          else{
            next(new Error('logn ou mot de passe incorect'))
          }
        })
        .catch((err)=>{
          next (err)
        })
      }
      else{
        next ('Données eronnées')
      }
    })
  }

    // récuperation d'une liste de candidature limitée ou pas 
  static register(email,password)
  {
   const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    var email = email
    var password = password
    // console.log(email)
    return new  Promise ((next) =>{
      if ( email != undefined &&  password != undefined ) {
        connection.query("SELECT * FROM `user` WHERE `email` =?",[email])
        // SELECT * FROM `user` WHERE `email` LIKE 'toto@gmail.com' 
        .then((result) => {
          
          if (result[0] != undefined) {
            next(new Error("Cet Email est déja pris"))
            // next(result)
          }
          else{
            bcrypt.hash(password,5,function(err,bcryptedPassword){
              return connection.query("INSERT INTO `user` (`id`, `email`, `password`) VALUES (NULL, ?, ?)",[email,bcryptedPassword])
              // INSERT INTO `user` (`id`, `email`, `password`) VALUES (NULL, 'toto@gmail.com', '4321')
              // .then((result) => next(result))
              // .catch((err) => next(err))
              // next(bcryptedPassword)
            })
          }
          
        })
        .then(() => next(true))
        // .then(()=>{
        //   connection.query('SELECT * FROM `user` WHERE `email` =?',[email])
        //   .then((result) => {
        //     // next(connection.query('SELECT * FROM `user` WHERE `email` =?',[email]))
        //     // 'SELECT * FROM `user` WHERE `email` =? AND `password`= ?'
        //     next(result)
        //   })
        //   // .catch((err) => { next(err) })
        //   // SELECT * FROM `user` WHERE `email` LIKE 'toto@gmail.com'
        //   // SELECT * FROM `user` ORDER BY `id` DESC LIMIT 1
        // })
        .catch((err) => {
          next(err)
        })
      }
      else{
        next (new Error ('les champs sont vides'))
      }
    })
  }

    
   
    
}