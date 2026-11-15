
import cloudinary from "../../config/cloudinary";

export const uploadToCloudinary = (
    buffer: Buffer
): Promise<{url:string, public_id:string}> => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: "lifestyle",
                resource_type: "image",
            },
            (error, result) => {
                if (error) {
                    reject(error);
                    return;
                }

                if (!result) {
                    reject(new Error("Cloudinary upload failed"));
                    return;
                }

                resolve({
                    url: result.secure_url,
                    public_id:result.public_id
                });
            }
        );

        stream.end(buffer);
    });
};
