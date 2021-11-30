import supertest from 'supertest'
import app from '../../../app'

const sendRequestFriendHelper = async (userOwnToken, userRequestUserID, userTargetUserID) => {
  await supertest(app)
    .post('/friends/send_request')
    .set('Authorization', `Bearer ${userOwnToken}`)
    .send({requesterUserId: userRequestUserID, targetUserId: userTargetUserID})
    .expect(200)
} 

export {sendRequestFriendHelper}