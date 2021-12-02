import { Router } from 'express'

// Users 
import { 
  CreateUserController, 
  DeleteUserController, 
  GetAllUsersController, 
  GetUserController, 
  UpdateUserController 
} from './users/controllers'


// Authentication
import {loginController} from './authentication/controller'
import AuthenticationMiddleware from './authentication/middlewares/AutorizationMiddlewares'

// Friends
import {
  CreateRequestFriendController,
  GetAllRequestFriendController,
  DeleteRequestFriendController,
  CreateFriendshipController
} from './friends/controllers'
import { DeleteFriendshipController } from './friends/controllers/DeleteFriendshipController'
import { GetAllFriendshipsController } from './friends/controllers/GetAllFriendshipsController'

const routes = Router()

// Users
.post('/users', CreateUserController.create)
.put('/users/:id', AuthenticationMiddleware.ensureAuthenticated, UpdateUserController.update)
.delete('/users/:id', AuthenticationMiddleware.ensureAuthenticated, DeleteUserController.deleteUser)
.get('/users/:id', AuthenticationMiddleware.ensureAuthenticated, GetUserController.getUser)
.get('/users', AuthenticationMiddleware.ensureAuthenticated, GetAllUsersController.getAll)

// Authentication
.post('/login', loginController)

// Friends
// send request
.post('/friends/send_request', AuthenticationMiddleware.ensureAuthenticated, CreateRequestFriendController.createRequest)
.get('/friends/get_requesters/:requesterUserId', AuthenticationMiddleware.ensureAuthenticated, GetAllRequestFriendController.getAll)
.delete('/friends/cancel_request/:requesterUserId/:targetUserId', AuthenticationMiddleware.ensureAuthenticated, DeleteRequestFriendController.deleteRequest)
// friendship
.post('/friends/friendship/accept', AuthenticationMiddleware.ensureAuthenticated, CreateFriendshipController.createFriend)
.delete('/friends/friendship/cancel/:requesterUserId/:targetUserId', AuthenticationMiddleware.ensureAuthenticated, DeleteFriendshipController.deleteFriendship)
.get('/friends/:requesterUserId', AuthenticationMiddleware.ensureAuthenticated, GetAllFriendshipsController.getAll)


export default routes
