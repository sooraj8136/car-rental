const { createCar, getAllCar, getCar, getOwnerCars, deleteOwnerCar, updateCar, searchCars } = require('../../controller/carController')
const { upload } = require('../../middlewares/multer')
const { ownerAuth } = require('../../middlewares/ownerAuth');

const carRouter = require('express').Router()

carRouter.post("/create-car", ownerAuth, upload.single("images"), createCar);
carRouter.get("/get-all-car", getAllCar);
carRouter.get("/get-a-car/:id", getCar);
carRouter.get("/get-owner-cars",ownerAuth, getOwnerCars);
carRouter.delete("/delete-owner-car/:id",ownerAuth, deleteOwnerCar);
carRouter.put("/update-owner-car/:id",ownerAuth, updateCar);
carRouter.get("/search", searchCars);


module.exports = carRouter