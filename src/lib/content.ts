export const contact = {
  email: "tarunjj2006@gmail.com",
  github: "https://github.com/TJ-programmer",
  githubHandle: "TJ-programmer",
  linkedin: "https://www.linkedin.com/in/tarun-j-66a374247/",
  hackerrank: "https://www.hackerrank.com/profile/tarunjj2006",
};

export const identity = {
  name: "Tarun J",
  degree: "B.Tech — Artificial Intelligence & Data Science",
  college: "Sri Eshwar College of Engineering",
  batch: "2023–2027",
  cgpa: "7.77",
  location: "Coimbatore, India",
};

export const heroStats = [
  { value: 17, suffix: "+", label: "GitHub repositories" },
  { value: 8, suffix: "+", label: "Projects built" },
  { value: 3, suffix: "", label: "Internships" },
  { value: 4, suffix: "", label: "Credentials & awards" },
];

export const techMarquee = [
  "Python",
  "PyTorch",
  "TensorFlow",
  "scikit-learn",
  "NumPy",
  "Pandas",
  "NLP",
  "RAG",
  "FastAPI",
  "React",
  "Next.js",
  "Node.js",
  "TypeScript",
  "Tailwind CSS",
  "SQL",
  "MongoDB",
  "Docker",
  "Git",
  "Streamlit",
  "CrewAI",
  "Three.js",
  "GSAP",
];

export const skills = [
  {
    group: "Core arsenal",
    icon: "code",
    items: ["Python", "C", "C++", "JavaScript", "TypeScript", "SQL"],
  },
  {
    group: "AI / ML",
    icon: "neural",
    items: ["NumPy", "Pandas", "scikit-learn", "PyTorch", "NLP", "RAG"],
  },
  {
    group: "Web & APIs",
    icon: "globe",
    items: ["React", "Next.js", "FastAPI", "Node.js", "REST APIs", "Tailwind CSS"],
  },
  {
    group: "Deployment",
    icon: "server",
    items: ["Git", "Docker", "Vercel", "MySQL", "MongoDB", "ServiceNow"],
  },
];

export type Project = {
  title: string;
  tagline: string;
  description: string;
  stack: string[];
  links: { label: string; href: string }[];
  status: string;
  featured: boolean;
  language?: string;
};

export const projects: Project[] = [
  {
    title: "StudyMate",
    tagline: "Local-first AI study assistant",
    description:
      "Upload a PDF, ask questions against its content, and pull up related YouTube videos without leaving the app. Runs a local llama GGUF model with RAG over Qdrant, a FastAPI ingestion/retrieval backend, and a React chat + PDF viewer.",
    stack: ["React", "FastAPI", "Qdrant", "llama.cpp", "RAG"],
    links: [{ label: "View mission", href: "https://github.com/TJ-programmer/Studymate" }],
    status: "Shipped",
    featured: true,
    language: "JavaScript",
  },
  {
    title: "JustTalks — Legal Assistant",
    tagline: "Chatbot for the judiciary ecosystem",
    description:
      "An intelligent legal chatbot combining RAG over IPC code PDFs with live web search and file-upload retrieval, plus a community page. Full-stack: Node + Express + React with MongoDB and a multi-agent question pipeline.",
    stack: ["Node.js", "React", "MongoDB", "RAG", "IPC Codes"],
    links: [{ label: "View mission", href: "https://github.com/TJ-programmer/Justalks-legal_assitance_ai" }],
    status: "Shipped",
    featured: true,
    language: "JavaScript",
  },
  {
    title: "Cal-AI",
    tagline: "Photo-based calorie intelligence",
    description:
      "AI-assisted calorie tracker that analyzes meal and workout photos with vision models (YOLO / Gemini / OpenAI), verifies every log, and tracks daily macros with coach notes.",
    stack: ["React", "Node.js", "Express", "MongoDB", "YOLO", "Gemini"],
    links: [{ label: "View mission", href: "https://github.com/TJ-programmer/Cal-AI" }],
    status: "Shipped",
    featured: true,
    language: "JavaScript",
  },
  {
    title: "Smart AI Gallery",
    tagline: "Self-organizing photo gallery",
    description:
      "An AI-powered gallery web app that organizes photos automatically using machine learning features, so the library stays sorted without manual folders.",
    stack: ["TypeScript", "React", "ML features"],
    links: [{ label: "View mission", href: "https://github.com/TJ-programmer/smart-ai-gallery" }],
    status: "Shipped",
    featured: false,
    language: "TypeScript",
  },
  {
    title: "AI Resume Summarizer",
    tagline: "CrewAI agent that reads your resume",
    description:
      "A Streamlit application that uses LLMs, RAG, and CrewAI agents to analyze resumes across content, skills, and market fit — then answers questions about the resume and exports a full PDF report.",
    stack: ["Python", "Streamlit", "CrewAI", "RAG", "LLM"],
    links: [{ label: "View mission", href: "https://github.com/TJ-programmer/Ai-Resume-summarizer" }],
    status: "Shipped",
    featured: false,
    language: "Python",
  },
  {
    title: "Introvert vs Extrovert Predictor",
    tagline: "Kaggle personality classification",
    description:
      "A data-driven Kaggle challenge classifying people as introverts or extroverts from behavioral signals — time alone, stage fear, social event attendance — using interpretable ML pipelines and thorough EDA.",
    stack: ["Python", "scikit-learn", "Pandas", "EDA"],
    links: [
      {
        label: "View mission",
        href: "https://github.com/TJ-programmer/Kaggle-Predict-the-Introverts-from-the-Extroverts",
      },
    ],
    status: "Shipped",
    featured: false,
    language: "Jupyter",
  },
  {
    title: "FF Tournament Tracker",
    tagline: "Live esports standings + admin panel",
    description:
      "A live tournament scoreboard with auto-refreshing standings, player kill leaderboards, fixtures, and a PIN-protected admin panel that exports JSON for publishing.",
    stack: ["HTML", "CSS", "JavaScript", "JSON"],
    links: [{ label: "View mission", href: "https://github.com/TJ-programmer/ff-tournament" }],
    status: "Shipped",
    featured: false,
    language: "HTML",
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
      "Completed an AI internship at Inters Tech, converting academic AI interest into real project and workplace context.",
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
      "Built and improved workflow automation features on the ServiceNow platform.",
      "Used JavaScript / GlideScript to extend platform modules and integrate REST APIs.",
      "Hands-on with ServiceNow AI capabilities — Now Assist, AI Search, AI UX, AICT (Agentic AI Control Tower), OTTO AI, and more.",
      "Collaborated in an Agile team with daily standups and sprint reviews.",
      "Gained hands-on exposure to enterprise AI/automation tooling and large-scale SaaS development.",
    ],
    stack: [
      "ServiceNow Platform",
      "JavaScript",
      "GlideScript",
      "REST APIs",
      "Agile",
      "Now Assist",
      "AI Search",
      "AI UX",
      "AICT",
      "OTTO AI",
    ],
  },
  {
    company: "Inters Tech",
    role: "Artificial Intelligence Intern",
    period: "2024",
    points: [
      "Assisted in data collection, preprocessing, and model experimentation for an AI project.",
      "Worked with Python AI/ML libraries including pandas and scikit-learn.",
      "Contributed a deliverable script/tool under mentor guidance.",
    ],
    stack: ["Python", "pandas", "scikit-learn", "Data preprocessing"],
  },
];
