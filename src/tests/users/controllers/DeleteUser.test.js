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

  test('should delete an user', async () => {
    const userAuth = await createUserAndAuthHelper()
    await supertest(app)
      .delete(`/users/${userAuth.id}`)
      .set('Authorization', `Bearer ${userAuth.token}`)
      .expect(204)
  })
})
