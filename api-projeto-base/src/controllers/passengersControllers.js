//const travels = require("../models/travels.json");
//const passengers = require("../models/passengers.json");
//const fs = require("fs");
//const utils = require("../utils/travelsUtils");

const getAllPassengers = (req, res) => {
    res.status(200).send(passengers);
};

const createPassenger = (req, res) => {
    let {
        name,
        email,
        documentNumber
    } = req.body;

    let requiredId = req.params.id;

    let passenger = {
        "id": Math.random().toString(32).substr(2),
        name,
        email,
        documentNumber,
        travelId: requiredId
    }

    travels.findOne({ id: requiredId }, function (err, travelFound) { // achando a viagem solicitada na requisição
        if (err) {
            res.status(500).send({ message: err.message })
        } else {
            if (travelFound) { // verifico primeiro se a viagem existe na base de dados
                let newPassenger = new passengers(passenger)
                newPassenger.save(function (err) { // crio novo passageiro na collection de passageiros
                    if (err) {
                        // se deu erro ao salvar o passageiro na collection de passageiros
                        res.status(500).send({ message: err.message })
                    } else {
                        // se deu certo salvar o passageiro na collection de passageiros vou salvar na viagem tambem
                        travelFound.passengersInfos.push(passenger); // adicionando um passageiro à viagem solicitada
                        travels.updateOne({ id: requiredId }, { $set: { passengersInfos: travelFound.passengersInfos } }, function (err) { // atualizando os passageiros na viagem no banco de dados
                            if (err) {
                                res.status(500).send({ message: err.message }) //responder com o erro
                            }
                            res.status(201).send({
                                message: "Passageiro adicionado com sucesso!",
                                ...travelFound.toJSON()
                            });
                        });
                    }
                })
            } else {
                res.status(404).send({ message: "Viagem não encontrada para inserir passageiro!" });
            }
        }
    })
};
// substituir todo passageiro APESAR do método PUT ser usado para substituir apenas uma parte
const replacePassenger = (req, res) => {
    const requiredId = req.params.id;
    passengers.findOne({ id: requiredId }, function (err, passengerFound) {
        if (err) {
            res.status(500).send({ message: err.message })
        } else {
            if (passengerFound) {
                passengers.updateOne({ id: requiredId }, { $set: req.body }, function (err) {
                    if (err) {
                        res.status(500).send({ message: err.message })
                    } else {
                        res.status(200).send({ message: "Registro alterado com sucesso" })
                    }
                })
            } else {
                res.status(404).send({ message: "Não há registro para ser atualizado com esse id" });
            }
        }
    })
};
// atualizar apenas o nome do passageiro
const updateName = (req, res) => {
    const requiredId = req.params.id;
    let newName = req.body.name;

    let filteredPassenger = utils.filterById(passengers, requiredId);

    if (filteredPassenger) {
        filteredPassenger.name = newName;

        //atualiza passageiro na base de passageiros
        fs.writeFile("./src/models/passengers.json", JSON.stringify(passengers), 'utf8', function (err) {
            if (err) {
                res.status(500).send({ message: err }) // caso de erro retorno status 500
            } else {
                res.status(200).json([{
                    "mensagem": "Nome do passageiro atualizado com sucesso",
                    filteredPassenger
                }]);
            }
        })
    } else {
        res.status(404).send({ "message": "Passageiro não encontrado para ter nome atualizado!" })
    }
}
const deletePassenger = (req, res) => {
    const requiredId = req.params.id;
    passengers.findOne({ id: requiredId }, function (err, passenger) {
        if (err) {
            res.status(500).send({ message: err.message })
        } else {
            if (passenger) {
                //deleteMany remove mais de um registro
                //deleteOne remove apenas um registro
                passengers.deleteOne({ id: requiredId }, function (err) {
                    if (err) {
                        res.status(500).send({
                            message: err.message,
                            status: "FAIL"
                        })
                    } else {
                        res.status(200).send({
                            message: 'Passageiro removido com sucesso',
                            status: "SUCCESS"
                        })
                    }
                })
            } else {
                res.status(404).send({ message: 'Não há passageiro para ser removido com esse id' })
            }
        }
    })
};
module.exports = {
    getAllPassengers,
    createPassenger,
    replacePassenger,
    updateName,
    deletePassenger
};