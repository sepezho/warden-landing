import { useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  Check,
  ChevronDown,
  ChevronRight,
  Copy,
  Focus,
  History,
  Monitor,
  Moon,
  Pencil,
  Search,
  Sun,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type ThemePreference = "system" | "light" | "dark";
const themeOptions: {
  value: ThemePreference;
  label: string;
  icon: LucideIcon;
}[] = [
  { value: "system", label: "System", icon: Monitor },
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
];

function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <a
      className={`brand${compact ? " compact" : ""}`}
      href="#"
      aria-label="Warden home"
    >
      <img src="./favicon.svg" width="34" height="34" alt="" />
      <span>warden</span>
    </a>
  );
}

function ThemeSwitch() {
  const [preference, setPreference] = useState<ThemePreference>(
    () =>
      (document.documentElement.dataset.preference as ThemePreference) ||
      "system",
  );
  const [open, setOpen] = useState(false);
  const container = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const options = useRef<(HTMLButtonElement | null)[]>([]);
  const Icon = themeOptions.find((option) => option.value === preference)!.icon;
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => {
      const theme =
        preference === "system"
          ? media.matches
            ? "dark"
            : "light"
          : preference;
      document.documentElement.dataset.theme = theme;
      document.documentElement.dataset.preference = preference;
      document.documentElement.style.backgroundColor =
        theme === "dark" ? "#151916" : "#f6f7f4";
      document.documentElement.style.colorScheme = theme;
      document
        .querySelector('meta[name="theme-color"]')
        ?.setAttribute("content", theme === "dark" ? "#151916" : "#f6f7f4");
    };
    apply();
    try {
      localStorage.setItem("warden-theme", preference);
    } catch {
      /* The selected theme still works when storage is unavailable. */
    }
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, [preference]);
  useEffect(() => {
    if (!open) return;
    options.current[
      themeOptions.findIndex((option) => option.value === preference)
    ]?.focus();
    const outside = (event: PointerEvent) => {
      if (!container.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, [open, preference]);
  return (
    <div
      className="theme-switch"
      ref={container}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
    >
      <button
        className="theme-trigger"
        ref={trigger}
        aria-label={`Color theme: ${preference}. Change theme`}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls="theme-menu"
        onClick={() => setOpen(!open)}
      >
        <Icon size={18} />
        <ChevronDown size={11} />
      </button>
      {open && (
        <div
          className="theme-menu"
          id="theme-menu"
          role="menu"
          aria-label="Color theme"
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              setOpen(false);
              trigger.current?.focus();
              return;
            }
            const current = options.current.indexOf(
              document.activeElement as HTMLButtonElement,
            );
            const next =
              event.key === "ArrowDown"
                ? (current + 1) % 3
                : event.key === "ArrowUp"
                  ? (current + 2) % 3
                  : event.key === "Home"
                    ? 0
                    : event.key === "End"
                      ? 2
                      : -1;
            if (next !== -1) {
              event.preventDefault();
              options.current[next]?.focus();
            }
          }}
        >
          {themeOptions.map(({ value, label, icon: OptionIcon }, index) => (
            <button
              key={value}
              role="menuitemradio"
              aria-checked={value === preference}
              ref={(element) => {
                options.current[index] = element;
              }}
              onClick={() => {
                setPreference(value);
                setOpen(false);
                trigger.current?.focus();
              }}
            >
              <OptionIcon size={16} />
              <span>{label}</span>
              {value === preference && <Check size={14} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const categories = [
  {
    name: "On goal",
    className: "focus",
    minutes: 192,
    description:
      "Work related to your goal, including useful research and conversations.",
  },
  {
    name: "Distraction",
    className: "distraction",
    minutes: 24,
    description:
      "Activity classified as a distraction and unrelated to your goal.",
  },
  {
    name: "Communication",
    className: "communication",
    minutes: 18,
    description: "Conversations that were not related to your goal.",
  },
  {
    name: "Other",
    className: "other",
    minutes: 16,
    description: "Other recorded activity that was not related to your goal.",
  },
  {
    name: "Unclassified",
    className: "unknown",
    minutes: 16,
    description:
      "Recorded time without a confident classification. It still counts in the total.",
  },
];
const activityRows = [
  {
    title: "Onboarding implementation",
    time: "2h 12m",
    app: "Xcode",
    detail:
      "Built the welcome screen and connected the first-project flow. Related to the Atlas goal.",
    category: "focus",
  },
  {
    title: "Design review & feedback",
    time: "1h",
    app: "Safari · Messages",
    detail:
      "Reviewed the Atlas design notes and discussed feedback. Research and communication that support your goal count as time on goal.",
    category: "focus",
  },
  {
    title: "Other activity",
    time: "1h 14m",
    app: "Across apps",
    detail:
      "24m distraction, 18m unrelated communication, 16m other activity, and 16m unclassified time.",
    category: "other",
  },
];
const formatTime = (minutes: number) =>
  minutes >= 60
    ? `${Math.floor(minutes / 60)}h ${minutes % 60}m`
    : `${minutes}m`;

function DaySummary() {
  const [goal, setGoal] = useState("Ship the Atlas onboarding flow");
  const [draft, setDraft] = useState(goal);
  const [editing, setEditing] = useState(false);
  const [category, setCategory] = useState<number | null>(null);
  const [expanded, setExpanded] = useState<number | null>(null);
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (editing) input.current?.focus();
  }, [editing]);
  return (
    <section
      className="day-section"
      id="day"
      aria-label="Interactive example day"
    >
      <div className="summary-window">
        <div className="summary-toolbar">
          <span>
            <Focus size={16} /> Day overview
          </span>
          <span className="example-label">Example data</span>
        </div>
        <div className="summary-content">
          <div className="goal-heading">
            <span>Daily goal</span>
            <button
              className="edit-goal"
              onClick={() => {
                setDraft(goal);
                setEditing(!editing);
              }}
              aria-label={
                editing ? "Cancel goal editing" : "Edit example daily goal"
              }
            >
              {editing ? <X size={14} /> : <Pencil size={13} />}
              <span>{editing ? "Cancel" : "Edit"}</span>
            </button>
          </div>
          {editing ? (
            <form
              className="goal-form"
              onSubmit={(event) => {
                event.preventDefault();
                if (draft.trim()) {
                  setGoal(draft.trim());
                  setEditing(false);
                }
              }}
            >
              <input
                ref={input}
                aria-label="Example daily goal"
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Escape") setEditing(false);
                }}
                maxLength={100}
                required
              />
              <button aria-label="Save example goal" type="submit">
                <Check size={17} />
              </button>
            </form>
          ) : (
            <h2 className="daily-goal">{goal}</h2>
          )}
          <div className="score-row">
            <div className="focus-score">
              <strong>
                72<span>%</span>
              </strong>
              <span>
                of recorded time
                <br />
                on your goal
              </span>
            </div>
            <div className="total-time">
              <strong>4h 26m</strong>
              <span>recorded active time</span>
            </div>
          </div>
          <div
            className="time-bar"
            aria-label="Example: 72 percent of recorded active time was spent on the daily goal"
          >
            {categories.map((item, index) => (
              <button
                key={item.name}
                className={item.className}
                style={{ flexGrow: item.minutes }}
                aria-label={`${item.name}: ${formatTime(item.minutes)}. ${item.description}`}
                aria-pressed={category === index}
                onClick={() => setCategory(category === index ? null : index)}
              />
            ))}
          </div>
          <div className="time-legend">
            {categories.map((item, index) => (
              <button
                key={item.name}
                aria-pressed={category === index}
                onClick={() => setCategory(category === index ? null : index)}
              >
                <i className={item.className} />
                <span>{item.name}</span>
                <strong>{formatTime(item.minutes)}</strong>
              </button>
            ))}
          </div>
          <p className="category-explanation" aria-live="polite">
            {category === null
              ? "Select a category to see what it includes."
              : categories[category].description}
          </p>
          <div className="day-details">
            <div className="activity-list">
              <h3>Time by activity</h3>
              {activityRows.map((row, index) => (
                <div className="activity-item" key={row.title}>
                  <button
                    className="activity-row"
                    onClick={() =>
                      setExpanded(expanded === index ? null : index)
                    }
                    aria-expanded={expanded === index}
                    aria-controls={`activity-${index}`}
                  >
                    <i className={row.category} />
                    <span>
                      <strong>{row.title}</strong>
                      <small>{row.app}</small>
                    </span>
                    <time>{row.time}</time>
                    <ChevronRight
                      className={expanded === index ? "rotated" : ""}
                      size={13}
                    />
                  </button>
                  <p hidden={expanded !== index} id={`activity-${index}`}>
                    {row.detail}
                  </p>
                </div>
              ))}
            </div>
            <div className="day-review">
              <h3>
                Day review <span>Example</span>
              </h3>
              <p>
                Most of your focused time went to building Atlas. Design review
                stayed connected to the same goal.
              </p>
              <p>
                You spent <strong>24 minutes</strong> on unrelated browsing.
              </p>
            </div>
          </div>
        </div>
      </div>
      <p className="example-note">
        Interactive example, not a live recording. Scores estimate goal
        relevance; they don’t measure task completion.
      </p>
    </section>
  );
}

function CopyCommand() {
  const [status, setStatus] = useState("");
  const command =
    "git clone https://github.com/sepezho/warden.git\ncd warden\nmake setup";
  return (
    <div className="command-block">
      <div>
        <span>Terminal · repository access required</span>
        <button
          aria-label="Copy setup commands"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(command);
              setStatus("Copied");
              window.setTimeout(() => setStatus(""), 2500);
            } catch {
              setStatus("Select the commands to copy them.");
            }
          }}
        >
          {status === "Copied" ? <Check size={14} /> : <Copy size={14} />}
          <span>{status === "Copied" ? "Copied" : "Copy"}</span>
        </button>
      </div>
      <pre>
        <code>{command}</code>
      </pre>
      <span className="copy-status" role="status">
        {status && status !== "Copied" ? status : ""}
      </span>
    </div>
  );
}

