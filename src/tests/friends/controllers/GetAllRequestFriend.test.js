import supertest from 'supertest'
import app from '../../../app'
import { db } from '../../../shared/database'

import {createUserAndAuthHelper} from '../../authentication/controllers/createUserAndAuthHelper'
import {createUserHelper} from '../../users/controllers/createUserHelper'

import {sendRequestFriendHelper} from './sendRequestFriendHelper'

describe('GetAllRequestFriend Success', () => {
  beforeAll( async () => {
    await db.none('delete from friends.send_request_friend;')
    await db.none('delete from users.user;')
  })

  afterAll(async () => {
    await db.none('delete from friends.send_request_friend;')
    await db.none('delete from users.user;')
  })


  test('should return all user requester', async () => {
    const userAuth = await createUserAndAuthHelper()
    const userTarget = await createUserHelper()

    const amountRequesters = 5
    let expectedRequesters = []
  
    // create requester and send requester
    for (let i=0; i < amountRequesters; i++) {
      // create requester
      const userRequester = await createUserHelper()
      const {id, username} = userRequester
      
      // add to expected
      expectedRequesters.push({userId:id, username})
      await sendRequestFriendHelper(userAuth.token, userRequester.id, userTarget.id)
    }

    // get all
    const response = await supertest(app)
      .get(`/friends/get_requesters/${userTarget.id}`)
      .set('Authorization', `Bearer ${userAuth.token}`)

    // reverse because list is ordened sended at from db
    expectedRequesters=expectedRequesters.reverse()

    expect(response.status).toEqual(200)
    expect(response.body.length).toEqual(amountRequesters)
    
    for (let i=0; i < amountRequesters; i++) {
      expect(response.body[i].userId).toEqual(expectedRequesters[i].userId)
      expect(response.body[i].username).toEqual(expectedRequesters[i].username)
      expect(new Date(response.body[i].sendedAt).getDate()).toEqual(new Date().getDate())
    }
  })
})