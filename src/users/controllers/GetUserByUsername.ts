import { Request, Response } from 'express'
import {db} from '../../shared/database/index'

const GetUserControllerByUsername = {
  getUserByUsername: async (req: Request, res: Response) => {
    try {
      if (!req.params.username) {
        res.status(400).json({ message: 'missing user username from params' }).end()
        return
      }
      const { username } = req.params
      const user = await db.oneOrNone(`
        select 
          id, username, email, created_at, updated_at
        from users.user
        where username=$1`, [username])
        
      if(!user) {
        res.status(404).send().end()
        return
      }

      // todo: add image and bio on database
      const userFake = ({
        ...user,  
        image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cGFydHl8ZW58MHx8MHx8&w=1000&q=80',
        bio: 'lorem '.repeat(25)
      })
      res.status(200).json(userFake)
    } catch (ex) {
      res.status(500).send()
    }
  }
}

export { GetUserControllerByUsername }
