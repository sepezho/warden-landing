import { useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  ChevronRight,
  Circle,
  Clock3,
  Code2,
  Command,
  Copy,
  Database,
  Focus,
  GitBranch,
  HardDrive,
  History,
  Layers,
  LayoutDashboard,
  ListTodo,
  LockKeyhole,
  Menu,
  MessageCircle,
  Minus,
  Monitor,
  Moon,
  MousePointer2,
  Network,
  Pause,
  Play,
  Plus,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Terminal,
  X,
} from "lucide-react";

const APP_REPO = "https://github.com/sepezho/warden";
const INSTALL_COMMAND =
  "git clone https://github.com/sepezho/warden.git\ncd warden\nmake setup";
type DemoTab = "Overview" | "History" | "Memory" | "Models";
const demoTabs: { name: DemoTab; icon: typeof Focus }[] = [
  { name: "Overview", icon: LayoutDashboard },
  { name: "History", icon: History },
  { name: "Memory", icon: Network },
  { name: "Models", icon: SlidersHorizontal },
];
const bucketData = [
  {
    name: "On focus",
    time: "3h 12m",
    color: "#548064",
    width: 72,
    description:
      "Activity that relates to your daily intention, including relevant research and conversations.",
  },
  {
    name: "Distraction",
    time: "24m",
    color: "#d29965",
    width: 9,
    description:
      "Activity classified as a distraction and unrelated to your intention.",
  },
  {
    name: "Communication",
    time: "18m",
    color: "#78a9ac",
    width: 7,
    description: "Conversations that were not related to your intention.",
  },
  {
    name: "Other activity",
    time: "16m",
    color: "#969b92",
    width: 6,
    description:
      "Other recorded activity, separate from work on your intention.",
  },
  {
    name: "Not classified",
    time: "16m",
    color: "#d7dbd2",
    width: 6,
    description:
      "Recorded time without a confident classification. It still counts in the total; the AI does not know everything.",
  },
];
const episodes = [
  {
    time: "14:24",
    title: "Putting the final pieces together",
    app: "Xcode",
    detail: "Building the onboarding flow for the Atlas project.",
    tag: "On focus",
    color: "#548064",
    icon: Code2,
    duration: "42 min",
  },
  {
    time: "13:42",
    title: "A second opinion on the details",
    app: "Messages",
    detail: "Reviewing feedback on the Atlas welcome screen.",
    tag: "On focus",
    color: "#548064",
    icon: MessageCircle,
    duration: "18 min",
  },
  {
    time: "13:18",
    title: "A small detour",
    app: "Safari",
    detail: "Browsing a few things unrelated to today’s goal.",
    tag: "Distraction",
    color: "#d29965",
    icon: Circle,
    duration: "24 min",
  },
];
const historyEntries = [
  {
    time: "14:24:15",
    app: "Xcode",
    title: "Atlas / WelcomeView.swift",
    text: "Welcome to Atlas. Your next adventure starts here. Build a calmer onboarding experience.",
    type: "Code",
  },
  {
    time: "13:48:30",
    app: "Safari",
    title: "Atlas — design notes",
    text: "Onboarding checklist: welcome, preferences, first project. Keep the first step focused.",
    type: "Document",
  },
  {
    time: "13:42:15",
    app: "Messages",
    title: "Design feedback",
    text: "The Atlas welcome screen looks good. Could we make the primary action a little clearer?",
    type: "Conversation",
  },
];

