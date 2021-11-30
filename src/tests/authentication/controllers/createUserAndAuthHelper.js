import supertest from "supertest"
import { createUserHelper } from "../../users/controllers/createUserHelper"
import app from '../../../app'

const createUserAndAuthHelper = async () => {
  const user = await createUserHelper()
    const payload = {
      username: user.username,
      password: user.password
    }
    const response = await supertest(app)
      .post('/login')
      .send(payload)
    const {body} = response
    return {
      token: body.token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        password: user.password,  
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      }
    }
}

export { createUserAndAuthHelper }