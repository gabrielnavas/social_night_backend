import { Request, Response } from 'express'
import {db, pg} from '../../shared/database'

const GetAllUsersController = {
  getAll: async (req: Request, res: Response) => {
    try {
      const { username, email, offset, limit } = req.query

      const paramsSql = {} as any
      let whereSql = ''
      let offsetSql = ''
      let limitSql = ''
      if (username) {
        paramsSql.username = pg.as.value(`%${username}%`)
        whereSql += 'where username=$<username>'
      }

      if (email) {
        paramsSql.email = pg.as.value(`%${email}%`)
        whereSql += ' or email=$<email>'
      }

      if (offset)  {
        paramsSql.offset = parseInt(offset as string)
        offsetSql = ' offset $<offset>'
      }
      if (limit) {
        paramsSql.limit = parseInt(limit as string)
        limitSql = ' limit $<limit>'
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
      res.status(200).json(users)
    } catch (ex) {
      console.error(ex);
      
      res.status(500).json({message: 'server error'})
    }
  }
}

export { GetAllUsersController }
