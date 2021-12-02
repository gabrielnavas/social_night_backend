import {Request, Response} from 'express'
import { db } from '../../shared/database'

const DeleteFriendshipController = {
  deleteFriendship: async (req: Request, res: Response) => {
    try {
      const requesterUserId = parseInt(req.params.requesterUserId)
      const targetUserId = parseInt(req.params.targetUserId)

      if(!await DeleteFriendshipUsecase.userExists(requesterUserId)) {
        res.status(400).json({message: 'requesterUserId not found'})
        return
      }
      
      if(!await DeleteFriendshipUsecase.userExists(targetUserId)) {
        res.status(400).json({message: 'targetUserId not found'})
        return
      }

      if(!await DeleteFriendshipUsecase.alreadyExistSendRequestCount(requesterUserId, targetUserId)) {
        res.status(400).json({message: 'friendship does not exist'})
        return
      }

      if(!await DeleteFriendshipUsecase.alreadyExistFriendshipCount(requesterUserId, targetUserId)) {
        res.status(400).json({message: 'friendship does not exist'})
        return
      }

      await DeleteFriendshipUsecase.deleteFriendship(requesterUserId, targetUserId)

      res.status(204).send()
    }
    catch(ex) {
      console.error(ex)
      res.status(500).json({message: 'server error'})
    }
  }
}


const DeleteFriendshipUsecase = {
  alreadyExistSendRequestCount: async (requesterUserId: number, targetUserId: number): Promise<boolean> => {
    const requestFriend = await db.oneOrNone<{requesterUserID: number, targetUserID: number}>(`
      select requester_id, target_id 
      from friends.send_request_friend
      where (
        (requester_id=$1 and target_id=$2) or
        (requester_id=$2 and target_id=$1)
      )
    `, [requesterUserId,targetUserId])
    return requestFriend !== null
  },
  
  alreadyExistFriendshipCount: async (requesterUserId: number, targetUserId: number): Promise<boolean> => {
    const requestFriend = await db.oneOrNone<{friendOneId: number, friendTwoId: number}>(`
      select friend_one_id, friend_two_id 
      from friends.friend
      where (
        (friend_one_id=$1 and friend_two_id=$2) or
        (friend_one_id=$2 and friend_two_id=$1)
      )
    `, [requesterUserId,targetUserId])
    return requestFriend !== null
  },

  userExists: async (userID: number): Promise<boolean> => {
    const user = await db.oneOrNone<{id: number}>(`
      select id 
      from users.user
      where id=$1 
    `, [userID])
    return user !== null
  },

  deleteFriendship: async(requesterUserID: number, targetUserID: number): Promise<void> => {
    
    await db.tx(async tx => {
      // delete send requester
      await tx.none(`
        delete from friends.send_request_friend 
        where 
          (requester_id=$1 and target_id=$2) or 
          (requester_id=$2 and target_id=$1)
        `, 
        [requesterUserID, targetUserID]
      )

      // delete friendship
      await tx.none(`
        delete from friends.friend
        where (
          (friend_one_id=$1 and friend_two_id=$2) or
          (friend_one_id=$2 and friend_two_id=$1)
        )`, 
        [requesterUserID, targetUserID]
      )
    })
    .then(() => {})
    .catch(err => {throw err})
  },
}

export { DeleteFriendshipController }