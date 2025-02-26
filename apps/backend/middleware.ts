import type { NextFunction,Request,Response } from "express";
import jwt from "jsonwebtoken";

export function authMiddleware(req:Request,res:Response,next:NextFunction){
    const authHeader = req.headers["authorization"];
    const token = authHeader?.split("")[1];

    try{
        const decode = jwt.decode(token,process.env.AUTH_JWT_KEY, {
            algorithms:['RS256']
        })

        if(decode?.sub){
            req.userId  = decode?.sub
            next();
        }
    }catch(e){
        res.status(403).json({
            message:"Error in the middleware"
        })
    }
}