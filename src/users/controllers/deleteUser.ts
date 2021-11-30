import { Request, Response } from 'express'
import {db} from '../../shared/database'

const DeleteUserController = {
  deleteUser: async (req: Request, res: Response) => {
    try {
      if (!req.params.id) {
        res.status(400).json({ message: 'missing user id from params' }).end()
        return
      }
      await db.none(`
        delete from users.user 
        where id=$1
      `, [req.userID])
      res.status(204).send()
    } catch (ex) {
      res.status(500).send()
    }
  }
}

export { DeleteUserController }
