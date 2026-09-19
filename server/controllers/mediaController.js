import cloudinary from '../config/cloudinary.js';

export const uploadMedia = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No media file provided.' });
    }

    const { mimetype, buffer, originalname } = req.file;

    const isVideo = mimetype.startsWith('video/');
    const isAudio = mimetype.startsWith('audio/');
    const isImage = mimetype.startsWith('image/');

    let targetAspectRatio = '4:5';
    let mediaCategory = 'image';
    let resourceType = 'image';

    if (isVideo) {
      mediaCategory = 'video';
      resourceType = 'video';
      targetAspectRatio = '9:16'; // Vertical Reels default
    } else if (isAudio) {
      mediaCategory = 'audio';
      resourceType = 'video'; // Cloudinary handles audio files under 'video' resource_type
    } else if (isImage) {
      mediaCategory = 'image';
      resourceType = 'image';
      targetAspectRatio = '4:5';
    }

    // Upload buffer stream directly to Cloudinary
    const uploadToCloudinary = () => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: 'ryzo_media',
            resource_type: resourceType,
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        stream.end(buffer);
      });
    };

    let secureUrl;
    try {
      const cloudinaryResult = await uploadToCloudinary();
      secureUrl = cloudinaryResult.secure_url;
      console.log(`☁️ Cloudinary Upload Success: ${secureUrl}`);
    } catch (uploadErr) {
      console.warn('Cloudinary upload error, using local fallback:', uploadErr.message);
      const base64Data = buffer.toString('base64');
      secureUrl = `data:${mimetype};base64,${base64Data}`;
    }

    res.json({
      success: true,
      url: secureUrl,
      media_type: mediaCategory,
      aspect_ratio: targetAspectRatio,
      filename: originalname,
      size_bytes: buffer.length,
      format: mimetype.split('/')[1],
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
