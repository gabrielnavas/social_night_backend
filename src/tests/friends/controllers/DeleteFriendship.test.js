const { createUserAndAuthHelper } = require("../../authentication/controllers/createUserAndAuthHelper")
const { createUserHelper } = require("../../users/controllers/createUserHelper")
const { sendRequestFriendHelper } = require("./sendRequestFriendHelper")
const {acceptFriendshipHelper} = require('./acceptFriendshipHelper')
const supertest = require("supertest")
import app from '../../../app'
const { db } = require("../../../shared/database")

describe('DeleteFriendship Success', () => {
  beforeEach( async () => {
    await db.none('delete from friends.friend;')
    await db.none('delete from friends.send_request_friend;')
    await db.none('delete from users.user;')
  })

  afterAll(async () => {
    await db.none('delete from friends.friend;')
    await db.none('delete from friends.send_request_friend;')
    await db.none('delete from users.user;')
  })

  test('should cancel a friendship', async () => {
    const userAuth = await  createUserAndAuthHelper()
    const userRequest = await createUserHelper()
    const userTarget = await createUserHelper()

    // send request
    await sendRequestFriendHelper(userAuth.token, userRequest.id, userTarget.id)

    // accept friendship
    await acceptFriendshipHelper(userAuth.token, userRequest.id, userTarget.id)

    // delete friendship
    await supertest(app)
      .delete(`/friends/friendship/cancel/${userRequest.id}/${userTarget.id}`)
      .set('Authorization', `Bearer ${userAuth.token}`)
      .expect(204)
  });
});

describe('DeleteFriendship Bad Request', () => {
  beforeEach( async () => {
    await db.none('delete from friends.friend;')
    await db.none('delete from friends.send_request_friend;')
    await db.none('delete from users.user;')
  })

  afterAll(async () => {
    await db.none('delete from friends.friend;')
    await db.none('delete from friends.send_request_friend;')
    await db.none('delete from users.user;')
  })

  test('should return 400 if user requester id does not exist', async () => {
    const userAuth = await  createUserAndAuthHelper()
    const userRequest = await createUserHelper()
    const userTarget = await createUserHelper()

    // send request
    await sendRequestFriendHelper(userAuth.token, userRequest.id, userTarget.id)

    // accept friendship
    await acceptFriendshipHelper(userAuth.token, userRequest.id, userTarget.id)

    // delete friendship
    await supertest(app)
      .delete(`/friends/friendship/cancel/${0}/${userTarget.id}`)
      .set('Authorization', `Bearer ${userAuth.token}`)
      .expect(400)
      .expect({message: 'requesterUserId not found'})
  })
})



describe('DeleteFriendship Bad Request', () => {
  beforeEach( async () => {
    await db.none('delete from friends.friend;')
    await db.none('delete from friends.send_request_friend;')
    await db.none('delete from users.user;')
  })

  afterAll(async () => {
    await db.none('delete from friends.friend;')
    await db.none('delete from friends.send_request_friend;')
    await db.none('delete from users.user;')
  })

  test('should return 400 if user target id does not exist', async () => {
    const userAuth = await  createUserAndAuthHelper()
    const userRequest = await createUserHelper()
    const userTarget = await createUserHelper()

    // send request
    await sendRequestFriendHelper(userAuth.token, userRequest.id, userTarget.id)

    // accept friendship
    await acceptFriendshipHelper(userAuth.token, userRequest.id, userTarget.id)

    // delete friendship
    await supertest(app)
      .delete(`/friends/friendship/cancel/${userRequest.id}/${0}`)
      .set('Authorization', `Bearer ${userAuth.token}`)
      .expect(400)
      .expect({message: 'targetUserId not found'})
  })
})


describe.only('DeleteFriendship Bad Request', () => {
  beforeEach( async () => {
    await db.none('delete from friends.friend;')
    await db.none('delete from friends.send_request_friend;')
    await db.none('delete from users.user;')
  })

  afterAll(async () => {
    await db.none('delete from friends.friend;')
    await db.none('delete from friends.send_request_friend;')
    await db.none('delete from users.user;')
  })

  test('should return 400 if frienship does not created', async () => {
    const userAuth = await  createUserAndAuthHelper()

    const userRequest = await createUserHelper()
    const userTarget = await createUserHelper()

    // // send request
    // await sendRequestFriendHelper(userAuth.token, userRequest.id, userTarget.id)

    // // accept friendship
    // await acceptFriendshipHelper(userAuth.token, userRequest.id, userTarget.id)

    // delete friendship
    await supertest(app)
      .delete(`/friends/friendship/cancel/${userRequest.id}/${userTarget.id}`)
      .set('Authorization', `Bearer ${userAuth.token}`)
      .expect(400)
      .expect({message: 'friendship does not exist'})
  })
})


describe('DeleteFriendship Bad Request', () => {
  beforeEach( async () => {
    await db.none('delete from friends.friend;')
    await db.none('delete from friends.send_request_friend;')
    await db.none('delete from users.user;')
  })

  afterAll(async () => {
    await db.none('delete from friends.friend;')
    await db.none('delete from friends.send_request_friend;')
    await db.none('delete from users.user;')
  })

  test('should return 400 if frienship does not created', async () => {
    const userAuth = await  createUserAndAuthHelper()

    const userRequest = await createUserHelper()
    const userTarget = await createUserHelper()

    // send request
    await sendRequestFriendHelper(userAuth.token, userRequest.id, userTarget.id)

    // // accept friendship
    // await acceptFriendshipHelper(userAuth.token, userRequest.id, userTarget.id)

    // delete friendship
    await supertest(app)
      .delete(`/friends/friendship/cancel/${userRequest.id}/${userTarget.id}`)
      .set('Authorization', `Bearer ${userAuth.token}`)
      .expect(400)
      .expect({message: 'friendship does not exist'})
  })
})
