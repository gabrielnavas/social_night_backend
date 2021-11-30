import supertest from 'supertest'
import app from '../../../app'
import faker from 'faker'
import {db} from '../../../shared/database'
import { createUserHelper } from './createUserHelper'

describe.only('CreateUser Success', () => {
  beforeEach(async () => {
    await db.none('delete from users.user')
  })

  afterEach(async () => {
    await db.none('delete from users.user')
  })

  test('should create an user', async () => {
    const password = faker.internet.password(8)
    const payload = {
      email: faker.internet.email(),
      username: faker.internet.userName(),
      password,
      passwordConfirmation: password
    }
    const response = await supertest(app)
      .post('/users')
      .send(payload)
    const body = response.body
    const lengthEntriesBody = Object.entries(body).length

    expect(response.statusCode).toEqual(201)
    expect(lengthEntriesBody).toEqual(5)

    expect(body.id).toBeGreaterThan(0)
    expect(body.username).toEqual(payload.username)
    expect(new Date(body.createdAt).getDate()).toEqual(new Date().getDate())
    expect(new Date(body.updatedAt).getDate()).toEqual(new Date().getDate())
    expect(body.email).toEqual(payload.email)
    expect(body.password).toEqual(undefined)
  })
})



describe('CreateUser Bad Request', () => {
  beforeEach(async () => {
    await knex('user').delete()
  })

  afterEach(async () => {
    await knex('user').delete()
  })

  test('should return if email alread exists', async () => {
    const password = faker.internet.password(8)
    const payload = {
      email: faker.internet.email(),
      username: faker.internet.userName(),
      password,
      passwordConfirmation: password
    }
    await createUserHelper(payload)

    await supertest(app)
      .post('/users')
      .send(payload)
      .expect(400)
      .expect({message: "Usuário já existe com esse email."})
  })
})


describe('CreateUser Bad Request', () => {
  beforeEach(async () => {
    await knex('user').delete()
  })

  afterEach(async () => {
    await knex('user').delete()
  })

  test('should return if username alread exists', async () => {
    const password = faker.internet.password(8)
    const payload = {
      email: faker.internet.email(),
      username: faker.internet.userName(),
      password,
      passwordConfirmation: password
    }
    await createUserHelper(payload)
    const otherRandomEmail = faker.internet.email()
    payload.email = otherRandomEmail

    await supertest(app)
      .post('/users')
      .send(payload)
      .expect(400)
      .expect({message: "Usuário já existe com esse nome de usuário."})
  })
})



