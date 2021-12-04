import {Request, Response} from 'express'
import {db} from '../../shared/database'

const DeleteRequestFriendController = {
  deleteRequest:  async (req: Request, res: Response) => {
    try {
      const requesterUserId = parseInt(req.params.requesterUserId)
      const targetUserId = parseInt(req.params.targetUserId)

      if(!await DeleteRequestFriendUsercase.userExists(requesterUserId)) {
        res.status(400).json({message: 'requesterUserId not found'})
        return
      }
  
      if(!await DeleteRequestFriendUsercase.userExists(targetUserId)) {
        res.status(400).json({message: 'targetUserId not found'})
        return
      }

      if(!await DeleteRequestFriendUsercase.verifySendRequestExists(requesterUserId, targetUserId)) {
        res.status(400).json({message: 'send requester does not created yet'})
        return
      }

      await DeleteRequestFriendUsercase.deleteSendRequest(requesterUserId, targetUserId)
      res.status(204).send().end()
    }
    catch(ex) {
      console.error(ex)
      res.status(500).json({message: 'server error'})
    }
  },
}

const DeleteRequestFriendUsercase = {
  userExists: async (userID: number): Promise<boolean> => {
    const user = await db.oneOrNone<{id: number}>(`
      select id 
      from users.user
      where id=$1 
    `, [userID])
    return user !== null
  },

  verifySendRequestExists: async (requesterUserId: number, targetUserId: number): Promise<boolean> => {
    const sendRequest = await db.oneOrNone<{requester_id: number, target_id: number}>(`
      select requester_id, target_id
      from friends.send_request_friend
      where (
        requester_id=$1 and 
        target_id=$2
      ) or (
        requester_id=$2 and 
        target_id=$1
      )`,
      [requesterUserId, targetUserId])
    return sendRequest !== null
  },

  deleteSendRequest: async (requesterUserId: number, targetUserId: number): Promise<void> => {
    await db.none(`
      delete from friends.send_request_friend 
      where (
        requester_id=$1 and 
        target_id=$2
      ) or (
        requester_id=$2 and 
        target_id=$1
      )`
    ,[requesterUserId, targetUserId])
  }
}

export { DeleteRequestFriendController }