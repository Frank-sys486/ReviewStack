export interface ReviewerConcept {
  exactWord: string;
  mnemonic: string;
  elementaryExplanation: string;
  example: string;
}

export interface QuizItem {
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}

export interface StudyGuide {
  id: string;
  title: string;
  examName: string;
  level: string;
  concepts: ReviewerConcept[];
  summary: string;
  quiz: QuizItem[];
  createdDate: string;
  studentId: string;
  originalMarkdown?: string;
}

export interface StudentAccount {
  id: string;
  name: string;
  email: string;
  password?: string;
  grade: string; // e.g. "Junior Undergraduate", "Senior Undergraduate"
  major: string; // e.g. "Computer Science", "Biochemistry"
  university: string; // e.g. "Stamford University", "State College"
  credits: number;
  createdDate: string;
}

export interface Transaction {
  id: string;
  studentId: string;
  planName: string;
  amount: number;
  creditsAdded: number;
  date: string;
}
