import React, { useState, useRef, useEffect } from 'react'
import { Button } from "../ui"

// SVG Icons
const PlayIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
  </svg>
);

const PauseIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
  </svg>
);

const StopIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
  </svg>
);

const MicrophoneIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
  </svg>
);

type RecordingState = 'idle' | 'recording' | 'completed';

export const Hero: React.FC = () => {
  const [recordingState, setRecordingState] = useState<RecordingState>('idle');
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [playbackTime, setPlaybackTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const animationRef = useRef<number | null>(null);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Update playback time
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => {
      setPlaybackTime(audio.currentTime);
      setDuration(audio.duration || 0);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setPlaybackTime(0);
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('loadedmetadata', updateTime);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('loadedmetadata', updateTime);
    };
  }, [audioBlob]);

  const startRecording = async () => {
    console.log("Starting recording");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        } 
      });
      
      streamRef.current = stream;
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      const chunks: BlobPart[] = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm;codecs=opus' });
        setAudioBlob(blob);
        setRecordingState('completed');
        
        // Create audio element for playback
        if (audioRef.current) {
          audioRef.current.src = URL.createObjectURL(blob);
        }
      };

      mediaRecorder.start();
      setRecordingState('recording');
      setRecordingTime(0);

      // Start timer
      intervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      // Start volume monitoring
      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      const microphone = audioContext.createMediaStreamSource(stream);
      microphone.connect(analyser);
      
      analyser.fftSize = 256;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const updateVolume = () => {
        analyser.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b) / bufferLength;
        setVolume(average);
        
        if (recordingState === 'recording') {
          animationRef.current = requestAnimationFrame(updateVolume);
        }
      };
      
      updateVolume();

    } catch (err) {
      console.error('Error accessing microphone:', err);
      alert('Could not access microphone. Please check your permissions.');
    }
  };

  const stopRecording = () => {
    console.log("Stopping recording");

    if (mediaRecorderRef.current && recordingState === 'recording') {
      mediaRecorderRef.current.stop();
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      setVolume(0);
    }
  };

  const togglePlayback = () => {
    const audio = audioRef.current;
    if (!audio || !audioBlob) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play();
      setIsPlaying(true);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newTime = parseFloat(e.target.value);
    audio.currentTime = newTime;
    setPlaybackTime(newTime);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const resetRecording = () => {
    setRecordingState('idle');
    setAudioBlob(null);
    setRecordingTime(0);
    setPlaybackTime(0);
    setDuration(0);
    setIsPlaying(false);
    
    if (audioRef.current) {
      audioRef.current.src = '';
    }
  };

  const handleCloneVoice = () => {
    if (!audioBlob) return;
    
    // Simulate voice cloning process
    alert(`Voice cloning started! This will cost 5 credits. Processing your ${formatTime(recordingTime)} recording...`);
    
    // In a real app, you would:
    // 1. Upload the audio blob to your server
    // 2. Process it with your AI model
    // 3. Deduct credits from user account
    // 4. Return the cloned voice model
  };

  return (
    <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 via-black to-gray-800 min-h-screen flex items-center relative overflow-hidden border-b-4 border-gray-900">
      {/* Grain overlay */}
      <div className="absolute inset-0 opacity-15 mix-blend-overlay pointer-events-none" 
           style={{
             backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='1' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
           }}>
      </div>
      
      {/* Gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
      <div className="max-w-7xl mx-auto w-full relative z-10">
        <div className="text-center space-y-8">
          {/* Top Badge */}
          <div className="flex justify-center">
            <div className="flex items-center gap-2 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-full px-6 py-3">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-white text-sm font-medium font-body">AI-Powered Voice Cloning</span>
            </div>
          </div>

          {/* Main Heading */}
          <div className="space-y-6">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight font-heading tracking-tight">
              <span className="text-white block bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                CLONE ANY VOICE
              </span>
              <span className="text-white block bg-gradient-to-r from-gray-300 to-white bg-clip-text text-transparent">
                WITH AI MAGIC
              </span>
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto font-body">
              Revolutionary AI technology that captures and replicates any voice with just a few seconds of audio. 
              Start with <span className="text-white font-semibold">10 free credits</span> - no strings attached!
            </p>
          </div>

          {/* CTA Button */}
          <div className="flex justify-center">
            <Button 
              size="lg" 
              className="bg-white text-black hover:bg-gray-100 text-black px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 font-heading"
            >
              Let's generate
            </Button>
          </div>

          {/* Stats */}
          <div className="text-center">
            <p className="text-gray-400 text-sm font-mono">50k+ generation per week</p>
          </div>

          {/* Audio Visualizer */}
          <div className="flex justify-center mt-10">
            <div className="flex items-end space-x-1 h-20">
              {Array.from({ length: 40 }, (_, i) => (
                <div
                  key={i}
                  className="bg-gray-600 rounded-full animate-pulse"
                  style={{
                    width: '4px',
                    height: `${Math.random() * 60 + 20}px`,
                    animationDelay: `${i * 0.1}s`,
                    animationDuration: `${0.5 + Math.random() * 0.5}s`
                  }}
                />
              ))}
            </div>
          </div>

          {/* Voice Recorder Section */}
          <div className="max-w-md mx-auto mt-16">
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-white mb-6 text-center font-handwritten text-2xl">
                "Try Voice Cloning"
              </h3>

              <div className="space-y-6">
                {/* Recording Interface */}
                <div className="text-center space-y-4">
                  <div className="relative inline-flex">
                    <button
                      onClick={recordingState === 'recording' ? stopRecording : startRecording}
                      className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
                        recordingState === 'recording'
                          ? 'bg-red-500 shadow-lg shadow-red-200 animate-pulse'
                          : 'bg-white text-black shadow-lg'
                      }`}
                    >
                      {recordingState === 'recording' ? (
                        <StopIcon />
                      ) : (
                        <MicrophoneIcon />
                      )}
                      <span className="sr-only">
                        {recordingState === 'recording' ? 'Stop Recording' : 'Start Recording'}
                      </span>
                    </button>
                    
                    {/* Volume Indicator */}
                    {recordingState === 'recording' && (
                      <div className="absolute -inset-2 rounded-full border-4 border-red-300 animate-ping opacity-75"></div>
                    )}
                  </div>

                  <div className="space-y-2">
                    {recordingState === 'idle' && (
                      <p className="text-gray-300 font-body">Click to start recording your voice</p>
                    )}
                    {recordingState === 'recording' && (
                      <div className="space-y-2">
                        <p className="text-red-400 font-medium font-body">Recording... <span className="font-mono">{formatTime(recordingTime)}</span></p>
                        <div className="flex justify-center">
                          <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-red-500 transition-all duration-100"
                              style={{ width: `${Math.min(volume * 2, 100)}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                    {recordingState === 'completed' && (
                      <p className="text-green-400 font-medium font-body">
                        Recording completed (<span className="font-mono">{formatTime(recordingTime)}</span>)
                      </p>
                    )}
                  </div>
                </div>

                {/* Playback Controls */}
                {recordingState === 'completed' && audioBlob && (
                  <div className="space-y-4 p-4 bg-gray-800/50 rounded-xl">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={togglePlayback}
                        className="w-10 h-10 bg-white text-black hover:bg-gray-100 rounded-full flex items-center justify-center transition-colors"
                      >
                        {isPlaying ? <PauseIcon /> : <PlayIcon />}
                      </button>
                      
                      <div className="flex-1 space-y-2">
                        <input
                          type="range"
                          min="0"
                          max={duration || 0}
                          value={playbackTime}
                          onChange={handleSeek}
                          className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                        />
                        <div className="flex justify-between text-sm text-gray-400 font-mono">
                          <span>{formatTime(playbackTime)}</span>
                          <span>{formatTime(duration)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-center space-x-3">
                      <Button
                        onClick={resetRecording}
                        variant="outline"
                        size="sm"
                        className="text-gray-300 border-gray-600 hover:bg-gray-700 font-body"
                      >
                        Record Again
                      </Button>
                      <Button
                        onClick={handleCloneVoice}
                        size="sm"
                        className="bg-white text-black hover:bg-gray-100 font-heading font-semibold"
                      >
                        Clone This Voice (5 Credits)
                      </Button>
                    </div>
                  </div>
                )}

                {/* Hidden audio element */}
                <audio ref={audioRef} />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom gradient transition to Features */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-black/50 pointer-events-none"></div>
    </section>
  );
};
