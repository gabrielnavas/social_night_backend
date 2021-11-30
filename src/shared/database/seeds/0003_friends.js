const getRandomIndex = (maxLengthUsers) => Math.floor(Math.random() * maxLengthUsers)

function addDays(date, days) {
  const copy = new Date(Number(date))
  copy.setDate(date.getDate() + days)
  return copy
}


// send request friend and accept friend
exports.seed = knex =>
  knex('friend').del()
    .then(() => knex.select('id').from('user'))
    .then(async users => {
      for (let i =0; i < users.length-1; i+=2) {
        await knex('friend').insert([{
          user_id_one: users[i+1].id, 
          user_id_two: users[i].id, 
          sended_at: new Date(),
          accepted_at: null
        }])
      }  
    })
    