import mongoose from "mongoose"
import {Event} from "../models/event.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const id=v=>{if(!mongoose.Types.ObjectId.isValid(v))throw new ApiError(400,"Invalid event ID")}
const owner=(doc,user,permissions=[])=>permissions.includes("manage_events")||doc.createdBy.toString()===user._id.toString()

const createEvent = asyncHandler(async (req, res) => {
    // 1. Get required data from req.body, req.params, or req.query
    // 2. Validate the request data and authorization
    // 3. Perform the required database operation
    // 4. Check the operation result and handle missing data
    // 5. Return the successful API response
const {title,description="",type="general",startTime,endTime,allDay=false,recurrence="none",recurrenceEnd,location="",meetingLink="",visibility="private",attendees=[]}=req.body
if(!title||!startTime||!endTime)throw new ApiError(400,"Title, startTime and endTime are required")
const attendeeIds=[...new Set((attendees||[]).map(String))]
 if(attendeeIds.some(x=>!mongoose.Types.ObjectId.isValid(x)))throw new ApiError(422,"Invalid attendee ID")
 if(attendeeIds.length&&await User.countDocuments({_id:{$in:attendeeIds}})!==attendeeIds.length)throw new ApiError(422,"One or more attendees do not exist")
 const doc=await Event.create({createdBy:req.user._id,title,description,type,startTime,endTime,allDay,recurrence,recurrenceEnd,location,meetingLink,visibility,attendees:attendeeIds})
return res.status(201).json(new ApiResponse(201,doc,"Event created"))
})
const getMyEvents = asyncHandler(async (req, res) => {
    // 1. Get required data from req.body, req.params, or req.query
    // 2. Validate the request data and authorization
    // 3. Perform the required database operation
    // 4. Check the operation result and handle missing data
    // 5. Return the successful API response
const docs=await Event.find({$or:[{createdBy:req.user._id},{attendees:req.user._id},{visibility:"public"},{visibility:"authenticated"}]}).sort({startTime:1})
return res.status(200).json(new ApiResponse(200,docs,"Events fetched"))
})
const getEventById = asyncHandler(async (req, res) => {
    // 1. Get required data from req.body, req.params, or req.query
    // 2. Validate the request data and authorization
    // 3. Perform the required database operation
    // 4. Check the operation result and handle missing data
    // 5. Return the successful API response
id(req.params.id)
const doc=await Event.findById(req.params.id)
if(!doc)throw new ApiError(404,"Event not found")
if(doc.visibility==="private"&&!owner(doc,req.user,req.userPermissions)&&!doc.attendees.some(x=>x.toString()===req.user._id.toString()))throw new ApiError(403,"Not authorized")
return res.status(200).json(new ApiResponse(200,doc,"Event fetched"))
})
const updateEvent = asyncHandler(async (req, res) => {
    // 1. Get required data from req.body, req.params, or req.query
    // 2. Validate the request data and authorization
    // 3. Perform the required database operation
    // 4. Check the operation result and handle missing data
    // 5. Return the successful API response
id(req.params.id)
const doc=await Event.findById(req.params.id)
if(!doc)throw new ApiError(404,"Event not found")
if(!owner(doc,req.user,req.userPermissions))throw new ApiError(403,"Not authorized")
for(const f of ["title","description","type","startTime","endTime","allDay","recurrence","recurrenceEnd","location","meetingLink","visibility","status"])if(req.body[f]!==undefined)doc[f]=req.body[f]
 if(req.body.attendees!==undefined){if(!Array.isArray(req.body.attendees))throw new ApiError(422,"attendees must be an array")
 const attendeeIds=[...new Set(req.body.attendees.map(String))]
 if(attendeeIds.some(x=>!mongoose.Types.ObjectId.isValid(x)))throw new ApiError(422,"Invalid attendee ID")
 if(attendeeIds.length&&await User.countDocuments({_id:{$in:attendeeIds}})!==attendeeIds.length)throw new ApiError(422,"One or more attendees do not exist")
 doc.attendees=attendeeIds
}await doc.save()
return res.status(200).json(new ApiResponse(200,doc,"Event updated"))
})
const deleteEvent = asyncHandler(async (req, res) => {
    // 1. Get required data from req.body, req.params, or req.query
    // 2. Validate the request data and authorization
    // 3. Perform the required database operation
    // 4. Check the operation result and handle missing data
    // 5. Return the successful API response
id(req.params.id)
const doc=await Event.findById(req.params.id)
if(!doc)throw new ApiError(404,"Event not found")
if(!owner(doc,req.user,req.userPermissions))throw new ApiError(403,"Not authorized")
await doc.deleteOne()
return res.status(200).json(new ApiResponse(200,null,"Event deleted"))
})
const updateEventStatus = asyncHandler(async (req, res) => {
    // 1. Get required data from req.body, req.params, or req.query
    // 2. Validate the request data and authorization
    // 3. Perform the required database operation
    // 4. Check the operation result and handle missing data
    // 5. Return the successful API response
id(req.params.id)
const doc=await Event.findById(req.params.id)
if(!doc)throw new ApiError(404,"Event not found")
if(!owner(doc,req.user,req.userPermissions))throw new ApiError(403,"Not authorized")
if(!["scheduled","completed","cancelled"].includes(req.body.status))throw new ApiError(422,"Invalid status")
doc.status=req.body.status
await doc.save()
return res.status(200).json(new ApiResponse(200,doc,"Event status updated"))
})

export {
    createEvent,
    getMyEvents,
    getEventById,
    updateEvent,
    deleteEvent,
    updateEventStatus,
}
