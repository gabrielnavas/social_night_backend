import { Request, Response } from 'express'
import {db} from '../../shared/database/index'
import bcrypt from 'bcrypt'

const UpdateUserController = {
  update: async (req: Request, res: Response) => {
    try {
      if (!req.params.id) {
        res.status(400).json({ message: 'missing user id from params' }).end()
        return
      }

      for (const param of ['username', 'email', 'password']) {
        if (!req.body) {
          res.status(400).json({ message: `missing '${param}' on body` }).end()
          return
        }
      }

      const { username, email, password } = req.body

      const hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10))

      await db.none(`
        update users.user 
          set 
            username=$2,
            email=$3,
            password=$4,
            updated_at=$5
        where id=$1;
      `, [req.userID, username, email, hashPassword, new Date()])

      res.status(204).send()
    } catch (ex) {
      res.status(500).send()
    }
  }
}

export { UpdateUserController }
