import supertest from 'supertest'
import app from '../../../app'
import { db } from '../../../shared/database'

import {createUserAndAuthHelper} from '../../authentication/controllers/createUserAndAuthHelper'
import {createUserHelper} from '../../users/controllers/createUserHelper'

describe('SendRequestFriend Success', () => {
  beforeEach( async () => {
    await db.none('delete from friends.send_request_friend;')
    await db.none('delete from users.user;')
  })

  afterEach(async () => {
    await db.none('delete from friends.send_request_friend;')
    await db.none('delete from users.user;')
  })

  test('should send request friend', async () => {
    const userAuth = await createUserAndAuthHelper()

    const userRequester = await createUserHelper()
    const userTarget = await createUserHelper()

    await supertest(app)
      .post('/friends/send_request')
      .set('Authorization', `Bearer ${userAuth.token}`)
      .send({requesterUserId: userRequester.id, targetUserId: userTarget.id})
      .expect(200)
  })
})



describe('SendRequestFriend BadRequest', () => {
  beforeEach( async () => {
    await db.none('delete from friends.send_request_friend;')
    await db.none('delete from users.user;')
  })

  afterEach(async () => {
    await db.none('delete from friends.send_request_friend;')
    await db.none('delete from users.user;')
  })

  test('should return an error if user requester does not exist', async () => {
    const userIamAuth = await createUserAndAuthHelper()

    const userTarget = await createUserHelper()
    
    await supertest(app)
      .post('/friends/send_request')
      .set('Authorization', `Bearer ${userIamAuth.token}`)
      .send({requesterUserId: 0, targetUserId: userTarget.id})
      .expect(400)
      .expect({message: 'requesterUserId not found'})
  })
})


describe('SendRequestFriend BadRequest', () => {
  beforeEach( async () => {
    await db.none('delete from friends.send_request_friend;')
    await db.none('delete from users.user;')
  })

  afterEach(async () => {
    await db.none('delete from friends.send_request_friend;')
    await db.none('delete from users.user;')
  })

  test('should return an error if user requester does not exist', async () => {
    const userIamAuth = await createUserAndAuthHelper()

    const userRequester = await createUserHelper()
    
    await supertest(app)
      .post('/friends/send_request')
      .set('Authorization', `Bearer ${userIamAuth.token}`)
      .send({requesterUserId: userRequester.id, targetUserId: 0})
      .expect(400)
      .expect({message: 'targetUserId not found'})
  })
})


describe('SendRequestFriend BadRequest', () => {
  beforeEach( async () => {
    await db.none('delete from friends.send_request_friend;')
    await db.none('delete from users.user;')
  })

  afterEach(async () => {
    await db.none('delete from friends.send_request_friend;')
    await db.none('delete from users.user;')
  })

  test('should return an error if user requester already exists', async () => {
    const userIamAuth = await createUserAndAuthHelper()

    const userRequester = await createUserHelper()
    const userTarget = await createUserHelper()

    // first send request
    await supertest(app)
      .post('/friends/send_request')
      .set('Authorization', `Bearer ${userIamAuth.token}`)
      .send({requesterUserId: userRequester.id, targetUserId: userTarget.id})
      .expect(200)

    // second try send request
    await supertest(app)
      .post('/friends/send_request')
      .set('Authorization', `Bearer ${userIamAuth.token}`)
      .send({requesterUserId: userRequester.id, targetUserId: userTarget.id})
      .expect(400)
      .expect({message: 'Solicitação de amizade já existe.'})
  })
})



describe('SendRequestFriend BadRequest', () => {
  beforeEach( async () => {
    await db.none('delete from friends.send_request_friend;')
    await db.none('delete from users.user;')
  })

  afterEach(async () => {
    await db.none('delete from friends.send_request_friend;')
    await db.none('delete from users.user;')
  })
  
  test('should return an error if user requester reverse already exists', async () => {
    const userIamAuth = await createUserAndAuthHelper()

    const userRequester = await createUserHelper()
    const userTarget = await createUserHelper()

    // first send request
    await supertest(app)
      .post('/friends/send_request')
      .set('Authorization', `Bearer ${userIamAuth.token}`)
      .send({requesterUserId: userRequester.id, targetUserId: userTarget.id})
      .expect(200)

    // second try send request
    await supertest(app)
      .post('/friends/send_request')
      .set('Authorization', `Bearer ${userIamAuth.token}`)
      .send({requesterUserId: userTarget.id, targetUserId: userRequester.id})
      .expect(400)
      .expect({message: 'Solicitação de amizade já existe.'})
  })
})