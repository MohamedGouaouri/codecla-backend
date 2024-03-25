import multer from 'multer'
import {getStorage, ref, uploadBytesResumable, getDownloadURL} from 'firebase/storage'
import {app} from "./firebase.js";
import sharp from 'sharp'

const storage = getStorage(app)

export const upload = multer({
    storage: multer.memoryStorage()
})

export const fireBaseUpload = async (req) => {

    const dateTime = new Date().toISOString();
    if (!req.file) return ""
    const storageRef = ref(storage, `files/${req.file.originalname + "-" + dateTime}`);
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

export const processImage = async (imageBuffer) => {
    return await sharp(imageBuffer)
        .resize(100, 100)
        .toBuffer()
}