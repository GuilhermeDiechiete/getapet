const User = require('../database/models/User')


const encrypt = require("../fragments/security/config-password")
const tk = require("../fragments/security/config-token")
const jwt = require("jsonwebtoken")
const { imageUpload } = require('../helpers/image-upload')

module.exports = class UserController {
  static async register(req, res) {

    console.log(req)
    const { name, email, phone, password, confirmpassword } = req.body
  
    if (!name) {
      res.status(422).json({ message: 'O nome é obrigatório!' })
      return
    }
    if (!email) {
      res.status(422).json({ message: 'O e-mail é obrigatório!' })
      return
    }
    if (!phone) {
      res.status(422).json({ message: 'O telefone é obrigatório!' })
      return
    }
    if (!password) {
      res.status(422).json({ message: 'A senha é obrigatória!' })
      return
    }
    if (!confirmpassword) {
      res.status(422).json({ message: 'A confirmação de senha é obrigatória!' })
      return
    }
    if (password != confirmpassword) {
      res.status(422).json({ message: 'A senha e a confirmação precisam ser iguais!' })
      return
    }
    // check if user exists
    const userExists = await User.findOne({ email: email })
    if (userExists) {
      res.status(422).json({ message: 'Por favor, utilize outro e-mail!' })
      return
    }
    // create password
    const passwordHash = await encrypt.hashPassword(password)

    // create user
    const user = new User({ name, email, phone, password: passwordHash })

    try {
      const newUser = await user.save()
      await tk.createToken(newUser, req, res)
      res.status(200).json({message: "Usuário criado com sucesso."})

    } catch (error) {
      console.log("---User Register - Error generating token.")
      res.status(500).json({ message: error })
    }
  } 

  static async login(req, res) {

    const { email, password } = req.body

    if (!email) {
      res.status(422).json({ message: 'O e-mail é obrigatório!' })
      return
    }
    if (!password) {
      res.status(422).json({ message: 'A senha é obrigatória!' })
      return
    }
    // check if user exists
    const user = await User.findOne({ email: email })

    if (!user) {
      res.status(422).json({ message: 'Não há usuário cadastrado com este e-mail!' })
      return
    }
    // check if password match
    const checkPassword = await encrypt.comparePasswords(password, user.password)
    if (!checkPassword) {
      return res.status(422).json({ message: 'Senha inválida' })
    }
    try {
      await tk.createToken(user, req, res)
      res.status(200).json({message: "Login efetuado com sucesso."})
    } catch (error) {
      console.log("--- User login - Error login")
    }
    
  }

  static async checkUser(req, res) {
    let currentUser

    if (req.headers.authorization) {
      const token = tk.getToken(req)
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      console.log(decoded)
      const user = await User.findById(decoded.id)
      console.log(user)
      if(user){
        currentUser = { ...user.toObject()}
        currentUser.password = undefined
      } else {
        currentUser = null
      }
    } else {
      currentUser = null
    }
    res.status(200).send(currentUser)
  }

  static async getUserById(req, res) {
    const id = req.params.id

    const user = await User.findById(id)

    if (!user) {
      res.status(422).json({ message: 'Usuário não encontrado!' })
      return
    }

    res.status(200).json({ user })
  }

  static async editUser(req, res) {

    
    
    const { name, email, phone, password, confirmpassword } = req.body

    const user = await tk.getByToken(req)
    console.log(user)
    let image = ''

    if (req.file) {
      image = req.file.filename
    }
    // validations
    if (!name) {
      res.status(422).json({ message: 'O nome é obrigatório!' })
      return
    }
    user.name = name 
    if (!email) {
      res.status(422).json({ message: 'O e-mail é obrigatório!' })
      return
    }
    // check if user exists
    const userExists = await User.findOne({ email: email })
    user.email = email
    if (user.email !== email && userExists) {
      res.status(422).json({ message: 'Por favor, utilize outro e-mail!' })
      return
    }
    if (image) {
      const imageName = req.file.filename
      user.image = imageName
    }
    if (!phone) {
      res.status(422).json({ message: 'O telefone é obrigatório!' })
      return
    }
    user.phone = phone

    // check if password match
    if (password != confirmpassword) {
      res.status(422).json({ error: 'As senhas não conferem.' })

      // change password
    } else if (password == confirmpassword && password != null) {
      // creating password
      const reqPassword = req.body.password

      const passwordHash = await encrypt.hashPassword(reqPassword)
      user.password = passwordHash
    }

    try {
      // returns updated data
      const updatedUser = await User.findOneAndUpdate(
        { _id: user._id },
        { $set: user },
        { new: true },
      )
      res.json({
        message: 'Usuário atualizado com sucesso!',
        data: updatedUser,
      })
    } catch (error) {
      res.status(500).json({ message: error })
    }
  }
}
