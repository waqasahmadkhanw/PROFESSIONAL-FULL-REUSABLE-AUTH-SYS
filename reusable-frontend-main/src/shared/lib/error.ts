export class AppError extends Error {

 statusCode:number;

 constructor(
   message:string,
   statusCode:number=500
 ){

   super(message);

   this.statusCode=statusCode;

   this.name="AppError";

 }

}



export function getErrorMessage(
 error:unknown
){

 if(error instanceof Error){
    return error.message;
 }

 return "Something went wrong";

}