"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { achievements, internships, projects, skills } from "@/lib/content";
import { Pill } from "@/components/ui/Pill";
import { Section } from "@/components/ui/Section";

const NeuralScene = dynamic(() => import("@/components/three/NeuralScene"), {
  ssr: false,
  loading: () => <div className="canvas-fallback" aria-hidden="true" />,
});

export default function Home() {
  const [soundEnabled, setSoundEnabled] = useState(false);

  return (
    <main>
      <a className="skip-link" href="#projects">Skip to projects</a>
      <NeuralScene />
      <RainOverlay />
      <Navigation soundEnabled={soundEnabled} onSoundToggle={() => setSoundEnabled(v => !v)} />
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Achievements />
      <Internships />
      <Contact />
    </main>
  );
}

/* ─── Rain overlay (CSS-driven, no JS) ─── */
function RainOverlay() {
  return <div className="rain-overlay" aria-hidden="true" />;
}

/* ─── Navigation ─── */
function Navigation({ soundEnabled, onSoundToggle }: { soundEnabled: boolean; onSoundToggle: () => void }) {
  const links = ["about", "skills", "projects", "internships", "contact"];
  return (
    <header className="site-nav">
      <a className="brand" href="#top" aria-label="Tarun J home">
        <BatIcon size={28} />
      </a>
      <nav aria-label="Main navigation">
        {links.map(link => (
          <a key={link} href={`#${link}`}>{link}</a>
        ))}
      </nav>
      <button
        className="icon-button"
        type="button"
        aria-label={soundEnabled ? "Mute" : "Sound on"}
        onClick={onSoundToggle}
      >
        {soundEnabled ? "◉ ON" : "◎ OFF"}
      </button>
    </header>
  );
}

/* ─── Hero ─── */
function Hero() {
  return (
    <section id="top" className="hero-section" aria-labelledby="hero-title">
      {/* Bat-signal spotlight */}
      <div className="bat-signal-spotlight" aria-hidden="true">
        <div className="spotlight-cone" />
        <div className="spotlight-logo">
          <BatIcon size={64} />
        </div>
      </div>

      {/* Batman silhouette */}
      <div className="batman-figure" aria-hidden="true">
        <BatmanSilhouette />
      </div>

      <motion.div
        className="hero-copy"
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: "easeOut", delay: 0.2 }}
      >
        <p className="eyebrow">Gotham-grade AI systems</p>
        <h1 id="hero-title" className="glitch-title" data-text="TARUN J">TARUN J</h1>
        <p className="hero-role">
          <span className="role-bracket">[</span>
          AI End-to-End Developer
          <span className="role-bracket">]</span>
        </p>
        <p className="hero-text">
          Building like a detective-engineer — tracking raw signals, training useful models,
          shipping sharp interfaces, and deploying products that hold up when the night gets loud.
        </p>
        <div className="hero-actions">
          <a className="primary-button" href="#projects">
            <BatIcon size={14} /> View missions
          </a>
          <a className="secondary-button" href="#contact">
            Light the signal
          </a>
        </div>
      </motion.div>

      {/* Gotham skyline */}
      <div className="gotham-skyline" aria-hidden="true">
        {Array.from({ length: 18 }, (_, i) => <span key={i} />)}
      </div>

      <div className="scroll-cue" aria-hidden="true"><span /></div>
    </section>
  );
}

