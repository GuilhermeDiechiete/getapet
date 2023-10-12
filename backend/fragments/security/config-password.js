const bcrypt = require('bcrypt');

// Função para criptografar a senha
exports.hashPassword = async (password) => {
  try {
    const saltRounds = 10; // Número de rounds de sal (quanto maior, mais seguro)
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
    
  } catch (error) {
      throw error;
  }
};

// Função para verificar se uma senha corresponde a uma hash
exports.comparePasswords = async (password, hashedPassword) => {
  try {
    const isMatch = await bcrypt.compare(password, hashedPassword);
    return isMatch;
  } catch (error) {
      throw error;
  }
};