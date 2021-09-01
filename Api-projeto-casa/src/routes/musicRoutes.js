const express = require("express");
const router = express.Router();
const controller = require("../controllers/musicControllers.js");


router.get("/music", controller.getAllMusic)
router.get('/music/:id', controller.getMusicById)
router.post("/musicnew", controller.createMusic)
router.delete("/music/:id/delete", controller.deleteMusic)
router.put("/music/:id/update", controller.updateMusic)

module.exports = router
