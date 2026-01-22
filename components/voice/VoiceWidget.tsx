import { useEffect, useState, useRef } from "react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { GlassCard, NeonButton } from "@/components/ui";
import { RealtimeAgent, RealtimeSession } from "@openai/agents-realtime";
import { generatePortfolioContext } from "@/lib/openai/context";
import BackgroundDots from "./BackgroundDots";
import { motion, AnimatePresence } from "motion/react";

interface ConversationMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

export default function VoiceWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [textInput, setTextInput] = useState("");
  const [transcript, setTranscript] = useState("");
  const [response, setResponse] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [voice, setVoice] = useState<string>("alloy");
  const [useTTS, setUseTTS] = useState<boolean>(true);
  const [conversation, setConversation] = useState<ConversationMessage[]>([]);
  const sessionRef = useRef<RealtimeSession | null>(null);
  const agentRef = useRef<RealtimeAgent | null>(null);
  const currentUserMessageRef = useRef<string>("");
  const currentAssistantMessageRef = useRef<string>("");
  const sawAudioRef = useRef(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const welcomeSentRef = useRef(false);
  const isSpeakingRef = useRef(false);
  const seenHistoryItemIdsRef = useRef<Set<string>>(new Set());
  const lastTranscriptItemIdRef = useRef<string | null>(null);

  useEffect(() => {
    isSpeakingRef.current = isSpeaking;
  }, [isSpeaking]);

  const realtimeOnlyVoices = ["marin", "cedar"];
  const canUseTTSForCurrentVoice = useTTS && !realtimeOnlyVoices.includes(voice);

  useEffect(() => {
    fetchVoiceSettings();
  }, []);

  useEffect(() => {
    return () => {
      if (sessionRef.current) {
        try {
          const session = sessionRef.current as any;
          if (typeof session.close === "function") {
            session.close().catch(console.error);
          } else if (typeof session.disconnect === "function") {
            session.disconnect().catch(console.error);
          } else if (session.transport && typeof session.transport.close === "function") {
            session.transport.close().catch(console.error);
          }
        } catch (error) {
          console.error("Error cleaning up session:", error);
        }
      }
    };
  }, []);

  const fetchVoiceSettings = async () => {
    try {
      const response = await fetch("/api/admin/voice-settings");
      if (response.ok) {
        const data = await response.json();
        setVoice(data.voice || "alloy");
        setUseTTS(data.use_tts !== false);
      }
    } catch (error) {
      console.error("Error fetching voice settings:", error);
    }
  };

  const playTTSAudio = async (text: string, overrideVoice?: string) => {
    try {
      const voiceToUse = overrideVoice || voice;
      const response = await fetch("/api/voice/tts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text, voice: voiceToUse }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate TTS");
      }

      const data = await response.json();
      
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }

      const audio = new Audio(data.audio);
      audioRef.current = audio;
      
      audio.onplay = () => setIsSpeaking(true);
      audio.onended = () => {
        setIsSpeaking(false);
        audioRef.current = null;
      };
      audio.onerror = () => {
        setIsSpeaking(false);
        audioRef.current = null;
      };

      await audio.play();
    } catch (error) {
      console.error("Error playing TTS audio:", error);
      setIsSpeaking(false);
    }
  };

  const initializeAgent = async () => {
    try {
      const context = await generatePortfolioContext();
      const portfolioData = JSON.parse(context);

      const systemInstructions = `You are Alex's portfolio assistant. Your ONLY purpose is to tell people about Alexander Marston and his portfolio. You MUST stay on topic at all times.

CRITICAL RULES - YOU MUST FOLLOW THESE EXACTLY:
- You can ONLY discuss Alexander Marston, his work, projects, experience, skills, and education
- You MUST ONLY use information from the Portfolio Data provided below - NEVER make up, infer, or assume any information
- If information is not in the Portfolio Data, say "I don't have that information about Alex" - DO NOT make up details
- When asked about Alex, PROACTIVELY SHARE INFORMATION from the Portfolio Data - don't just ask questions back
- Tell them about his experience, projects, skills, and background using ONLY the data provided
- Be informative and engaging - share details about his work and accomplishments from the Portfolio Data
- If the user asks about anything else (other people, general topics, unrelated questions), politely redirect them back to Alex's portfolio
- Always bring the conversation back to Alex's work, projects, or experience
- Never engage with off-topic questions - instead say something like "I'm here to tell you about Alex! Let me tell you about [relevant Alex topic] instead."
- Don't ask questions like a questionnaire - instead, provide information and offer to tell them more
- Be friendly but firm about staying on topic
- NEVER fabricate, assume, or infer information not explicitly in the Portfolio Data below

Speak casually and naturally.
Use contractions.
Vary sentence length.
Avoid formal phrasing.
No lists unless asked.
Sound like a human guide, not a narrator.

Portfolio Data (USE ONLY THIS INFORMATION - DO NOT MAKE ANYTHING UP):
${JSON.stringify(portfolioData, null, 2)}

When someone asks about Alex, proactively share relevant information ONLY from the Portfolio Data above. Tell them about his experience, highlight his projects, discuss his skills, and share his background. Be informative and engaging, not interrogative. If you don't have specific information in the Portfolio Data, say so - never make it up.`;

      const agent = new RealtimeAgent({
        name: "Alex",
        instructions: systemInstructions,
        voice,
      });

      agentRef.current = agent;

      const outputModalities: ("text" | "audio")[] = canUseTTSForCurrentVoice
        ? ["text"]
        : ["audio"];

      const session = new RealtimeSession(agent, {
        model: "gpt-realtime",
        config: {
          outputModalities,
          audio: {
            ...(canUseTTSForCurrentVoice
              ? {}
              : {
                  output: {
                    voice,
                    speed: 0.95,
                  },
                }),
            input: {
              turnDetection: {
                type: "server_vad",
                createResponse: true,
                prefixPaddingMs: 250,
                silenceDurationMs: 650,
              },
            },
          },
        },
      });

      const s: any = session;

      // Reset local history tracking for this session
      seenHistoryItemIdsRef.current = new Set();
      lastTranscriptItemIdRef.current = null;

      s.on("error" as any, (err: any) => {
        console.error("Session error:", err);
        const msg =
          err?.error?.error?.message ||
          err?.error?.message ||
          err?.message ||
          "Connection error occurred";
        setError(String(msg));
      });

      // Raw transport events (lets us update live transcript / live output text)
      s.on("transport_event" as any, (event: any) => {
        if (!event?.type) return;

        if (event.type === "conversation.item.input_audio_transcription.delta") {
          const itemId = event.item_id;
          const delta = event.delta || "";
          if (typeof itemId === "string") {
            if (lastTranscriptItemIdRef.current !== itemId) {
              lastTranscriptItemIdRef.current = itemId;
              setTranscript(delta);
              currentUserMessageRef.current = delta;
            } else {
              setTranscript((prev) => prev + delta);
              currentUserMessageRef.current = (currentUserMessageRef.current || "") + delta;
            }
          }
        }

        if (event.type === "conversation.item.input_audio_transcription.completed") {
          setTranscript("");
          currentUserMessageRef.current = "";
          lastTranscriptItemIdRef.current = null;
        }

        if (event.type === "response.output_text.delta") {
          const delta = event.delta || "";
          if (typeof delta === "string" && delta.length > 0) {
            setResponse((prev) => prev + delta);
            currentAssistantMessageRef.current =
              (currentAssistantMessageRef.current || "") + delta;
          }
        }

        if (event.type === "response.created") {
          setResponse("");
          currentAssistantMessageRef.current = "";
        }

        if (event.type === "response.done") {
          setResponse("");
          currentAssistantMessageRef.current = "";
        }
      });

      // History items are the most reliable way to get user + assistant messages
      s.on("history_added" as any, (item: any) => {
        const itemId = item?.itemId;
        if (!itemId || typeof itemId !== "string") return;
        if (seenHistoryItemIdsRef.current.has(itemId)) return;
        seenHistoryItemIdsRef.current.add(itemId);

        if (item?.type !== "message") return;

        if (item.role === "user") {
          const text = (item.content || [])
            .map((c: any) => {
              if (c?.type === "input_text") return c.text || "";
              if (c?.type === "input_audio") return c.transcript || "";
              return "";
            })
            .join("")
            .trim();

          if (!text) return;

          setConversation((prev) => [
            ...prev,
            { role: "user", content: text, timestamp: Date.now() },
          ]);
          return;
        }

        if (item.role === "assistant") {
          const text = (item.content || [])
            .map((c: any) => {
              if (c?.type === "output_text") return c.text || "";
              if (c?.type === "output_audio") return c.transcript || "";
              return "";
            })
            .join("")
            .trim();

          if (!text) return;

          setConversation((prev) => [
            ...prev,
            { role: "assistant", content: text, timestamp: Date.now() },
          ]);

          if (canUseTTSForCurrentVoice) {
            playTTSAudio(text);
          }
        }
      });

      // Realtime audio state (for Marin/Cedar or if TTS is disabled)
      s.on("audio_start" as any, () => {
        sawAudioRef.current = true;
        setIsSpeaking(true);
      });

      s.on("audio_stopped" as any, () => {
        setIsSpeaking(false);
      });

      sessionRef.current = session;
    } catch (error) {
      console.error("Error initializing agent:", error);
      setError("Failed to initialize agent");
    }
  };

  const handleConnect = async () => {
    setError(null);
    
    if (!agentRef.current) {
      await initializeAgent();
    }

    if (!sessionRef.current) {
      setError("Failed to create session");
      return;
    }

    try {
      const tokenResponse = await fetch("/api/voice/token", {
        method: "POST",
      });

      if (!tokenResponse.ok) {
        const errorData = await tokenResponse.json();
        throw new Error(errorData.error || "Failed to get token");
      }

      const { token } = await tokenResponse.json();

      if (!token) {
        throw new Error("No token received");
      }

      await sessionRef.current.connect({ apiKey: token });
      setIsConnected(true);
      setError(null);
      welcomeSentRef.current = false;
      // Unmute mic by default (WebRTC transport manages the actual stream)
      try {
        sessionRef.current.mute(false);
        setIsListening(true);
      } catch {
        // ignore
      }
      
      setTimeout(() => {
        if (!welcomeSentRef.current && sessionRef.current) {
          welcomeSentRef.current = true;
          const welcomeText = `welcome to Alexander's porfolio! feel free to ask anything about Alex!`;
          
          setConversation([
            {
              role: "assistant",
              content: welcomeText,
              timestamp: Date.now(),
            },
          ]);
          
          const realtimeOnlyVoices = ["marin", "cedar"];
          if (realtimeOnlyVoices.includes(voice)) {
            playTTSAudio(welcomeText, "alloy");
          } else {
            playTTSAudio(welcomeText);
          }
        }
      }, 1000);
    } catch (error: any) {
      console.error("Error connecting:", error);
      setError(error.message || "Failed to connect. Please check your OpenAI API key.");
    }
  };

  const handleDisconnect = async () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    
    if (sessionRef.current) {
      try {
        const session = sessionRef.current as any;
        if (typeof session.close === "function") {
          await session.close();
        } else if (typeof session.disconnect === "function") {
          await session.disconnect();
        } else if (session.transport && typeof session.transport.close === "function") {
          await session.transport.close();
        }
      } catch (error) {
        console.error("Error disconnecting:", error);
      }
      sessionRef.current = null;
      agentRef.current = null;
    }
    setIsConnected(false);
    setIsListening(false);
    setIsSpeaking(false);
    setTranscript("");
    setResponse("");
    setConversation([]);
    currentUserMessageRef.current = "";
    currentAssistantMessageRef.current = "";
    sawAudioRef.current = false;
    welcomeSentRef.current = false;
    setError(null);
  };

  const handleTextSubmit = async () => {
    if (!sessionRef.current || !textInput.trim() || !isConnected) {
      setError("Please connect first");
      return;
    }

    try {
      setError(null);
      const message = textInput.trim();

      setResponse("");
      currentAssistantMessageRef.current = "";
      sessionRef.current.sendMessage(message);
      setTextInput("");
    } catch (error: any) {
      console.error("Error sending message:", error);
      setError(error.message || "Failed to send message");
    }
  };

  const toggleMic = async () => {
    if (!sessionRef.current || !isConnected) {
      setError("Please connect first");
      return;
    }

    try {
      setError(null);

      // In the WebRTC transport, mic is managed automatically; we can mute/unmute.
      if (isListening) {
        sessionRef.current.mute(true);
        setIsListening(false);
      } else {
        sessionRef.current.mute(false);
        setIsListening(true);
      }
    } catch (error: any) {
      console.error("Error toggling mic:", error);
      setError("Microphone is automatically active when connected. Just speak!");
    }
  };

  const allMessages = [
    ...conversation,
    ...(transcript ? [{ role: "user" as const, content: transcript, timestamp: Date.now() }] : []),
    ...(response ? [{ role: "assistant" as const, content: response, timestamp: Date.now() }] : []),
  ];

  return (
    <>
      <BackgroundDots isSpeaking={isSpeaking} />
      {allMessages.length > 0 && (
        <div className="fixed top-20 right-4 z-50 max-w-sm">
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="glass-card"
              style={{
                maxHeight: "400px",
                overflowY: "auto",
                overflowX: "hidden",
                padding: "16px",
                fontSize: "12px",
                backdropFilter: "blur(10px)",
                backgroundColor: "rgba(0, 0, 0, 0.7)",
                border: "1px solid rgba(0, 255, 65, 0.4)",
                borderRadius: "12px",
                scrollbarWidth: "thin",
                scrollbarColor: "rgba(0, 255, 65, 0.3) transparent",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {allMessages.map((msg, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: idx * 0.05 }}
                    style={{
                      color: msg.role === "user" ? "rgba(255, 255, 255, 0.9)" : "rgba(0, 255, 65, 0.9)",
                    }}
                  >
                    <div style={{ fontSize: "11px", fontWeight: 600, marginBottom: "4px", opacity: 0.8 }}>
                      {msg.role === "user" ? "You" : "AI"}:
                    </div>
                    <div style={{ fontSize: "13px", whiteSpace: "pre-wrap", wordBreak: "break-word", lineHeight: "1.4" }}>
                      {msg.content}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      )}
      <div className="fixed bottom-4 right-4 z-40">
        {!isOpen ? (
          <NeonButton
            glow
            isIconOnly
            onPress={() => setIsOpen(true)}
            className="rounded-full w-14 h-14"
          >
            🎤
          </NeonButton>
        ) : (
          <GlassCard hover={false} glow={false} className="w-80 max-h-96">
            <div className="p-4 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Ask Alex</h3>
                <Button
                  size="sm"
                  variant="light"
                  isIconOnly
                  onPress={() => {
                    setIsOpen(false);
                    if (isConnected) {
                      handleDisconnect();
                    }
                  }}
                >
                  ✕
                </Button>
              </div>

              {error && (
                <div className="text-sm text-danger bg-danger/10 p-2 rounded">
                  {error}
                </div>
              )}

              {!isConnected ? (
                <div className="space-y-3">
                  <p className="text-sm text-default-500">
                    Connect to start asking questions about the portfolio
                  </p>
                  <NeonButton
                    glow
                    onPress={handleConnect}
                    className="w-full"
                    size="sm"
                  >
                    Connect
                  </NeonButton>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      size="sm"
                      placeholder="Ask a question..."
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          handleTextSubmit();
                        }
                      }}
                      className="flex-1"
                    />
                    <Button
                      size="sm"
                      variant="flat"
                      onPress={handleTextSubmit}
                      isDisabled={!textInput.trim()}
                    >
                      Send
                    </Button>
                  </div>

                  <div className="flex gap-2">
                    <NeonButton
                      size="sm"
                      variant={isListening ? "solid" : "bordered"}
                      glow={isListening}
                      onPress={toggleMic}
                      className="flex-1"
                    >
                      {isListening ? "🎤 Listening..." : "🎤 Use Mic"}
                    </NeonButton>
                    <Button
                      size="sm"
                      variant="light"
                      onPress={handleDisconnect}
                    >
                      Disconnect
                    </Button>
                  </div>

                  {(transcript || response) && (
                    <div className="space-y-2 max-h-48 overflow-y-auto text-sm">
                      {transcript && (
                        <div>
                          <p className="text-default-500 text-xs mb-1">You:</p>
                          <p className="text-foreground">{transcript}</p>
                        </div>
                      )}
                      {response && (
                        <div>
                          <p className="text-primary text-xs mb-1">AI:</p>
                          <p className="text-foreground whitespace-pre-wrap">
                            {response}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </GlassCard>
        )}
      </div>
    </>
  );
}
