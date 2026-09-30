export interface ProfileUser { _id:string; name?:string; email?:string; phone?:string; bio?:string; avatar?:string; role?:string; provider?:string; isActivated?:boolean; createdAt?:string; updatedAt?:string; socials?:Record<string,string>; }
export interface UpdateProfilePayload { name?:string; phone?:string; bio?:string; profession?:string; address?:string; }
export interface UpdateSocialLinksPayload { [key:string]: string | undefined; }
