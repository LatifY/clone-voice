import React, { useState, useRef, useEffect } from "react";
import { Card, CardBody, Button, Badge } from "../ui";
import morganFreemanOriginal from "../../assets/audio/original-morgan-freeman.mp3";
import morganFreemanAI from "../../assets/audio/ai-morgan-freeman.wav";
import rickOriginal from "../../assets/audio/original-rick.mp3";
import rickAI from "../../assets/audio/ai-rick.wav";

import morganFreemanImage from "../../assets/img/morgan-freeman.jpg"
import rickImage from "../../assets/img/rick-sanchez.png"

// SVG Icons
const PlayIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
      clipRule="evenodd"
    />
  </svg>
);

const PauseIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
      clipRule="evenodd"
    />
  </svg>
);

const AIIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z"
      clipRule="evenodd"
    />
  </svg>
);

const VoiceIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z"
      clipRule="evenodd"
    />
  </svg>
);

const TextIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1z"
      clipRule="evenodd"
    />
  </svg>
);

const ArrowIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
      clipRule="evenodd"
    />
  </svg>
);

interface AudioPlayerProps {
  audioSrc: string;
  isPlaying: boolean;
  onTogglePlay: () => void;
  isSpecial?: boolean;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({
  audioSrc,
  isPlaying,
  onTogglePlay,
  isSpecial
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Audio effect for play/pause
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    console.log('Audio player effect:', { isPlaying, audioSrc });

    if (isPlaying) {
      audio.play().catch((error) => {
        console.error('Error playing audio:', error);
      });
    } else {
      audio.pause();
    }
  }, [isPlaying, audioSrc]);

  // Time update handler
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      onTogglePlay(); // Stop playing when audio ends
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [onTogglePlay]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className={"flex items-center gap-3 bg-white/5 backdrop-blur-sm border rounded-xl p-3 " + (isSpecial ? "border-orange-300" : "border-white/10")}>
      <audio
        ref={audioRef}
        src={audioSrc}
        preload="metadata"
      />
      <button
        onClick={onTogglePlay}
        className="w-10 h-10 bg-white text-black hover:bg-gray-100 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105"
      >
        {isPlaying ? <PauseIcon /> : <PlayIcon />}
      </button>
      <div className="flex-1">
        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-white rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
      <span className="text-sm text-gray-400">
        {formatTime(currentTime)} / {formatTime(duration)}
      </span>
    </div>
  );
};

