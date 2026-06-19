"use client";

import { useState, useEffect, useRef, useCallback } from "react";

// ============================================================
// 🔐  CONFIGURATION — SWAP IN YOUR REAL DATES HERE
// ============================================================
const SECURITY_PROMPTS = [
  {
    id: "target_dob",
    label: "TARGET'S DATE OF BIRTH",
    placeholder: "DD/MM/YYYY",
    // ⬇️  Her birthdate — CHANGE THIS
    answer: "20/06/2008",
  },
  {
    id: "creator_dob",
    label: "AUTHORIZATION REQUIRED: ENTER CREATOR'S DATE OF BIRTH",
    placeholder: "DD/MM/YYYY",
    // ⬇️  Your birthdate — CHANGE THIS
    answer: "11/08/2007",
  },
  {
    id: "anniversary",
    label: "FINAL SECURITY KEY: ENTER ANNIVERSARY DATE",
    placeholder: "DD/MM/YYYY",
    // ⬇️  Your anniversary — CHANGE THIS
    answer: "12/03/2025",
  },
];

// ============================================================
// 🎁  BIRTHDAY MESSAGE — CUSTOMIZE THIS
// ============================================================
const BIRTHDAY_NAME = "Nithya";
const BIRTHDAY_MESSAGE = `Happy Birthday My Love, hate that we have 1800 kms between us today, but you are absolutely worth every single one of them. 

I can't wait for the day when our biggest problem is just figuring out what to order for dinner while we watch a movie. 

Have the best day ever, I miss you so much and I am so lucky to be yours. ❤️`;

// ============================================================
// DECRYPTION SEQUENCE LINES
// ============================================================
const DECRYPTION_LINES = [
  { text: "> INITIATING SECURE HANDSHAKE...", delay: 600 },
  { text: "> BYPASSING FIREWALL [████████████] 100%", delay: 900 },
  { text: "> DECRYPTING PAYLOAD WITH AES-256...", delay: 800 },
  { text: "> VERIFYING BIOMETRIC SIGNATURE...", delay: 700 },
  { text: "> LOADING ENCRYPTED MEMORIES...", delay: 600 },
  { text: "> RECONSTRUCTING EMOTIONAL PAYLOAD...", delay: 800 },
  { text: "> ALL SYSTEMS GREEN.", delay: 500 },
  { text: "", delay: 300 },
  { text: "> ACCESS GRANTED.", delay: 1000 },
  { text: "> DEPLOYING BIRTHDAY PROTOCOL... 🎂", delay: 1200 },
];

// ============================================================
// BOOT SEQUENCE LINES
// ============================================================
const BOOT_LINES = [
  "╔══════════════════════════════════════════════════╗",
  "║     M I D N I G H T   D E C R Y P T I O N       ║",
  "║                  V A U L T  v3.1.4               ║",
  "╚══════════════════════════════════════════════════╝",
  "",
  "SYSTEM BOOT SEQUENCE INITIATED...",
  "LOADING ENCRYPTION MODULES... OK",
  "INITIALIZING SECURE CHANNEL... OK",
  "THREAT LEVEL: ██████████ MAXIMUM",
  "",
  "⚠  THIS TERMINAL CONTAINS A CLASSIFIED PAYLOAD.",
  "⚠  UNAUTHORIZED ACCESS WILL BE LOGGED & REPORTED.",
  "",
  "IDENTITY VERIFICATION REQUIRED.",
  "PLEASE ANSWER THE FOLLOWING SECURITY PROMPTS.",
  "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
  "",
];

// ============================================================
// HELPER: normalize date input for flexible comparison
// ============================================================
function normalizeDate(input: string): string {
  let s = input.trim().replace(/\s+/g, "");
  // Accept common separators: - . / and normalize to /
  s = s.replace(/[-.\s]/g, "/");
  return s.toLowerCase();
}

