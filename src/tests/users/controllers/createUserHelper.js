import faker from 'faker'
import supertest from 'supertest'
import app from '../../../app'

const createUserRandom = () => {
  const password = faker.internet.password(8)
  const payloadRandom = {
    email: faker.internet.email(),
    username: faker.internet.userName(),
    password,
    passwordConfirmation: password
  }
  return payloadRandom
}

export const createUserHelper = async (userPayload = createUserRandom()) => {
  const response = await supertest(app)
    .post('/users')
    .send(userPayload)
    .expect(201)
  const body = response.body
  return {
    id: body.id,
    email: userPayload.email,
    username: userPayload.username,
    password: userPayload.password,
    createdAt: body.createdAt,
    updatedAt: body.updatedAt
  }
}
