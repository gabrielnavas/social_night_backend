import app from './app'
import db from './shared/database'

const PORT = process.env.PORT || 3333
const NODE_ENV = process.env.NODE_ENV

const verifyEnv = () => {
  if (!NODE_ENV) {
    console.error('[ * ] MISSING SET .env NODE_ENV')
    process.exit()
  }
}

const verifyDatabase = () => {
  db.many(`
    select test_online
    from (
        values ('online')
    ) s(test_online);
  `)
    .then(() => {})
    .catch(err => {
      console.log('[ * ] DATABASE OFF!!!')
      console.error(err)
      process.exit()
    })
}

const listenApp = () => app.listen(PORT, () => {
  console.log('[ * ] Database ON. Ping with success')
  console.log(`[ * ] NODE_ENV: ${NODE_ENV}`)
  console.log(`[ * ] Server is on on port ${PORT}`)
})

const makeServer = () => {
  verifyEnv()
  verifyDatabase()
  return listenApp()
}

const server = makeServer()
