export type AnnouncementStatus = "draft" | "published" | "archived";
export type AnnouncementAudience = "all" | "authenticated" | "role";
export interface Announcement { _id:string; author?: { _id?:string; name?:string; email?:string } | string; title:string; content:string; link?:string; attachments?:Array<{url:string;filename?:string;publicId?:string}>; audience:AnnouncementAudience; audienceRole?:string; isPinned:boolean; status:AnnouncementStatus; publishedAt?:string; createdAt:string; updatedAt:string; }
export interface AnnouncementListResult { announcements:Announcement[]; total:number; }
export interface AnnouncementPayload { title:string; content:string; link?:string; audience?:AnnouncementAudience; audienceRole?:string; isPinned?:boolean; status?:AnnouncementStatus; }
