import { Router } from "express"
import notificationController from "../controller/notification.controller"
import messageController from "../controller/test.controller"

const router = Router()

router.post("/notification", notificationController.receiver)
router.get("/test", messageController.test)

export default router
