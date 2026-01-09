'use client';

import { useState, useCallback } from 'react';

interface JitsiMeetProps {
  roomName: string;
  userName: string;
  userEmail?: string;
  isModerator?: boolean;
  onJoinCall?: () => void;
  onLeaveCall?: () => void;
  height?: string | number;
  width?: string | number;
}

export default function JitsiMeet({
  roomName,
  userName,
  userEmail,
  isModerator = false,
  onJoinCall,
  onLeaveCall,
  height = '100%',
  width = '100%',
}: JitsiMeetProps) {
  const [hasJoined, setHasJoined] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const domain = process.env.NEXT_PUBLIC_JITSI_DOMAIN;
  const roomPrefix = process.env.NEXT_PUBLIC_JITSI_ROOM_PREFIX || '';

  const openJitsiRoom = useCallback(async () => {
    if (!domain) {
      alert('Jitsi domain not configured');
      return;
    }

    setIsLoading(true);

    try {
      // Get JWT token from our API
      const response = await fetch('/api/jitsi-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomName,
          userName,
          userEmail,
          isModerator,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get token');
      }

      const { token, roomName: fullRoomName } = await response.json();

      // Build Jitsi URL with JWT token
      const jitsiUrl = new URL(`https://${domain}/${fullRoomName}`);
      jitsiUrl.searchParams.set('jwt', token);
      
      // Add display name config
      jitsiUrl.hash = `config.displayName="${userName}"`;

      // Open in new tab
      window.open(jitsiUrl.toString(), '_blank', 'noopener,noreferrer');
      
      setHasJoined(true);
      onJoinCall?.();
    } catch (error) {
      console.error('Error opening Jitsi:', error);
      alert(error instanceof Error ? error.message : 'Failed to open video call');
    } finally {
      setIsLoading(false);
    }
  }, [domain, roomName, userName, userEmail, isModerator, onJoinCall]);

  const handleEndCall = useCallback(() => {
    setHasJoined(false);
    onLeaveCall?.();
  }, [onLeaveCall]);

  return (
    <div 
      className="flex flex-col items-center justify-center bg-black/60 rounded-xl border border-white/10"
      style={{ height, width }}
    >
      {!hasJoined ? (
        <div className="text-center p-6 space-y-6">
          {/* Video icon */}
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center border border-cyan-500/30">
            <svg className="w-10 h-10 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>

          {/* Room info */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-1">Video Therapy Session</h3>
            <p className="text-zinc-400 text-sm">
              Room: <span className="text-cyan-400 font-mono">{roomPrefix}{roomName}</span>
            </p>
            <p className="text-zinc-500 text-xs mt-1">
              Opens in a new tab for best experience
            </p>
          </div>

          {/* Join button */}
          <button
            onClick={openJitsiRoom}
            disabled={isLoading}
            className="w-full max-w-xs py-3 px-6 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Connecting...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                <span>Join Video Call</span>
              </>
            )}
          </button>

          {/* Security note */}
          <div className="flex items-center justify-center gap-2 text-xs text-zinc-500">
            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span>Secured with JWT authentication</span>
          </div>
        </div>
      ) : (
        <div className="text-center p-6 space-y-6">
          {/* Active call indicator */}
          <div className="w-20 h-20 mx-auto rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/50 animate-pulse">
            <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>

          <div>
            <h3 className="text-white text-lg font-semibold mb-1">Session In Progress</h3>
            <p className="text-zinc-400 text-sm">
              Video call is open in another tab
            </p>
            <p className="text-cyan-400 text-xs font-mono mt-2">
              {roomPrefix}{roomName}
            </p>
          </div>

          <div className="flex flex-col gap-3 w-full max-w-xs mx-auto">
            {/* Rejoin button */}
            <button
              onClick={openJitsiRoom}
              className="w-full py-2 px-4 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              <span>Rejoin Call</span>
            </button>

            {/* End session button */}
            <button
              onClick={handleEndCall}
              className="w-full py-2 px-4 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-600/30 rounded-lg transition-colors"
            >
              End Session
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
