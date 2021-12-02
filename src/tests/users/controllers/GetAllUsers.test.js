import supertest from 'supertest'
import app from '../../../app'
import {db} from '../../../shared/database'
import {createUserAndAuthHelper} from '../../authentication/controllers/createUserAndAuthHelper'
import {createUserHelper} from '../controllers/createUserHelper'

describe('GetAllUsers Success', () => {
  beforeEach(async () => {
    await db.none('delete from users.user;')
  })

  afterEach(async () => {
    await db.none('delete from users.user;')
  })  
  
  const createUsers = async totalUsers => {
    const users = []
    for (let i = 0; i < totalUsers; i++) {
      const user = await createUserHelper()
      users.push(user)
    }
    return users
  }

  const mapUsers = users => {
    const removePasswords = user => {
      const { password, ...rest } = user
      return rest
    }
    return users
      .reverse()
      .map(removePasswords)
  }


  test('should get all users', async () => {
    const userAuth = await createUserAndAuthHelper()
    const amountUsers = 10
    const usersCreated = await createUsers(amountUsers)

    const usersCreatedFilters = mapUsers([userAuth.user,...usersCreated])
    const usersCreatedFiltersLength = usersCreatedFilters.length
    
    const response = await supertest(app)
      .get('/users')
      .set('Authorization', `Bearer ${userAuth.token}`)

    expect(response.statusCode).toEqual(200)
    expect(response.body.length).toEqual(usersCreatedFiltersLength)
    expect(response.body).toEqual(usersCreatedFilters)
  })
})


describe('GetAllUsers Success', () => {
  beforeEach(async () => {
    await db.none('delete from users.user;')
  })

  afterEach(async () => {
    await db.none('delete from users.user;')
  })  
  
  const createUsers = async totalUsers => {
    const users = []
    for (let i = 0; i < totalUsers; i++) {
      const user = await createUserHelper()
      users.push(user)
    }
    return users
  }

  const mapUsers = users => {
    const removePasswords = user => {
      const { password, ...rest } = user
      return rest
    }
    return users
      .reverse()
      .map(removePasswords)
  }


  test.only('should get all users by username', async () => {
    const userAuth = await createUserAndAuthHelper()
    const amountUsers = 10
    const usersCreated = await createUsers(amountUsers)
    
    const userFind = usersCreated[0]
    const amountEncounter = 1

    const usersCreatedFilters = mapUsers([userFind])
    
    const response = await supertest(app)
      .get(`/users?username=${userFind.username}`)
      .set('Authorization', `Bearer ${userAuth.token}`)

    expect(response.statusCode).toEqual(200)
    expect(response.body.length).toEqual(amountEncounter)
    expect(response.body).toEqual(usersCreatedFilters)
  })
})

