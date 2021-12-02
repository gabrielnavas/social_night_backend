import {Request, Response} from 'express'
import {db} from '../../shared/database'

type Friend = {
  userId: number
  username: number
  createdAt: Date,
}

const GetAllFriendshipsController = {
  getAll: async (req: Request, res: Response) => {
    try {
      const requesterUserId = parseInt(req.params.requesterUserId)
      const allRequests = await GetAllFriendshipsController._getAllFriendshipsByUserId(requesterUserId)
      res.status(200).json(allRequests).end()
    }
    catch(ex) {
      console.error(ex)
      res.status(500).json({message: 'server error'})
    }
  },

  _getAllFriendshipsByUserId: async (requesterUserId: number) => {
    const allRequestsByRequesterUserId = await db.manyOrNone<Friend>(`
      select u.id as user_id, username, f.created_at
      from users.user as u
      inner join friends.friend as f on f.friend_one_id = u.id
      where(f.friend_two_id = $1)
      
      union
      
      select u.id as user_id, username, f.created_at
      from users.user as u
      inner join friends.friend as f on f.friend_two_id = u.id
      where(f.friend_one_id = $1)
      order by created_at desc
    `, 
      [requesterUserId]
    )
    return allRequestsByRequesterUserId
  }
}

export {GetAllFriendshipsController}