export default function App() {
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <header className="site-header page-width">
        <Brand />
        <div className="header-actions">
          <a href="#setup">
            Setup & privacy <ArrowRight size={13} />
          </a>
          <ThemeSwitch />
        </div>
      </header>
      <main id="main" className="page-width">
        <section className="hero">
          <h1>
            See where your
            <br />
            workday went.
          </h1>
          <p>
            Set a daily goal. Warden uses local AI to show how much time went
            toward it, what distracted you, and what you worked on.
          </p>
          <div className="hero-bottom">
            <a href="#day" className="primary-link">
              See an example <ArrowDown size={15} />
            </a>
            <span>macOS 26+ · Apple Silicon</span>
          </div>
        </section>
        <DaySummary />
        <section className="features" aria-label="What Warden does">
          <article>
            <Focus size={21} strokeWidth={1.6} />
            <h2>Track time against a goal.</h2>
            <p>
              Choose what you want to work on. See related work, distractions,
              and other activity as a share of your recorded day.
            </p>
          </article>
          <article>
            <History size={21} strokeWidth={1.6} />
            <h2>Review the day.</h2>
            <p>
              Follow a timeline of your work, see time by app and task, and read
              a daily summary grounded in captured activity.
            </p>
          </article>
          <article>
            <Search size={21} strokeWidth={1.6} />
            <h2>Find earlier work.</h2>
            <p>
              Search text from your screen history. Explore connected topics in
              Memory when you need the context behind a moment.
            </p>
          </article>
        </section>
        <section className="setup-section" id="setup">
          <div className="setup-heading">
            <h2>Setup & privacy</h2>
            <p>
              A native Mac app.
              <br />
              Models and activity stored locally.
            </p>
            <span className="preview-label">Developer preview</span>
          </div>
          <div className="setup-details">
            <details>
              <summary>
                <span>What do I need to run it?</span>
                <ChevronDown size={17} />
              </summary>
              <div className="detail-content">
                <p>
                  Apple Silicon, <strong>macOS 26+</strong>, and about{" "}
                  <strong>10 GB for the default models</strong>, plus captured
                  images. Docker Desktop runs the local backend; Ollama runs the
                  models on your Mac.
                </p>
                <p>
                  The current setup builds from source. It requires{" "}
                  <strong>full Xcode 26+</strong> and access to the Warden
                  repository. There is no public app binary linked here.
                </p>
                <CopyCommand />
                <p>
                  Grant Screen Recording permission, then relaunch. Capture
                  starts when permissions and the local backend are ready. Stop
                  it at any time.
                </p>
              </div>
            </details>
            <details>
              <summary>
                <span>What stays on my Mac?</span>
                <ChevronDown size={17} />
              </summary>
              <div className="detail-content">
                <p>
                  Screen analysis, OCR, activity history, and memory are
                  processed locally. Warden itself has no telemetry or crash
                  reporting.
                </p>
                <p>
                  Setup and model downloads use the network. Asana requests
                  leave your Mac only if you connect it. Docker Desktop and
                  Ollama have their own update and analytics settings.
                </p>
                <p>
                  Adjust retention in Settings. Delete stored screenshots from
                  History; this removes images while keeping OCR, history, and
                  AI memory.
                </p>
              </div>
            </details>
            <details>
              <summary>
                <span>How is the focus score calculated?</span>
                <ChevronDown size={17} />
              </summary>
              <div className="detail-content">
                <p>
                  <strong>
                    Time related to your goal ÷ all recorded active time.
                  </strong>{" "}
                  Relevant research and conversations count toward the goal.
                  Unclassified time remains in the total; fully unclassified
                  days show a dash.
                </p>
                <p>
                  Sleep, lock, idle time, stopped capture, and missing intervals
                  are excluded. The score is an AI estimate of relevance, not
                  task completion or a measure of your productivity.
                </p>
              </div>
            </details>
            <details>
              <summary>
                <span>What else can I control?</span>
                <ChevronDown size={17} />
              </summary>
              <div className="detail-content">
                <p>
                  Manage and switch compatible local models in Settings. Adjust
                  capture intervals, retention, work hours, and distraction
                  alerts. All connected displays belong to the same snapshot.
                </p>
                <p>
                  Optionally connect Asana for task suggestions, deadlines, and
                  estimated task activity. The core app works offline after its
                  dependencies and models are downloaded.
                </p>
                <p>
                  History supports literal OCR search. Memory connects episodes
                  by meaning and includes an interactive graph. Neither requires
                  a cloud AI service.
                </p>
              </div>
            </details>
          </div>
        </section>
      </main>
      <footer className="site-footer page-width">
        <Brand compact />
        <span>Local activity tracking for macOS.</span>
        <a
          href="https://github.com/sepezho/warden-landing"
          target="_blank"
          rel="noreferrer"
        >
          Site source <ArrowRight size={13} />
        </a>
      </footer>
    </>
  );
}
