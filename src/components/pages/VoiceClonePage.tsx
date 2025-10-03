import React, { useState, useRef, useEffect } from 'react';
import { Navbar, Footer } from '../sections';
import { Card } from '../ui';
import { useAudioRecording } from '../../hooks/useAudioRecording';

// Icons
const MicrophoneIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
  </svg>
);

const UploadIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
  </svg>
);

const SparklesIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

const PlayIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M8 5v14l11-7z" />
  </svg>
);

const PauseIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
  </svg>
);

const StopIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <rect x="6" y="6" width="12" height="12" rx="2" />
  </svg>
);

const TrashIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

// Expanded preset voices with more variety
const PRESET_VOICES = [
  {
    id: 'morgan-freeman',
    name: 'Morgan Freeman',
    image: '/src/assets/img/morgan-freeman.jpg',
    audioSample: '/src/assets/audio/ai-morgan-freeman.wav',
    description: 'Deep, authoritative narrator',
    category: 'Male'
  },
  {
    id: 'rick-sanchez',
    name: 'Rick Sanchez',
    image: '/src/assets/img/rick-sanchez.png',
    audioSample: '/src/assets/audio/ai-rick.wav',
    description: 'Sarcastic scientist',
    category: 'Character'
  },
  {
    id: 'steve-jobs',
    name: 'Steve Jobs',
    image: '/src/assets/img/steve-jobs.jpg',
    audioSample: '/src/assets/audio/ai-steve-jobs.wav',
    description: 'Inspirational presenter',
    category: 'Male'
  },
  {
    id: 'stewie',
    name: 'Stewie Griffin',
    image: '/src/assets/img/stewie.png',
    audioSample: '/src/assets/audio/original-stewie.mp3',
    description: 'British intellectual',
    category: 'Character'
  },
  {
    id: 'david-attenborough',
    name: 'David Attenborough',
    image: '/src/assets/img/morgan-freeman.jpg',
    audioSample: '/src/assets/audio/ai-morgan-freeman.wav',
    description: 'Nature documentary',
    category: 'Male'
  },
  {
    id: 'scarlett-johansson',
    name: 'Scarlett AI',
    image: '/src/assets/img/stewie.png',
    audioSample: '/src/assets/audio/original-stewie.mp3',
    description: 'Smooth, feminine',
    category: 'Female'
  },
  {
    id: 'james-bond',
    name: 'James Bond',
    image: '/src/assets/img/steve-jobs.jpg',
    audioSample: '/src/assets/audio/ai-steve-jobs.wav',
    description: 'Sophisticated British',
    category: 'Male'
  },
  {
    id: 'tony-stark',
    name: 'Tony Stark',
    image: '/src/assets/img/rick-sanchez.png',
    audioSample: '/src/assets/audio/ai-rick.wav',
    description: 'Confident genius',
    category: 'Character'
  },
  {
    id: 'emma-watson',
    name: 'Emma AI',
    image: '/src/assets/img/stewie.png',
    audioSample: '/src/assets/audio/original-stewie.mp3',
    description: 'British, educated',
    category: 'Female'
  },
  {
    id: 'darth-vader',
    name: 'Darth Vader',
    image: '/src/assets/img/morgan-freeman.jpg',
    audioSample: '/src/assets/audio/ai-morgan-freeman.wav',
    description: 'Dark, powerful',
    category: 'Character'
  },
  {
    id: 'obama',
    name: 'Presidential',
    image: '/src/assets/img/steve-jobs.jpg',
    audioSample: '/src/assets/audio/ai-steve-jobs.wav',
    description: 'Charismatic leader',
    category: 'Male'
  },
  {
    id: 'yoda',
    name: 'Master Yoda',
    image: '/src/assets/img/stewie.png',
    audioSample: '/src/assets/audio/original-stewie.mp3',
    description: 'Wise, ancient',
    category: 'Character'
  }
];

