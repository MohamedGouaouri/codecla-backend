import env from "../../env.js";
env(process.env['APP_ENV'])

import multer from 'multer'
import {getStorage, ref, uploadBytesResumable, getDownloadURL} from 'firebase/storage'
import {app} from "./firebase.js";
import sharp from 'sharp'
import { createClient } from '@supabase/supabase-js'


// Create a single supabase client for interacting with your database
const supabase = createClient(process.env['SUPABASE_PROJECT'], process.env['SUPABASE_KEY'])

const storage = getStorage(app)

export const upload = multer({
    storage: multer.memoryStorage()
})

// Note: Firebase-based upload
export const fireBaseUpload = async (req) => {

    const dateTime = new Date().toISOString();
    if (!req.file) return ""
    const storageRef = ref(storage, `files/${dateTime + "-" + req.file.originalname}`);
    // Create file metadata including the content type
    const metadata = {
        contentType: req.file.mimetype,
    };
    try{
        const processedImage = await processImage(req.file.buffer)
        const snapshot = await uploadBytesResumable(storageRef, processedImage, metadata)
        const downloadURL = await getDownloadURL(storageRef);
        console.log('File successfully uploaded.', downloadURL);
        return downloadURL
    }catch (e) {
        console.log(e)
        throw e
    }

}

// Note: Supabase-based upload

export const supabaseUpload = async (req) => {
    const avatarFile = req.file
    const dateTime = new Date().toISOString();
    if (!avatarFile) return ""
    try {
        const processedImage = await processImage(avatarFile.buffer)
        const avatarFilename =  dateTime + "-" +  avatarFile.originalname
        let { data ,error } = await supabase
            .storage
            .from('codela_uploads')
            .upload(avatarFilename, processedImage, {
                cacheControl: '3600',
                upsert: false
            })
        if (error) {
            console.error("Upload error ", error)
            return ""
        }
        const publicUrlData = supabase
            .storage
            .from('codela_uploadst')
            .getPublicUrl(data.path)
        return publicUrlData.data.publicUrl
    }catch (e) {
        console.error(e)
        throw e
    }

}

// Optional image processing
export const processImage = async (imageBuffer) => {
    return await sharp(imageBuffer)
        .resize(300, 300)
        .toBuffer()
}