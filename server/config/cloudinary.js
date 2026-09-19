import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();

let cloud_name = process.env.CLOUDINARY_CLOUD_NAME;
let api_key = process.env.CLOUDINARY_API_KEY;
let api_secret = process.env.CLOUDINARY_API_SECRET;

if (process.env.CLOUDINARY_URL && (!cloud_name || !api_key || !api_secret)) {
  try {
    const parsed = new URL(process.env.CLOUDINARY_URL);
    api_key = parsed.username || api_key;
    api_secret = parsed.password || api_secret;
    cloud_name = parsed.hostname || cloud_name;
  } catch (e) {
    console.warn('Could not parse CLOUDINARY_URL:', e.message);
  }
}

cloudinary.config({
  cloud_name: cloud_name || 'ejhj8rgc',
  api_key: api_key || '191331731739599',
  api_secret: api_secret || 'fVSy0jz-DPUDDmtwgp1OmfhNcXg',
  secure: true,
});

export default cloudinary;

