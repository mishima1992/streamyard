import { google } from 'googleapis';
import User from '../models/User.js';
import crypto from 'crypto';

const oAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

const algorithm = 'aes-256-cbc';
const key = crypto.createHash('sha256').update(String(process.env.TOKEN_ENCRYPTION_KEY)).digest('base64').substr(0, 32);

const encrypt = (text, iv) => {
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
};

export const generateAuthUrl = (req, res) => {
  const scopes = [
    'https://www.googleapis.com/auth/youtube.readonly',
    'https://www.googleapis.com/auth/youtube.upload',
    'https://www.googleapis.com/auth/youtube'
  ];

  const url = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    state: req.user.id,
    prompt: 'consent'
  });
  res.json({ url });
};

export const handleCallback = async (req, res) => {
  const { code, state } = req.query;
  const userId = state;

  try {
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);

    const youtube = google.youtube({
      version: 'v3',
      auth: oAuth2Client,
    });

    const channelResponse = await youtube.channels.list({
      part: 'snippet,id',
      mine: true,
    });

    if (!channelResponse.data.items || channelResponse.data.items.length === 0) {
      return res.status(400).send('Could not find your YouTube channel.');
    }

    const channel = channelResponse.data.items[0];
    const channelId = channel.id;
    const channelName = channel.snippet.title;

    const user = await User.findById(userId);
    const channelExists = user.youtubeChannels.some(ch => ch.channelId === channelId);

    if (!channelExists) {
        const iv = crypto.randomBytes(16);
        const encryptedAccessToken = encrypt(tokens.access_token, iv);
        let encryptedRefreshToken = null;

        if (tokens.refresh_token) {
            encryptedRefreshToken = encrypt(tokens.refresh_token, iv);
        }

        user.youtubeChannels.push({
            channelId: channelId,
            channelName: channelName,
            accessToken: encryptedAccessToken,
            refreshToken: encryptedRefreshToken,
            iv: iv.toString('hex')
        });
        await user.save();
    }
    
    res.redirect(`https://${process.env.VITE_MAIN_DOMAIN}/profile`);
  } catch (error) {
    res.status(500).send('Failed to link YouTube channel.');
  }
};

export const getLinkedChannels = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user.youtubeChannels);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching linked channels.' });
  }
};

export const unlinkChannel = async (req, res) => {
  try {
    const { channelId } = req.params;
    await User.findByIdAndUpdate(req.user.id, {
      $pull: { youtubeChannels: { channelId: channelId } },
    });
    res.json({ message: 'Channel unlinked successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error unlinking channel.' });
  }
};
