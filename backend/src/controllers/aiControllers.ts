import { Request, Response } from "express";
import { aiSchema } from "../schemas/aiSchema";
import { generate } from "../service/geminiAiService";

export const aiGenerate = async (req: Request, res: Response) : Promise<void> => {
    try{
        const {productName, description} = req.body

        const parsedData = aiSchema.safeParse({productName, description})

        if(!parsedData.success){
            res.status(400).json({message: "Zod error, please enter correct field data", success: false, error: parsedData.error.message})
            return
        }

        const data = parsedData.data
        let response;
        if(!data.productName && !data.description){

            res.status(400).json({
                success:false,
                message:"Provide productName or description"
            })

            return;
        }

        response = await generate(data.productName, data.description)

        res.status(200).json({success:true, answer:response})
    }
    catch(error:any){


    if(error.status === 503){

        res.status(503).json({
            success:false,
            message:"AI service is busy. Please try again."
        });

        return;
    }


    res.status(500).json({
        success:false,
        message:error.message || "AI generation failed"
    });
}
}