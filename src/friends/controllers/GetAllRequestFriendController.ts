import {Request, Response} from 'express'
import {db} from '../../shared/database'

type Friend = {
  Id: number
  username: number
  sendedAt: Date,
}

const GetAllRequestFriendController = {
  getAll: async (req: Request, res: Response) => {
    try {
      const requesterUserId = parseInt(req.params.requesterUserId)
      const allRequests = await GetAllRequestFriendController._getAllRequestsByRequesterUserId(requesterUserId)
      res.status(200).json(allRequests).end()
    }
    catch(ex) {
      console.error(ex)
      res.status(500).json({message: 'server error'})
    }
  },

  _getAllRequestsByRequesterUserId: async (requesterUserId: number) => {
    const allRequestsByRequesterUserId = await db.manyOrNone<Friend>(`
        select u.id as user_id, username, rf.created_at as sended_at 
        from users.user as u
        inner join friends.send_request_friend as rf on rf.requester_id = u.id
        where(rf.target_id = $1)
        order by rf.created_at desc
      `, 
      [requesterUserId]
    )
    return allRequestsByRequesterUserId
  }
}

export {GetAllRequestFriendController}