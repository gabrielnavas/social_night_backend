import supertest from 'supertest'
import app from '../../../app'
import { db } from '../../../shared/database'

import {createUserAndAuthHelper} from '../../authentication/controllers/createUserAndAuthHelper'
import {createUserHelper} from '../../users/controllers/createUserHelper'
import {acceptFriendshipHelper} from './acceptFriendshipHelper'
import {sendRequestFriendHelper} from './sendRequestFriendHelper'

describe('GetStatusFriendController Success', () => {
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

  test('should return status Unknow', async () => {
    const userAuth = await createUserAndAuthHelper()
    const userRequester = await createUserHelper()
    const userTarget = await createUserHelper()

    // verify 
    const response = await supertest(app)
      .get(`/friends/status/${userRequester.id}/${userTarget.id}`)
      .set('Authorization', `Bearer ${userAuth.token}`)
  
    
    const expectedResponse = {
      status: 'Unknow'
    }
    expect(response.status).toEqual(200)
    expect(response.body).toEqual(expectedResponse)
  })
})


describe('GetStatusFriendController Success', () => {
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

  test('should return status Waiting', async () => {
    const userAuth = await createUserAndAuthHelper()
    const userRequester = await createUserHelper()
    const userTarget = await createUserHelper()

    // send request friend
    await sendRequestFriendHelper(userAuth.token, userRequester.id, userTarget.id)

    // verify 
    const response = await supertest(app)
      .get(`/friends/status/${userRequester.id}/${userTarget.id}`)
      .set('Authorization', `Bearer ${userAuth.token}`)
  
  
    const expectedResponse = {
      requesterUserId:userRequester.id,
      targetUserId:userTarget.id,
      status: 'Waiting'
    }
    expect(response.status).toEqual(200)
    expect(response.body).toEqual(expectedResponse)
  })
})


describe('GetStatusFriendController Success', () => {
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

  test('should return status Waiting (reverse)', async () => {
    const userAuth = await createUserAndAuthHelper()
    const userRequester = await createUserHelper()
    const userTarget = await createUserHelper()

    // send request friend
    await sendRequestFriendHelper(userAuth.token, userTarget.id, userRequester.id)

    // verify 
    const response = await supertest(app)
      .get(`/friends/status/${userRequester.id}/${userTarget.id}`)
      .set('Authorization', `Bearer ${userAuth.token}`)
  
    const expectedResponse = {
      requesterUserId:userTarget.id,
      targetUserId:userRequester.id,
      status: 'Waiting'
    }
    expect(response.status).toEqual(200)
    expect(response.body).toEqual(expectedResponse)
  })
})



describe('GetStatusFriendController Success', () => {
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

  test('should return status Friend', async () => {

    const userAuth = await createUserAndAuthHelper()
    const userRequester = await createUserHelper()
    const userTarget = await createUserHelper()

    // send request friend
    await sendRequestFriendHelper(userAuth.token, userRequester.id, userTarget.id)

    // accept friendship
    await acceptFriendshipHelper(userAuth.token, userRequester.id, userTarget.id)

    // verify 
    const response = await supertest(app)
      .get(`/friends/status/${userRequester.id}/${userTarget.id}`)
      .set('Authorization', `Bearer ${userAuth.token}`)


    const expectedResponse = {
      requesterUserId:userRequester.id,
      targetUserId:userTarget.id,
      status: 'Friend'
    }
    expect(response.status).toEqual(200)
    expect(response.body).toEqual(expectedResponse)
  })
})



describe('GetStatusFriendController Success', () => {
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

  test('should return status Friend (reverse)', async () => {

    const userAuth = await createUserAndAuthHelper()
    const userRequester = await createUserHelper()
    const userTarget = await createUserHelper()

    // send request friend
    await sendRequestFriendHelper(userAuth.token, userTarget.id, userRequester.id)

    // accept friendship
    await acceptFriendshipHelper(userAuth.token, userRequester.id, userTarget.id)

    // verify 
    const response = await supertest(app)
      .get(`/friends/status/${userRequester.id}/${userTarget.id}`)
      .set('Authorization', `Bearer ${userAuth.token}`)


    const expectedResponse = {
      requesterUserId:userTarget.id,
      targetUserId:userRequester.id,
      status: 'Friend'
    }
    expect(response.status).toEqual(200)
    expect(response.body).toEqual(expectedResponse)
  })
})