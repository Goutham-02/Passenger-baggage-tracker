import { Router } from 'express';
import {
    loginUser,
    registerUser,
    logoutUser,
    addPlane,
    addBaggage,
    updateBaggageStatus,
    searchBaggage,
    getAllBaggages
} from '../controllers/user.controller.js';
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register-user").post(registerUser);
router.route("/login-user").post(loginUser);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/add-plane").post(addPlane);
router.route("/add-baggage").post(addBaggage);
router.route("/update-baggage-status").post(updateBaggageStatus);
router.route("/search-baggage").post(searchBaggage);
router.route("/all-baggages/:passengerId").get(getAllBaggages);


export default router;