export const Examples: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"text-to-speech" | "speech-to-speech">("text-to-speech");
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [playingType, setPlayingType] = useState<'source' | 'cloned' | null>(null);

  // Text-to-Speech Examples (Voice Cloning with Text Input)
  const textToSpeechExamples = [
    {
      id: "morgan-freeman-tts",
      name: "Morgan Freeman",
      description: "Actor, narrator",
      avatar: morganFreemanImage,
      sourceAudio: morganFreemanOriginal,
      textPrompt: "Welcome to the future of sound. With this voice clone app, every word becomes more than text, it becomes an experience.",
      clonedAudio: morganFreemanAI,
      settings: {
        emotion: "Confident",
        speed: "Normal", 
        pitch: "Deep"
      }
    },
    {
      id: "rick-tts",
      name: "Rick Sanchez",
      description: "Fictional character",
      avatar: rickImage,
      sourceAudio: rickOriginal,
      textPrompt: "I just found a hidden treasure in the backyard! Check it out!",
      clonedAudio: rickAI, 
      settings: {
        emotion: "Inspirational",
        speed: "Moderate",
        pitch: "Clear"
      }
    },
    {
      id: "professional-voice-tts",
      name: "Professional Speaker",
      description: "Business presentation style",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      sourceAudio: "/examples/business-voice.mp3",
      textPrompt: "Our quarterly results demonstrate exceptional growth across all key performance indicators and market segments.",
      clonedAudio: "/examples/business-cloned.mp3",
      settings: {
        emotion: "Professional",
        speed: "Business Pace",
        pitch: "Authoritative"
      }
    }
  ];

  const speechToSpeechExamples = [
    {
      id: "shakespeare-modern",
      name: "Shakespeare → Modern CEO",
      description: "Classic literature to business speak",
      originalText: "To be or not to be, that is the question",
      clonedText:
        "To innovate or not to innovate, that is the strategic decision we must make",
      originalVoice: "Shakespearean theater style",
      clonedVoice: "Modern CEO presentation style",
      audioSrc: "/examples/shakespeare-ceo.mp3",
    },
    {
      id: "child-professor",
      name: "Child → Professor",
      description: "Young voice to academic authority",
      originalText: "I love playing with my toys and watching cartoons",
      clonedText:
        "The pedagogical implications of interactive learning through recreational activities",
      originalVoice: "8-year-old child",
      clonedVoice: "University professor",
      audioSrc: "/examples/child-professor.mp3",
    },
    {
      id: "casual-news",
      name: "Casual → News Anchor",
      description: "Informal speech to professional broadcast",
      originalText:
        "Hey, so like, there was this crazy thing that happened today",
      clonedText:
        "Good evening, I'm reporting on the significant events that transpired earlier today",
      originalVoice: "Casual conversation",
      clonedVoice: "Professional news anchor",
      audioSrc: "/examples/casual-news.mp3",
    },
    {
      id: "robotic-human",
      name: "Robotic → Human",
      description: "Monotone AI to natural human speech",
      originalText:
        "Processing request. System status nominal. Task completed.",
      clonedText:
        "I'm working on your request right now. Everything looks good, and I've finished the task!",
      originalVoice: "AI robot voice",
      clonedVoice: "Friendly human assistant",
      audioSrc: "/examples/robotic-human.mp3",
    },
    {
      id: "whisper-shout",
      name: "Whisper → Motivational",
      description: "Quiet speech to energetic motivation",
      originalText: "I don't think I can do this, it's too difficult",
      clonedText:
        "YOU'VE GOT THIS! Nothing is impossible when you believe in yourself!",
      originalVoice: "Uncertain whisper",
      clonedVoice: "High-energy motivational speaker",
      audioSrc: "/examples/whisper-motivational.mp3",
    },
    {
      id: "accent-neutral",
      name: "Heavy Accent → Neutral",
      description: "Strong regional accent to neutral English",
      originalText: "G'day mate, how ya goin' down under today?",
      clonedText: "Hello there, how are you doing today?",
      originalVoice: "Strong Australian accent",
      clonedVoice: "Neutral American English",
      audioSrc: "/examples/accent-neutral.mp3",
    },
  ];

  const handlePlayToggle = (id: string, type: 'source' | 'cloned') => {
    console.log('Play toggle:', { id, type, currentlyPlaying: playingId, currentType: playingType });
    
    if (playingId === id && playingType === type) {
      // If currently playing this exact audio, pause it
      setPlayingId(null);
      setPlayingType(null);
    } else {
      // Play this audio
      setPlayingId(id);
      setPlayingType(type);
    }
  };

  return (
    <section
      id="examples"
      className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 via-gray-950 to-black relative overflow-hidden border-b-4 border-gray-900"
    >
      {/* Top gradient transition from Features */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-gray-900/50 to-transparent pointer-events-none"></div>

      {/* Grain overlay */}
      <div
        className="absolute inset-0 opacity-12 mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='1' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      ></div>

      {/* Gradient orbs */}
      <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-cyan-600/8 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-teal-600/8 rounded-full blur-3xl"></div>
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              AI Voice
              <span className="block mt-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Examples
              </span>
            </h2>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Experience the power of AI voice cloning. Transform text to speech or convert speech styles with advanced AI technology.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-12">
          <div className="bg-white/5 backdrop-blur-md border border-white/10 p-1 rounded-2xl">
            <button
              onClick={() => setActiveTab("text-to-speech")}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                activeTab === "text-to-speech"
                  ? "bg-white text-black shadow-lg"
                  : "text-gray-300 hover:text-white hover:bg-white/10"
              }`}
            >
              <div className="flex items-center gap-2">
                <TextIcon />
                Text to Speech
              </div>
            </button>
            <button
              onClick={() => setActiveTab("speech-to-speech")}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                activeTab === "speech-to-speech"
                  ? "bg-white text-black shadow-lg"
                  : "text-gray-300 hover:text-white hover:bg-white/10"
              }`}
            >
              <div className="flex items-center gap-2">
                <VoiceIcon />
                Speech to Speech
              </div>
            </button>
          </div>
        </div>

        {/* Content */}
        {activeTab === "text-to-speech" && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {textToSpeechExamples.map((example) => (
              <Card key={example.id} hover className="overflow-hidden">
                <CardBody className="p-6 space-y-6">
                  {/* Header */}
                  <div className="flex items-center gap-4">
                    <img
                      src={example.avatar}
                      alt={example.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-white">
                        {example.name}
                      </h3>
                      <p className="text-sm text-gray-400">
                        {example.description}
                      </p>
                    </div>
                  </div>

                  {/* Source Audio */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="glass" size="sm">
                        <VoiceIcon />
                        Source Sample
                      </Badge>
                    </div>
                    <AudioPlayer
                      audioSrc={example.sourceAudio}
                      isPlaying={playingId === example.id && playingType === 'source'}
                      onTogglePlay={() => handlePlayToggle(example.id, 'source')}
                    />
                  </div>

                  {/* Text Prompt */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="primary" size="sm">
                        <TextIcon />
                        Text Input
                      </Badge>
                    </div>
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                      <p className="text-sm text-gray-300 italic">
                        "{example.textPrompt}"
                      </p>
                    </div>
                  </div>

                  {/* AI Result */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" size="sm">
                        🤖 AI Result
                      </Badge>
                    </div>
                    <AudioPlayer
                      audioSrc={example.clonedAudio}
                      isPlaying={playingId === example.id && playingType === 'cloned'}
                      onTogglePlay={() => handlePlayToggle(example.id, 'cloned')}
                      isSpecial={true}
                    />
                  </div>

                  {/* Settings */}
                  <div className="pt-4 border-t border-white/10">
                    <div className="flex flex-wrap gap-2">
                      <span className="text-xs bg-white/10 px-2 py-1 rounded-full text-gray-300">
                        {example.settings.emotion}
                      </span>
                      <span className="text-xs bg-white/10 px-2 py-1 rounded-full text-gray-300">
                        {example.settings.speed}
                      </span>
                      <span className="text-xs bg-white/10 px-2 py-1 rounded-full text-gray-300">
                        {example.settings.pitch}
                      </span>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}

        {activeTab === "speech-to-speech" && (
          <div className="grid md:grid-cols-2 gap-6">
            {speechToSpeechExamples.map((example) => (
              <Card key={example.id} hover className="overflow-hidden">
                <CardBody className="p-6 space-y-6">
                  {/* Header */}
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {example.name}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {example.description}
                    </p>
                  </div>

                  {/* Transformation */}
                  <div className="space-y-4">
                    {/* Original */}
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="glass" size="sm">
                          Original
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-300 mb-2">
                        "{example.originalText}"
                      </p>
                      <p className="text-xs text-gray-400">
                        {example.originalVoice}
                      </p>
                    </div>

                    {/* Arrow */}
                    <div className="flex justify-center">
                      <div className="w-8 h-8 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>

                    {/* Transformed */}
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="primary" size="sm">
                          AI Transformed
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-300 mb-2">
                        "{example.clonedText}"
                      </p>
                      <p className="text-xs text-white">
                        {example.clonedVoice}
                      </p>
                    </div>
                  </div>

                  {/* Audio Player */}
                  <AudioPlayer
                    audioSrc={example.audioSrc}
                    isPlaying={playingId === example.id && playingType === 'cloned'}
                    onTogglePlay={() => handlePlayToggle(example.id, 'cloned')}
                  />
                </CardBody>
              </Card>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="text-center mt-16">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              Ready to Create Your Own?
            </h3>
            <p className="text-lg text-gray-300 mb-6">
              Start with 10 free credits and experience the magic of AI voice
              cloning
            </p>
            <Button
              size="lg"
              variant="primary"
              className="px-8 py-4 text-lg font-semibold"
            >
              Try CloneVoice Free
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom gradient transition to Pricing */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-black/50 pointer-events-none"></div>
    </section>
  );
};
