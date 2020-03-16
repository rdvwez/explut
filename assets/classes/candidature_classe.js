let connection, config

module.exports = ( _connection, _config) =>{
    connection = _connection
    config = _config
    return Candidatures
}

let Candidatures = class {

    // recuperer la cndidature à l'aide de l'ID
    // SELECT * FROM `user` WHERE `email` =?
    static getByID(id){
      
      return new Promise((next) => {
        connection.query('SELECT * FROM `candidature` WHERE  `id`= ?', [id])
            .then((result) => {
              if (result[0] != undefined) {
                next(result[0])
              }else{
                next(new Error(config.errors.wrongID))
              }
            })
            .catch((err) => next(err))

      })
  
    }

    // récuperation d'une liste de candidature limitée ou pas 
    static getAll(max)
    {
      
      return new Promise((next) => {
        if (max != undefined && max > 0) {
          connection.query('SELECT * FROM `candidature` ORDER BY id DESC LIMIT 0,?',[parseInt(max)])
            .then((result) => next(result))
            .catch((err) => next(err))
        } else if (max != undefined){
          next(new Error (config.errors.wrongMaxValue))
        } else{
          connection.query('SELECT * FROM `candidature` ORDER BY id DESC')
              .then((result) => next(result))
              .catch((err) => next(err))
        }
          
        })
    }

    // insertion d'une candidature
    static add(entreprise,adresse,siteweb,dureetraitement,description,commentaire,iduser){
     
      return new Promise((next) => {
        var LaDate = new Date(); 
        var datesoumission =  LaDate.getFullYear() +"/"+LaDate.getMonth() +"/"+ LaDate.getDate();

        if(entreprise != undefined && adresse != undefined && siteweb != undefined && dureetraitement != undefined && 
          description != undefined && commentaire != undefined && iduser != undefined) {
            
          connection.query('SELECT * FROM candidature where description =?',[description])
            .then((result) => {
              // console.log(result)
              if (result[0] != undefined) {
                next(new Error (config.errors.thisApplicationAlreadyExists))
              }else{
                return connection.query('INSERT INTO `candidature` (`id`,`entreprise`,`adresse`,`siteweb`,`datesoumission`,`dureetraitement`,`description`,`commentaire`,`iduser`) VALUES (NULL,?,?, ?,?, ?,?, ?,?)',
                [entreprise, adresse,siteweb,datesoumission,dureetraitement,description,commentaire,iduser])
              }
            })
            .then(() =>{
              return connection.query('SELECT * FROM candidature where description =?',[description])
            })
            .then((result) =>{
              next({
                id:result[0].id,
                entreprise: result[0].entrprise
                // adresse: result[0].adresse,
                // siteweb: result[0].siteweb,
                // date: result[0].datesoumission,
                // dureetraitement: result[0].dureetraitement,
                // description: result[0].description,
                // commentaire: result[0].commetaire,
                // iduser: result[0].iduser
              })
            })
            .catch((err) => next(err))
          }else{
            next(new Error (config.errors.someInformationsAreMissingFromTheForm))
          }
      })
    }

    // Mise à jour d'une candidature
    static update(id,entreprise,adresse,siteweb,datesoumission,dureetraitement,description,commentaire)
    {
      return new  Promise ((next) =>{
        
        if (entreprise != undefined && adresse != undefined && siteweb != undefined && datesoumission != undefined && dureetraitement != undefined && description != undefined && commentaire != undefined ) {
          // entreprise = entreprise.trim()
          // adresse = adresse.trim()
          // siteweb = siteweb.trim()
          // datesoumission = datesoumission.trim()
          // dureetraitement = dureetraitement.trim()
          // description = description.trim()
          // commentaire =  commentaire.trim()
          connection.query('SELECT * FROM candidature WHERE id =?',[id])
            .then((result) => {
              if (result[0] != undefined) {
                connection.query('UPDATE `candidature` SET `entreprise` = ?,`adresse` = ?,`siteweb` = ?,`datesoumission` = ?,`dureetraitement` = ?,`description` = ?,`commentaire` = ? WHERE `candidature`.`id` = ?',
                [entreprise, adresse,siteweb,datesoumission,dureetraitement,description,commentaire,id])
                .then(() => {
              // console.log(result)
              next(true)
              })
              .catch((err)=>{
                next(err)
              })
              }else{
               next(new Error(config.errors.wrongID))
              }
              // next(result)
            })
            .catch((err)=>{
              next(err)
            })
          // console.log(id)
        }
        else{
          next (new Error (config.errors.wrongData))
        }

      })
    }

    // suppression d'une candidature 
    static delete(id)
    {
      return new Promise((next) => {
        // next(id)
        connection.query('SELECT * FROM `candidature` WHERE id =?',[id])
          .then((result) =>{
            next(id)
            if (result[0] != undefined) {
              return connection.query('DELETE FROM `candidature` WHERE id=?',[id])
            }else{
             next(new Error(config.errors.wrongID))
            }
          })
          .then(() =>next(true))
          .catch((err) => next (err))
      })
    }
}