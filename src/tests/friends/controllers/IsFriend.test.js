import supertest from 'supertest'
import app from '../../../app'
import { db } from '../../../shared/database'

import {createUserAndAuthHelper} from '../../authentication/controllers/createUserAndAuthHelper'
import {createUserHelper} from '../../users/controllers/createUserHelper'
import {acceptFriendshipHelper} from '../../friends/controllers/acceptFriendshipHelper'
import {sendRequestFriendHelper} from '../../friends/controllers/sendRequestFriendHelper'

describe('IsFriendController Success', () => {
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

  test('should return true is friend if user one is friend of user 2', async () => {
    const userAuth = await createUserAndAuthHelper()
    const userRequester = await createUserHelper()
    const userTarget = await createUserHelper()

    // send request friend
    await sendRequestFriendHelper(userAuth.token, userRequester.id, userTarget.id)
    
    // accept friendship
    await acceptFriendshipHelper(userAuth.token, userRequester.id, userTarget.id)

    // verify 
    const response = await supertest(app)
      .get(`/friends/is_friend/${userRequester.id}/${userTarget.id}`)
      .set('Authorization', `Bearer ${userAuth.token}`)
  
  
    expect(response.status).toEqual(200)
    expect(response.body).toEqual({isFriend: true})
  })
})


describe('IsFriendController Success', () => {
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

  test('should return true is friend if user one is friend of user 2 reverse', async () => {
    const userAuth = await createUserAndAuthHelper()
    const userRequester = await createUserHelper()
    const userTarget = await createUserHelper()

    // send request friend
    await sendRequestFriendHelper(userAuth.token, userRequester.id, userTarget.id)
    
    // accept friendship
    await acceptFriendshipHelper(userAuth.token, userRequester.id, userTarget.id)

    // verify 
    const response = await supertest(app)
      .get(`/friends/is_friend/${userTarget.id}/${userRequester.id}`)
      .set('Authorization', `Bearer ${userAuth.token}`)
  
  
    expect(response.status).toEqual(200)
    expect(response.body).toEqual({isFriend: true})
  })
})


describe('IsFriendController Success', () => {
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

  test('should return false if user one is friend of user 2', async () => {
    const userAuth = await createUserAndAuthHelper()
    const userRequester = await createUserHelper()
    const userTarget = await createUserHelper()
    const userTarget2 = await createUserHelper()

    // send request friend
    await sendRequestFriendHelper(userAuth.token, userRequester.id, userTarget.id)
    
    // accept friendship
    await acceptFriendshipHelper(userAuth.token, userRequester.id, userTarget.id)

    // verify 
    const response =  await supertest(app)
      .get(`/friends/is_friend/${userRequester.id}/${userTarget2.id}`)
      .set('Authorization', `Bearer ${userAuth.token}`)
    
    expect(response.status).toEqual(200)
    expect(response.body).toEqual({isFriend: false})
  });
});