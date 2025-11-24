import { ReactNode } from "react";

export interface FileNode {
  type: 'file' | 'folder';
  name: string;
  content?: string | ReactNode;
  children?: FileNode[];
  icon?: string;
}

export interface WindowState {
  id: string;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  component: ReactNode;
  icon: ReactNode;
  zIndex: number;
}

export interface Project {
  title: string;
  tech: string[];
  description: string;
  date: string;
  type: string;
}

export interface Skill {
  category: string;
  items: string[];
}

export interface Video {
  id: string;
  title: string;
  filename: string;
  duration: string;
  path: string;
  thumbnail?: string;
}
