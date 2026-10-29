import { useState } from "react";
import { Link } from "wouter";
import {
  ArrowRight,
  BookOpen,
  Check,
  Leaf,
  MessageCircle,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import GardenArt from "@/components/GardenArt";
import {
  getJournalEntries,
  getMoodEntries,
  saveMoodEntry,
} from "@/lib/storage";
import { tips } from "@/lib/wellness";
import type { MoodType } from "@/types";
const moods: { value: MoodType; label: string; face: string; color: string }[] =
  [
    { value: "terrible", label: "Heavy", face: "︵", color: "#c5ccd7" },
    { value: "sad", label: "Low", face: "⌢", color: "#cdc9db" },
    { value: "neutral", label: "Okay", face: "−", color: "#ddd6b9" },
    { value: "happy", label: "Good", face: "⌣", color: "#c4d3aa" },
    { value: "amazing", label: "Lovely", face: "◡", color: "#e9cf94" },
  ];
export default function Home() {
  const [entries, setEntries] = useState(getMoodEntries);
  const [tip, setTip] = useState(new Date().getDate() % tips.length);
  const [message, setMessage] = useState("");
  const journals = getJournalEntries();
  const today = entries.find(
    (e) => new Date(e.date).toDateString() === new Date().toDateString(),
  );
  const hour = new Date().getHours();
  function checkIn(value: MoodType) {
    try {
      saveMoodEntry({
        id: `checkin-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        date: new Date().toISOString(),
        mood: value,
        context: today?.context || null,
      });
      setEntries(getMoodEntries());
      setMessage("Your check-in is saved. Every feeling belongs here.");
    } catch {
      setMessage(
        "Your browser could not save this check-in. Try exporting your data and freeing some space.",
      );
    }
  }
  return (
    <div className="home-page">
      <div className="welcome-row">
        <p className="eyebrow">
          <span className="little-sun">✳</span> GOOD{" "}
          {hour < 12 ? "MORNING" : hour < 18 ? "AFTERNOON" : "EVENING"}
        </p>
        <span className="date-label">
          {new Date().toLocaleDateString(undefined, {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </span>
      </div>
      <section className="sanctuary-hero">
        <div className="hero-copy">
          <span className="eyebrow">TAKE A BREATH. YOU’RE HERE.</span>
          <h1>
            A little space
            <br />
            to <em>just be.</em>
          </h1>
          <p>
            No perfect routines. No pressure to feel a certain way.
            <br className="hidden lg:block" /> Just a quiet place to check in,
            let go, and begin again.
          </p>
          <Link href="/mental-peace" className="primary-link">
            Find a moment of calm <ArrowRight size={17} />
          </Link>
          <div className="hero-footnote">
            <span /> YOUR PACE. YOUR PRIVATE SPACE.
          </div>
        </div>
        <GardenArt />
      </section>
      <div className="home-middle">
        <section className="checkin-card">
          <div className="section-top">
            <div>
              <p className="eyebrow">A MOMENT WITH YOURSELF</p>
              <h2>What’s your inner weather?</h2>
            </div>
            <span className="tiny-tag">
              {today ? "Checked in" : "Daily check-in"}
            </span>
          </div>
          <p className="supporting-copy">
            All feelings are welcome. Choose what feels closest.
          </p>
          <div className="weather-options">
            {moods.map((m) => (
              <button
                key={m.value}
                aria-label={`Check in: ${m.label}`}
                aria-pressed={today?.mood === m.value}
                onClick={() => checkIn(m.value)}
                className={today?.mood === m.value ? "selected" : ""}
              >
                <span
                  className="weather-face"
                  style={{ backgroundColor: m.color }}
                >
                  <span className="face-eyes">• •</span>
                  <span className="face-mouth">{m.face}</span>
                </span>
                <span>{m.label}</span>
                {today?.mood === m.value && <Check size={12} />}
              </button>
            ))}
          </div>
          <p role="status" className="checkin-status">
            {message ||
              (today
                ? "You can update your check-in as your day changes."
                : "A small check-in is enough. No explanation needed.")}
          </p>
        </section>
        <section className="daily-note">
          <div className="section-top">
            <span className="eyebrow">A GENTLE REMINDER</span>
            <Sparkles size={17} />
          </div>
          <div className="quote-mark">“</div>
          <p>{tips[tip]}</p>
          <button onClick={() => setTip((tip + 1) % tips.length)}>
            <RefreshCw size={13} /> Another little reminder
          </button>
          <div className="note-leaf" aria-hidden="true">
            ✳
          </div>
        </section>
      </div>
      <section className="pathways">
        <div className="section-top">
          <div>
            <p className="eyebrow">A SMALL STEP IS A START</p>
            <h2>What would feel good right now?</h2>
          </div>
          <span className="supporting-copy hidden lg:block">
            There’s no right way to begin.
          </span>
        </div>
        <div className="pathway-grid">
          <Link href="/journal" className="pathway-card journal-path">
            <span className="pathway-icon">
              <BookOpen size={23} />
            </span>
            <span className="pathway-time">YOUR WORDS, YOUR SPACE</span>
            <h3>Leave it on the page</h3>
            <p>
              Untangle a thought. Capture a little joy. Write without a filter.
            </p>
            <span className="pathway-action">
              Open your journal <ArrowRight size={16} />
            </span>
            <span className="pathway-decoration" aria-hidden="true">
              ∿
            </span>
          </Link>
          <Link href="/chat" className="pathway-card chat-path">
            <span className="pathway-icon">
              <MessageCircle size={23} />
            </span>
            <span className="pathway-time">A MOMENT TO REFLECT</span>
            <h3>Talk it through</h3>
            <p>
              A gentle guide to help you reflect and find a small next step.
            </p>
            <span className="pathway-action">
              Meet your companion <ArrowRight size={16} />
            </span>
            <span className="pathway-decoration" aria-hidden="true">
              ◌
            </span>
          </Link>
          <Link href="/mental-peace" className="pathway-card peace-path">
            <span className="pathway-icon">
              <Leaf size={23} />
            </span>
            <span className="pathway-time">ONE UNHURRIED MINUTE</span>
            <h3>Turn down the noise</h3>
            <p>Soft soundscapes, a slower breath, and somewhere to land.</p>
            <span className="pathway-action">
              Enter the quiet room <ArrowRight size={16} />
            </span>
            <span className="pathway-decoration" aria-hidden="true">
              ☾
            </span>
          </Link>
        </div>
      </section>
      <section className="journey-strip">
        <div>
          <Leaf size={24} />
          <div>
            <h3>Your garden, at your pace</h3>
            <p>
              {entries.length || journals.length
                ? `${entries.length} mood check-ins · ${journals.length} reflections. Every visit is a little care for yourself.`
                : "Your story starts wherever you are. No streaks to keep, no falling behind."}
            </p>
          </div>
        </div>
        <Link href="/mood">
          See your reflections <ArrowRight size={15} />
        </Link>
      </section>
    </div>
  );
}