function datesMatch(input: string, answer: string): boolean {
  const a = normalizeDate(input);
  const b = normalizeDate(answer);
  if (a === b) return true;

  // Also try matching without leading zeros
  const stripLeadingZeros = (d: string) =>
    d
      .split("/")
      .map((part) => String(parseInt(part, 10)))
      .join("/");

  return stripLeadingZeros(a) === stripLeadingZeros(b);
}

// ============================================================
// FLOATING PARTICLE DATA (deterministic to avoid hydration mismatch)
// ============================================================
const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  emoji: ["❤️", "✨", "🎂", "💖", "🌸", "💫", "🎁", "🥂"][i % 8],
  left: `${(i * 5.27 + 3.14) % 100}%`,
  top: `${(i * 7.89 + 11.3) % 100}%`,
  delay: `${(i * 0.37) % 4}s`,
  duration: `${3 + (i * 0.53) % 4}s`,
  opacity: 0.3 + ((i * 0.17) % 0.4),
}));

// ============================================================
// MAIN COMPONENT
// ============================================================
type HistoryLine = {
  type: "system" | "input" | "error" | "success";
  text: string;
};

export default function MidnightVault() {
  const [phase, setPhase] = useState<"vault" | "decrypting" | "payload">(
    "vault"
  );
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [terminalHistory, setTerminalHistory] = useState<HistoryLine[]>([]);
  const [error, setError] = useState("");
  const [decryptionLines, setDecryptionLines] = useState<string[]>([]);
  const [showPayload, setShowPayload] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [bootComplete, setBootComplete] = useState(false);
  const [giftOpened, setGiftOpened] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  // ── Boot sequence ──────────────────────────────────────────
  useEffect(() => {
    // Reset state so strict-mode remount starts fresh
    setTerminalHistory([]);
    setBootComplete(false);

    let i = 0;
    const timer = setInterval(() => {
      if (i < BOOT_LINES.length) {
        setTerminalHistory((prev) => [
          ...prev,
          { type: "system" as const, text: BOOT_LINES[i] },
        ]);
        i++;
      } else {
        clearInterval(timer);
        setTerminalHistory((prev) => [
          ...prev,
          {
            type: "system" as const,
            text: `[PROMPT 1/${SECURITY_PROMPTS.length}] ${SECURITY_PROMPTS[0].label} (${SECURITY_PROMPTS[0].placeholder}):`,
          },
        ]);
        setBootComplete(true);
      }
    }, 70);

    return () => clearInterval(timer);
  }, []);

  // ── Auto-scroll terminal ──────────────────────────────────
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalHistory, decryptionLines]);

  // ── Focus input once boot completes ───────────────────────
  useEffect(() => {
    if (phase === "vault" && bootComplete) {
      // Short delay so mobile keyboards open reliably
      const t = setTimeout(() => inputRef.current?.focus(), 200);
      return () => clearTimeout(t);
    }
  }, [phase, bootComplete, currentPromptIndex]);

  // ── Decryption sequence ───────────────────────────────────
  const startDecryption = useCallback(() => {
    setPhase("decrypting");
    let totalDelay = 0;

    DECRYPTION_LINES.forEach((line, idx) => {
      totalDelay += line.delay;
      setTimeout(() => {
        setDecryptionLines((prev) => [...prev, line.text]);
      }, totalDelay);

      if (idx === DECRYPTION_LINES.length - 1) {
        setTimeout(() => {
          setPhase("payload");
          setTimeout(() => {
            setShowPayload(true);
            setTimeout(() => setShowConfetti(true), 500);
          }, 300);
        }, totalDelay + 1500);
      }
    });
  }, []);

  // ── Handle submit ─────────────────────────────────────────
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const currentPrompt = SECURITY_PROMPTS[currentPromptIndex];

    // Add user input to history
    setTerminalHistory((prev) => [
      ...prev,
      { type: "input" as const, text: `> ${inputValue}` },
    ]);

    if (datesMatch(inputValue, currentPrompt.answer)) {
      setError("");
      setTerminalHistory((prev) => [
        ...prev,
        {
          type: "success" as const,
          text: `✓ VERIFIED. SECURITY LAYER ${currentPromptIndex + 1} CLEARED.`,
        },
      ]);

      const nextIndex = currentPromptIndex + 1;

      if (nextIndex >= SECURITY_PROMPTS.length) {
        setTerminalHistory((prev) => [
          ...prev,
          { type: "system" as const, text: "" },
          {
            type: "success" as const,
            text: "★ ALL SECURITY LAYERS CLEARED. INITIATING DECRYPTION...",
          },
        ]);
        setTimeout(startDecryption, 1500);
      } else {
        setCurrentPromptIndex(nextIndex);
        setTerminalHistory((prev) => [
          ...prev,
          { type: "system" as const, text: "" },
          {
            type: "system" as const,
            text: `[PROMPT ${nextIndex + 1}/${SECURITY_PROMPTS.length}] ${SECURITY_PROMPTS[nextIndex].label} (${SECURITY_PROMPTS[nextIndex].placeholder}):`,
          },
        ]);
      }
    } else {
      setError("ACCESS DENIED");
      setTerminalHistory((prev) => [
        ...prev,
        {
          type: "error" as const,
          text: "✗ ACCESS DENIED. INCORRECT CREDENTIALS. TRY AGAIN.",
        },
        {
          type: "system" as const,
          text: `[PROMPT ${currentPromptIndex + 1}/${SECURITY_PROMPTS.length}] ${currentPrompt.label} (${currentPrompt.placeholder}):`,
        },
      ]);
      setTimeout(() => setError(""), 1500);
    }

    setInputValue("");
  };

  // ================================================================
  //  PHASE 1  — THE VAULT (Terminal Interface)
  // ================================================================
  if (phase === "vault") {
    return (
      <div className="min-h-dvh bg-black flex flex-col font-mono relative overflow-hidden terminal-select animate-crt">
        {/* CRT scanline overlay */}
        <div
          className="pointer-events-none fixed inset-0 z-50 opacity-[0.04]"
          style={{
            background:
              "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,0,0.04) 2px, rgba(0,255,0,0.04) 4px)",
          }}
        />

        {/* CRT vignette */}
        <div
          className="pointer-events-none fixed inset-0 z-40"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.7) 100%)",
          }}
        />

        {/* ── Header bar ── */}
        <div className="border-b border-green-900/50 px-3 py-2 sm:px-4 flex items-center justify-between shrink-0 z-10">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-500/80" />
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-yellow-500/80" />
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-500/80" />
          </div>
          <span
            className="text-green-600 text-[9px] sm:text-xs tracking-[0.15em] sm:tracking-widest"
            style={{ textShadow: "0 0 6px rgba(34,197,94,0.3)" }}
          >
            MIDNIGHT-VAULT://SECURE
          </span>
          <div className="flex items-center gap-1">
            <span className="inline-block w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-500 animate-pulse" />
            <span
              className="text-green-500 text-[9px] sm:text-xs"
              style={{ textShadow: "0 0 6px rgba(34,197,94,0.5)" }}
            >
              LIVE
            </span>
          </div>
        </div>

        {/* ── Terminal output ── */}
        <div
          ref={terminalRef}
          className="flex-1 overflow-y-auto px-3 py-3 sm:px-6 sm:py-4 space-y-0.5 z-10 scrollbar-hide"
          onClick={() => inputRef.current?.focus()}
        >
          {terminalHistory.map((line, i) => (
            <div
              key={i}
              className={`text-[11px] sm:text-sm leading-relaxed whitespace-pre-wrap break-all transition-colors ${
                line.type === "error"
                  ? "text-red-500"
                  : line.type === "success"
                    ? "text-emerald-400"
                    : line.type === "input"
                      ? "text-cyan-400"
                      : "text-green-500"
              }`}
              style={{
                textShadow:
                  line.type === "error"
                    ? "0 0 10px rgba(239,68,68,0.7)"
                    : line.type === "success"
                      ? "0 0 10px rgba(52,211,153,0.7)"
                      : line.type === "input"
                        ? "0 0 8px rgba(34,211,238,0.5)"
                        : "0 0 8px rgba(34,197,94,0.5)",
              }}
            >
              {line.text || "\u00A0"}
            </div>
          ))}

          {/* Blinking cursor at end of history */}
          <div className="flex items-center h-5">
            <span
              className="inline-block w-2 h-[14px] sm:h-4 bg-green-500 animate-pulse"
              style={{ filter: "drop-shadow(0 0 6px rgba(34,197,94,0.8))" }}
            />
          </div>
        </div>

        {/* ── Input area ── */}
        <div className="border-t border-green-900/50 px-3 py-3 sm:px-6 sm:py-4 shrink-0 z-10">
          {error && (
            <div
              className="text-red-500 text-[11px] sm:text-sm mb-2 animate-pulse font-bold tracking-wider"
              style={{ textShadow: "0 0 14px rgba(239,68,68,0.9)" }}
            >
              ⚠ {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <span
              className="text-green-500 text-sm sm:text-base shrink-0 font-bold"
              style={{ textShadow: "0 0 8px rgba(34,197,94,0.6)" }}
            >
              &gt;
            </span>
            <input
              ref={inputRef}
              type="text"
              inputMode="numeric"
              value={inputValue}
              onChange={(e) => {
                let val = e.target.value.replace(/[^\d]/g, "");
                if (val.length > 8) val = val.substring(0, 8);
                if (val.length >= 5) {
                  val = val.substring(0, 2) + "/" + val.substring(2, 4) + "/" + val.substring(4);
                } else if (val.length >= 3) {
                  val = val.substring(0, 2) + "/" + val.substring(2);
                }
                setInputValue(val);
              }}
              placeholder={
                SECURITY_PROMPTS[currentPromptIndex]?.placeholder ?? ""
              }
              className="flex-1 bg-transparent text-green-400 text-xs sm:text-sm outline-none
                         placeholder-green-800/60 caret-green-500
                         border-none focus:ring-0 focus:outline-none"
              style={{ textShadow: "0 0 6px rgba(34,197,94,0.5)" }}
              autoComplete="off"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
            />
            <button
              type="submit"
              className="text-green-500 border border-green-700/60 px-2.5 py-1 sm:px-3.5 sm:py-1.5
                         text-[10px] sm:text-xs tracking-wider
                         hover:bg-green-900/30 hover:border-green-600
                         active:bg-green-900/50 transition-all duration-200
                         focus:outline-none focus:ring-1 focus:ring-green-600/50"
              style={{ textShadow: "0 0 8px rgba(34,197,94,0.5)" }}
            >
              ENTER
            </button>
          </form>
        </div>

        {/* ── Status bar ── */}
        <div className="border-t border-green-900/30 px-3 py-1 sm:px-4 sm:py-1.5 flex items-center justify-between text-[8px] sm:text-[10px] text-green-700/80 shrink-0 z-10 tracking-wider">
          <span>
            LAYER {currentPromptIndex + 1}/{SECURITY_PROMPTS.length}
          </span>
          <span>AES-256-GCM</span>
          <span className="hidden sm:inline">AWAITING INPUT</span>
        </div>
      </div>
    );
  }

  // ================================================================
  //  PHASE 2  — DECRYPTION SEQUENCE
  // ================================================================
  if (phase === "decrypting") {
    return (
      <div className="min-h-dvh bg-black flex flex-col items-center justify-center font-mono p-4 sm:p-6 relative overflow-hidden">
        {/* Background radial pulse */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="w-[280px] h-[280px] sm:w-[500px] sm:h-[500px] rounded-full opacity-10 animate-ping"
            style={{
              background:
                "radial-gradient(circle, rgba(34,197,94,0.3) 0%, transparent 70%)",
              animationDuration: "3s",
            }}
          />
        </div>

        {/* Lock icon */}
        <div className="mb-6 sm:mb-8 relative z-10">
          <svg
            className="w-12 h-12 sm:w-16 sm:h-16 text-green-500 animate-pulse"
            style={{ filter: "drop-shadow(0 0 14px rgba(34,197,94,0.6))" }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>

        {/* Decryption output lines */}
        <div className="w-full max-w-lg space-y-2 relative z-10">
          {decryptionLines.map((line, i) => (
            <div
              key={i}
              className={`text-xs sm:text-sm animate-fadeSlideIn ${
                line.includes("ACCESS GRANTED")
                  ? "text-emerald-400 font-bold text-sm sm:text-lg"
                  : line.includes("BIRTHDAY PROTOCOL")
                    ? "text-yellow-400 font-bold"
                    : "text-green-500"
              }`}
              style={{
                textShadow: line.includes("ACCESS GRANTED")
                  ? "0 0 24px rgba(52,211,153,0.8)"
                  : "0 0 8px rgba(34,197,94,0.5)",
              }}
            >
              {line || "\u00A0"}
            </div>
          ))}

          {/* Blinking cursor while decrypting */}
          {decryptionLines.length < DECRYPTION_LINES.length && (
            <span
              className="inline-block w-2 h-4 sm:h-5 bg-green-500 animate-pulse mt-1"
              style={{ filter: "drop-shadow(0 0 6px rgba(34,197,94,0.8))" }}
            />
          )}
        </div>

        {/* Progress bar */}
        <div className="mt-8 sm:mt-10 w-full max-w-lg relative z-10">
          <div className="h-1 bg-green-900/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-600 to-emerald-400 rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${(decryptionLines.length / DECRYPTION_LINES.length) * 100}%`,
                boxShadow: "0 0 12px rgba(34,197,94,0.6)",
              }}
            />
          </div>
          <p
            className="text-green-700 text-[10px] sm:text-xs mt-2 text-center tracking-[0.2em]"
            style={{ textShadow: "0 0 6px rgba(34,197,94,0.3)" }}
          >
            DECRYPTING...{" "}
            {Math.round(
              (decryptionLines.length / DECRYPTION_LINES.length) * 100
            )}
            %
          </p>
        </div>
      </div>
    );
  }

  // ================================================================
  //  PHASE 3  — THE PAYLOAD (Birthday Reveal)
  // ================================================================
  return (
    <div
      className={`min-h-dvh transition-all duration-1000 ease-out relative overflow-hidden payload-select ${
        showPayload ? "opacity-100" : "opacity-0"
      }`}
      style={{
        background:
          "linear-gradient(135deg, #fdf2f8 0%, #fce7f3 25%, #fbcfe8 50%, #fdf2f8 100%)",
      }}
    >
      {/* ── Floating emoji particles ── */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          {PARTICLES.map((p, i) => (
            <div
              key={i}
              className="absolute text-lg sm:text-2xl animate-float"
              style={{
                left: p.left,
                top: p.top,
                animationDelay: p.delay,
                animationDuration: p.duration,
                opacity: p.opacity,
              }}
            >
              {p.emoji}
            </div>
          ))}
        </div>
      )}

      {/* ── Soft background glow orbs ── */}
      <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-pink-200/40 blur-3xl animate-gentlePulse" />
      <div className="absolute bottom-[-15%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-rose-200/30 blur-3xl animate-gentlePulse" />
      <div className="absolute top-[40%] left-[30%] w-[30vw] h-[30vw] rounded-full bg-fuchsia-100/20 blur-3xl animate-gentlePulse" />

      {/* ── Main content ── */}
      <div className="relative z-10 min-h-dvh flex flex-col items-center justify-center px-5 py-10 sm:px-8 sm:py-16">
        {/* Declassified stamp */}
        <div
          className="mb-4 sm:mb-6 px-4 py-1.5 sm:px-6 sm:py-2 border-2 border-rose-400/50 rounded-md
                      transform -rotate-2 animate-fadeSlideIn"
        >
          <span className="text-rose-500 text-[9px] sm:text-xs font-mono tracking-[0.25em] uppercase">
            ★ Classified Payload Decrypted ★
          </span>
        </div>

        {/* Birthday heading */}
        <h1
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-transparent bg-clip-text
                     bg-gradient-to-r from-rose-500 via-pink-500 to-fuchsia-500
                     mb-2 sm:mb-3 text-center leading-tight"
          style={{
            fontFamily: "'Georgia', 'Times New Roman', serif",
            animation: "fadeSlideIn 1s ease-out 0.2s both",
          }}
        >
          Happy Birthday
        </h1>

        <h2
          className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-rose-400 mb-6 sm:mb-10 text-center"
          style={{
            fontFamily: "'Georgia', 'Times New Roman', serif",
            animation: "fadeSlideIn 1s ease-out 0.4s both",
          }}
        >
          {BIRTHDAY_NAME} 💕
        </h2>

        {/* ── Message card ── */}
        <div
          className="max-w-md sm:max-w-lg w-full mx-auto"
          style={{ animation: "fadeSlideIn 1s ease-out 0.6s both" }}
        >
          <div
            className="bg-white/65 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10
                        shadow-[0_8px_40px_rgba(244,114,182,0.15)] border border-white/80"
          >
            {/* Envelope icon */}
            <div className="flex justify-center mb-4 sm:mb-5 text-3xl sm:text-4xl">
              💌
            </div>

            {/* The message */}
            <p
              className="text-gray-700 text-sm sm:text-base leading-relaxed sm:leading-loose
                         text-center whitespace-pre-line"
              style={{
                fontFamily: "'Georgia', 'Times New Roman', serif",
              }}
            >
              {BIRTHDAY_MESSAGE}
            </p>

            {/* Divider */}
            <div className="my-5 sm:my-6 flex items-center gap-3">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-pink-300 to-transparent" />
              <span className="text-pink-400 text-sm">❤️</span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-pink-300 to-transparent" />
            </div>

            {/* Gift tease */}
            <div className="text-center">
              <p
                className="text-rose-400 text-xs sm:text-sm italic"
                style={{
                  fontFamily: "'Georgia', 'Times New Roman', serif",
                }}
              >
                Your gift awaits... 🎁
              </p>
            </div>
          </div>
        </div>

        {/* ── Gift card ── */}
        <div
          className="mt-8 sm:mt-12 text-center max-w-sm w-full mx-auto"
          style={{ animation: "fadeSlideIn 1s ease-out 1s both" }}
        >
          <div
            onClick={() => setGiftOpened(true)}
            className="bg-white/45 backdrop-blur-lg rounded-2xl p-5 sm:p-6
                        border border-white/60 shadow-lg cursor-pointer hover:bg-white/60 transition-colors duration-300"
          >
            <div className={`text-4xl sm:text-5xl mb-3 ${!giftOpened ? 'animate-bounce' : 'scale-110 transition-transform'}`}>
              {giftOpened ? '💌' : '🎁'}
            </div>
            <p
              className="text-gray-600 text-lg sm:text-xl font-medium leading-relaxed mb-2"
              style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
            >
              I love you ∞
            </p>
            {giftOpened && (
              <p
                className="text-pink-500 text-sm sm:text-base italic leading-relaxed animate-fadeSlideIn mt-3"
                style={{ fontFamily: "'Georgia', 'Times New Roman', serif", animationDuration: "0.5s" }}
              >
                "You can ask me anything you want today"
              </p>
            )}
            {!giftOpened && (
              <p className="text-rose-400/70 text-[10px] sm:text-xs mt-2 animate-pulse uppercase tracking-wider">Tap to open</p>
            )}
          </div>
        </div>

        {/* ── Footer ── */}
        <div
          className="mt-10 sm:mt-14 text-center"
          style={{ animation: "fadeSlideIn 1s ease-out 1.2s both" }}
        >
          <p className="text-rose-300/80 text-[9px] sm:text-xs font-mono tracking-[0.2em] uppercase">
            Encrypted with love • Decrypted by you
          </p>
        </div>
      </div>
    </div>
  );
}
