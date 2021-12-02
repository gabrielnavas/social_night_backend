import { Request, Response } from 'express'
import {db, pg} from '../../shared/database'

const GetAllUsersController = {
  getAll: async (req: Request, res: Response) => {
    try {
      const { username, offset, limit } = req.query

      const paramsSql = {} as any
      let whereSql = ''
      let offsetSql = ''
      let limitSql = ''

      if (username) {
        paramsSql.username = pg.as.value(`%${username}%`)
        whereSql += ' where username like $<username> '
      }
      if (offset)  {
        paramsSql.offset = parseInt(offset as string)
        offsetSql = ' offset $<offset> '
      }
      if (limit) {
        paramsSql.limit = parseInt(limit as string)
        limitSql = ' limit $<limit> '
      }
      const sql = `
        select id, username, email, created_at, updated_at
        from users.user
        ${whereSql}
        order by created_at desc
        ${offsetSql}
        ${limitSql}
      `
      const users = await db.manyOrNone(sql, paramsSql)


      // todo: add image and bio on database
      const fakerUsers = users.map(user => ({
        ...user, 
        image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cGFydHl8ZW58MHx8MHx8&w=1000&q=80',
        bio: 'lorem '.repeat(25)
      }))
      res.status(200).json(users)
    } catch (ex) {
      console.error(ex);
      
      res.status(500).json({message: 'server error'})
    }
  }
}

export { GetAllUsersController }
