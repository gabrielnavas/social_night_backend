import {Request, Response} from 'express'
import { db } from '../../shared/database'


const IsFriendController = {
  isFriend: async (req: Request, res: Response) => {
    try {
      const requesterUserId = parseInt(req.params.requesterUserId)
      const targetUserId = parseInt(req.params.targetUserId)

      const result = {isFriend: false}

      if(!await IsFriendUsercase.userExists(requesterUserId)) {
        res.status(400).json({message: 'requesterUserId not found'})
        return
      }
      
      if(!await IsFriendUsercase.userExists(targetUserId)) {
        res.status(400).json({message: 'targetUserId not found'})
        return
      }

      //mudar para status
      if(await IsFriendUsercase.isFriendship(requesterUserId, targetUserId)) {
        result.isFriend = true
      }

      res.status(200).json(result).end()
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

export {IsFriendController}