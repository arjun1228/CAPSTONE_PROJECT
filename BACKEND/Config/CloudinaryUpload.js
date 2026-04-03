import cloudinary from "./cloudinary.js";
export const uploadToCloudinary = (buffer) => {
    //we have created the promise because, thecloudinary does not support promises before invention of promises they used the callback funtions
        return new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { folder: "blog_users" },
                (err, result) => {
                if (err) return reject(err);
                resolve(result);
                }
            );
            stream.end(buffer);
        });
        };