/* ─── About ─── */
function About() {
  return (
    <Section id="about" eyebrow="Case file" title="A builder trained for the long night.">
      <div className="about-grid">
        <div className="prose-panel">
          <p>
            Second-year B.Tech student in Artificial Intelligence &amp; Data Science at
            Sri Eshwar College of Engineering. My focus is converting strong programming
            fundamentals into AI projects that prove the full path — from raw data to
            a deployed, working product.
          </p>
          <p>
            Currently deepening skills in PyTorch, NLP, and MLOps while building
            real pipeline projects. The portfolio reflects where I am now and where
            the trajectory is heading.
          </p>
          <div className="currently-learning">
            <span className="eyebrow">Currently learning</span>
            <div className="pill-wrap">
              {["PyTorch", "NLP", "MLOps", "FastAPI", "Docker"].map(item => (
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
          <strong>B.Tech AIDS</strong>
          <p>Sri Eshwar College of Engineering</p>
          <div className="metric-row">
            <div>
              <small>Batch</small>
              <b>2023–2027</b>
            </div>
            <div>
              <small>CGPA</small>
              <b>7.77</b>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ─── Skills ─── */
function Skills() {
  return (
    <Section id="skills" eyebrow="Utility belt" title="Tools for signal, code, and deployment.">
      <div className="skill-grid">
        {skills.map((group, i) => (
          <SkillCard key={group.group} group={group} index={i} />
        ))}
      </div>
    </Section>
  );
}

function SkillCard({ group, index }: { group: { group: string; icon: string; items: string[] }; index: number }) {
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
      <div className="skill-icon" aria-hidden="true">{group.icon}</div>
      <h3>{group.group}</h3>
      <div className="pill-wrap">
        {group.items.map(item => <Pill key={item}>{item}</Pill>)}
      </div>
    </motion.article>
  );
}

/* ─── Projects ─── */
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
            <p className="project-problem"><strong>Problem:</strong> {project.problem}</p>
            <p>{project.description}</p>
            <div className="pill-wrap">
              {project.stack.map(item => <Pill key={item}>{item}</Pill>)}
            </div>
            <div className="project-links">
              {project.links.map(link => (
                <a key={link.label} href={link.href} aria-label={`${project.title} — ${link.label}`}>
                  {link.label}
                </a>
              ))}
            </div>
          </motion.article>
        ))}
      </div>
    </Section>
  );
}

/* ─── Achievements ─── */
function Achievements() {
  return (
    <Section id="achievements" eyebrow="Evidence board" title="Signals gathered along the route.">
      <div className="timeline" aria-label="Certifications and achievements timeline">
        {achievements.map((item, i) => (
          <motion.article
            className="timeline-item"
            key={item.title}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.45 }}
          >
            <div className="timeline-bat" aria-hidden="true"><BatIcon size={16} /></div>
            <span>{item.year}</span>
            <h3>{item.title}</h3>
            <p>{item.detail}</p>
          </motion.article>
        ))}
      </div>
    </Section>
  );
}

