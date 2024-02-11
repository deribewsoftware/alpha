import express from 'express'
import { LoginUser, UpdateUserInfo, activateUser, deleteUser, getAllUsers, getUserInfo, logoutUser, socialAuth, updateAccessToken, updatePassword, updateUserProfilePicture, updateUserRole, userRegistration } from '../controllers/user.controller';
import { IsAuthenticated, authorizeRoles } from '../middleware/auth';
const userRouter= express.Router();
userRouter.post('/registration',userRegistration);
userRouter.post('/activateuser',activateUser);
userRouter.post('/login',LoginUser);
userRouter.get('/logout',IsAuthenticated,logoutUser);
userRouter.get('/refresh',updateAccessToken);
userRouter.get('/me',IsAuthenticated,getUserInfo);
userRouter.post('/social-auth',socialAuth);
userRouter.put('/update-user-info',IsAuthenticated,UpdateUserInfo);
userRouter.put('/update-password',IsAuthenticated,updatePassword);
userRouter.put('/update-avatar',IsAuthenticated,updateUserProfilePicture);
userRouter.put('/update-user-role',IsAuthenticated,authorizeRoles("admin"),updateUserRole);
userRouter.get('/get-users',IsAuthenticated,authorizeRoles("admin"),getAllUsers);
userRouter.delete('/delete-user/:id',IsAuthenticated,authorizeRoles("admin"),deleteUser);
export default userRouter;