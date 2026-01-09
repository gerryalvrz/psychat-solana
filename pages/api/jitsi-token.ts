import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

interface JitsiTokenRequest {
  roomName: string;
  userName: string;
  userEmail?: string;
  isModerator?: boolean;
}

interface JitsiTokenResponse {
  token: string;
  domain: string;
  roomName: string;
}

interface ErrorResponse {
  error: string;
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<JitsiTokenResponse | ErrorResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { roomName, userName, userEmail, isModerator = false } = req.body as JitsiTokenRequest;

  if (!roomName || !userName) {
    return res.status(400).json({ error: 'roomName and userName are required' });
  }

  const appId = process.env.JITSI_APP_ID;
  const appSecret = process.env.JITSI_APP_SECRET;
  const domain = process.env.NEXT_PUBLIC_JITSI_DOMAIN;
  const roomPrefix = process.env.NEXT_PUBLIC_JITSI_ROOM_PREFIX || '';

  if (!appId || !appSecret || !domain) {
    return res.status(500).json({ error: 'Jitsi configuration missing' });
  }

  const fullRoomName = `${roomPrefix}${roomName}`;
  const now = Math.floor(Date.now() / 1000);

  // JWT payload for Jitsi
  const payload = {
    aud: 'jitsi',
    iss: appId,
    sub: domain,
    room: fullRoomName,
    exp: now + 3600, // 1 hour expiration
    nbf: now - 10,
    context: {
      user: {
        id: userEmail || `user-${Date.now()}`,
        name: userName,
        email: userEmail || '',
        moderator: isModerator,
      },
      features: {
        livestreaming: false,
        recording: false,
        transcription: false,
        'outbound-call': false,
      },
    },
  };

  try {
    const token = jwt.sign(payload, appSecret, { algorithm: 'HS256' });

    res.status(200).json({
      token,
      domain,
      roomName: fullRoomName,
    });
  } catch (error) {
    console.error('Error generating JWT:', error);
    res.status(500).json({ error: 'Failed to generate token' });
  }
}
