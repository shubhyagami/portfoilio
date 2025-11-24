import React from 'react';
import { Project, Skill } from './types';

export const RESUME_DATA = {
  name: "Shubh Kumar",
  role: "Electronics & Communication Engineer | Software Developer",
  location: "Dhanbad, Jharkhand",
  email: "aec.ece.shubhkumar.2025.078@gmail.com",
  phone: "+91 7493980105",
  linkedin: "https://www.linkedin.com/in/shubh-kumar-733773187/",
  summary: "Electronics & Communication Engineering graduate with strong foundations in robotics, automation, and software development. Proficient in Java, Python, Spring Boot, Arduino, and MySQL. Passionate about building intelligent automation and software solutions.",
};

export const SKILLS: Skill[] = [
  { category: "Programming", items: ["Java", "Python", "C", "JavaScript"] },
  { category: "Frameworks", items: ["Spring Boot", "JSP", "Thymeleaf"] },
  { category: "Databases", items: ["MySQL", "H2 Database"] },
  { category: "DevOps & Tools", items: ["Docker", "Git", "Maven", "Linux", "Arduino IDE"] },
  { category: "Hardware & IoT", items: ["Arduino", "Raspberry Pi", "ESP Boards", "Embedded Systems"] },
];

export const PROJECTS: Project[] = [
  {
    title: "Chat-in-terminal",
    type: "Anonymous Chat App",
    tech: ["Spring Boot", "WebSocket", "Docker", "Java"],
    date: "Oct 2025",
    description: "Real-time terminal-style chat application. Implemented live communication via STOMP protocol, dynamic chat rooms with unique URLs, and containerized using Docker.",
  },
  {
    title: "Ethan: E-Waste Robot",
    type: "Robotics / AI",
    tech: ["Python", "Robotics", "Ultrasonic Sensors"],
    date: "Sept 2023",
    description: "Human-sized robot built from e-waste. Features dual displays for interaction, ultrasonic sensors for user detection, and lightweight AI for conversation. Inspired by Call of Duty.",
  },
  {
    title: "CloudBucket",
    type: "Cloud Storage",
    tech: ["Spring Boot", "MySQL", "Thymeleaf", "AWS S3 Concepts"],
    date: "Mar 2025",
    description: "Lightweight cloud storage application providing simple file upload, view, and download capabilities with Spring Security authentication.",
  },
  {
    title: "Game-DB-Console",
    type: "Web Application",
    tech: ["Java", "JSP", "Servlets", "HTML/CSS"],
    date: "Jul 2024",
    description: "Scalable web app for gamer profiles, statistics, and user interactions ensuring high availability.",
  },
  {
    title: "Pnumated Robotic Arm",
    type: "Automation Hardware",
    tech: ["Arduino", "Solenoid Valves", "Air Pressure"],
    date: "Feb 2023",
    description: "Precise lightweight control robotic arm using air pressure. Mimics human body movements suitable for industrial automation.",
  }
];

export const BOOT_LOGS = [
  "BIOS Date 01/01/25 15:23:01 Ver: 08.00.15",
  "CPU: Intel(R) Core(TM) i9-14900K CPU @ 6.00GHz",
  "Memory Test: 65536K OK",
  "Detecting Primary Master ... SHUBH-SSD-1TB",
  "Detecting Primary Slave ... None",
  "Booting from local disk...",
  "Loading Kernel...",
  "[  0.000000] Linux version 6.8.9-arch1-1 (shubh@archlinux) (gcc 13.2.1)",
  "[  0.234120] ACPI: Added _OSI(Linux)",
  "[  0.512341] systemd[1]: Detected architecture x86-64.",
  "[  0.891231] Mounting /dev/sda1 to /root...",
  "[  1.023123] Starting Graphics Interface...",
  "[  1.450000] Loading Personal Modules...",
  "[  1.600000] Loading Java Runtime Environment...",
  "[  1.800000] Initializing Spring Boot Context...",
  "[  2.000000] Calibrating Robotics Sensors...",
  "[  2.200000] Connecting to Neural Network...",
  "Welcome to ShubhOS v1.0",
];

