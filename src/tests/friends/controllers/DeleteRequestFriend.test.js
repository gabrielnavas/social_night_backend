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

    // create send requester
    const userRequester = await createUserHelper()
    const userTarget = await createUserHelper()

    // send requester
    await supertest(app)
      .post('/friends/send_request')
      .set('Authorization', `Bearer ${userAuth.token}`)
      .send({requesterUserId: userRequester.id, targetUserId: userTarget.id})
      .expect(200)


    // try delete
    await supertest(app)
      .delete(`/friends/cancel_request/${userRequester.id}/${userTarget.id}`)
      .set('Authorization', `Bearer ${userAuth.token}`)
      .expect(204)
  })
})


describe('SendRequestFriend Bad Request', () => {
  beforeEach( async () => {
    await db.none('delete from friends.send_request_friend;')
    await db.none('delete from users.user;')
  })

  afterEach(async () => {
    await db.none('delete from friends.send_request_friend;')
    await db.none('delete from users.user;')
  })

  test('should return an error if user requester does not exist', async () => {
    const userAuth = await createUserAndAuthHelper()

    // create send requester
    const userRequester = await createUserHelper()
    const userTarget = await createUserHelper()

    // send requester
    await supertest(app)
      .post('/friends/send_request')
      .set('Authorization', `Bearer ${userAuth.token}`)
      .send({requesterUserId: userRequester.id, targetUserId: userTarget.id})
      .expect(200)


    // try delete
    await supertest(app)
      .delete(`/friends/cancel_request/${0}/${userTarget.id}`)
      .set('Authorization', `Bearer ${userAuth.token}`)
      .expect(400)
      .expect({message: 'requesterUserId not found'})
  })
})



describe('SendRequestFriend Bad Request', () => {
  beforeEach( async () => {
    await db.none('delete from friends.send_request_friend;')
    await db.none('delete from users.user;')
  })

  afterEach(async () => {
    await db.none('delete from friends.send_request_friend;')
    await db.none('delete from users.user;')
  })

  test('should return an error if user requester does not exist', async () => {
    const userAuth = await createUserAndAuthHelper()

    // create send requester
    const userRequester = await createUserHelper()
    const userTarget = await createUserHelper()

    // send requester
    await supertest(app)
      .post('/friends/send_request')
      .set('Authorization', `Bearer ${userAuth.token}`)
      .send({requesterUserId: userRequester.id, targetUserId: userTarget.id})
      .expect(200)

    // try delete
    await supertest(app)
      .delete(`/friends/cancel_request/${userRequester.id}/${0}`)
      .set('Authorization', `Bearer ${userAuth.token}`)
      .expect(400)
      .expect({message: 'targetUserId not found'})
  })
})



describe('SendRequestFriend Bad Request', () => {
  beforeEach( async () => {
    await db.none('delete from friends.send_request_friend;')
    await db.none('delete from users.user;')
  })

  afterEach(async () => {
    await db.none('delete from friends.send_request_friend;')
    await db.none('delete from users.user;')
  })

  test('should return an error if send request does not created yet', async () => {
    const userAuth = await createUserAndAuthHelper()

      // create send requester
      const userRequester = await createUserHelper()
      const userTarget = await createUserHelper()
   
    // try delete
    await supertest(app)
      .delete(`/friends/cancel_request/${userRequester.id}/${userTarget.id}`)
      .set('Authorization', `Bearer ${userAuth.token}`)
      .expect(400)
      .expect({message: 'send requester does not created yet'})
  })
})