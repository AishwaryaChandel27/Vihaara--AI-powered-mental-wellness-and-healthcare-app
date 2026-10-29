import { useEffect, useRef, useState } from "react";
import {
  Pause,
  Play,
  RotateCcw,
  Volume2,
  VolumeX,
  Waves,
  CloudRain,
  Wind,
  Check,
} from "lucide-react";
const grounding = [
  {
    count: 5,
    sense: "things you can see",
    prompt: "Let your eyes rest on colours, shapes, and small details.",
  },
  {
    count: 4,
    sense: "things you can feel",
    prompt:
      "Notice textures or points of contact: a sleeve, a chair, the floor.",
  },
  {
    count: 3,
    sense: "things you can hear",
    prompt: "A nearby sound or a distant one. Silence can count, too.",
  },
  {
    count: 2,
    sense: "things you can smell",
    prompt: "Notice a familiar scent, or imagine one you find pleasant.",
  },
  {
    count: 1,
    sense: "thing you can taste",
    prompt:
      "Notice a taste, or imagine a favourite one. Skip anything uncomfortable.",
  },
];
export default function QuietRoom() {
  const [running, setRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [duration, setDuration] = useState(60);
  const [step, setStep] = useState(0);
  const [sound, setSound] = useState("rain");
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(20);
  const [audioError, setAudioError] = useState("");
  const audio = useRef<AudioContext | null>(null);
  const gain = useRef<GainNode | null>(null);
  const phase = seconds % 10 < 5 ? "Breathe in" : "Breathe out";
  useEffect(() => {
    if (!running) return;
    let previous = performance.now();
    const timer = window.setInterval(() => {
      const now = performance.now();
      const elapsed = Math.floor((now - previous) / 1000);
      if (elapsed > 0) {
        previous += elapsed * 1000;
        setSeconds((s) => Math.min(duration, s + elapsed));
      }
    }, 250);
    return () => clearInterval(timer);
  }, [running, duration]);
  useEffect(() => {
    if (seconds >= duration) setRunning(false);
  }, [seconds, duration]);
  useEffect(() => {
    const pause = () => {
      if (document.hidden) {
        setRunning(false);
        setPlaying(false);
      }
    };
    document.addEventListener("visibilitychange", pause);
    return () => document.removeEventListener("visibilitychange", pause);
  }, []);
  useEffect(() => {
    if (!playing) return;
    let ctx: AudioContext;
    try {
      ctx = new AudioContext();
      audio.current = ctx;
      const buffer = ctx.createBuffer(1, ctx.sampleRate * 4, ctx.sampleRate);
      const channel = buffer.getChannelData(0);
      let previous = 0;
      for (let i = 0; i < channel.length; i++) {
        const white = Math.random() * 2 - 1;
        previous = (previous + 0.02 * white) / 1.02;
        channel[i] = sound === "rain" ? white * 0.35 : previous * 3.5;
      }
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value =
        sound === "rain" ? 1600 : sound === "waves" ? 450 : 800;
      const master = ctx.createGain();
      master.gain.value = 0;
      gain.current = master;
      master.gain.setTargetAtTime((volume / 100) * 0.4, ctx.currentTime, 0.3);
      source.connect(filter);
      filter.connect(master);
      master.connect(ctx.destination);
      source.start();
      if (sound === "waves") {
        const lfo = ctx.createOscillator();
        const depth = ctx.createGain();
        lfo.frequency.value = 0.12;
        depth.gain.value = 180;
        lfo.connect(depth);
        depth.connect(filter.frequency);
        lfo.start();
      }
      void ctx.resume().catch(() => {
        setAudioError("Audio could not start in this browser.");
        setPlaying(false);
      });
    } catch {
      setAudioError("Audio is not available in this browser.");
      setPlaying(false);
      return;
    }
    return () => {
      gain.current = null;
      audio.current = null;
      void ctx.close();
    };
    // Volume is adjusted separately, without restarting the sound.
  }, [playing, sound]);
  useEffect(() => {
    if (gain.current && audio.current)
      gain.current.gain.setTargetAtTime(
        (volume / 100) * 0.4,
        audio.current.currentTime,
        0.15,
      );
  }, [volume]);
  const completed = seconds >= duration;
  return (
    <div className="quiet-tools">
      <section className="breathing-space">
        <p className="eyebrow">A BREATHING SPACE</p>
        <h2>Nothing to do. Just arrive.</h2>
        <p className="supporting-copy">
          Follow gently, or simply watch. Your natural pace is enough.
        </p>
        <div className={`breath-stage ${running ? "breathing-active" : ""}`}>
          <div className="breath-halo halo-two" />
          <div className="breath-halo halo-one" />
          <div
            className={`breath-orb ${running && phase === "Breathe in" ? "inhale" : ""}`}
          >
            <span>
              {completed
                ? "A little more space."
                : running
                  ? phase
                  : seconds
                    ? "Take your time"
                    : "Begin where you are"}
            </span>
            <small>
              {completed
                ? "You can stay a while."
                : running
                  ? `${5 - (seconds % 5)} · gently`
                  : "No breath holds. No pressure."}
            </small>
          </div>
        </div>
        <div className="breath-controls">
          <label className="sr-only" htmlFor="session-duration">
            Breathing session duration
          </label>
          <select
            id="session-duration"
            value={duration}
            disabled={running}
            onChange={(e) => {
              setDuration(Number(e.target.value));
              setSeconds(0);
            }}
          >
            <option value={60}>1 minute</option>
            <option value={180}>3 minutes</option>
            <option value={300}>5 minutes</option>
          </select>
          <button
            className="primary-link"
            onClick={() => {
              if (completed) setSeconds(0);
              setRunning(!running);
            }}
          >
            {running ? <Pause size={16} /> : <Play size={16} />}{" "}
            {running
              ? "Pause"
              : completed
                ? "Begin again"
                : seconds
                  ? "Resume"
                  : "Begin breathing"}
          </button>
          <button
            className="round-control"
            aria-label="Reset breathing session"
            onClick={() => {
              setRunning(false);
              setSeconds(0);
            }}
          >
            <RotateCcw size={17} />
          </button>
        </div>
        <p className="session-time" role="status">
          {Math.floor((duration - seconds) / 60)}:
          {String((duration - seconds) % 60).padStart(2, "0")} remaining{" "}
          {completed && "· Session complete"}
        </p>
        <p className="practice-note">
          Breathe comfortably without forcing it. Stop if you feel dizzy or
          uncomfortable.
        </p>
      </section>
      <div className="quiet-side">
        <section className="sound-card">
          <div className="section-top">
            <p className="eyebrow">SET THE ATMOSPHERE</p>
            <Volume2 size={17} />
          </div>
          <h2>A softer background</h2>
          <p className="supporting-copy">Sounds made here, on your device.</p>
          <div className="sound-options">
            {[
              { id: "rain", name: "Soft rain", icon: CloudRain },
              { id: "waves", name: "Shoreline", icon: Waves },
              { id: "wind", name: "Low breeze", icon: Wind },
            ].map(({ id, name, icon: Icon }) => (
              <button
                key={id}
                aria-pressed={sound === id}
                onClick={() => setSound(id)}
                className={sound === id ? "selected" : ""}
              >
                <Icon size={21} />
                <span>{name}</span>
              </button>
            ))}
          </div>
          <div className="sound-volume">
            <button
              className="round-control"
              aria-label={playing ? "Stop ambient sound" : "Play ambient sound"}
              onClick={() => {
                setAudioError("");
                setPlaying(!playing);
              }}
            >
              {playing ? <VolumeX size={18} /> : <Play size={18} />}
            </button>
            <label className="sr-only" htmlFor="ambient-volume">
              Ambient sound volume
            </label>
            <input
              id="ambient-volume"
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
            />
            <span>{volume}%</span>
          </div>
          <p className="practice-note" role="status">
            {audioError ||
              (playing
                ? "Playing · pauses when you leave this screen"
                : "Sound is off. Start softly.")}
          </p>
        </section>
        <section className="grounding-card">
          <p className="eyebrow">COME BACK TO THE ROOM</p>
          <h2>The senses trail</h2>
          {step < 5 ? (
            <>
              <div className="grounding-prompt">
                <span>{grounding[step].count}</span>
                <div>
                  <h3>{grounding[step].sense}</h3>
                  <p>{grounding[step].prompt}</p>
                </div>
              </div>
              <div className="grounding-footer">
                <div className="step-dots" aria-label={`Step ${step + 1} of 5`}>
                  {grounding.map((_, i) => (
                    <span key={i} className={i <= step ? "filled" : ""} />
                  ))}
                </div>
                <button onClick={() => setStep(step + 1)}>
                  {step === 4 ? "Finish" : "Next sense"} →
                </button>
              </div>
              <button
                className="text-xs underline mt-4 text-muted-foreground"
                onClick={() => setStep(step + 1)}
              >
                Skip this sense
              </button>
            </>
          ) : (
            <div className="grounding-done">
              <Check size={28} />
              <h3>You’re here.</h3>
              <p>Notice how you feel, without expecting it to change.</p>
              <button className="mt-4 underline" onClick={() => setStep(0)}>
                Walk the trail again
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