function Mark({ small = false }: { small?: boolean }) {
  return (
    <span className={`brand-mark${small ? " small" : ""}`} aria-hidden="true">
      <svg viewBox="0 0 40 40">
        <path d="M9 12v13l5.5 5 5.5-7 5.5 7 5.5-5V12" />
        <circle cx="20" cy="11" r="2" />
      </svg>
    </span>
  );
}
function ButtonLink({
  children,
  href,
  secondary = false,
  className = "",
}: {
  children: ReactNode;
  href: string;
  secondary?: boolean;
  className?: string;
}) {
  return (
    <a
      className={`button ${secondary ? "secondary" : "primary"} ${className}`}
      href={href}
    >
      {children}
    </a>
  );
}
function SectionLabel({
  children,
  number,
}: {
  children: ReactNode;
  number: string;
}) {
  return (
    <div className="section-label">
      <span>{number}</span>
      {children}
    </div>
  );
}
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const [failed, setFailed] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setFailed(false);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      setFailed(true);
    }
  };
  return (
    <>
      <button
        className="copy-button"
        onClick={copy}
        aria-label={copied ? "Copied to clipboard" : "Copy commands"}
      >
        {copied ? <Check size={16} /> : <Copy size={16} />}
        {copied ? "Copied" : "Copy"}
      </button>
      {failed && (
        <span role="status" className="copy-error">
          Select the commands to copy them manually.
        </span>
      )}
    </>
  );
}
function OverviewDemo({ goal, onEdit }: { goal: string; onEdit: () => void }) {
  const [bucket, setBucket] = useState<number | null>(null);
  const [expanded, setExpanded] = useState<number | null>(null);
  return (
    <div className="overview-demo">
      <div className="intent-card">
        <div className="intent-top">
          <span>
            <Focus size={15} /> Today’s intention
          </span>
          <button onClick={onEdit}>
            Edit <ArrowUpRight size={12} />
          </button>
        </div>
        <h3>{goal}</h3>
        <div className="score-line">
          <strong>
            72<span>%</span>
          </strong>
          <span>
            of 4h 26m recorded activity{" "}
            <span className="muted">on your focus</span>
          </span>
          <span className="score-badge">
            <span className="status-dot" /> Finding your flow
          </span>
        </div>
        <div
          className="progress-track"
          aria-label="72 percent on focus, 9 percent distraction, 7 percent communication, 6 percent other activity, 6 percent not classified"
        >
          {bucketData.map((b, i) => (
            <button
              key={b.name}
              onClick={() => setBucket(bucket === i ? null : i)}
              style={{ background: b.color, flexGrow: b.width }}
              aria-label={`${b.name}: ${b.time}. ${b.description}`}
              aria-pressed={bucket === i}
            />
          ))}
        </div>
        <div className="progress-legend">
          {bucketData.map((b, i) => (
            <button
              key={b.name}
              onClick={() => setBucket(bucket === i ? null : i)}
              aria-pressed={bucket === i}
            >
              <i style={{ background: b.color }} />
              {b.name}
              <span>{b.time}</span>
            </button>
          ))}
        </div>
        {bucket !== null && (
          <div className="bucket-explanation" role="status">
            <strong>{bucketData[bucket].name}.</strong>{" "}
            {bucketData[bucket].description}
          </div>
        )}
      </div>
      <div className="demo-summary">
        <Sparkles size={17} />
        <div>
          <strong>A day taking shape</strong>
          <p>
            You moved Atlas from first ideas to a working welcome screen. Your
            longest focus block was this afternoon.
          </p>
        </div>
        <span className="tiny-label">EXAMPLE REVIEW</span>
      </div>
      <div className="timeline-heading">
        <h4>Your timeline</h4>
        <span>
          Today <ChevronDown size={12} />
        </span>
      </div>
      <div className="timeline">
        {episodes.map((e, i) => (
          <button
            className={`timeline-row ${expanded === i ? "expanded" : ""}`}
            key={e.time}
            onClick={() => setExpanded(expanded === i ? null : i)}
            aria-expanded={expanded === i}
          >
            <time>{e.time}</time>
            <div
              className="timeline-icon"
              style={{ "--episode-color": e.color } as CSSProperties}
            >
              <e.icon size={20} />
            </div>
            <div className="timeline-text">
              <strong>{e.title}</strong>
              <span>
                {e.app} <i /> {e.duration}
              </span>
              {expanded === i && <p>{e.detail}</p>}
            </div>
            <span
              className={`activity-tag ${e.tag === "Distraction" ? "orange" : ""}`}
            >
              {e.tag}
            </span>
            <ChevronRight className="row-chevron" size={14} />
          </button>
        ))}
      </div>
    </div>
  );
}
function HistoryDemo() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const filtered = historyEntries.filter((e) =>
    `${e.title} ${e.text} ${e.app}`.toLowerCase().includes(query.toLowerCase()),
  );
  const current = filtered[selected] || filtered[0];
  return (
    <div className="history-demo">
      <div className="demo-page-heading">
        <h3>Find that moment.</h3>
        <p>Search the text your screen remembers.</p>
      </div>
      <label className="search-field">
        <Search size={17} />
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSelected(0);
          }}
          placeholder="Try “welcome” or “feedback”"
          aria-label="Search example screen text"
        />
        <kbd>OCR</kbd>
      </label>
      <div className="history-results">
        <div className="history-list">
          {filtered.map((item, i) => (
            <button
              className={i === selected ? "selected" : ""}
              onClick={() => setSelected(i)}
              key={item.time}
            >
              <span>
                <time>{item.time}</time>
                <span>{item.app}</span>
              </span>
              <strong>{item.title}</strong>
              <small>{item.type}</small>
            </button>
          ))}
          {filtered.length === 0 && (
            <p className="empty-result">
              No example snapshots match “{query}”. Try “Atlas”.
            </p>
          )}
        </div>
        {current && (
          <div className="snapshot-preview">
            <div className="mini-browser">
              <span />
              <span />
              <span />
              <span>{current.app}</span>
            </div>
            <div
              className={`synthetic-screen ${current.type === "Code" ? "code-screen" : ""}`}
            >
              {current.type === "Code" ? (
                <>
                  <div className="code-line">
                    <em>struct</em> WelcomeView: <b>View</b> {"{"}
                  </div>
                  <div className="code-line">
                    &nbsp; <em>var</em> body: <b>some View</b> {"{"}
                  </div>
                  <div className="code-line">
                    &nbsp; &nbsp; VStack(spacing: <b>24</b>) {"{"}
                  </div>
                  <div className="code-line">
                    &nbsp; &nbsp; &nbsp; Text(<span>“Welcome to Atlas”</span>)
                  </div>
                  <div className="code-line">
                    &nbsp; &nbsp; &nbsp; Text(<span>“Your next adventure”</span>
                    )
                  </div>
                  <div className="code-line">&nbsp; &nbsp; {"}"}</div>
                  <div className="code-line">&nbsp; {"}"}</div>
                  <div className="code-line">{"}"}</div>
                </>
              ) : (
                <>
                  <span className="document-label">ATLAS / WORKSPACE</span>
                  <h4>{current.title}</h4>
                  <p>{current.text}</p>
                  <div className="document-rule" />
                  <div className="document-rule short" />
                </>
              )}
            </div>
            <div className="recognized-text">
              <span>
                <Search size={12} /> Recognized text
              </span>
              <p>{current.text}</p>
            </div>
          </div>
        )}
      </div>
      <p className="demo-footnote">
        Illustrative snapshots. Your real screen is never captured by this
        website.
      </p>
    </div>
  );
}
const graphNodes = [
  {
    id: "atlas",
    label: "Atlas project",
    x: 330,
    y: 190,
    w: 126,
    color: "green",
    detail:
      "The project at the center of today’s work. Connected to design, research, and implementation.",
  },
  {
    id: "design",
    label: "Product design",
    x: 150,
    y: 85,
    w: 132,
    color: "green",
    detail:
      "Welcome screens, interaction details, and the ideas that shaped the product.",
  },
  {
    id: "swift",
    label: "SwiftUI",
    x: 520,
    y: 90,
    w: 96,
    color: "blue",
    detail: "Implementation sessions connected to the Atlas onboarding flow.",
  },
  {
    id: "research",
    label: "Research",
    x: 125,
    y: 270,
    w: 112,
    color: "blue",
    detail: "Documentation and examples that informed the project.",
  },
  {
    id: "feedback",
    label: "Team feedback",
    x: 475,
    y: 295,
    w: 136,
    color: "blue",
    detail:
      "Conversations about the project, connected to design and implementation.",
  },
  {
    id: "reading",
    label: "Weekend reading",
    x: 670,
    y: 210,
    w: 146,
    color: "orange",
    detail:
      "An unrelated topic. Memory keeps context without treating every activity as work.",
  },
];
function GraphDemo() {
  const [selected, setSelected] = useState("atlas");
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const chosen = graphNodes.find((n) => n.id === selected)!;
  const points = graphNodes.map((n) => {
    const a = (rotation * Math.PI) / 180;
    return {
      ...n,
      px: 390 + (n.x - 390) * Math.cos(a) - (n.y - 190) * Math.sin(a),
      py: 190 + (n.x - 390) * Math.sin(a) + (n.y - 190) * Math.cos(a),
    };
  });
  const links = [
    [0, 1],
    [0, 2],
    [0, 3],
    [0, 4],
    [2, 4],
    [4, 5],
    [1, 3],
  ];
  return (
    <div className="graph-demo">
      <div className="demo-page-heading">
        <h3>The connections behind your day.</h3>
        <p>Explore the topics your work keeps coming back to.</p>
      </div>
      <div className="graph-canvas">
        <svg
          viewBox="0 0 780 380"
          role="group"
          aria-label="Interactive example knowledge graph. Select a topic to read its connections."
        >
          <defs>
            <marker
              id="arrowhead"
              markerWidth="7"
              markerHeight="7"
              refX="6"
              refY="3.5"
              orient="auto"
            >
              <path d="M0,0 L7,3.5 L0,7" fill="none" stroke="#a1aea0" />
            </marker>
          </defs>
          <g
            transform={`translate(390 190) scale(${zoom}) translate(-390 -190)`}
          >
            {links.map(([a, b]) => {
              const from = points[a];
              const to = points[b];
              const dx = to.px - from.px;
              const dy = to.py - from.py;
              const length = Math.hypot(dx, dy);
              return (
                <line
                  key={`${a}-${b}`}
                  x1={from.px}
                  y1={from.py}
                  x2={to.px - (dx / length) * 66}
                  y2={to.py - (dy / length) * 29}
                  stroke={
                    from.id === selected || to.id === selected
                      ? "#789a7d"
                      : "#cdd3c8"
                  }
                  strokeWidth="1.4"
                  strokeDasharray={a === 4 ? "4 5" : undefined}
                  markerEnd="url(#arrowhead)"
                />
              );
            })}
            {points.map((n) => (
              <g
                key={n.id}
                className={`graph-node ${n.color} ${selected === n.id ? "selected" : ""}`}
                transform={`translate(${n.px} ${n.py})`}
                role="button"
                tabIndex={0}
                aria-label={`Explore ${n.label}`}
                aria-pressed={selected === n.id}
                onClick={() => setSelected(n.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setSelected(n.id);
                  }
                }}
              >
                <rect x={-n.w / 2} y="-23" width={n.w} height="46" rx="9" />
                <text textAnchor="middle" dominantBaseline="central">
                  {n.label}
                </text>
              </g>
            ))}
          </g>
        </svg>
        <div className="graph-controls">
          <button
            aria-label="Zoom out graph"
            onClick={() => setZoom(Math.max(0.7, zoom - 0.15))}
            disabled={zoom <= 0.7}
          >
            <Minus size={15} />
          </button>
          <button
            aria-label="Zoom in graph"
            onClick={() => setZoom(Math.min(1.6, zoom + 0.15))}
            disabled={zoom >= 1.6}
          >
            <Plus size={15} />
          </button>
          <button
            aria-label="Rotate graph"
            onClick={() => setRotation(rotation + 20)}
          >
            <GitBranch size={15} />
          </button>
          <button
            onClick={() => {
              setZoom(1);
              setRotation(0);
            }}
          >
            Fit
          </button>
        </div>
      </div>
      <div className="graph-detail" aria-live="polite">
        <Network size={18} />
        <div>
          <strong>{chosen.label}</strong>
          <p>{chosen.detail}</p>
        </div>
      </div>
    </div>
  );
}
function ModelsDemo() {
  const [model, setModel] = useState("Vision");
  const models = [
    {
      type: "Vision",
      name: "qwen3-vl:4b-instruct",
      size: "3.3 GB",
      task: "Understands screenshots and the activity happening on them.",
      icon: Monitor,
    },
    {
      type: "Language",
      name: "qwen3:8b",
      size: "5.2 GB",
      task: "Turns your activity into summaries and connects it with your daily intention.",
      icon: Sparkles,
    },
    {
      type: "Embedding",
      name: "qwen3-embedding:0.6b",
      size: "0.6 GB",
      task: "Connects related episodes so your activity can become searchable memory.",
      icon: Database,
    },
  ];
  const selected = models.find((m) => m.type === model)!;
  return (
    <div className="models-demo">
      <div className="demo-page-heading">
        <h3>Your Mac. Your models.</h3>
        <p>Three local roles, one place to manage them.</p>
      </div>
      <div className="model-demo-list">
        {models.map((m) => (
          <button
            className={model === m.type ? "selected" : ""}
            key={m.type}
            onClick={() => setModel(m.type)}
          >
            <span className="model-demo-icon">
              <m.icon size={21} />
            </span>
            <span>
              <small>{m.type} model</small>
              <strong>{m.name}</strong>
            </span>
            <span className="model-size">{m.size}</span>
            <Check size={16} />
          </button>
        ))}
      </div>
      <div className="model-explanation" aria-live="polite">
        <selected.icon size={22} />
        <div>
          <strong>{selected.type} that stays local.</strong>
          <p>
            {selected.task} Runs through Ollama on your Mac, using Apple
            Silicon.
          </p>
        </div>
      </div>
      <p className="demo-footnote">
        Example default models. The app lets you download, select, and remove
        compatible local models.
      </p>
    </div>
  );
}
function ProductDemo({
  goal,
  onEdit,
  tab,
  setTab,
}: {
  goal: string;
  onEdit: () => void;
  tab: DemoTab;
  setTab: (tab: DemoTab) => void;
}) {
  const [capturing, setCapturing] = useState(true);
  return (
    <div className="product-stage" id="demo">
      <div
        className="demo-tabs"
        role="tablist"
        aria-label="Explore Warden screens"
      >
        {demoTabs.map(({ name, icon: Icon }) => (
          <button
            role="tab"
            id={`tab-${name}`}
            aria-controls="product-panel"
            aria-selected={tab === name}
            tabIndex={tab === name ? 0 : -1}
            key={name}
            onClick={() => setTab(name)}
            onKeyDown={(event) => {
              const index = demoTabs.findIndex((item) => item.name === tab);
              const next =
                event.key === "ArrowRight"
                  ? (index + 1) % demoTabs.length
                  : event.key === "ArrowLeft"
                    ? (index + demoTabs.length - 1) % demoTabs.length
                    : event.key === "Home"
                      ? 0
                      : event.key === "End"
                        ? demoTabs.length - 1
                        : -1;
              if (next !== -1) {
                event.preventDefault();
                setTab(demoTabs[next].name);
                document.getElementById(`tab-${demoTabs[next].name}`)?.focus();
              }
            }}
          >
            <Icon size={15} />
            {name}
          </button>
        ))}
      </div>
      <div className="app-window">
        <aside className="app-sidebar">
          <div className="traffic-lights">
            <i />
            <i />
            <i />
          </div>
          <div className="app-brand">
            <Mark small />
            <span>
              Warden
              <span className="app-brand-caption">
                A little more intention.
              </span>
            </span>
          </div>
          <nav aria-label="Example app navigation">
            {demoTabs.map(({ name, icon: Icon }) => (
              <button
                key={name}
                className={tab === name ? "active" : ""}
                onClick={() => setTab(name)}
              >
                <Icon size={17} />
                {name}
              </button>
            ))}
          </nav>
          <div className="sidebar-bottom">
            <div>
              <span className={`status-dot ${!capturing ? "paused" : ""}`} />
              {capturing ? "Keeping watch, locally" : "Example capture paused"}
            </div>
            <button onClick={() => setCapturing(!capturing)}>
              {capturing ? <Pause size={12} /> : <Play size={12} />}
              {capturing ? "Pause capture" : "Resume capture"}
            </button>
          </div>
        </aside>
        <div
          className="app-main"
          id="product-panel"
          role="tabpanel"
          aria-labelledby={`tab-${tab}`}
        >
          <div className="app-toolbar">
            <strong>{tab}</strong>
            <span>
              <Clock3 size={13} /> Today <ChevronDown size={12} />
            </span>
          </div>
          <div className="app-content">
            {tab === "Overview" ? (
              <OverviewDemo goal={goal} onEdit={onEdit} />
            ) : tab === "History" ? (
              <HistoryDemo />
            ) : tab === "Memory" ? (
              <GraphDemo />
            ) : (
              <ModelsDemo />
            )}
          </div>
        </div>
      </div>
      <div className="demo-caption">
        <span>
          <MousePointer2 size={13} /> A working little preview. Go ahead,
          explore.
        </span>
        <span>Illustrative interface · synthetic example data</span>
      </div>
    </div>
  );
}
const workflow = [
  {
    icon: Monitor,
    number: "01",
    title: "Observe",
    text: "Native macOS capture collects your displays together. Apple Vision reads text on changed frames.",
  },
  {
    icon: Focus,
    number: "02",
    title: "Understand",
    text: "A local vision model interprets your active screen, using cursor position, window context, and previous activity.",
  },
  {
    icon: Layers,
    number: "03",
    title: "Connect",
    text: "Related moments become episodes. Local models compare your activity with your intention and connected tasks.",
  },
  {
    icon: Sparkles,
    number: "04",
    title: "Reflect",
    text: "A readable timeline, searchable memory, and daily review help you see where your attention went.",
  },
];
const guideTabs = [
  { id: "install", title: "Get started", icon: Terminal },
  { id: "daily", title: "Your daily rhythm", icon: Focus },
  { id: "models", title: "Local models", icon: Database },
  { id: "permissions", title: "Permissions", icon: ShieldCheck },
  { id: "asana", title: "Connect Asana", icon: ListTodo },
  { id: "storage", title: "Storage & capture", icon: HardDrive },
];
function Guide({
  tab,
  setTab,
}: {
  tab: string;
  setTab: (tab: string) => void;
}) {
  return (
    <section className="guide-section section-shell" id="guide">
      <div className="section-heading">
        <SectionLabel number="05">THE FIELD GUIDE</SectionLabel>
        <h2>
          A good beginning.
          <br />
          <span className="serif">And the details after.</span>
        </h2>
        <p>
          Everything you need to understand the setup, the everyday workflow,
          and what stays on your Mac.
        </p>
      </div>
      <div className="guide-layout">
        <nav className="guide-nav" aria-label="Documentation chapters">
          {guideTabs.map(({ id, title, icon: Icon }) => (
            <button
              key={id}
              className={tab === id ? "active" : ""}
              onClick={() => setTab(id)}
              aria-pressed={tab === id}
            >
              <Icon size={17} />
              {title}
              <ChevronRight size={14} />
            </button>
          ))}
          <div className="guide-note">
            <Code2 size={18} />
            <p>
              Developer preview
              <br />
              <span>The current installer builds Warden from source.</span>
            </p>
          </div>
        </nav>
        <article className="guide-content" aria-live="polite">
          {tab === "install" && (
            <>
              <span className="eyebrow">GET STARTED</span>
              <h3>Make a little space on your Mac.</h3>
              <p>
                Warden currently requires access to its source repository. There
                is no public binary download linked here. If you have source
                access, the setup command prepares the local stack and builds
                the native app.
              </p>
              <div className="requirements">
                <div>
                  <Monitor size={18} />
                  <strong>Apple Silicon</strong>
                  <span>macOS 26 or newer</span>
                </div>
                <div>
                  <Code2 size={18} />
                  <strong>Xcode 26+</strong>
                  <span>Full Xcode, for the build</span>
                </div>
                <div>
                  <HardDrive size={18} />
                  <strong>~10 GB for models</strong>
                  <span>Plus your retained captures</span>
                </div>
              </div>
              <div className="code-block">
                <div>
                  <span>
                    <Terminal size={14} /> Terminal · source access required
                  </span>
                  <CopyButton text={INSTALL_COMMAND} />
                </div>
                <pre>
                  <code>{INSTALL_COMMAND}</code>
                </pre>
              </div>
              <ol className="guide-steps">
                <li>
                  <strong>Prepare the dependencies.</strong>
                  <p>
                    The setup checks Docker Desktop and Ollama, downloads the
                    default models, and starts the local backend.
                  </p>
                </li>
                <li>
                  <strong>Allow Screen Recording.</strong>
                  <p>
                    Grant access in macOS System Settings, then relaunch Warden.
                    Notifications are optional.
                  </p>
                </li>
                <li>
                  <strong>Choose today’s intention.</strong>
                  <p>
                    Write one sentence. Capture starts when the backend and
                    permission are ready; you can stop it at any time.
                  </p>
                </li>
              </ol>
              <p className="guide-small">
                Have repository access?{" "}
                <a
                  href={`${APP_REPO}/blob/main/scripts/install.sh`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Review the installer <ArrowUpRight size={12} />
                </a>
                . You can also run <code>make bootstrap</code> and{" "}
                <code>make install</code> separately. Command Line Tools alone
                are not sufficient.
              </p>
            </>
          )}
          {tab === "daily" && (
            <>
              <span className="eyebrow">YOUR DAILY RHYTHM</span>
              <h3>One intention. A whole day of context.</h3>
              <p>
                Start with what you want to work on, choose a recent intention,
                or select a task from your connected Asana workspace. Press
                Enter to continue, or skip the prompt for the day.
              </p>
              <div className="doc-callout">
                <Focus size={22} />
                <p>
                  “Build the welcome flow for Atlas.”
                  <small>
                    A specific project gives the local model useful context.
                  </small>
                </p>
              </div>
              <h4>Understand the score</h4>
              <p>
                The percentage is time related to your intention divided by all
                recorded active time. The bar keeps five categories visible: on
                focus, distraction, communication, other activity, and not
                classified. Relevant research and conversations can count toward
                your intention.
              </p>
              <p>
                Unknown time remains in the total. When nothing has been
                classified, Warden shows a dash rather than a made-up score.
                Idle time, sleep, lock, stopped capture, and missing intervals
                are excluded.
              </p>
              <h4>Come back when you need to</h4>
              <p>
                The compact intention card lives in today’s Overview and scrolls
                with your timeline. Edit it or reopen the input from Today’s
                focus. At local midnight, your daily totals roll over and a
                fresh intention prompt appears.
              </p>
              <h4>Reflect, without watching the clock</h4>
              <p>
                Overview includes episode summaries and a daily review. Usage
                shows per-app time, switches, window context, hourly and weekly
                patterns, and cursor heatmaps. Configure distraction alerts,
                working hours, and review time in Settings.
              </p>
            </>
          )}
          {tab === "models" && (
            <>
              <span className="eyebrow">LOCAL MODELS</span>
              <h3>Choose the intelligence on your machine.</h3>
              <p>
                Ollama runs on the Mac itself so inference can use Apple Silicon
                through Metal. Docker runs the backend and memory service; it
                does not host the model runtime.
              </p>
              <div className="doc-models">
                <div>
                  <span>Vision</span>
                  <strong>qwen3-vl:4b-instruct</strong>
                  <small>~3.3 GB</small>
                </div>
                <div>
                  <span>Language</span>
                  <strong>qwen3:8b</strong>
                  <small>~5.2 GB</small>
                </div>
                <div>
                  <span>Embedding</span>
                  <strong>qwen3-embedding:0.6b</strong>
                  <small>~0.6 GB</small>
                </div>
              </div>
              <h4>Manage models in Settings</h4>
              <p>
                View your installed models, download new ones with progress,
                cancel a download, and choose compatible models for each role.
                Warden checks model capabilities and protects selected models
                from accidental deletion.
              </p>
              <h4>Size is a tradeoff</h4>
              <p>
                Larger models need more storage and memory. Speed varies with
                your Mac, model, and screen content. The defaults are a starting
                point, not a promise of a particular throughput or perfect
                accuracy.
              </p>
              <h4>Downloading is a network operation</h4>
              <p>
                Model downloads contact the Ollama registry. Once the needed
                weights and dependencies are present, capture, inference, and
                local memory can work offline.
              </p>
            </>
          )}
          {tab === "permissions" && (
            <>
              <span className="eyebrow">PERMISSIONS</span>
              <h3>Only the access the work needs.</h3>
              <div className="permission-row">
                <Monitor size={22} />
                <div>
                  <h4>
                    Screen Recording <span>Required</span>
                  </h4>
                  <p>
                    Allows Warden to capture your displays and inspect window
                    context. Relaunch after granting access in System Settings.
                  </p>
                </div>
              </div>
              <div className="permission-row">
                <MessageCircle size={22} />
                <div>
                  <h4>
                    Notifications <span className="optional">Optional</span>
                  </h4>
                  <p>
                    Shows system banners for distraction alerts and reviews.
                    Warden also has an in-app notch widget.
                  </p>
                </div>
              </div>
              <div className="permission-row">
                <Command size={22} />
                <div>
                  <h4>
                    Browser Automation{" "}
                    <span className="optional">Optional</span>
                  </h4>
                  <p>
                    Reads the active browser tab URL. It is off by default and
                    can be enabled under Advanced settings.
                  </p>
                </div>
              </div>
              <div className="doc-callout">
                <ShieldCheck size={22} />
                <p>
                  No Accessibility permission.
                  <small>
                    Screen capture and window metadata use native macOS APIs.
                  </small>
                </p>
              </div>
              <p>
                Capture begins automatically after launch when the local backend
                and Screen Recording permission are ready. Use Start / Stop to
                control it. Stopping lasts until the next launch; sleep, screen
                lock, and configured idle periods pause capture automatically.
              </p>
            </>
          )}
          {tab === "asana" && (
            <>
              <span className="eyebrow">OPTIONAL INTEGRATION</span>
              <h3>Bring the work you already planned.</h3>
              <p>
                Connect Asana to see tasks, due dates, priorities, and estimated
                time worked on them today. Open tasks can become daily-intention
                suggestions, ordered by priority and deadline.
              </p>
              <ol className="guide-steps">
                <li>
                  <strong>Choose your connection.</strong>
                  <p>
                    In Settings → Integrations, use official Asana MCP v2 OAuth
                    or a Personal Access Token.
                  </p>
                </li>
                <li>
                  <strong>Authorize your workspace.</strong>
                  <p>
                    OAuth uses an Asana MCP app and the callback{" "}
                    <code>
                      http://127.0.0.1:8484/integrations/asana/callback
                    </code>
                    . PAT setup asks for a token and workspace.
                  </p>
                </li>
                <li>
                  <strong>Let the task list stay current.</strong>
                  <p>
                    Tasks sync about every 10 minutes. The API uses your
                    account’s permissions; some search capabilities depend on
                    your Asana plan.
                  </p>
                </li>
              </ol>
              <div className="doc-callout">
                <Network size={22} />
                <p>
                  A deliberate connection to the outside.
                  <small>
                    Asana requests leave your Mac only after you connect it.
                    Disconnect in Settings to stop using the integration.
                  </small>
                </p>
              </div>
              <p>
                Activity matching is a local AI estimate. It helps you reflect
                on your task work; it is not a substitute for a reviewed
                timesheet.
              </p>
            </>
          )}
          {tab === "storage" && (
            <>
              <span className="eyebrow">STORAGE & CAPTURE</span>
              <h3>You decide what stays.</h3>
              <p>
                Frames, recognized text, episodes, embeddings, and summaries are
                stored locally under{" "}
                <code>~/Library/Application Support/Warden/</code>.
              </p>
              <h4>Set your own rhythm</h4>
              <p>
                The default capture interval is 15 seconds, configurable from 5
                to 300 seconds. Changed screens are processed; unchanged
                displays use lightweight heartbeats. All connected monitors
                belong to the same snapshot.
              </p>
              <h4>Set retention</h4>
              <p>
                By default, image frames are retained for 14 days and episodes
                for 180 days. Daily reviews are kept. Adjust retention and
                storage controls in Settings.
              </p>
              <h4>Delete images, keep the thread</h4>
              <p>
                The screenshot-deletion control permanently removes stored image
                files while keeping OCR text, history, AI memory, and settings.
                That makes it different from erasing all activity data. Ongoing
                capture can create new images after deletion.
              </p>
              <h4>On quit</h4>
              <p>
                Warden normally stops capture, unloads its models, and stops its
                containers. You can choose to keep the backend running. Launch
                at login is also optional.
              </p>
              <div className="doc-callout">
                <LockKeyhole size={22} />
                <p>
                  Local is a trust boundary, not encryption.
                  <small>
                    The loopback backend has no authentication. Other software
                    running as your user can access it. Protect your Mac account
                    accordingly.
                  </small>
                </p>
              </div>
            </>
          )}
        </article>
      </div>
    </section>
  );
}
const faqs = [
  [
    "Does Warden send my screen to a cloud AI?",
    "Warden’s screen analysis runs locally through Ollama. Its backend, vector memory, and model runtime use local connections. Installation and model downloads need the network; Asana uses the network if you choose to connect it. Warden itself has no telemetry or crash reporting.",
  ],
  [
    "Will it know when I’m actually working on my goal?",
    "It estimates relevance from screenshot analysis, recognized text, activity context, and the sequence of your work. Useful research and related conversations can count as on focus. Models can be wrong or uncertain; the five-part bar preserves unclassified time instead of pretending it is certain.",
  ],
  [
    "Does it record while I’m away?",
    "Capture pauses during sleep, screen lock, and configured idle periods. You can also stop it manually. Idle and missing intervals are excluded from recorded active time; Warden does not treat every gap between screenshots as work.",
  ],
  [
    "Can I use it without Asana or the internet?",
    "Yes. Asana is optional. Once Docker images, dependencies, and Ollama models have been downloaded, the core capture, local inference, timeline, and memory can run offline. Dependency applications may have their own update or analytics settings.",
  ],
  [
    "What is the difference between History and Memory?",
    "History lets you inspect snapshots and search their recognized text with a literal query. Memory connects episodes semantically, exposing topics, relationships, and a navigable knowledge graph. One helps you find an exact moment; the other helps you see a pattern.",
  ],
  [
    "Can I download Warden today?",
    "This is a developer preview. The current setup builds the app from source and requires access to the Warden repository, a Mac with Apple Silicon running macOS 26 or newer, full Xcode 26+, Docker Desktop, and Ollama. This site does not currently offer a public app binary.",
  ],
];

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [demoTab, setDemoTab] = useState<DemoTab>("Overview");
  const [guideTab, setGuideTab] = useState("install");
  const [goal, setGoal] = useState("Build a thoughtful welcome for Atlas");
  const [draftGoal, setDraftGoal] = useState(goal);
  const [goalSaved, setGoalSaved] = useState(false);
  const [openFAQ, setOpenFAQ] = useState<number | null>(0);
  const editGoal = () => {
    document
      .getElementById("intention")
      ?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
        block: "center",
      });
    window.setTimeout(
      () =>
        document.getElementById("goal-input")?.focus({ preventScroll: true }),
      400,
    );
  };
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-header">
        <a className="brand" href="#" aria-label="Warden home">
          <Mark />
          <span>warden</span>
        </a>
        <nav className={menuOpen ? "open" : ""} aria-label="Main navigation">
          <a href="#features" onClick={() => setMenuOpen(false)}>
            The app
          </a>
          <a href="#how-it-works" onClick={() => setMenuOpen(false)}>
            How it works
          </a>
          <a href="#privacy" onClick={() => setMenuOpen(false)}>
            Privacy
          </a>
          <a href="#guide" onClick={() => setMenuOpen(false)}>
            Field guide
          </a>
        </nav>
        <a
          className="header-cta"
          href="#guide"
          onClick={() => setGuideTab("install")}
        >
          Get started <ArrowUpRight size={15} />
        </a>
        <button
          className="menu-toggle"
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={23} /> : <Menu size={23} />}
        </button>
      </header>
      <main id="main">
        <section className="hero section-shell">
          <div className="hero-eyebrow">
            <span className="status-dot" /> A LOCAL AI COMPANION FOR YOUR MAC
          </div>
          <h1>
            A little more intention.
            <br />
            <span className="serif">A lot more focus.</span>
          </h1>
          <p className="hero-description">
            You know what you want to build. Warden helps you see
            <br className="desktop-break" /> where your day goes — and find your
            way back.
          </p>
          <div className="hero-actions">
            <ButtonLink href="#demo">
              Explore the app <ArrowDown size={16} />
            </ButtonLink>
            <ButtonLink secondary href="#how-it-works">
              Meet your quiet companion <ArrowRight size={16} />
            </ButtonLink>
          </div>
          <div className="platform-note">
            <Monitor size={13} /> macOS 26+ <span>·</span> Apple Silicon{" "}
            <span>·</span> Developer preview
          </div>
          <ProductDemo
            goal={goal}
            onEdit={editGoal}
            tab={demoTab}
            setTab={setDemoTab}
          />
        </section>
        <div className="principles-strip section-shell">
          <span>
            <Monitor size={17} /> Native to your Mac
          </span>
          <span>
            <LockKeyhole size={17} /> Inference stays local
          </span>
          <span>
            <Focus size={17} /> Built around your intention
          </span>
          <span>
            <ShieldCheck size={17} /> Your data, your controls
          </span>
        </div>
        <section className="intention-section section-shell" id="features">
          <div className="intention-copy">
            <SectionLabel number="01">A DAY WITH DIRECTION</SectionLabel>
            <h2>
              Busy is a feeling.
              <br />
              <span className="serif">Focus is a direction.</span>
            </h2>
            <p>
              Tabs multiply. Conversations branch off. The thing you meant to
              build gets a little further away.
            </p>
            <p>
              Begin with one intention. Warden follows the context of your work,
              then gives you a clear view of the time that moved it forward.
            </p>
            <a
              className="text-link"
              href="#guide"
              onClick={() => setGuideTab("daily")}
            >
              Understand the focus score <ArrowUpRight size={15} />
            </a>
          </div>
          <div className="intention-example" id="intention">
            <div className="quiet-sun" aria-hidden="true">
              <Focus size={32} strokeWidth={1} />
            </div>
            <span className="tiny-label">A FRESH START, EVERY DAY</span>
            <h3>
              What do you want
              <br />
              to build today?
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (draftGoal.trim()) {
                  setGoal(draftGoal.trim());
                  setGoalSaved(true);
                }
              }}
            >
              <label className="visually-hidden" htmlFor="goal-input">
                Your example daily intention
              </label>
              <input
                id="goal-input"
                maxLength={140}
                value={draftGoal}
                onChange={(e) => {
                  setDraftGoal(e.target.value);
                  setGoalSaved(false);
                }}
                placeholder="One thing that matters today…"
                required
              />
              <button aria-label="Save example intention" type="submit">
                <ArrowRight size={20} />
              </button>
            </form>
            <p className="intention-hint" aria-live="polite">
              {goalSaved ? (
                <>
                  <Check size={13} /> Your intention is now in the example
                  Overview.
                </>
              ) : (
                <>Try your own intention. It stays in this page.</>
              )}
            </p>
            <div className="intention-suggestion">
              <Clock3 size={13} />
              <span>Recent intentions & connected Asana tasks</span>
            </div>
          </div>
        </section>
        <section className="attention-section section-shell">
          <div className="attention-top">
            <h3>
              More context.
              <br />
              <span className="serif">Less second-guessing.</span>
            </h3>
            <p>
              One browser can hold deep research and an afternoon detour. Warden
              looks at what you are doing, not just which app is open.
            </p>
          </div>
          <div className="attention-features">
            <article>
              <span className="feature-index">01 / UNDERSTAND</span>
              <Focus size={25} strokeWidth={1.5} />
              <h4>Your goal, in the picture.</h4>
              <p>
                Local AI compares activity with your daily intention. Research
                and conversations that move it forward belong to your focus.
              </p>
            </article>
            <article>
              <span className="feature-index">02 / SEE CLEARLY</span>
              <Layers size={25} strokeWidth={1.5} />
              <h4>A day in five shades.</h4>
              <p>
                Focus, distraction, communication, other activity, and
                unclassified time. A percentage with the context still attached.
              </p>
            </article>
            <article>
              <span className="feature-index">03 / COME BACK</span>
              <Moon size={25} strokeWidth={1.5} />
              <h4>A gentle course correction.</h4>
              <p>
                Configurable distraction alerts in the notch and notifications.
                A daily review to close the loop when your work is done.
              </p>
            </article>
          </div>
        </section>
        <section className="memory-section section-shell" id="memory">
          <div className="section-heading">
            <SectionLabel number="02">A MEMORY FOR YOUR WORK</SectionLabel>
            <h2>
              You’ve seen it before.
              <br />
              <span className="serif">Now you can find it again.</span>
            </h2>
            <p>
              That useful line. That earlier idea. The thread connecting them.
              <br className="desktop-break" /> Your work leaves a trail. Warden
              makes it readable.
            </p>
          </div>
          <div className="memory-panels">
            <article className="memory-panel search-panel">
              <div className="mini-search">
                <Search size={17} />
                <span>the welcome screen</span>
                <span className="keycap">↵</span>
              </div>
              <div className="search-example">
                <span>
                  <i /> TODAY, 13:42 · MESSAGES
                </span>
                <p>
                  “The Atlas <mark>welcome screen</mark> looks good. Could we
                  make the primary action a little clearer?”
                </p>
                <div>
                  <span>1 display</span>
                  <span>Recognized text</span>
                  <ArrowUpRight size={14} />
                </div>
              </div>
              <div className="panel-description">
                <History size={22} />
                <h3>Find the exact moment.</h3>
                <p>
                  Search recognized screen text across your history. Open a
                  snapshot to inspect every display, window context, and the
                  model’s analysis.
                </p>
                <a
                  href="#demo"
                  className="text-link"
                  onClick={() => setDemoTab("History")}
                >
                  Try History in the demo <ArrowUpRight size={14} />
                </a>
              </div>
            </article>
            <article className="memory-panel connections-panel">
              <div className="mini-network" aria-hidden="true">
                <svg viewBox="0 0 440 210">
                  <path d="M92 65L220 106L355 53M220 106L125 178M220 106L338 170M92 65L125 178" />
                  <rect x="156" y="84" width="128" height="44" rx="8" />
                  <text x="220" y="111">
                    Atlas project
                  </text>
                  <rect x="28" y="45" width="128" height="38" rx="7" />
                  <text x="92" y="68">
                    Product design
                  </text>
                  <rect x="308" y="35" width="94" height="38" rx="7" />
                  <text x="355" y="58">
                    SwiftUI
                  </text>
                  <rect x="70" y="159" width="110" height="38" rx="7" />
                  <text x="125" y="182">
                    Research
                  </text>
                  <rect x="277" y="150" width="122" height="38" rx="7" />
                  <text x="338" y="173">
                    Feedback
                  </text>
                </svg>
              </div>
              <div className="panel-description">
                <Network size={22} />
                <h3>See the bigger picture.</h3>
                <p>
                  Explore topics and connections in an interactive knowledge
                  graph. Zoom, pan, rotate, and select a topic to follow the
                  work behind it.
                </p>
                <a
                  href="#demo"
                  className="text-link"
                  onClick={() => setDemoTab("Memory")}
                >
                  Explore Memory in the demo <ArrowUpRight size={14} />
                </a>
              </div>
            </article>
          </div>
          <div className="small-feature-row">
            <article>
              <Monitor size={22} />
              <div>
                <h4>Every screen, one story.</h4>
                <p>
                  Multiple monitors are captured as one snapshot, with the
                  active display and cursor in context.
                </p>
              </div>
            </article>
            <article>
              <ListTodo size={22} />
              <div>
                <h4>Your tasks, connected.</h4>
                <p>
                  Optional Asana integration brings priorities, deadlines, and
                  today’s task activity together.
                </p>
              </div>
            </article>
            <article>
              <SlidersHorizontal size={22} />
              <div>
                <h4>A setup that fits.</h4>
                <p>
                  Manage local models, capture intervals, retention, work hours,
                  and alerts in one place.
                </p>
              </div>
            </article>
          </div>
        </section>
        <section className="workflow-section" id="how-it-works">
          <div className="section-shell">
            <div className="workflow-heading">
              <div>
                <SectionLabel number="03">BEHIND THE QUIET</SectionLabel>
                <h2>
                  A thoughtful loop.
                  <br />
                  <span className="serif">Entirely on your Mac.</span>
                </h2>
              </div>
              <p>
                A native app, local models, and a local memory.
                <br />
                Each has a small, specific job.
              </p>
            </div>
            <div className="workflow-steps">
              {workflow.map((step) => (
                <article key={step.title}>
                  <div className="workflow-step-top">
                    <span>{step.number}</span>
                    <step.icon size={23} strokeWidth={1.5} />
                  </div>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </article>
              ))}
            </div>
            <div className="architecture-strip">
              <span>
                <Monitor size={17} />
                <strong>Native macOS app</strong>
                <small>Capture + Apple Vision OCR</small>
              </span>
              <ArrowRight size={17} />
              <span>
                <Layers size={17} />
                <strong>Local backend</strong>
                <small>FastAPI + SQLite + Qdrant</small>
              </span>
              <ArrowRight size={17} />
              <span>
                <Sparkles size={17} />
                <strong>Ollama on your Mac</strong>
                <small>Vision + language + embeddings</small>
              </span>
              <div className="architecture-badge">
                <LockKeyhole size={13} /> Local by design
              </div>
            </div>
            <p className="workflow-footnote">
              Capture pauses for sleep, lock, and idle. Unchanged screens use
              heartbeats; analysis is queued when context changes.
            </p>
          </div>
        </section>
        <section className="privacy-section section-shell" id="privacy">
          <div className="privacy-copy">
            <SectionLabel number="04">PERSONAL MEANS PERSONAL</SectionLabel>
            <h2>
              Your day is yours.
              <br />
              <span className="serif">It should stay that way.</span>
            </h2>
            <p>
              Screenshots can hold a lot of your life. Warden processes your
              activity on your machine, with local models and local storage.
            </p>
            <a
              className="text-link"
              href="#guide"
              onClick={() => setGuideTab("storage")}
            >
              Read the setup & privacy details <ArrowUpRight size={15} />
            </a>
          </div>
          <div className="privacy-details">
            <div className="privacy-seal">
              <LockKeyhole size={24} />
              <span>
                ON YOUR MAC<span>BY DESIGN</span>
              </span>
              <ShieldCheck size={18} />
            </div>
            <div className="privacy-row">
              <Check size={17} />
              <div>
                <strong>No cloud AI for screen analysis.</strong>
                <p>
                  Ollama handles inference locally. Activity and memory stay in
                  your local data directory.
                </p>
              </div>
            </div>
            <div className="privacy-row">
              <Check size={17} />
              <div>
                <strong>No Warden telemetry.</strong>
                <p>
                  No usage analytics, crash reporting, or update checks in
                  Warden itself.
                </p>
              </div>
            </div>
            <div className="privacy-row">
              <Check size={17} />
              <div>
                <strong>Controls you can reach.</strong>
                <p>
                  Stop capture, adjust retention, and delete stored images. OCR
                  and memory have separate lifecycles.
                </p>
              </div>
            </div>
            <div className="privacy-fineprint">
              <Network size={16} />
              <p>
                <strong>Local doesn’t mean never online.</strong> Setup and
                model downloads use the network. Asana connects only when you
                enable it. Docker Desktop and Ollama have their own update and
                analytics settings.
              </p>
            </div>
          </div>
        </section>
        <Guide tab={guideTab} setTab={setGuideTab} />
        <section className="faq-section section-shell" id="faq">
          <div>
            <SectionLabel number="06">A FEW GOOD QUESTIONS</SectionLabel>
            <h2>
              The little
              <br />
              <span className="serif">things to know.</span>
            </h2>
            <p>Clarity is part of the product.</p>
          </div>
          <div className="faq-list">
            {faqs.map(([q, a], i) => (
              <article className={openFAQ === i ? "open" : ""} key={q}>
                <h3>
                  <button
                    onClick={() => setOpenFAQ(openFAQ === i ? null : i)}
                    aria-expanded={openFAQ === i}
                    aria-controls={`faq-${i}`}
                  >
                    {q}
                    {openFAQ === i ? <Minus size={17} /> : <Plus size={17} />}
                  </button>
                </h3>
                <div id={`faq-${i}`} hidden={openFAQ !== i}>
                  <p>{a}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
        <section className="closing-section section-shell">
          <Mark />
          <span className="eyebrow">LESS DRIFT. MORE DIRECTION.</span>
          <h2>
            Make room for
            <br />
            <span className="serif">what matters.</span>
          </h2>
          <p>A little awareness can change the shape of a day.</p>
          <ButtonLink href="#guide">
            Get to know Warden <ArrowUpRight size={17} />
          </ButtonLink>
          <span className="closing-note">
            Built for your Mac. Designed around you.
          </span>
        </section>
      </main>
      <footer className="site-footer section-shell">
        <a className="brand" href="#">
          <Mark small />
          <span>warden</span>
        </a>
        <p>A local companion for intentional work.</p>
        <nav aria-label="Footer navigation">
          <a href="#privacy">Privacy</a>
          <a href="#guide">Field guide</a>
          <a href="#faq">FAQ</a>
          <a
            href="https://github.com/sepezho/warden-site"
            target="_blank"
            rel="noreferrer"
          >
            Site source <ArrowUpRight size={12} />
          </a>
        </nav>
        <span>Made with intention.</span>
      </footer>
    </>
  );
}
