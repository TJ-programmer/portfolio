export const skills = [
  {
    group: "Core arsenal",
    icon: "⚔️",
    items: ["Python", "C", "C++", "JavaScript", "SQL"],
  },
  {
    group: "AI / ML",
    icon: "🧠",
    items: ["NumPy", "Pandas", "scikit-learn", "PyTorch", "NLP"],
  },
  {
    group: "Web & APIs",
    icon: "🌐",
    items: ["React", "Next.js", "FastAPI", "REST APIs", "Tailwind CSS"],
  },
  {
    group: "Deployment",
    icon: "🚀",
    items: ["Git", "Docker", "Vercel", "MySQL", "ServiceNow"],
  },
];

export const projects = [
  {
    title: "Project Nightfall",
    featured: true,
    status: "In progress",
    problem: "Demonstrate a complete AI pipeline from raw data to a live, usable product.",
    description:
      "End-to-end AI mission: dataset collection and cleaning → model training → FastAPI serving → React frontend → Docker deployment. Reserved for the flagship project currently in development.",
    stack: ["Python", "PyTorch", "FastAPI", "React", "Docker"],
    links: [{ label: "Coming soon", href: "#contact" }],
  },
  {
    title: "EyeLink Recon System",
    featured: true,
    status: "Built",
    problem: "Enable hands-free computer interaction using eye movement and IR sensor signals.",
    description:
      "AI-assisted HCI system that captures eye-tracking signals, processes them in real time, and maps gaze patterns to control inputs — combining embedded hardware with signal processing logic.",
    stack: ["Embedded systems", "Signal processing", "Python", "HCI", "IR sensors"],
    links: [{ label: "Add demo link", href: "#contact" }],
  },
  {
    title: "Gotham Reservations Console",
    featured: false,
    status: "Built",
    problem: "Build a reliable room booking system with real-time availability and database operations.",
    description:
      "Hotel room reservation system with booking workflows, availability checks, and structured database operations. Focused on data structures, system design, and user-facing flows.",
    stack: ["C++", "SQL", "Data structures", "System design"],
    links: [{ label: "Add GitHub link", href: "#contact" }],
  },
  {
    title: "Batcave Learning Lab",
    featured: false,
    status: "Ongoing",
    problem: "Build a visible, structured learning track for AI/ML tools and deployment practices.",
    description:
      "A public learning log covering PyTorch experiments, NLP mini-projects, MLOps tooling, and reproducible AI workflows. Honest about what is in progress versus what is shipped.",
    stack: ["PyTorch", "MLOps", "NLP", "Docker", "Jupyter"],
    links: [{ label: "View roadmap", href: "#skills" }],
  },
];

export const achievements = [
  {
    year: "2023",
    title: "Core training",
    detail:
      "Built strong fundamentals in C, C++, Python, and algorithmic problem-solving. Established the programming base that everything else runs on.",
  },
  {
    year: "2024",
    title: "First field exposure",
    detail:
      "Completed AI internship at Inters Tech. Started converting academic AI interest into real project and workplace context.",
  },
  {
    year: "2024",
    title: "HackerRank stars",
    detail:
      "Earned multi-star ratings in Python and problem-solving on HackerRank, validating core coding ability.",
  },
  {
    year: "2026",
    title: "Enterprise field work",
    detail:
      "ServiceNow internship — enterprise SaaS platform, workflow automation, and team delivery practices at scale.",
  },
];

export const internships = [
  {
    company: "ServiceNow",
    role: "AI / Software Development Intern",
    period: "May 2026 – July 2026",
    points: [
      "Worked on the ServiceNow platform building and improving workflow automation features.",
      "Used JavaScript / GlideScript to extend platform modules and integrate REST APIs.",
      "Collaborated in an Agile team with daily standups and sprint reviews.",
      "Gained hands-on exposure to enterprise AI/automation tooling and large-scale SaaS development.",
    ],
    stack: ["ServiceNow Platform", "JavaScript", "GlideScript", "REST APIs", "Agile"],
  },
  {
    company: "Inters Tech",
    role: "Artificial Intelligence Intern",
    period: "2024",
    points: [
      "Assisted in data collection, preprocessing, and model experimentation for an AI project.",
      "Worked with Python AI/ML libraries including pandas and scikit-learn.",
      "Contributed to a deliverable script/tool under mentor guidance.",
    ],
    stack: ["Python", "pandas", "scikit-learn", "Data preprocessing"],
  },
];
