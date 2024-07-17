import { Router } from "express"
import notificationController from "../controller/notification.controller"
import messageController from "../controller/message.controller"

const router = Router()

router.post("/notification", notificationController.Receiver)
router.post("/message/from-sqs", messageController.send)

export default router
