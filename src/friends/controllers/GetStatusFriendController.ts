import {Request, Response} from 'express'
import { db } from '../../shared/database'

type Status = 'Unknow'| 'Waiting' | 'Friend'

type ResultHttp = {
  requesterUserId?: number,
  targetUserId?: number,
  status: Status
}

const GetStatusFriendController = {
  isFriend: async (req: Request, res: Response) => {
    try {
      const requesterUserId = parseInt(req.params.requesterUserId)
      const targetUserId = parseInt(req.params.targetUserId)

      const responseHttpPayload: ResultHttp = {
        status: 'Unknow'
      }

      if(!await IsFriendUsercase.userExists(requesterUserId)) {
        res.status(400).json({message: 'requesterUserId not found'})
        return
      }
      
      if(!await IsFriendUsercase.userExists(targetUserId)) {
        res.status(400).json({message: 'targetUserId not found'})
        return
      }

      const requesterCreated = await IsFriendUsercase.isSendRequestFriendship(requesterUserId, targetUserId)
      if(requesterCreated) {
        responseHttpPayload.requesterUserId = requesterCreated.requesterId
        responseHttpPayload.targetUserId = requesterCreated.targetId
        responseHttpPayload.status ='Waiting'
      }

      if(responseHttpPayload.status == 'Waiting' && await IsFriendUsercase.isFriendship(requesterUserId, targetUserId)) {
        responseHttpPayload.status =   'Friend'
      }

      res.status(200).json(responseHttpPayload).end()
    }
    catch(ex) {
      console.error(ex)
      res.status(500).json({message: 'server error'})
    }
  }
}

const IsFriendUsercase = {
  userExists: async (userID: number): Promise<boolean> => {
    const user = await db.oneOrNone<{id: number}>(`
      select id 
      from users.user
      where id=$1 
    `, [userID])
    return user !== null
  },

  isSendRequestFriendship: async (userOneId: number, userTwoId: number): Promise<{requesterId: number, targetId: number} | null> => {
    const requestFriend = await db.oneOrNone<{requesterId: number, targetId: number}>(`
      select requester_id, target_id 
      from friends.send_request_friend
      where (
        (requester_id=$1 and target_id=$2) or
        (requester_id=$2 and target_id=$1)
      )
    `, [userOneId,userTwoId])
    return requestFriend
  },

  isFriendship: async (userOneId: number, userTwoId: number) => {
    const requestFriend = await db.oneOrNone<{friendOneId: number, friendTwoId: number}>(`
      select friend_one_id, friend_two_id 
      from friends.friend
      where (
        (friend_one_id=$1 and friend_two_id=$2) or
        (friend_one_id=$2 and friend_two_id=$1)
      )
    `, [userOneId,userTwoId])
    return requestFriend !== null
  }
}

export {GetStatusFriendController}