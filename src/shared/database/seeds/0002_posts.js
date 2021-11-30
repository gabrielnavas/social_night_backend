const faker = require('faker')

const getRandomIndex = (maxLengthUsers) => Math.floor(Math.random() * maxLengthUsers)

exports.seed = function(knex) {
  return knex('post').del()
    .then(() => knex.select('id').from('user'))
    .then(users => {
      const lengthAllUsers = users.length
      const maxPostsToCreate = 500
    
      const posts = Array(maxPostsToCreate).fill('').map(() => ({
        comment: faker.lorem.words(50),
        image: faker.image.technics(800, 600),
        user_id: users[getRandomIndex(lengthAllUsers)].id
      }))

      console.log(posts);
    
      return knex('post').insert(posts);
    })
}
