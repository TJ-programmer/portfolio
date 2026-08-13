"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import {
  achievements,
  contact,
  heroStats,
  identity,
  internships,
  projects,
  skills,
  techMarquee,
} from "@/lib/content";
import { Pill } from "@/components/ui/Pill";
import { Section } from "@/components/ui/Section";
import { Loader } from "@/components/Loader";
import {
  ArrowIcon,
  BatIcon,
  BoltIcon,
  CodeIcon,
  ExternalIcon,
  GithubIcon,
  GlobeIcon,
  HackerrankIcon,
  LinkedinIcon,
  MailIcon,
  NeuralIcon,
  ServerIcon,
  VolumeIcon,
} from "@/components/icons";
import { disableAmbientSound, enableAmbientSound } from "@/lib/audio";

const NeuralScene = dynamic(() => import("@/components/three/NeuralScene"), {
  ssr: false,
  loading: () => <div className="canvas-fallback" aria-hidden="true" />,
});

const skillIcons: Record<string, React.ReactNode> = {
  code: <CodeIcon size={26} />,
  neural: <NeuralIcon size={26} />,
  globe: <GlobeIcon size={26} />,
  server: <ServerIcon size={26} />,
};

const navLinks = [
  { id: "about", label: "about" },
  { id: "skills", label: "arsenal" },
  { id: "projects", label: "missions" },
  { id: "achievements", label: "record" },
  { id: "contact", label: "signal" },
];

export default function Home() {
  const [soundEnabled, setSoundEnabled] = useState(false);

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    if (next) enableAmbientSound();
    else disableAmbientSound();
  };

  return (
    <main>
      <Loader />
      <ScrollProgress />
      <a className="skip-link" href="#projects">Skip to missions</a>
      <NeuralScene />
      <RainOverlay />
      <Navigation soundEnabled={soundEnabled} onSoundToggle={toggleSound} />
      <Hero />
      <TechMarquee />
      <About />
      <Stats />
      <Skills />
      <Projects />
      <Achievements />
      <Internships />
      <Contact />
      <Footer />
    </main>
  );
}

/* ---------- scroll progress ---------- */
function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setProgress(max > 0 ? window.scrollY / max : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="scroll-progress" aria-hidden="true">
      <div className="scroll-progress-fill" style={{ transform: `scaleX(${progress})` }} />
    </div>
  );
}

/* ---------- rain overlay ---------- */
function RainOverlay() {
  return <div className="rain-overlay" aria-hidden="true" />;
}

/* ---------- navigation ---------- */
function Navigation({
  soundEnabled,
  onSoundToggle,
}: {
  soundEnabled: boolean;
  onSoundToggle: () => void;
}) {
  return (
    <header className="site-nav">
      <a className="brand" href="#top" aria-label="Tarun J home">
        <BatIcon size={30} />
      </a>
      <nav aria-label="Main navigation">
        {navLinks.map((link) => (
          <a key={link.id} href={`#${link.id}`}>
            {link.label}
          </a>
        ))}
      </nav>
      <button
        className="icon-button"
        type="button"
        aria-label={soundEnabled ? "Mute ambient sound" : "Enable ambient sound"}
        onClick={onSoundToggle}
      >
        <VolumeIcon size={15} muted={!soundEnabled} />
        <span>{soundEnabled ? "ON" : "OFF"}</span>
      </button>
    </header>
  );
}

/* ---------- hero ---------- */
function Hero() {
  return (
    <section id="top" className="hero-section" aria-labelledby="hero-title">
      <div className="bat-signal-spotlight" aria-hidden="true">
        <div className="spotlight-cone" />
        <div className="spotlight-logo">
          <BatIcon size={72} />
        </div>
      </div>

      <motion.div
        className="hero-copy"
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: "easeOut", delay: 0.35 }}
      >
        <p className="eyebrow">Gotham-grade AI systems</p>
        <h1 id="hero-title" className="glitch-title" data-text="TARUN J">
          TARUN J
        </h1>
        <p className="hero-role">
          <span className="role-bracket">[</span>
          AI End-to-End Developer
          <span className="role-bracket">]</span>
        </p>
        <p className="hero-text">
          I take a signal and follow it all the way — cleaning raw data, training models
          that actually hold up, and shipping sharp interfaces that survive the night.
          From local RAG assistants to deployed AI products, I build the whole pipeline.
        </p>
        <div className="hero-actions">
          <a className="primary-button" href="#projects">
            <BatIcon size={14} /> View missions
          </a>
          <a className="secondary-button" href="#contact">
            Light the signal <ArrowIcon size={14} />
          </a>
        </div>
      </motion.div>

      <div className="gotham-skyline" aria-hidden="true">
        {Array.from({ length: 18 }, (_, i) => (
          <span key={i} />
        ))}
      </div>

      <div className="scroll-cue" aria-hidden="true">
        <span />
      </div>
    </section>
  );
}

