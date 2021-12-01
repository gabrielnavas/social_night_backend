import {Request, Response } from 'express'
import { db } from '../../shared/database'

const CreateFriendshipController = {
  createFriend: async (req: Request, res: Response) => {
    try {
      const requesterUserId = parseInt(req.body.requesterUserId)
      const targetUserId = parseInt(req.body.targetUserId)

      if(!await CreateFriendUsecase.userExists(requesterUserId)) {
        res.status(400).json({message: 'requesterUserId not found'}).end()
        return
      }
  
      if(!await CreateFriendUsecase.userExists(targetUserId)) {
        res.status(400).json({message: 'targetUserId not found'}).end()
        return
      }
  
      if(!await CreateFriendUsecase.alreadyExistSendRequestCount(requesterUserId, targetUserId)) {
        res.status(400).json({message: 'solicitation of friendship does not has'}).end()
        return 
      }

      if (await CreateFriendUsecase.alreadyExistsFriendship(requesterUserId, targetUserId)) {
        res.status(400).json({message: 'you already friendship'}).end()
        return
      }

      if (await CreateFriendUsecase.alreadyExistsFriendship(targetUserId, requesterUserId)) {
        res.status(400).json({message: 'you already friendship'}).end()
        return
      }

      await CreateFriendUsecase.insertFriendship(targetUserId, requesterUserId)
      res.status(200).json({message: 'Agora já são amigos!!'}).end()
    }
    catch(ex) {
      console.error(ex)
      res.status(500).json({message: 'server error'})
    }
  }
}

const CreateFriendUsecase = {
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

  userExists: async (userID: number): Promise<boolean> => {
    const user = await db.oneOrNone<{id: number}>(`
      select id 
      from users.user
      where id=$1 
    `, [userID])
    return user !== null
  },

  alreadyExistsFriendship: async(friendOneId: number, friendTwoId: number): Promise<boolean> => {
    const friendShip = await db.oneOrNone<{friendOneId: number, friendTwoId: number}>(`
      select friend_one_id, friend_two_id
      from friends.friend
      where 
        friend_one_id=$1 and
        friend_two_id=$2; 
    `, [friendOneId, friendTwoId])
    return !!friendShip
  },

  insertFriendship:  async(friendOneId: number, friendTwoId: number):Promise<void> => {
    await db.none(`
      insert into friends.friend
        (friend_one_id, friend_two_id)
      values ($1, $2);
    `, [friendOneId, friendTwoId])
  }
}

export {CreateFriendshipController}