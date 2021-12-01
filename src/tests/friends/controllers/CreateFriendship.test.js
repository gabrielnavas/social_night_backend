import supertest from 'supertest'
import app from '../../../app'
import { db } from '../../../shared/database'

import {createUserAndAuthHelper} from '../../authentication/controllers/createUserAndAuthHelper'
import {createUserHelper} from '../../users/controllers/createUserHelper'
import {sendRequestFriendHelper} from './sendRequestFriendHelper'

describe('CreateFriendship Success', () => {
  beforeEach( async () => {
    await db.none('delete from friends.friend;')
    await db.none('delete from friends.send_request_friend;')
    await db.none('delete from users.user;')
  })

  afterEach(async () => {
    await db.none('delete from friends.friend;')
    await db.none('delete from friends.send_request_friend;')
    await db.none('delete from users.user;')
  })
  
  test('should create a friendship from send request friend', async () => {
    const userIamAuth = await createUserAndAuthHelper()
    
    const userRequester = await createUserHelper()
    const userTarget = await createUserHelper()

    // send request friend
    await sendRequestFriendHelper(userIamAuth.token, userRequester.id, userTarget.id)

    // accept friend
    await supertest(app)
      .post('/friends/friendship/accept')
      .set('Authorization', `Bearer ${userIamAuth.token}`)
      .send({requesterUserId: userRequester.id, targetUserId: userTarget.id})
      .expect(200)
      .expect({message: 'Agora já são amigos!!'})
  })
})

describe('CreateFriendship Bad Request', () => {
  beforeEach( async () => {
    await db.none('delete from friends.friend;')
    await db.none('delete from friends.send_request_friend;')
    await db.none('delete from users.user;')
  })

  afterEach(async () => {
    await db.none('delete from friends.friend;')
    await db.none('delete from friends.send_request_friend;')
    await db.none('delete from users.user;')
  })
  
  test('should return an error if user request id does not exists', async () => {
    const userIamAuth = await createUserAndAuthHelper()
    
    const userTarget = await createUserHelper()

    // try accept friend
    await supertest(app)
      .post('/friends/friendship/accept')
      .set('Authorization', `Bearer ${userIamAuth.token}`)
      .send({requesterUserId: 0, targetUserId: userTarget.id})
      .expect(400)
      .expect({message: 'requesterUserId not found'})
  })
})


describe('CreateFriendship Bad Request', () => {
  beforeEach( async () => {
    await db.none('delete from friends.friend;')
    await db.none('delete from friends.send_request_friend;')
    await db.none('delete from users.user;')
  })

  afterEach(async () => {
    await db.none('delete from friends.friend;')
    await db.none('delete from friends.send_request_friend;')
    await db.none('delete from users.user;')
  })
  
  test('should return an error if user targetUser id does not exists', async () => {
    const userIamAuth = await createUserAndAuthHelper()
    const userRequester = await createUserHelper()
    
    // try accept friend
    await supertest(app)
      .post('/friends/friendship/accept')
      .set('Authorization', `Bearer ${userIamAuth.token}`)
      .send({requesterUserId: userRequester.id, targetUserId: 0})
      .expect(400)
      .expect({message: 'targetUserId not found'})
  })
})


describe('CreateFriendship Bad Request', () => {
  beforeEach( async () => {
    await db.none('delete from friends.friend;')
    await db.none('delete from friends.send_request_friend;')
    await db.none('delete from users.user;')
  })

  afterEach(async () => {
    await db.none('delete from friends.friend;')
    await db.none('delete from friends.send_request_friend;')
    await db.none('delete from users.user;')
  })
  
  test('should return an error if solicitation of friendship does not has', async () => {
    const userIamAuth = await createUserAndAuthHelper()
    
    const userRequester = await createUserHelper()
    const userTarget = await createUserHelper()

    // try accept friend
    await supertest(app)
      .post('/friends/friendship/accept')
      .set('Authorization', `Bearer ${userIamAuth.token}`)
      .send({requesterUserId: userRequester.id, targetUserId: userTarget.id})
      .expect(400)
      .expect({message: 'solicitation of friendship does not has'})
  })
})


describe('CreateFriendship Bad Request', () => {
  beforeEach( async () => {
    await db.none('delete from friends.friend;')
    await db.none('delete from friends.send_request_friend;')
    await db.none('delete from users.user;')
  })

  afterEach(async () => {
    await db.none('delete from friends.friend;')
    await db.none('delete from friends.send_request_friend;')
    await db.none('delete from users.user;')
  })
  
  test('should return an error if you already friendship', async () => {
    const userIamAuth = await createUserAndAuthHelper()
    
    const userRequester = await createUserHelper()
    const userTarget = await createUserHelper()

    // send request friend
    await sendRequestFriendHelper(userIamAuth.token, userRequester.id, userTarget.id)

    // accept friend
    await supertest(app)
      .post('/friends/friendship/accept')
      .set('Authorization', `Bearer ${userIamAuth.token}`)
      .send({requesterUserId: userRequester.id, targetUserId: userTarget.id})
      .expect(200)

    // try again
    await supertest(app)
      .post('/friends/friendship/accept')
      .set('Authorization', `Bearer ${userIamAuth.token}`)
      .send({requesterUserId: userRequester.id, targetUserId: userTarget.id})
      .expect(400)
      .expect({message: 'you already friendship'})
  })
})



describe('CreateFriendship Bad Request', () => {
  beforeEach( async () => {
    await db.none('delete from friends.friend;')
    await db.none('delete from friends.send_request_friend;')
    await db.none('delete from users.user;')
  })

  afterEach(async () => {
    await db.none('delete from friends.friend;')
    await db.none('delete from friends.send_request_friend;')
    await db.none('delete from users.user;')
  })
  
  test('should return an error if you already friendship. (target and requester id changed)', async () => {
    const userIamAuth = await createUserAndAuthHelper()
    
    const userRequester = await createUserHelper()
    const userTarget = await createUserHelper()

    // send request friend
    await sendRequestFriendHelper(userIamAuth.token, userRequester.id, userTarget.id)

    // accept friend
    await supertest(app)
      .post('/friends/friendship/accept')
      .set('Authorization', `Bearer ${userIamAuth.token}`)
      .send({requesterUserId: userRequester.id, targetUserId: userTarget.id})
      .expect(200)

    // try again
    await supertest(app)
      .post('/friends/friendship/accept')
      .set('Authorization', `Bearer ${userIamAuth.token}`)
      .send({requesterUserId: userTarget.id, targetUserId: userRequester.id})
      .expect(400)
      .expect({message: 'you already friendship'})
  })
})
