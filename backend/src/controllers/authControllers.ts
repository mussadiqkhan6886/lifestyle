import bcrypt from "bcryptjs"
import { Request, Response } from "express"
import { loginSchema } from "../schemas/loginSchema"
import jwt, { JwtPayload } from "jsonwebtoken"
import { prisma } from "../config/prisma"

export const login = async (req: Request<{}, {}, {email: string, password: string}>, res:Response) : Promise<void> => {
    const {email, password} = req.body
     
    const safeParsed = loginSchema.safeParse({email, password})
    
    if(!safeParsed.success){
        res.status(400).json({success:false, message: "Please enter a valid email and password"})
        return
    }

    const data = safeParsed.data

    const user = await prisma.admin.findUnique({where: {email: data.email}})

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
            sameSite: 'lax' as const,
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
export const logout = async (req: Request, res:Response) : Promise<void> => {
    const cookies = req.cookies

    if(!cookies.refreshToken) {
        res.sendStatus(204)
        return
    }
    const isProduction = process.env.NODE_ENV === 'production';
    const cookieOptions = {
            httpOnly: true,
            secure: isProduction,
            sameSite: 'strict' as const,
            path: '/'
        };
    res.clearCookie("accessToken", {
        ...cookieOptions, maxAge: 15 * 60 * 1000
    })
    res.clearCookie("refreshToken", {
        ...cookieOptions,
            maxAge: 7 * 24 * 60 * 60 * 1000
    })

    res.json({message: "Logout successfully"})
}
export const refresh = async (req: Request, res:Response) : Promise<void> => {
    const cookies = req.cookies

    if(!cookies.refreshToken){
        res.sendStatus(204)
        return
    }

    const token = cookies.refreshToken

    jwt.verify(
        token,
        process.env.REFRESH_TOKEN as string,
        async (
            err: jwt.VerifyErrors | null,
            decoded: string | undefined | JwtPayload
        ) => {
            if(err || !decoded || typeof decoded === "string"){
                return res.status(403).json({
                    message: "Forbidden",
                });
            }

            const admin = await prisma.admin.findUnique({where: {id: Number(decoded.id)}})
            
            if(!admin){
                res.status(401).json({message: "No User Found"})
                return
            }

            const accessToken = jwt.sign(
                {
                    adminInfo: {
                        id: admin.id,
                        email: admin.email
                    }
                },
                process.env.ACCESS_TOKEN as string,
                {expiresIn: "15m"}
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

            res.json({message: "Token refreshed"})
        }
    )
}