export const VIRTUAL_FILESYSTEM = {
  // Folder for Games: Preconfigured paths as requested
  games: [
    {
      id: 'contra',
      filename: 'Contra (USA).nes',
      title: 'Contra',
      size: '128KB',
      path: '/games/Contra (USA).nes',
      color: 'red',
      desc: 'Konami • Action'
    },
    {
      id: 'mario2',
      filename: 'Super Mario Bros. 2 (USA) (Rev 1).nes',
      title: 'Super Mario Bros 2',
      size: '256KB',
      path: '/games/Super Mario Bros. 2 (USA) (Rev 1).nes',
      color: 'blue',
      desc: 'Nintendo • Platformer'
    },
    {
      id: '150in1',
      filename: '150-in-1 (Mapper 202) [p1][!].nes',
      title: '150 in 1',
      size: '184KB',
      path: '/games/150-in-1 (Mapper 202) [p1][!].nes',
      color: 'yellow',
      desc: 'Unlicensed • Compilation'
    },
    {
      id: 'contraforce',
      filename: 'Contra Force (USA).nes',
      title: 'Contra Force',
      size: '256KB',
      path: '/games/Contra Force (USA).nes',
      color: 'orange',
      desc: 'Konami • Action'
    },
    {
      id: 'dk',
      filename: 'Donkey Kong Classics (USA, Europe).nes',
      title: 'Donkey Kong Classics',
      size: '48KB',
      path: '/games/Donkey Kong Classics (USA, Europe).nes',
      color: 'purple',
      desc: 'Nintendo • Arcade'
    },
    {
      id: 'pacman',
      filename: 'Pac-Man (USA) (Namco).nes',
      title: 'Pac-Man',
      size: '24KB',
      path: '/games/Pac-Man (USA) (Namco).nes',
      color: 'yellow',
      desc: 'Namco • Arcade'
    },
    {
      id: 'mario1',
      filename: 'Super Mario Bros (PC10).nes',
      title: 'Super Mario Bros',
      size: '48KB',
      path: '/games/Super Mario Bros (PC10).nes',
      color: 'red',
      desc: 'Nintendo • Platformer'
    },
    {
      id: 'tetris',
      filename: 'Tetris (USA) (Tengen) (Unl).nes',
      title: 'Tetris',
      size: '48KB',
      path: '/games/Tetris (USA) (Tengen) (Unl).nes',
      color: 'green',
      desc: 'Tengen • Puzzle'
    },
  ],
  // Folder for Music: Add files here for the Music Player
  music: [
    { filename: 'cyber_city_ost.mp3', title: 'Cyber City', artist: 'Synthwave', duration: 184, path: '/music/cyber_city_ost.mp3' },
    { filename: 'night_call.mp3', title: 'Night Call', artist: 'ShubhOS Mix', duration: 210, path: '/music/night_call.mp3' },
    { filename: 'coding_flow.mp3', title: 'Coding Flow', artist: 'Lo-Fi Beats', duration: 156, path: '/music/coding_flow.mp3' },
    { filename: 'retro_vibe.mp3', title: 'Retro Vibe', artist: 'Arcade Sounds', duration: 145, path: '/music/retro_vibe.mp3' },
  ],
  videos: [
    {
      id: 'vid1',
      title: 'Heat Waves',
      filename: 'Glass Animals - Heat Waves (Official Video).mp4',
      duration: '3:55',
      path: '/videos/Glass Animals - Heat Waves (Official Video).mp4',
    },
    {
      id: 'vid2',
      title: 'Sunflower',
      filename: 'Post Malone, Swae Lee - Sunflower (Spider-Man_ Into the Spider-Verse) (Official Video).mp4',
      duration: '2:41',
      path: '/videos/Post Malone, Swae Lee - Sunflower (Spider-Man_ Into the Spider-Verse) (Official Video).mp4',
    },
    {
      id: 'vid3',
      title: 'After Hours',
      filename: 'The Weeknd - After Hours (Audio).mp4',
      duration: '6:01',
      path: '/videos/The Weeknd - After Hours (Audio).mp4',
    },
    {
      id: 'vid4',
      title: 'Blinding Lights',
      filename: 'The Weeknd - Blinding Lights (Official Video).mp4',
      duration: '4:22',
      path: '/videos/The Weeknd - Blinding Lights (Official Video).mp4',
    },
    {
      id: 'vid5',
      title: 'Heartless',
      filename: 'The Weeknd - Heartless (Official Video).mp4',
      duration: '3:21',
      path: '/videos/The Weeknd - Heartless (Official Video).mp4',
    },
    {
      id: 'vid6',
      title: 'I Feel It Coming',
      filename: 'The Weeknd - I Feel It Coming ft. Daft Punk (Official Video).mp4',
      duration: '4:58',
      path: '/videos/The Weeknd - I Feel It Coming ft. Daft Punk (Official Video).mp4',
    },
  ]
};