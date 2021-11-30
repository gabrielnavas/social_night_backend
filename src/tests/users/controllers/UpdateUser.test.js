import supertest from 'supertest'
import app from '../../../app'
import faker from 'faker'
import {db} from '../../../shared/database'
import { createUserAndAuthHelper } from '../../authentication/controllers/createUserAndAuthHelper'

describe('UpdateUser', () => {
  beforeEach(async () => {
    await db.none('delete from users.user;')
  })

  afterEach(async () => {
    await db.none('delete from users.user;')
  })

  test('should update an user', async () => {
    const userAuth = await createUserAndAuthHelper()

    const password = faker.internet.password()
    const payloadToUpdate = {
      username: faker.internet.userName(),
      password,
      passwordConfirmation: password,
      email: faker.internet.email()
    }

    await supertest(app)
      .put(`/users/${userAuth.user.id}`)
      .set('Authorization', `Bearer ${userAuth.token}`)
      .send(payloadToUpdate)
      .expect(204)
  })
})
