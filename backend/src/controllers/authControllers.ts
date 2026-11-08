import bcrypt from "bcryptjs"
import { db } from "../prisma/db"
import { Request, Response } from "express"
import { loginSchema } from "../schemas/loginSchema"
import jwt from "jsonwebtoken"

export const login = async (req: Request<{}, {}, {email: string, password: string}>, res:Response) => {
    const {email, password} = req.body
     
    const safeParsed = loginSchema.safeParse({email, password})
    
    if(!safeParsed.success){
        res.status(400).json({success:false, message: "Please enter a valid email and password"})
        return
    }

    const data = safeParsed.data

    const user = await db.orm.public.Admin
        .where({
            email: data.email
        })
        .first();

    if(!user){
        res.status(404).json({success:false, message: "Admin not found with this email"})
        return
    }
    
    const comparePassword = await bcrypt.compare(data.password, user.password)  
    
        if(!comparePassword){
            res.status(401).json({success:false, message: "Wrong password"})
            return
        }

        const accessSecret = process.env.ACCESS_TOKEN;
        const refreshSecret = process.env.REFRESH_TOKEN;

        if (!accessSecret || !refreshSecret) {
            throw new Error('JWT secrets are not configured');
        }

    const accessToken = jwt.sign(
        {
            adminInfo: {
                id: user.id,
                email: user.email
            }
        },
        accessSecret,
        {expiresIn: "15m"}
    )

    const refreshToken = jwt.sign(
        {
            id:user.id,
            email:user.email
        },
        refreshSecret,
        {expiresIn: "7d"}
    )

    const isProduction = process.env.NODE_ENV === 'production';
    const cookieOptions = {
            httpOnly: true,
            secure: isProduction,
            sameSite: 'strict' as const,
            path: '/'
        };
    res.cookie("accessToken", accessToken, {
        ...cookieOptions, maxAge: 15 * 60 * 1000
    })
    res.cookie("refreshToken", refreshToken, {
        ...cookieOptions,
            maxAge: 7 * 24 * 60 * 60 * 1000
    })

    res.json({message: "Login successfully"})

}
export const logout = async (req: Request, res:Response) => {
    
}
export const refresh = async (req: Request, res:Response) => {
    
}