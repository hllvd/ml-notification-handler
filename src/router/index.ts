import { Router } from "express"
import notificationController from "../controller/notification.controller"

const router = Router()

router.post("/notification", notificationController.notification)

export default router
