import { Request, Response } from 'express'
import {db} from '../../shared/database/index'

const GetUserController = {
  getUser: async (req: Request, res: Response) => {
    try {
      if (!req.params.id) {
        res.status(400).json({ message: 'missing user id from params' }).end()
        return
      }
      const { id } = req.params
      const user = await db.oneOrNone(`
        select 
          id, username, email, created_at, updated_at
        from users.user
        where id=$1`, [id])
      res.status(200).json(user)
    } catch (ex) {
      res.status(500).send()
    }
  }
}

export { GetUserController }
