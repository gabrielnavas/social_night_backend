import {Request, Response} from 'express'
import {db} from '../../shared/database'

const CreateRequestFriendController = {
  sendRequest: async (req: Request, res: Response) => {
    try {
      const requesterUserId = parseInt(req.body.requesterUserId)
      const targetUserId = parseInt(req.body.targetUserId)

      if(!await CreateRequestFriendController._userExists(requesterUserId)) {
        res.status(400).json({message: 'requesterUserId not found'})
        return
      }
  
      if(!await CreateRequestFriendController._userExists(targetUserId)) {
        res.status(400).json({message: 'targetUserId not found'})
        return
      }
  
      if(await CreateRequestFriendController._alreadyExistSendRequestCount(requesterUserId, targetUserId)) {
        res.status(400).json({message: 'Solicitação de amizade já existe.'})
        return 
      }
  
      await CreateRequestFriendController._insertSendRequestFriend(requesterUserId, targetUserId)
      
      res.status(200).send()
    }
    catch(ex) {
      console.error(ex)
      res.status(500).json({message: 'server error'})
    }
  },
  
  _alreadyExistSendRequestCount: async (requesterUserId: number, targetUserId: number): Promise<boolean> => {
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

  _userExists: async (userID: number): Promise<boolean> => {
    const user = await db.oneOrNone<{id: number}>(`
      select id 
      from users.user
      where id=$1 
    `, [userID])
    return user !== null
  },

  _insertSendRequestFriend: async(requesterUserID: number, targetUserID: number): Promise<void> => {
    await db.none(`
      insert into friends.send_request_friend 
        (requester_id, target_id)
      values ($1, $2) 
    `, [requesterUserID, targetUserID])
  },
}

export  {CreateRequestFriendController}