import { useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamic import to avoid SSR issues
const JitsiMeet = dynamic(() => import('../components/video/JitsiMeet'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-[400px] bg-zinc-900 rounded-xl">
      <div className="w-10 h-10 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
    </div>
  ),
});

export default function VideoTestPage() {
  const [roomName, setRoomName] = useState('test-session');
  const [userName, setUserName] = useState('');
  const [showVideo, setShowVideo] = useState(false);

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
          Jitsi Video Test
        </h1>
        <p className="text-zinc-400 mb-8">
          Test your local Jitsi setup with JWT authentication
        </p>

        {!showVideo ? (
          <div className="bg-zinc-900 rounded-xl p-6 space-y-4">
            <div>
              <label className="block text-sm text-zinc-400 mb-2">Your Name</label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter your display name"
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-2">Room Name</label>
              <input
                type="text"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                placeholder="Enter room name"
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500 transition-colors"
              />
              <p className="text-xs text-zinc-500 mt-1">
                Full room: {process.env.NEXT_PUBLIC_JITSI_ROOM_PREFIX || ''}{roomName}
              </p>
            </div>

            <button
              onClick={() => setShowVideo(true)}
              disabled={!userName.trim() || !roomName.trim()}
              className="w-full py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
            >
              Continue
            </button>

            <div className="pt-4 border-t border-zinc-800 space-y-2">
              <p className="text-xs text-zinc-500">
                <strong>Domain:</strong> {process.env.NEXT_PUBLIC_JITSI_DOMAIN || 'Not configured'}
              </p>
              <p className="text-xs text-zinc-500">
                <strong>Room Prefix:</strong> {process.env.NEXT_PUBLIC_JITSI_ROOM_PREFIX || 'None'}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-zinc-400">User: </span>
                <span className="text-white font-medium">{userName}</span>
              </div>
              <button
                onClick={() => setShowVideo(false)}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-sm rounded-lg transition-colors"
              >
                ← Back
              </button>
            </div>

            <JitsiMeet
              roomName={roomName}
              userName={userName}
              isModerator={true}
              onJoinCall={() => console.log('Joined call')}
              onLeaveCall={() => console.log('Left call')}
              height={400}
              width="100%"
            />
          </div>
        )}
      </div>
    </div>
  );
}
