const mongoose = require('mongoose')

async function main() {
  await mongoose.connect(`${process.env.DB_PROTOCOL}://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`) 

  console.log('Connect database!')
}

main().catch((err) => console.log(err))

module.exports = mongoose
