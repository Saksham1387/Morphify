import type { NextFunction,Request,Response } from "express";

export function authMiddleware(req:Request,res:Response,next:NextFunction){
    const authHeader = req.headers["authorization"];
    const authHeader1 = req.headers.authorization
}