/* ─── Internships ─── */
function Internships() {
  return (
    <Section id="internships" eyebrow="Field work" title="Industry exposure from the watchtower.">
      <div className="internship-list">
        {internships.map(internship => (
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
                {internship.points.map(point => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
              <div className="pill-wrap">
                {internship.stack.map(item => <Pill key={item}>{item}</Pill>)}
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </Section>
  );
}

/* ─── Contact ─── */
function Contact() {
  return (
    <Section id="contact" eyebrow="Signal" title="Light the signal for the next build.">
      <div className="contact-grid">
        <div className="prose-panel">
          <p>
            Open to AI, software, data, and product-building opportunities.
            Replace the placeholder links below with your real GitHub, LinkedIn,
            HackerRank, and email before launch.
          </p>
          <div className="contact-links">
            <a href="mailto:tarun@example.com">✉ Email</a>
            <a href="https://www.linkedin.com" target="_blank" rel="noreferrer">in LinkedIn</a>
            <a href="https://github.com" target="_blank" rel="noreferrer">⌥ GitHub</a>
            <a href="https://www.hackerrank.com" target="_blank" rel="noreferrer">★ HackerRank</a>
          </div>
        </div>
        <form className="contact-form" action="mailto:tarun@example.com" method="post" encType="text/plain">
          <label>Name<input name="name" autoComplete="name" required /></label>
          <label>Email<input name="email" type="email" autoComplete="email" required /></label>
          <label>Message<textarea name="message" rows={5} required /></label>
          <button className="primary-button" type="submit">
            <BatIcon size={14} /> Send signal
          </button>
        </form>
      </div>
    </Section>
  );
}

/* ─── Batman SVG Silhouette ─── */
function BatmanSilhouette() {
  return (
    <svg
      viewBox="0 0 400 520"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="batman-svg"
      aria-hidden="true"
    >
      {/* Cape — left wing */}
      <path
        className="batman-cape"
        d="M200 480 C160 420 60 380 10 260 C40 280 80 300 110 290 C90 240 70 180 80 120 C120 160 150 200 160 240 C170 200 180 160 200 140"
        fill="#0a0c10"
        stroke="rgba(255,216,77,0.15)"
        strokeWidth="1"
      />
      {/* Cape — right wing */}
      <path
        className="batman-cape"
        d="M200 480 C240 420 340 380 390 260 C360 280 320 300 290 290 C310 240 330 180 320 120 C280 160 250 200 240 240 C230 200 220 160 200 140"
        fill="#0a0c10"
        stroke="rgba(255,216,77,0.15)"
        strokeWidth="1"
      />
      {/* Body */}
      <path
        d="M170 300 L160 420 L200 440 L240 420 L230 300 Z"
        fill="#0d0f14"
        stroke="rgba(255,216,77,0.2)"
        strokeWidth="0.8"
      />
      {/* Chest bat symbol */}
      <path
        d="M185 340 C182 332 175 328 170 330 C172 336 176 340 180 340 C176 344 172 350 174 356 C180 352 186 346 190 342 C194 346 200 352 206 356 C208 350 204 344 200 340 C204 340 208 336 210 330 C205 328 198 332 195 340 Z"
        fill="rgba(255,216,77,0.7)"
        filter="url(#glow)"
      />
      {/* Head */}
      <ellipse cx="200" cy="200" rx="28" ry="32" fill="#0d0f14" stroke="rgba(255,216,77,0.18)" strokeWidth="0.8" />
      {/* Left ear */}
      <path d="M178 182 L168 152 L186 172 Z" fill="#0d0f14" stroke="rgba(255,216,77,0.2)" strokeWidth="0.8" />
      {/* Right ear */}
      <path d="M222 182 L232 152 L214 172 Z" fill="#0d0f14" stroke="rgba(255,216,77,0.2)" strokeWidth="0.8" />
      {/* Mask eyes */}
      <path d="M186 196 L178 192 L182 200 Z" fill="rgba(255,216,77,0.9)" />
      <path d="M214 196 L222 192 L218 200 Z" fill="rgba(255,216,77,0.9)" />
      {/* Shoulders */}
      <path d="M172 300 C155 290 145 270 148 250 L172 260 Z" fill="#0d0f14" stroke="rgba(255,216,77,0.15)" strokeWidth="0.8" />
      <path d="M228 300 C245 290 255 270 252 250 L228 260 Z" fill="#0d0f14" stroke="rgba(255,216,77,0.15)" strokeWidth="0.8" />
      {/* Utility belt */}
      <rect x="168" y="355" width="64" height="10" rx="2" fill="rgba(255,216,77,0.25)" />
      <rect x="196" y="353" width="8" height="14" rx="1" fill="rgba(255,216,77,0.6)" />
      {/* Glow filter */}
      <defs>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
    </svg>
  );
}

/* ─── Bat icon (reusable) ─── */
function BatIcon({ size = 24 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size * 0.44}
      viewBox="0 0 100 44"
      fill="currentColor"
      aria-hidden="true"
      className="bat-icon"
    >
      <path d="M0 18 L14 8 L27 20 L37 4 L50 16 L63 4 L73 20 L86 8 L100 18 L82 28 L62 24 L50 38 L38 24 L18 28 Z" />
    </svg>
  );
}
