const music = require("../models/music")


const getAllMusic = (req, res) => {
    music.find((err, music) => {
        if (err) {
            return res.status(500).send({ message: err.message });
        };
        return res.status(200).send(music);
    });
};
const getMusicById = (req, res) => {
    const musicId = req.params.id;
    
    music.findOne({ _id: musicId }, function (err, musicFound) {
        if (err) {
            res.status(500).send({ message: err.message })
        } else {
            if (musicFound) {
                res.status(200).send(musicFound)
            } else {
                res.status(204).send({ message: "Musica não encontrada"});
            }
        }
    })
}; 
const createMusic = (req, res) => {

    const {
      id,
      title,
      duration,
      launchYear,
      favorited,
      artists,
    } = req.body

    const newMusic = new music({
      id,
      title,
      duration,
      launchYear,
      favorited,
      artists,
    })

    newMusic.save(function(err){

        if(err){

            res.status(500).send({message: err.message})

        } else {

            res.status(201).send("Musica adicionada com sucesoo!")
        }
    })
  
}
const updateMusic = (req, res) => {
    const musicId = req.params.id;

    music.findOne({ _id: musicId}, function (err,musicFound) {

      if(err){
          res.status(500).send({ message: err.message})

      }else{
          if(musicFound){
              music.updateOne({_id: musicId},{$set:req.body},
                
                function(err){
                  if(err){
                      res.status(500).send({ message: err.message})
                  }else{
                      res.status(200).send({ message: "Campo alterado com sucesso"})
                  }
              })
          }else{
              res.status(404).send({mensagem: "Musica não encontrada"})
          }

          
      }





    })
}
    
const deleteMusic = (req, res) => {
    const musicId = req.params.id;
    music.findOne({ _id: musicId }, function (err, music) {
        if (music) {
            
            music.deleteOne({ _id: musicId }, function (err) {
                if (err) {
                    res.status(500).send({
                        message: err.message,
                        status: "FAIL"
                    })
                } else {
                    res.status(200).send({
                        message: 'Musica removida com sucesso',
                        status: "SUCCESS"
                    })
                }
            })
        } else {
            res.status(404).send({ message: 'Não há musica para ser removida com esse id' })
        }
    })
}

module.exports = {
    getAllMusic,
   getMusicById,
    createMusic,
    updateMusic,
    deleteMusic
}   