import Video from '../models/Video.js';
import axios from 'axios';
import cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';

export const uploadVideo = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Please upload a file.' });
  }

  try {
    const { originalname, filename, path, mimetype, size } = req.file;

    const video = new Video({
      user: req.user.id,
      title: originalname,
      originalFilename: originalname,
      serverFilename: filename,
      path: path,
      mimetype: mimetype,
      size: size,
      source: 'upload',
    });

    const createdVideo = await video.save();
    res.status(201).json(createdVideo);
  } catch (error) {
    res.status(500).json({ message: 'Server error during file upload.' });
  }
};

export const importFromGoogleDrive = async (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ message: 'Google Drive URL is required.' });
  }

  try {
    const fileIdMatch = url.match(/file\/d\/([a-zA-Z0-9_-]+)/);
    if (!fileIdMatch || !fileIdMatch[1]) {
      return res.status(400).json({ message: 'Invalid Google Drive URL format.' });
    }
    const fileId = fileIdMatch[1];

    const confirmationUrl = `https://drive.google.com/uc?id=${fileId}&export=download`;
    const pageResponse = await axios.get(confirmationUrl);
    const $ = cheerio.load(pageResponse.data);

    const downloadForm = $('#download-form');
    if (downloadForm.length === 0) {
      return res.status(400).json({ message: 'Could not find download link. The file may not be public or requires permission.' });
    }

    const downloadAction = downloadForm.attr('action');
    const inputs = {};
    downloadForm.find('input[type="hidden"]').each((i, elem) => {
      inputs[$(elem).attr('name')] = $(elem).attr('value');
    });

    const finalDownloadUrl = new URL(downloadAction);
    for (const key in inputs) {
      finalDownloadUrl.searchParams.append(key, inputs[key]);
    }
    
    const videoTitle = $('meta[property="og:title"]').attr('content') || `${fileId}.mp4`;
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const serverFilename = `${req.user.id}-${uniqueSuffix}-${path.extname(videoTitle) || '.mp4'}`;
    const uploadPath = 'uploads/videos/';
    fs.mkdirSync(uploadPath, { recursive: true });
    const localFilePath = path.join(uploadPath, serverFilename);

    const writer = fs.createWriteStream(localFilePath);
    const downloadResponse = await axios({
      method: 'get',
      url: finalDownloadUrl.href,
      responseType: 'stream',
    });

    downloadResponse.data.pipe(writer);

    await new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });

    const stats = fs.statSync(localFilePath);

    const video = new Video({
      user: req.user.id,
      title: videoTitle,
      originalFilename: videoTitle,
      serverFilename: serverFilename,
      path: localFilePath,
      mimetype: 'video/mp4',
      size: stats.size,
      source: 'google-drive',
    });

    const createdVideo = await video.save();
    res.status(201).json(createdVideo);

  } catch (error) {
    res.status(500).json({ message: 'Server error during Google Drive import.' });
  }
};

export const getUserVideos = async (req, res) => {
  try {
    const videos = await Video.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(videos);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching videos.' });
  }
};