/* ---------- tech marquee ---------- */
function TechMarquee() {
  const items = [...techMarquee, ...techMarquee];
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {items.map((item, i) => (
          <span key={i} className="marquee-item">
            <BoltIcon size={12} /> {item}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ---------- about ---------- */
function About() {
  return (
    <Section id="about" eyebrow="Case file" title="A builder trained for the long night.">
      <div className="about-grid">
        <div className="prose-panel">
          <p>
            {identity.degree} student at {identity.college}. I focus on converting strong
            programming fundamentals into AI projects that prove the full path — from raw
            data to a deployed, working product.
          </p>
          <p>
            I&apos;ve shipped a local-first RAG study assistant, a legal chatbot for the judiciary
            ecosystem, a vision-powered calorie tracker, and more. Right now I&apos;m sharpening
            PyTorch, NLP, and MLOps while working at the enterprise scale.
          </p>
          <div className="currently-learning">
            <span className="eyebrow">Currently in the lab</span>
            <div className="pill-wrap">
              {["PyTorch", "NLP", "MLOps", "FastAPI", "Docker"].map((item) => (
                <Pill key={item}>{item}</Pill>
              ))}
            </div>
          </div>
        </div>
        <div className="id-panel" aria-label="Profile facts">
          <div className="card-emblem" aria-hidden="true">
            <BatIcon size={48} />
          </div>
          <span className="eyebrow">Identity</span>
          <strong>{identity.degree.split("—")[0].trim()}</strong>
          <p>{identity.college}</p>
          <div className="metric-row">
            <div>
              <small>Batch</small>
              <b>{identity.batch}</b>
            </div>
            <div>
              <small>CGPA</small>
              <b>{identity.cgpa}</b>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ---------- stats ---------- */
function Stats() {
  return (
    <div className="stats-strip" aria-label="Highlights">
      {heroStats.map((stat) => (
        <div className="stat-cell" key={stat.label}>
          <div className="stat-number">
            <Counter value={stat.value} suffix={stat.suffix} />
          </div>
          <div className="stat-label">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const start = performance.now();
    const duration = 1400;
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      setDisplay(Math.round(value * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value]);

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}

/* ---------- skills ---------- */
function Skills() {
  return (
    <Section id="skills" eyebrow="Utility belt" title="Tools for signal, code, and deployment.">
      <div className="skill-grid">
        {skills.map((group, i) => (
          <SkillCard key={group.group} group={group} icon={skillIcons[group.icon]} index={i} />
        ))}
      </div>
    </Section>
  );
}

function SkillCard({
  group,
  icon,
  index,
}: {
  group: { group: string; items: string[] };
  icon: React.ReactNode;
  index: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.article
      ref={ref}
      className="skill-card"
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.1, duration: 0.5 }}
    >
      <div className="skill-icon" aria-hidden="true">
        {icon}
      </div>
      <h3>{group.group}</h3>
      <div className="pill-wrap">
        {group.items.map((item) => (
          <Pill key={item}>{item}</Pill>
        ))}
      </div>
    </motion.article>
  );
}

/* ---------- projects ---------- */
function Projects() {
  return (
    <Section id="projects" eyebrow="Missions" title="Operations across the AI pipeline.">
      <div className="project-grid">
        {projects.map((project, i) => (
          <motion.article
            className={`project-card ${project.featured ? "featured" : ""}`}
            key={project.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ delay: i * 0.08, duration: 0.5 }}
          >
            <div className="project-header">
              <div className="project-index">{String(i + 1).padStart(2, "0")}</div>
              <div className="project-status" data-status={project.status}>
                {project.status}
              </div>
            </div>
            <div className="project-emblem" aria-hidden="true">
              <BatIcon size={20} />
            </div>
            <h3>{project.title}</h3>
            <p className="project-tagline">{project.tagline}</p>
            <p className="project-description">{project.description}</p>
            <div className="pill-wrap">
              {project.stack.map((item) => (
                <Pill key={item}>{item}</Pill>
              ))}
            </div>
            <div className="project-links">
              {project.links.map((link) => (
                <a key={link.label} href={link.href} target="_blank" rel="noreferrer" aria-label={`${project.title} — ${link.label}`}>
                  {link.label} <ExternalIcon size={13} />
                </a>
              ))}
              {project.language && <span className="project-lang">{project.language}</span>}
            </div>
          </motion.article>
        ))}
      </div>
    </Section>
  );
}

/* ---------- achievements ---------- */
function Achievements() {
  return (
    <Section id="achievements" eyebrow="Evidence board" title="Signals gathered along the route.">
      <div className="timeline" aria-label="Certifications and achievements timeline">
        {achievements.map((item, i) => (
          <motion.article
            className="timeline-item"
            key={`${item.year}-${item.title}`}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.45 }}
          >
            <div className="timeline-bat" aria-hidden="true">
              <BatIcon size={16} />
            </div>
            <span>{item.year}</span>
            <h3>{item.title}</h3>
            <p>{item.detail}</p>
          </motion.article>
        ))}
      </div>
    </Section>
  );
}

/* ---------- internships ---------- */
function Internships() {
  return (
    <Section id="internships" eyebrow="Field work" title="Industry exposure from the watchtower.">
      <div className="internship-list">
        {internships.map((internship) => (
          <motion.article
            className="internship-card"
            key={internship.company}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="internship-meta">
              <span>{internship.period}</span>
              <h3>{internship.company}</h3>
              <p className="internship-role">{internship.role}</p>
            </div>
            <div className="internship-body">
              <ul>
                {internship.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
              <div className="pill-wrap">
                {internship.stack.map((item) => (
                  <Pill key={item}>{item}</Pill>
                ))}
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </Section>
  );
}

/* ---------- contact ---------- */
function Contact() {
  const links = [
    { label: "Email", href: `mailto:${contact.email}`, icon: <MailIcon size={16} /> },
    { label: "GitHub", href: contact.github, icon: <GithubIcon size={16} /> },
    { label: "LinkedIn", href: contact.linkedin, icon: <LinkedinIcon size={16} /> },
  ];
  if (contact.hackerrank) {
    links.push({ label: "HackerRank", href: contact.hackerrank, icon: <HackerrankIcon size={16} /> });
  }

  return (
    <Section id="contact" eyebrow="Signal" title="Light the signal for the next build.">
      <div className="contact-grid">
        <div className="prose-panel">
          <p>
            Open to AI, software, data, and product-building opportunities. If you have a
            case worth solving together, my signal is always on.
          </p>
          <div className="contact-links">
            {links.map((link) => (
              <a key={link.label} href={link.href} target="_blank" rel="noreferrer">
                {link.icon} {link.label}
              </a>
            ))}
          </div>
        </div>
        <form
          className="contact-form"
          action={`mailto:${contact.email}`}
          method="post"
          encType="text/plain"
        >
          <label>
            Name
            <input name="name" autoComplete="name" required />
          </label>
          <label>
            Email
            <input name="email" type="email" autoComplete="email" required />
          </label>
          <label>
            Message
            <textarea name="message" rows={5} required />
          </label>
          <button className="primary-button" type="submit">
            <BatIcon size={14} /> Send signal
          </button>
        </form>
      </div>
    </Section>
  );
}

/* ---------- footer ---------- */
function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-mark" aria-hidden="true">
        <BatIcon size={26} />
      </div>
      <p>
        TARUN J — AI End-to-End Developer. Built in the dark, for the dark.
      </p>
      <a href="#top" className="footer-top">
        Back to top <ArrowIcon size={13} />
      </a>
    </footer>
  );
}
