import { Request, Response } from 'express'
import bcrypt from 'bcrypt'

import {db} from '../../shared/database'
import { validateEmail } from '../validations'

const CreateUserController = {
  create: async (req: Request, res: Response) => {
    try {
      let messageErrorFromBody = CreateUserController._validateTypesBody(req)
      if (messageErrorFromBody) {
        return res.status(400).json({ message: messageErrorFromBody }).end()
      }

      const { username, email, password, passwordConfirmation } = req.body
      const {error, user} = await  CreateUserUsecase.create(username, email, password, passwordConfirmation)

      if (error) {
        return res.status(400).json({ message: error }).end()
      }
      
      res.status(201).json(user).end()
    
    } catch (ex) {
      console.error(ex)
      res.status(500).json({message: 'server offline'})
    }
  },

  _validateTypesBody: (request: Request): string | null => {
    const bodyValuesExpected = [
      ['username', 'string'], 
      ['email', 'string'], 
      ['password', 'string'], 
      ['passwordConfirmation', 'string']
    ]
    for (const [paramParam, paramType] of bodyValuesExpected) {
      if (!request.body[paramParam]) {
        return  `missing '${paramParam}' on body`
      }
      if (typeof(request.body[paramParam]) !== paramType) {
        return `param '${paramParam}' should by type ${paramType}`
      }
    }
    return null
  }
}

type Result = {
  error: string | null
  user: object | null
}

const CreateUserUsecase = {
  create: async (username: string, email: string, password: string, passwordConfirmation: string): Promise<Result> => {
    if (username.length < 2 || username.length > 255) {
      return {error: 'username should by between 2 and 255 characteres', user: null}
    }
    if (!validateEmail(email)) {
      return {error: 'invalid email', user: null}
    }
    if (password.length < 2 || password.length > 255) {
      return {error: 'password should by between 2 and 255 characteres', user: null}
    }
    if (passwordConfirmation.length < 2 || passwordConfirmation.length > 255) {
      return {error: 'password should by between 2 and 255 characteres', user: null}
    }

    const {usersWithEmailFromBody} = await db.one(`
      select count(*) as users_with_email_from_body 
      from users.user 
      where email = $1`, 
      [email]
    )

    if(usersWithEmailFromBody > 0) {
      return {error: 'Usuário já existe com esse email.', user: null}
    }

    const {usersWithUsernameFromBody} = await db.one(`
      select count(*) as users_with_username_from_body 
      from users.user 
      where username = $1`, 
      [username]
    )

    if(usersWithUsernameFromBody > 0) {
      return {error: 'Usuário já existe com esse nome de usuário.', user: null}
    }

    const hashPassword = CreateUserUsecase._generateHashPassword(password)

    const user = await db.one(`
      insert into users.user 
        (username, email, password) 
      values ($1,$2,$3) 
      returning id, email, username, created_at, updated_at`, 
      [username, email, hashPassword]
    ) 
      
    return { error: null, user } 
  },

  _generateHashPassword: (password: string) => {
    const hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10))
    return hashPassword
  }
}



export { CreateUserController }
