import mongoose from "mongoose"
import {Notification} from "../models/notification.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const id = (value) => { if (!mongoose.Types.ObjectId.isValid(value)) throw new ApiError(400, "Invalid notification ID")
 }

const createNotification = async ({ userId, role = null, type = "system", title, message = "", link = "", refModel = "", refId = null }) => {
  if (!userId) throw new Error("userId is required")
  return Notification.create({ user: userId, role, type, title, message, link, refModel, refId })
}

const sendNotification = asyncHandler(async (req, res) => {
    // 1. Get required data from req.body, req.params, or req.query
    // 2. Validate the request data and authorization
    // 3. Perform the required database operation
    // 4. Check the operation result and handle missing data
    // 5. Return the successful API response

  const { userId, role, type = "system", title, message = "", link = "" } = req.body
  if (!title?.trim()) throw new ApiError(400, "Notification title is required")
  if (userId && role) throw new ApiError(400, "Provide either userId or role")
  const users = userId
    ? await User.find({ _id: userId }).select("_id role")
    : role
      ? await User.find({ role: String(role).trim().toLowerCase() }).select("_id role")
      : await User.find({}).select("_id role")
  if (!users.length) throw new ApiError(404, "No recipients found")

  const docs = users.map((user) => ({ user: user._id, role: user.role, type, title: title.trim(), message, link }))
  await Notification.insertMany(docs)
  return res.status(201).json(new ApiResponse(201, { count: docs.length }, "Notification sent successfully"))
})

const getMyNotifications = asyncHandler(async (req, res) => {
    // 1. Get required data from req.body, req.params, or req.query
    // 2. Validate the request data and authorization
    // 3. Perform the required database operation
    // 4. Check the operation result and handle missing data
    // 5. Return the successful API response

  const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1)
  const limit = Math.min(Math.max(Number.parseInt(req.query.limit, 10) || 20, 1), 100)
  const filter = { user: req.user._id, ...(req.query.unread === "true" ? { isRead: false } : {}) }
  const [notifications, total, unreadCount] = await Promise.all([
    Notification.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
    Notification.countDocuments(filter),
    Notification.countDocuments({ user: req.user._id, isRead: false }),
  ])
  return res.status(200).json(new ApiResponse(200, { notifications, total, unreadCount, pagination: { page, pages: Math.ceil(total / limit) } }, "Notifications fetched successfully"))
})

const getUnreadCount = asyncHandler(async (req, res) => {
    // 1. Get required data from req.body, req.params, or req.query
    // 2. Validate the request data and authorization
    // 3. Perform the required database operation
    // 4. Check the operation result and handle missing data
    // 5. Return the successful API response

  const unreadCount = await Notification.countDocuments({ user: req.user._id, isRead: false })
  return res.status(200).json(new ApiResponse(200, { unreadCount }, "Unread count fetched successfully"))
})

const markAsRead = asyncHandler(async (req, res) => {
    // 1. Get required data from req.body, req.params, or req.query
    // 2. Validate the request data and authorization
    // 3. Perform the required database operation
    // 4. Check the operation result and handle missing data
    // 5. Return the successful API response

  id(req.params.id)
  const notification = await Notification.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, { isRead: true, readAt: new Date() }, { new: true })
  if (!notification) throw new ApiError(404, "Notification not found")
  return res.status(200).json(new ApiResponse(200, notification, "Notification marked as read"))
})

const markAllAsRead = asyncHandler(async (req, res) => {
    // 1. Get required data from req.body, req.params, or req.query
    // 2. Validate the request data and authorization
    // 3. Perform the required database operation
    // 4. Check the operation result and handle missing data
    // 5. Return the successful API response

  await Notification.updateMany({ user: req.user._id, isRead: false }, { $set: { isRead: true, readAt: new Date() } })
  return res.status(200).json(new ApiResponse(200, {}, "All notifications marked as read"))
})

const deleteNotification = asyncHandler(async (req, res) => {
    // 1. Get required data from req.body, req.params, or req.query
    // 2. Validate the request data and authorization
    // 3. Perform the required database operation
    // 4. Check the operation result and handle missing data
    // 5. Return the successful API response

  id(req.params.id)
  const deleted = await Notification.findOneAndDelete({ _id: req.params.id, user: req.user._id })
  if (!deleted) throw new ApiError(404, "Notification not found")
  return res.status(200).json(new ApiResponse(200, null, "Notification deleted"))
})

export {
    createNotification,
    sendNotification,
    getMyNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
}
