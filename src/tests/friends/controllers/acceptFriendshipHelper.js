import supertest from 'supertest'
import app from '../../../app'

const acceptFriendshipHelper = async (userOwnToken, userRequestUserID, userTargetUserID) => {
  await supertest(app)
    .post('/friends/friendship/accept')
    .set('Authorization', `Bearer ${userOwnToken}`)
    .send({requesterUserId: userRequestUserID, targetUserId: userTargetUserID})
    .expect(200)
} 

export {acceptFriendshipHelper}