import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken'
import { UserTokenPayload } from "../models";


const AuthenticationMiddleware = {
  ensureAuthenticated: (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = AuthenticationMiddleware._verifyHeader(req)
      if(!token) {
        return res.status(401).json({
          message: 'You dont have permission. You need set on the header Authorization: Bearer <token>'
        }).end()
      }

      const secretKey = AuthenticationMiddleware._getSecretKey()
      const jwtPayload = jwt.verify(token, secretKey) as JwtPayload
      const userData = jwtPayload.data as UserTokenPayload
      if (userData.userID <= 0) {
        return res.status(401).json({
          message: 'You dont have permission. You need set on the header Authorization: Bearer <token>'
        }).end()
      }
      req.userID = userData.userID
      next()
    }
    catch(ex) {
      console.log(ex);
      res.status(500).json({message: 'Server error'})
    }
  },

  _verifyHeader: (req: Request): string | null => {
    const authorization = req.headers.authorization
    if (!authorization) {
      return null
    }
    const splited = authorization.split(' ')
    if(splited.length == 1) {
      return null
    }
    const [, token] = splited
    return token
  },

  _getSecretKey: () => {
    const secretKey = process.env.SECRET_KEY 
    if (!secretKey) {
      throw new Error('need set SECRET_KEY=? .env')
    }
    return secretKey
  },


}

export default AuthenticationMiddleware 