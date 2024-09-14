import ffmpeg from 'fluent-ffmpeg';
import { path as ffmpegPath } from '@ffmpeg-installer/ffmpeg';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from "../utils/ApiResponse.js"
import path from "path";
import fs from 'fs'


ffmpeg.setFfmpegPath(ffmpegPath);
const videoExtensions = ['.mp4', '.mkv', '.avi', '.mov', '.wmv', '.flv', '.webm', '.mpeg', '.mpg'];

const compressVideo = async (req, res) => {
    const inputPath = req.file?.path;
    if( !req.file.path ){
        throw new ApiError(401, "File required")
    }

    const extension = inputPath.slice(((inputPath.lastIndexOf(".") - 1) >>> 0) + 2).toLowerCase();
    if(!videoExtensions.includes('.' + extension)){
        throw new ApiError(401, "Require a valid file")
    }

    const outputFilename = `compressed-${Date.now()}.mp4`;
    const outputPath = path.join('./public/temp/', outputFilename);

    // Compress the video using FFmpeg
    ffmpeg(inputPath)
        .output(outputPath)
        .videoCodec('libx264')
        .size('50%')
        .on('end', async () => {
            const video = await uploadOnCloudinary(outputPath);

            if( !video ){
                throw new ApiError(500, "Something went wrong while uploading on cloudinary")
            }

            fs.unlinkSync(inputPath);
            res
            .status(200)
            .json(
                new ApiResponse(200, video.url, "Video compressed successfully")
            )
        })
        .on('error', (err) => {
            try{
                fs.unlinkSync(inputPath);
                fs.unlinkSync(outputPath);
            } catch{
                console.log("File not found while removing");
            }
            throw new ApiError(500, "Error while compressing the video", err);
        })
        .run();
}

export { compressVideo };