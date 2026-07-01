export interface MultilingualText {
  ar: string;
  tr: string;
}

export interface NewsItem {
  id: string;
  title: MultilingualText;
  content: MultilingualText;
  image: string;
  category: MultilingualText; // e.g. "Announcements" | "University Updates" | "Student Union News"
  date: string; // YYYY-MM-DD
  tags: MultilingualText[]; // array of tags
  views: number;
}

export interface DriveFile {
  id: string;
  name: MultilingualText;
  type: 'pdf' | 'doc' | 'video' | 'link' | 'zip';
  size?: string;
  url: string;
}

export interface DriveFolder {
  id: string;
  name: MultilingualText;
  files: DriveFile[];
}

export interface CourseFile {
  id: string;
  name: string;
  url: string; // Base64 data URI or path
  size?: string;
  type?: string;
}

export interface CourseItem {
  id: string;
  title: MultilingualText;
  faculty: MultilingualText;
  department: MultilingualText;
  category?: MultilingualText; // e.g. "Computer Engineering", "Language Prep", "Mathematics"
  description: MultilingualText;
  pdfUrl?: string; // Data URI or mock URL
  pdfName?: string;
  pdfFiles?: CourseFile[]; // Array of uploaded files
  videoUrl?: string;
  externalUrl?: string;
  dateAdded: string;
  driveUrl?: string; // Real or simulated Google Drive folder link
  driveFolders?: DriveFolder[]; // Organized folder hierarchy
  year?: MultilingualText;
  semester?: MultilingualText;
  registrations?: Array<{ 
    name: string; 
    studentId: string; 
    phone: string; 
    email: string; 
    firstName?: string; 
    lastName?: string; 
    major?: string; 
  }>;
}

export interface ActivityItem {
  id: string;
  title: MultilingualText;
  description: MultilingualText;
  date: string; // YYYY-MM-DD
  time?: string;
  location: MultilingualText;
  image: string;
  registrationEnabled: boolean;
  registeredCount: number;
  maxSeats?: number;
  registrations?: Array<{ 
    name: string; 
    studentId: string; 
    phone: string; 
    email: string; 
    firstName?: string; 
    lastName?: string; 
    major?: string; 
  }>;
  isPast?: boolean;
}

export interface ImportantLink {
  id: string;
  title: MultilingualText;
  description: MultilingualText;
  url: string;
  iconName: string; // Name of Lucide Icon, e.g. "Globe", "BookOpen", "GraduationCap"
}

export interface Faculty {
  name: MultilingualText;
  departments: MultilingualText[];
}

export interface UniversityInfo {
  id: string;
  description: MultilingualText;
  history: MultilingualText;
  faculties: Faculty[];
  contactEmail: string;
  contactPhone: string;
  address: MultilingualText;
  mapEmbedUrl?: string;
}

export interface TopAnnouncement {
  id: string;
  text: MultilingualText;
  type: 'info' | 'warning' | 'critical';
  active: boolean;
}

export type Language = 'ar' | 'tr';

export interface DeptAnnouncementItem {
  id: string;
  title: MultilingualText;
  faculty: MultilingualText;
  department: MultilingualText;
  description: MultilingualText;
  dateAdded: string;
  pdfFiles?: CourseFile[]; // Attachments
  externalUrl?: string;
}

export interface UniversityNewsItem {
  id: string;
  titleTr: string;
  titleAr: string;
  contentTr: string;
  contentAr: string;
  date: string;
  categoryTr: string;
  categoryAr: string;
  link: string;
  isRelevantToForeigners: boolean;
}

