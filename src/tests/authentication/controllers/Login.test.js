import supertest from 'supertest'
import app from '../../../app';
import { createUserHelper } from '../../users/controllers/createUserHelper';
import { db } from '../../../shared/database'

describe('LoginController Success', () => {
  beforeAll(async () => {
    db.none('delete from users.user;')
  })

  afterAll(async () => {
    db.none('delete from users.user;')
  })

  test('should return a token', async () => {
    const user = await createUserHelper()
    const payload = {
      username: user.username,
      password: user.password
    }
    const response = await supertest(app)
      .post('/login')
      .send(payload)

    const {status, body} = response
    
    expect(status).toEqual(201)
    expect(body.token.length).toBeGreaterThan(40)
    expect(body.user.id).toBeGreaterThan(0)
    expect(body.user.username).toEqual(user.username)
    expect(new Date(body.user.createdAt).getDate()).toEqual(new Date().getDate())
    expect(body.user.email).toEqual(user.email)
    expect(body.user.password).toEqual(undefined)
  });
});


describe('LoginController Bad Request', () => {
  beforeAll(async () => {
    db.none('delete from users.user;')
  })

  afterAll(async () => {
    db.none('delete from users.user;')
  })

  test('should return an error if username does not exist', async () => {
    const user = await createUserHelper()
    const payload = {
      username: 'wrong username',
      password: user.password
    }
    const response = await supertest(app)
      .post('/login')
      .send(payload)
      .expect(400)
      .expect({message: 'Nome de usuário ou senha invaĺidos.'})
  });
});


describe('LoginController Bad Request', () => {
  beforeAll(async () => {
    db.none('delete from users.user;')
  })

  afterAll(async () => {
    db.none('delete from users.user;')
  })

  test('should return an error if password does not exist', async () => {
    const user = await createUserHelper()
    const payload = {
      username: user.username,
      password: 'wrong password'
    }
    const response = await supertest(app)
      .post('/login')
      .send(payload)
      .expect(400)
      .expect({message: 'Nome de usuário ou senha invaĺidos.'})
  });
});