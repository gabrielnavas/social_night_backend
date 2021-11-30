const bcrypt = require('bcrypt')
const faker = require('faker')


exports.seed = function (knex) {
  return knex('user').del().then(() => {
    const lengthUsers = 49
    const users = [{ 
      username: 'navas', 
      email: 'navas@email.com', 
      password: bcrypt.hashSync('123456', bcrypt.genSaltSync(10))
    }]
    
    users.push(...Array(lengthUsers).fill('').map(() => ({ 
      username: faker.internet.userName(), 
      email: faker.internet.email(), 
      password: bcrypt.hashSync('123456', bcrypt.genSaltSync(10))
    })))
    return knex('user').insert(users)
  })
}