// Enhanced Audio Player with YouTube-like scrubbing
interface AudioPlayerProps {
  audioUrl?: string;
  onEnded?: () => void;
  className?: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioUrl, onEnded, className = "" }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => {
      setDuration(audio.duration);
      setIsLoading(false);
    };
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      onEnded?.();
    };
    const handleLoadStart = () => setIsLoading(true);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('loadstart', handleLoadStart);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('loadstart', handleLoadStart);
    };
  }, [onEnded]);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (isPlaying) {
        audio.pause();
      } else {
        await audio.play();
      }
      setIsPlaying(!isPlaying);
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    const progressBar = progressRef.current;
    if (!audio || !duration || !progressBar) return;

    const rect = progressBar.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const newTime = percent * duration;
    
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercent = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className={`space-y-3 ${className}`}>
      <audio ref={audioRef} src={audioUrl} preload="metadata" />
      
      {/* Progress Bar - YouTube style */}
      <div 
        ref={progressRef}
        className="relative h-1.5 bg-white/20 rounded-full cursor-pointer group hover:h-2 transition-all"
        onClick={handleSeek}
      >
        <div 
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all"
          style={{ width: `${progressPercent}%` }}
        />
        <div 
          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ left: `${progressPercent}%`, marginLeft: '-6px' }}
        />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={togglePlay}
            disabled={isLoading}
            className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 flex items-center justify-center text-white transition-all hover:scale-110 shadow-lg focus:outline-none"
          >
            {isLoading ? (
              <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : isPlaying ? (
              <PauseIcon />
            ) : (
              <PlayIcon />
            )}
          </button>

          <div className="flex items-center gap-1 text-xs text-gray-400 font-mono">
            <span>{formatTime(currentTime)}</span>
            <span>/</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Voice Source Type
type VoiceSource = 'record' | 'upload' | 'preset';

// Main Voice Clone Page
export const VoiceClonePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'tts' | 's2s'>('tts');
  const [voiceSource, setVoiceSource] = useState<VoiceSource>('record');
  const [text, setText] = useState('');
  
  // Use audio recording hook
  const {
    isRecording,
    hasRecording,
    recordingTime,
    waveformData,
    recordedAudioUrl,
    recordingError,
    startRecording,
    stopRecording,
    deleteRecording,
  } = useAudioRecording();
  
  // Upload state
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string>('');
  const [dragActive, setDragActive] = useState(false);
  
  // Preset state
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);

  const handleRecord = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  // File upload handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('audio/')) {
        setUploadedFile(file);
        setUploadedFileUrl(URL.createObjectURL(file));
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFile(file);
      setUploadedFileUrl(URL.createObjectURL(file));
    }
  };

  const removeFile = () => {
    if (uploadedFileUrl) {
      URL.revokeObjectURL(uploadedFileUrl);
    }
    setUploadedFile(null);
    setUploadedFileUrl('');
  };

  const formatRecordingTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = (seconds % 60).toFixed(1);
    return `${mins}:${secs.padStart(4, '0')}`;
  };

  const handleGenerate = () => {
    const voiceConfig = {
      source: voiceSource,
      hasRecording: hasRecording,
      uploadedFileName: uploadedFile?.name,
      selectedPreset: selectedPreset,
      text: text
    };
    
    console.log('Generating voice with config:', voiceConfig);
    alert('🎉 Voice generation started! Check your dashboard for progress.');
  };

  const isGenerationReady = () => {
    if (!text.trim()) return false;
    
    switch (voiceSource) {
      case 'record': return hasRecording;
      case 'upload': return uploadedFile !== null;
      case 'preset': return selectedPreset !== null;
      default: return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900">
      <Navbar />

      <main className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 tracking-tight">
              AI Voice Cloning Studio
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Create realistic voice clones with cutting-edge AI technology
            </p>
          </div>

          {/* Mode Tabs */}
          <div className="flex items-center justify-center gap-2 mb-10">
            <button
              onClick={() => setActiveTab('tts')}
              className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 focus:outline-none ${
                activeTab === 'tts'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30'
                  : 'bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white backdrop-blur-sm border border-white/10'
              }`}
            >
              Text to Speech
            </button>
            <button
              onClick={() => setActiveTab('s2s')}
              className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 focus:outline-none ${
                activeTab === 's2s'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30'
                  : 'bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white backdrop-blur-sm border border-white/10'
              }`}
            >
              Speech to Speech
            </button>
          </div>

          {activeTab === 'tts' ? (
            <div className="space-y-6">
              {/* Unified Voice Selection Card */}
              <Card className="p-6 backdrop-blur-xl bg-white/5 border-white/10 shadow-2xl">
                <h2 className="text-xl font-bold text-white mb-6">Choose Your Voice Source</h2>
                
                {/* Voice Source Tabs */}
                <div className="flex flex-wrap gap-2 mb-6">
                  <button
                    onClick={() => setVoiceSource('record')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 focus:outline-none ${
                      voiceSource === 'record'
                        ? 'bg-gradient-to-r from-red-500/30 to-pink-500/30 border border-red-400/50 text-white shadow-lg'
                        : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <MicrophoneIcon className="w-4 h-4" />
                    Record Voice
                  </button>

                  <button
                    onClick={() => setVoiceSource('upload')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 focus:outline-none ${
                      voiceSource === 'upload'
                        ? 'bg-gradient-to-r from-blue-500/30 to-cyan-500/30 border border-blue-400/50 text-white shadow-lg'
                        : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <UploadIcon className="w-4 h-4" />
                    Upload File
                  </button>

                  <button
                    onClick={() => setVoiceSource('preset')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 focus:outline-none ${
                      voiceSource === 'preset'
                        ? 'bg-gradient-to-r from-purple-500/30 to-pink-500/30 border border-purple-400/50 text-white shadow-lg'
                        : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <SparklesIcon className="w-4 h-4" />
                    Preset Voices
                  </button>
                </div>

                {/* Voice Source Content */}
                <div className="min-h-[300px]">
                  {/* RECORD VOICE */}
                  {voiceSource === 'record' && (
                    <div className="space-y-6">
                      {/* Enhanced Waveform Display */}
                      <div className="relative h-32 bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden flex items-end justify-center gap-0.5 p-4 shadow-inner">
                        {waveformData.map((height, i) => (
                          <div
                            key={i}
                            className={`w-1 rounded-sm transition-all duration-75 ${
                              isRecording 
                                ? 'bg-gradient-to-t from-red-500 via-red-400 to-pink-500 shadow-sm shadow-red-500/50' 
                                : hasRecording
                                ? 'bg-gradient-to-t from-blue-500 via-blue-400 to-purple-500'
                                : 'bg-gray-600'
                            }`}
                            style={{ 
                              height: `${height}%`,
                              filter: isRecording ? 'drop-shadow(0 0 2px rgba(239, 68, 68, 0.5))' : 'none'
                            }}
                          />
                        ))}
                        
                        {/* Recording Status Overlay */}
                        {isRecording && (
                          <div className="absolute top-3 left-3 flex items-center gap-2 px-3 py-1 bg-red-500/20 backdrop-blur-sm border border-red-400/30 rounded-full">
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                            <span className="text-xs text-red-300 font-medium">RECORDING</span>
                          </div>
                        )}
                      </div>

                      {/* Timer */}
                      <div className="text-center">
                        <div className={`text-3xl font-mono font-bold ${isRecording ? 'text-red-400' : 'text-white'}`}>
                          {formatRecordingTime(recordingTime)}
                        </div>
                        <p className="text-sm text-gray-400 mt-1">
                          {isRecording ? 'Recording in progress...' : hasRecording ? 'Recording complete' : 'Ready to record'}
                        </p>
                      </div>

                      {/* Controls */}
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={handleRecord}
                          className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 focus:outline-none flex items-center gap-2 shadow-lg ${
                            isRecording
                              ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-red-500/30'
                              : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-emerald-500/30'
                          }`}
                        >
                          {isRecording ? (
                            <>
                              <StopIcon />
                              Stop Recording
                            </>
                          ) : (
                            <>
                              <MicrophoneIcon className="w-5 h-5" />
                              {hasRecording ? 'Record Again' : 'Start Recording'}
                            </>
                          )}
                        </button>

                        {hasRecording && (
                          <button
                            onClick={deleteRecording}
                            className="px-4 py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-400/30 rounded-xl text-red-400 font-medium transition-all duration-300 hover:scale-105 focus:outline-none"
                          >
                            <TrashIcon />
                          </button>
                        )}
                      </div>

                      {/* Audio Playback */}
                      {hasRecording && recordedAudioUrl && (
                        <div className="p-4 bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-sm border border-white/10 rounded-xl">
                          <p className="text-sm text-gray-400 mb-3">Playback Recording</p>
                          <AudioPlayer audioUrl={recordedAudioUrl} />
                        </div>
                      )}

                      {/* Error Message */}
                      {recordingError && (
                        <div className="p-4 bg-red-500/10 backdrop-blur-sm border border-red-400/30 rounded-xl">
                          <p className="text-sm text-red-300 flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {recordingError}
                          </p>
                        </div>
                      )}

                      {/* Microphone Permission Info */}
                      {!hasRecording && !isRecording && !recordingError && (
                        <div className="p-4 bg-blue-500/10 backdrop-blur-sm border border-blue-400/30 rounded-xl">
                          <p className="text-sm text-blue-300 flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Make sure to allow microphone access when prompted for recording.
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* UPLOAD FILE */}
                  {voiceSource === 'upload' && (
                    <div className="space-y-4">
                      <div
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        className={`relative border-2 border-dashed rounded-xl p-8 transition-all duration-300 text-center ${
                          dragActive
                            ? 'border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/20'
                            : 'border-white/20 bg-white/5 hover:bg-white/10'
                        }`}
                      >
                        <input
                          type="file"
                          id="file-upload"
                          accept="audio/*"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                        
                        {uploadedFile ? (
                          <div className="space-y-4">
                            <div className="text-center">
                              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/50 flex items-center justify-center">
                                <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              </div>
                              <h4 className="text-white font-semibold mb-1">{uploadedFile.name}</h4>
                              <p className="text-gray-400 text-sm">
                                {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>

                            {/* Audio Player for uploaded file */}
                            <div className="p-4 bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-sm border border-white/10 rounded-lg">
                              <p className="text-sm text-gray-400 mb-3">Preview Audio</p>
                              <AudioPlayer audioUrl={uploadedFileUrl} />
                            </div>

                            <button
                              onClick={removeFile}
                              className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-400/30 rounded-lg text-red-400 text-sm font-medium transition-all duration-300 hover:scale-105 focus:outline-none"
                            >
                              Remove File
                            </button>
                          </div>
                        ) : (
                          <label htmlFor="file-upload" className="cursor-pointer block">
                            <div className="flex flex-col items-center">
                              <UploadIcon className="w-12 h-12 text-gray-400 mb-3" />
                              <h4 className="text-white font-semibold mb-2">
                                Drop your audio file here or click to browse
                              </h4>
                              <p className="text-gray-400 text-sm">
                                Supports MP3, WAV, M4A files (max 10MB)
                              </p>
                            </div>
                          </label>
                        )}
                      </div>
                    </div>
                  )}

                  {/* PRESET VOICES */}
                  {voiceSource === 'preset' && (
                    <div className="space-y-4">
                      <p className="text-gray-400 text-sm">Select from our curated voice collection</p>
                      
                      {/* Scrollable Voice Grid */}
                      <div className="max-h-96 overflow-y-auto pr-2 scrollbar-thin scrollbar-track-gray-800 scrollbar-thumb-purple-600">
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                          {PRESET_VOICES.map((voice) => (
                            <div
                              key={voice.id}
                              onClick={() => setSelectedPreset(voice.id)}
                              className={`relative group cursor-pointer rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 ${
                                selectedPreset === voice.id
                                  ? 'ring-2 ring-purple-500 shadow-lg shadow-purple-500/50'
                                  : 'hover:shadow-lg'
                              }`}
                            >
                              <div className="aspect-square bg-gradient-to-br from-gray-800 to-gray-900 relative">
                                <img
                                  src={voice.image}
                                  alt={voice.name}
                                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                                
                                {selectedPreset === voice.id && (
                                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center">
                                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                  </div>
                                )}

                                <div className="absolute bottom-0 left-0 right-0 p-2">
                                  <h4 className="text-white font-bold text-xs mb-0.5">{voice.name}</h4>
                                  <p className="text-gray-300 text-xs opacity-75">{voice.description}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Selected Voice Preview */}
                      {selectedPreset && (
                        <div className="p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-sm border border-purple-400/30 rounded-xl">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-12 h-12 rounded-lg overflow-hidden border border-purple-400/50">
                              <img
                                src={PRESET_VOICES.find(v => v.id === selectedPreset)?.image}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <h4 className="text-white font-bold">
                                {PRESET_VOICES.find(v => v.id === selectedPreset)?.name}
                              </h4>
                              <p className="text-gray-400 text-sm">
                                {PRESET_VOICES.find(v => v.id === selectedPreset)?.description}
                              </p>
                            </div>
                          </div>
                          <AudioPlayer 
                            audioUrl={PRESET_VOICES.find(v => v.id === selectedPreset)?.audioSample} 
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </Card>

              {/* Text Input & Generate Section */}
              <Card className="p-6 backdrop-blur-xl bg-white/5 border-white/10 shadow-2xl">
                <h2 className="text-xl font-bold text-white mb-4">Enter Text to Synthesize</h2>
                
                <div className="space-y-4">
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Type or paste your text here... The AI will read this using your selected voice."
                    className="w-full h-32 px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    maxLength={5000}
                  />

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">
                      {text.length} / 5000 characters
                    </span>

                    <button
                      onClick={handleGenerate}
                      disabled={!isGenerationReady()}
                      className="px-8 py-3 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 disabled:from-gray-700 disabled:to-gray-800 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all duration-300 hover:scale-105 disabled:hover:scale-100 shadow-lg shadow-purple-500/30 disabled:shadow-none focus:outline-none"
                    >
                      🎤 Generate Voice
                    </button>
                  </div>
                </div>
              </Card>
            </div>
          ) : (
            <Card className="p-12 backdrop-blur-xl bg-white/5 border-white/10 shadow-2xl">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                  <MicrophoneIcon className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  Speech to Speech
                </h3>
                <p className="text-gray-400 text-lg">
                  Coming soon... This feature is under development
                </p>
              </div>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};