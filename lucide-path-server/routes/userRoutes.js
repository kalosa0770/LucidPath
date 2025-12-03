import express from 'express';
import userAuth from '../middleware/userAuth.js';
import { getUserData } from '../controllers/userController.js';
import { listAvailableTherapists, getTherapistProfile, bookAppointment } from '../controllers/providerController.js';

const userRouter = express.Router();

// Accept both GET and POST so clients can use either method
userRouter.get('/data', userAuth, getUserData);

// Therapist browsing (public routes)
userRouter.get('/therapists', listAvailableTherapists);
userRouter.get('/therapists/:id', getTherapistProfile);

// Appointment booking (requires user auth)
userRouter.post('/appointments/book', userAuth, bookAppointment);

export default userRouter;