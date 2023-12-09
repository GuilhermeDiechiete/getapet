const router = require("express").Router()

const UserController = require("../controllers/UserController")

// middlewares
const verifyToken = require("../helpers/check-token")
const { imageUpload } = require("../helpers/image-upload")

router.post("/register",verifyToken, UserController.register)
router.post("/login",verifyToken, UserController.login)
router.get("/checkuser",verifyToken, UserController.checkUser)
router.get("/:id",verifyToken, UserController.getUserById)
router.patch("/edit/:id",verifyToken,imageUpload.single("image"), UserController.editUser)

module.exports = router;
