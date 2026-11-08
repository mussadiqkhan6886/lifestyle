import { NextFunction,Request, Response } from "express";

export const verifyJWT = (req: Request, res: Response, next: NextFunction): void => {
    next();
}