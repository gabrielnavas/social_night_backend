import { Request, Response } from "express";
import jwt from 'jsonwebtoken'
import {db} from '../../shared/database'
import bcrypt from 'bcrypt'
import { UserTokenPayload } from "../models";

const loginController = async (req: Request, res: Response) => {
  const {username, password} = req.body

  const user = await db.oneOrNone(`
    select id, username, email, password, created_at, updated_at
    from users.user
    where username=$1`, 
    [username]
  )
  
  if (!user) {
    return res.status(400).json({message: 'Nome de usuário ou senha invaĺidos.'}).end()
  }

  if(!bcrypt.compareSync(password, user.password)) {
    return res.status(400).json({message: 'Nome de usuário ou senha invaĺidos.'}).end()
  }
  
  const payload: UserTokenPayload = {userID: user.id}
  const sevenDays = Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7)
  
  if (!process.env.SECRET_KEY) {
    throw new Error('MISSING SECRET_KEY FROM .env')
  }
  
  const secretKey = process.env.SECRET_KEY
  const token = jwt.sign({
    exp: sevenDays,
    data: payload
  }, secretKey);

  const {password: pass, ...userWithOutPassword} = user 

  res.status(201).json({
    token,
    user: userWithOutPassword
  })
}

export {loginController}