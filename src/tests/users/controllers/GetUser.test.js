import supertest from 'supertest'
import app from '../../../app'
import {db} from '../../../shared/database'
import { createUserAndAuthHelper } from '../../authentication/controllers/createUserAndAuthHelper'


describe('DeleteUser', () => {
  beforeEach(async () => {
    await db.none('delete from users.user;')
  })

  afterEach(async () => {
    await db.none('delete from users.user;')
  })

  test('should get an user', async () => {
    const userAuth = await createUserAndAuthHelper()
    const response = await supertest(app)
      .get(`/users/${userAuth.user.id}`)
      .set('Authorization', `Bearer ${userAuth.token}`)

    const statusHttp = response.statusCode
    const body = response.body
    const lengthEntriesBody = Object.entries(body).length

    expect(statusHttp).toEqual(200)
    expect(lengthEntriesBody).toEqual(5)

    expect(body.id).toBeGreaterThan(0)
    expect(body.username).toEqual(userAuth.user.username)
    expect(body.email).toEqual(userAuth.user.email)
    expect(new Date(body.createdAt).getDate()).toEqual(new Date().getDate())
    expect(new Date(body.updatedAt).getDate()).toEqual(new Date().getDate())
  })
})
