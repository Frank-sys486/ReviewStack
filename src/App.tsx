import React, { useState, useEffect, useRef } from "react";
import { 
  StudentAccount, 
  StudyGuide, 
  ReviewerConcept, 
  QuizItem, 
  Transaction 
} from "./types";
import QuickStartLanding from "./components/QuickStartLanding";
import FlashcardViewer from "./components/FlashcardViewer";
import PracticeQuiz from "./components/PracticeQuiz";
import { 
  CreditCard, 
  FileText, 
  Sparkles, 
  Loader2, 
  Search, 
  History, 
  HelpCircle, 
  Check, 
  ChevronRight, 
  BookOpen, 
  AlertTriangle,
  Lightbulb,
  GraduationCap,
  CloudUpload,
  LayoutDashboard,
  NotebookTabs,
  WalletCards,
  LogOut,
  Trash2,
  WandSparkles,
  ClipboardCheck,
  Target,
  ShieldCheck
} from "lucide-react";

const DEMO_ACCOUNT_EMAIL = (import.meta.env.VITE_DEMO_ACCOUNT_EMAIL || "").trim();
const DEMO_ACCOUNT_PASSWORD = (import.meta.env.VITE_DEMO_ACCOUNT_PASSWORD || "").trim();

const DEMO_STUDENT: StudentAccount = {
  id: "student-demo",
  name: "Jane Doe",
  email: DEMO_ACCOUNT_EMAIL || "demo-session@reviewstack.local",
  password: DEMO_ACCOUNT_PASSWORD || undefined,
  grade: "Junior Undergraduate",
  major: "Biomedical Science",
  university: "Stamford University",
  credits: 45,
  createdDate: new Date().toISOString().split("T")[0],
};

const MOCK_DEMO_GUIDE: StudyGuide = {
  id: "demo-guide-123",
  title: "CS 101: Algorithmic Complexity Core Review",
  examName: "Computer Science Exam 1",
  level: "Accessible Simplification",
  summary:
    "Algorithmic complexity describes how computer operations scale as the workload grows. It helps you compare whether a process stays manageable or becomes too slow when the input gets larger.",
  concepts: [
    {
      exactWord: "Big O Notation",
      sourceMeaning: "Complexity analysis evaluates how runtime or memory requirements scale with input size.",
      mnemonic: "Big O = Big Obstacle: the upper limit you prepare for.",
      elementaryExplanation:
        "Big O is a shorthand for describing how much work an algorithm may need as the input grows. It focuses on the pattern of growth rather than the exact seconds on a clock.",
      example:
        "Searching a stack of N papers one by one takes longer as the stack grows, so the work grows in a straight line.",
    },
    {
      exactWord: "Recursion",
      sourceMeaning: "A function references itself to solve smaller versions of a problem. Every recursion needs a base case.",
      mnemonic: "Recursion = repeat the same task on a smaller piece.",
      elementaryExplanation:
        "Recursion is when a process solves a problem by calling itself on smaller versions of that same problem until it reaches a stopping point.",
      example:
        "Opening nested folders until you reach the final document follows the same action repeatedly until there is nothing left to open.",
    },
    {
      exactWord: "Hash Collision",
      sourceMeaning: "Hash tables can map distinct keys to identical hash indices.",
      mnemonic: "Collision = two items assigned the same slot.",
      elementaryExplanation:
        "A hash collision happens when two different pieces of information point to the same storage location, so the system needs a way to handle both.",
      example:
        "Two students can have the same locker number by mistake, forcing the school to resolve where each person should store their books.",
    },
  ],
  quiz: [
    {
      question: "What does Big O Notation describe?",
      options: [
        "How algorithm work grows as input size increases",
        "The visual size of a program window",
        "The price of running a server",
        "The number of students in a course",
      ],
      answer: "How algorithm work grows as input size increases",
      explanation: "Big O describes the growth pattern of work or memory as input size changes.",
    },
    {
      question: "Why does recursion need a base case?",
      options: [
        "To provide a stopping condition",
        "To change the font size",
        "To encrypt the source code",
        "To increase the screen resolution",
      ],
      answer: "To provide a stopping condition",
      explanation: "Without a base case, recursion may continue calling itself indefinitely.",
    },
  ],
  originalMarkdown:
    "# COURSE NOTES: CS 101 - COMPLEXITY ANALYSIS\n\n## Big O Notation\nComplexity analysis evaluates how runtime or memory requirements scale with input size.\n\n## Recursion\nA function references itself to solve smaller versions of a problem. Every recursion needs a base case.\n\n## Hash Collisions\nHash tables can map distinct keys to identical hash indices.",
  createdDate: new Date().toISOString().split("T")[0],
  studentId: "student-demo",
};

const SEEDED_GUIDES: StudyGuide[] = [
  {
    id: "dummy-disc-math-401",
    title: "Discrete Mathematics: Graph Theory and Matrix Operations",
    examName: "Discrete Math Prep",
    level: "Accessible Simplification",
    summary:
      "Graph theory studies points and the connections between them. It is useful for modeling networks, routes, relationships, and structured decision paths.",
    concepts: [
      {
        exactWord: "Bipartite Graph",
        sourceMeaning: "Bipartite graphs split vertices into two sets.",
        mnemonic: "Bipartite = two parts, cross-connections only.",
        elementaryExplanation:
          "A bipartite graph separates nodes into two groups, and connections only go from one group to the other.",
        example:
          "Customers and restaurants can be modeled as two groups where customers order from restaurants, but customers do not order from other customers.",
      },
      {
        exactWord: "Adjacency Matrix",
        sourceMeaning: "A matrix can represent whether nodes are directly connected.",
        mnemonic: "Adjacency matrix = a connection spreadsheet.",
        elementaryExplanation:
          "An adjacency matrix is a grid that marks whether each pair of nodes is directly connected.",
        example:
          "A flight chart can mark whether there is a direct flight between each pair of cities.",
      },
    ],
    quiz: [
      {
        question: "In a bipartite graph, which connection is not allowed?",
        options: [
          "A connection between two nodes in the same partition",
          "A connection between nodes in different partitions",
          "A connection represented by an edge",
          "A graph with two groups of nodes",
        ],
        answer: "A connection between two nodes in the same partition",
        explanation: "Bipartite graphs only permit edges between the two separate groups.",
      },
    ],
    originalMarkdown:
      "# DISCRETE MATHEMATICS\n\n## Graph Theory\nGraphs contain vertices and edges. Bipartite graphs split vertices into two sets.\n\n## Adjacency Matrix\nA matrix can represent whether nodes are directly connected.",
    createdDate: new Date().toISOString().split("T")[0],
    studentId: "student-demo",
  },
  {
    id: "dummy-bioc-402",
    title: "Biochemistry 301: Oxidative Phosphorylation Pathways",
    examName: "Biochem Midterm 2",
    level: "Accessible Simplification",
    summary:
      "Oxidative phosphorylation is how cells convert energy from food into usable ATP. It relies on electron movement, proton gradients, and ATP synthase activity.",
    concepts: [
      {
        exactWord: "Electron Transport Chain",
        sourceMeaning: "Complexes move electrons and pump protons.",
        mnemonic: "ETC = electrons travel checkpoints.",
        elementaryExplanation:
          "The electron transport chain passes electrons through a sequence of protein complexes, using the released energy to move protons.",
        example:
          "A relay team passes a baton from runner to runner, and each handoff helps move the race forward.",
      },
      {
        exactWord: "ATP Synthase",
        sourceMeaning: "Protons flow through ATP synthase to produce ATP.",
        mnemonic: "Synthase spins to synthesize ATP.",
        elementaryExplanation:
          "ATP synthase uses the flow of protons like a tiny turbine to make ATP, the cell's usable energy molecule.",
        example:
          "A waterwheel turns when water flows through it, converting movement into useful work.",
      },
    ],
    quiz: [
      {
        question: "What powers ATP synthase?",
        options: [
          "The flow of protons down their gradient",
          "The direct movement of ribosomes",
          "The contraction of cell walls",
          "The splitting of chromosomes",
        ],
        answer: "The flow of protons down their gradient",
        explanation: "ATP synthase uses proton flow to drive ATP production.",
      },
    ],
    originalMarkdown:
      "# MITOCHONDRIAL BIOCHEMISTRY\n\n## Oxidative Phosphorylation\nCells generate ATP inside the inner mitochondrial membrane.\n\n## Electron Transport Chain\nComplexes move electrons and pump protons.\n\n## ATP Synthase\nProtons flow through ATP synthase to produce ATP.",
    createdDate: new Date().toISOString().split("T")[0],
    studentId: "student-demo",
  },
];

const upsertDemoStudent = (studentList: StudentAccount[]) => {
  const demoIndex = studentList.findIndex(
    (student) => student.id === DEMO_STUDENT.id || student.email === DEMO_STUDENT.email
  );

  if (demoIndex === -1) {
    return [...studentList, DEMO_STUDENT];
  }

  return studentList.map((student, index) =>
    index === demoIndex
      ? {
          ...student,
          ...DEMO_STUDENT,
          credits: student.credits ?? DEMO_STUDENT.credits,
        }
      : student
  );
};

const mergeSeededGuides = (guideList: StudyGuide[]) => {
  const seededIds = new Set(guideList.map((guide) => guide.id));
  const missingSeededGuides = SEEDED_GUIDES.filter((guide) => !seededIds.has(guide.id));
  return missingSeededGuides.length > 0 ? [...guideList, ...missingSeededGuides] : guideList;
};

const getConceptSourceMeaning = (concept: ReviewerConcept) =>
  concept.sourceMeaning?.trim() || concept.elementaryExplanation;

export default function App() {
  // App navigation state
  const [activeTab, setActiveTab] = useState<"landing" | "workspace" | "reviewer" | "history">("landing");
  
  // Accounts State
  const [students, setStudents] = useState<StudentAccount[]>([]);
  const [currentStudentID, setCurrentStudentID] = useState<string>("");

  // Authentication states
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signUpName, setSignUpName] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [signUpGrade, setSignUpGrade] = useState("Junior Undergraduate");
  const [signUpMajor, setSignUpMajor] = useState("");
  const [signUpUniversity, setSignUpUniversity] = useState("");
  const [authError, setAuthError] = useState("");
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  // Buy Credits State
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<{name: string, price: number, credits: number} | null>(null);
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // PDF Parser State & workspace variables
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [isParsingPDF, setIsParsingPDF] = useState(false);
  const [extractedMarkdown, setExtractedMarkdown] = useState("");
  const [examNameInput, setExamNameInput] = useState("");
  const [vocabularyLevel, setVocabularyLevel] = useState("Accessible Primary Clarity");
  const [isGeneratingWorkspace, setIsGeneratingWorkspace] = useState(false);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  // History & Viewer
  const [savedGuides, setSavedGuides] = useState<StudyGuide[]>([]);
  const [activeGuide, setActiveGuide] = useState<StudyGuide | null>(null);
  const [guideViewerTab, setGuideViewerTab] = useState<"overview" | "dictionary" | "flashcards" | "quiz" | "pdfContent">("overview");
  const [searchHistoryQuery, setSearchHistoryQuery] = useState("");

  // Server Keys Config Status
  const [isApiKeyMissing, setIsApiKeyMissing] = useState(false);

  // Initialize data on load
  useEffect(() => {
    // 1. Fetch config status
    fetch("/api/config-status")
      .then((res) => res.json())
      .then((data) => {
        setIsApiKeyMissing(!data.isConfigured);
      })
      .catch((_) => {
        setIsApiKeyMissing(true);
      });

    // 2. Load accounts from localStorage and seed demo credentials.
    const storedStudents = localStorage.getItem("lesson_reviewer_students");
    let parsedStudents: StudentAccount[] = [];
    if (storedStudents) {
      parsedStudents = JSON.parse(storedStudents);
    }
    parsedStudents = upsertDemoStudent(parsedStudents);
    localStorage.setItem("lesson_reviewer_students", JSON.stringify(parsedStudents));
    setStudents(parsedStudents);

    // Retrieve active logged in session
    const activeSessionID = localStorage.getItem("current_logged_in_student_id");
    if (activeSessionID && parsedStudents.some((student) => student.id === activeSessionID)) {
      setCurrentStudentID(activeSessionID);
    } else {
      localStorage.removeItem("current_logged_in_student_id");
    }

    // 3. Load saved guides and seed demo study guides.
    const storedGuides = localStorage.getItem("lesson_reviewer_guides");
    let parsedGuides: StudyGuide[] = [];
    if (storedGuides) {
      parsedGuides = JSON.parse(storedGuides);
    }
    parsedGuides = mergeSeededGuides(parsedGuides);
    localStorage.setItem("lesson_reviewer_guides", JSON.stringify(parsedGuides));
    setSavedGuides(parsedGuides);
  }, []);

  // Sync to localstorage helper
  const syncStudents = (updatedList: StudentAccount[]) => {
    setStudents(updatedList);
    localStorage.setItem("lesson_reviewer_students", JSON.stringify(updatedList));
  };

  const syncGuides = (updatedGuides: StudyGuide[]) => {
    setSavedGuides(updatedGuides);
    localStorage.setItem("lesson_reviewer_guides", JSON.stringify(updatedGuides));
  };

  // Extract active profile
  const activeStudent = students.find((s) => s.id === currentStudentID) || null;

  // Login click handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    const matched = students.find(
      (s) => s.email.toLowerCase() === loginEmail.trim().toLowerCase() && s.password === loginPassword
    );
    if (matched) {
      setCurrentStudentID(matched.id);
      localStorage.setItem("current_logged_in_student_id", matched.id);
      setLoginEmail("");
      setLoginPassword("");
      setActiveTab("workspace");
    } else {
      setAuthError("Incorrect email or password.");
    }
  };

  // Sign Up handler
  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");

    if (!signUpName.trim() || !signUpEmail.trim() || !signUpPassword.trim()) {
      setAuthError("Please fill out all required fields.");
      return;
    }

    const emailTaken = students.some(
      (s) => s.email.toLowerCase() === signUpEmail.trim().toLowerCase()
    );
    if (emailTaken) {
      setAuthError("Email address is already registered.");
      return;
    }

    const newStudent: StudentAccount = {
      id: "student-" + Date.now(),
      name: signUpName.trim(),
      email: signUpEmail.trim(),
      password: signUpPassword,
      grade: signUpGrade,
      major: signUpMajor.trim() || "Not specified",
      university: signUpUniversity.trim() || "Not specified",
      credits: 30, // 30 free study coins for new collegiate students
      createdDate: new Date().toISOString().split("T")[0]
    };

    const updatedList = [...students, newStudent];
    syncStudents(updatedList);
    setCurrentStudentID(newStudent.id);
    localStorage.setItem("current_logged_in_student_id", newStudent.id);

    // Reset fields
    setSignUpName("");
    setSignUpEmail("");
    setSignUpPassword("");
    setSignUpGrade("Junior Undergraduate");
    setSignUpMajor("");
    setSignUpUniversity("");
    
    // Auto-navigate to workspace
    setActiveTab("workspace");
  };

  // Log Out handler
  const handleLogOut = () => {
    setCurrentStudentID("");
    localStorage.removeItem("current_logged_in_student_id");
    setActiveTab("landing");
  };

  // Buy Credits Action
  const initiateBuyCredits = (plan: {name: string, price: number, credits: number}) => {
    setSelectedPlan(plan);
    setCardNumber("");
    setCardHolder("");
    setCardExpiry("");
    setCardCvv("");
    setPaymentSuccess(false);
    setShowCheckoutModal(true);
  };

  const handleSimulatedPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan || !activeStudent) return;

    setIsProcessingPayment(true);
    // Simulate API authorization wait time
    setTimeout(() => {
      setIsProcessingPayment(false);
      setPaymentSuccess(true);
      
      // Update student credits ledger
      const list = students.map((s) => {
        if (s.id === activeStudent.id) {
          return { ...s, credits: s.credits + selectedPlan.credits };
        }
        return s;
      });
      syncStudents(list);

      // Hide modal after display time
      setTimeout(() => {
        setShowCheckoutModal(false);
        setPaymentSuccess(false);
        setSelectedPlan(null);
      }, 1800);
    }, 1500);
  };

  // Client-Side PDF Parser Action inside user browser session using PDF.js
  const handlePdfFileSelection = async (file: File) => {
    if (!file) return;
    if (file.type !== "application/pdf") {
      alert("Invalid format! Please upload a valid PDF document resource.");
      return;
    }

    setFileToUpload(file);
    setIsParsingPDF(true);

    try {
      // FileReader to read ArrayBuffer
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const arrayBuffer = e.target?.result as ArrayBuffer;
          const pdfjsLib = (window as any)["pdfjs-dist/build/pdf"];
          
          if (!pdfjsLib) {
            throw new Error("PDF parser CDN script is still packing files. Please retry in a second!");
          }

          // Specify global worker src
          pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js";

          // Load PDF array bytes
          const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) });
          const pdf = await loadingTask.promise;

          let convertedMarkdown = `## LESSON SOURCE: ${file.name}\n\n`;
          let totalExtractedWordCount = 0;

          // Parse text contents page-by-page
          for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const textContent = await page.getTextContent();
            
            let lastY = -1;
            let pageString = "";

            for (const item of textContent.items) {
              // Ensure space breaking
              if (lastY !== -1 && Math.abs(item.transform[5] - lastY) > 6) {
                pageString += "\n";
              }
              pageString += item.str + " ";
              lastY = item.transform[5];
            }

            // Simple markdown formatting
            convertedMarkdown += `### Page ${pageNum}\n\n${pageString.trim()}\n\n`;
            totalExtractedWordCount += pageString.split(/\s+/).length;
          }

          setExtractedMarkdown(convertedMarkdown);
          // Set standard exam name based on file title
          const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
          setExamNameInput(cleanName);
        } catch (parseError: any) {
          console.error("PDF.js detailed parse crash:", parseError);
          alert("Could not read PDF text directly. Please make sure it is not an scanned image PDF, or enter your notes in the input block below instead!");
        } finally {
          setIsParsingPDF(false);
        }
      };

      reader.onerror = () => {
        throw new Error("Could not read local file bytes.");
      };

      reader.readAsArrayBuffer(file);
    } catch (criticalFileError: any) {
      alert("Error parsing PDF: " + criticalFileError.message);
      setIsParsingPDF(false);
    }
  };

  // Drag and Drop Handles
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = () => {
    setIsDraggingOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handlePdfFileSelection(e.dataTransfer.files[0]);
    }
  };

  // Initiate custom Generation via Server Side router API
  const handleGenerateStudyGuide = async () => {
    if (!activeStudent) {
      alert("Please select or build a student profile account first!");
      return;
    }

    if (!extractedMarkdown.trim()) {
      alert("Please paste your lesson text notes or upload a PDF first.");
      return;
    }

    // Verify student credits
    if (activeStudent.credits < 1) {
      alert("Your student account has run out of study credits! Please purchase a top-up pack to continue.");
      initiateBuyCredits({name: "Primary Bundle", price: 230, credits: 15});
      return;
    }

    setIsGeneratingWorkspace(true);

    try {
      const response = await fetch("/api/generate-guide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonPlanMarkdown: extractedMarkdown,
          level: vocabularyLevel,
          examName: examNameInput || "Lesson General Exam"
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed while parsing lesson structure from AI model.");
      }

      // Deduct credit
      const updatedStudents = students.map((s) => {
        if (s.id === activeStudent.id) {
          return { ...s, credits: s.credits - 1 };
        }
        return s;
      });
      syncStudents(updatedStudents);

      // Save guide to local list
      const freshGuide: StudyGuide = {
        id: "guide-" + Date.now(),
        title: data.title || `${examNameInput} Study Reviewer`,
        examName: examNameInput || "Unit Exam",
        level: vocabularyLevel,
        concepts: data.concepts || [],
        summary: data.summary || "",
        quiz: data.quiz || [],
        createdDate: new Date().toISOString().split("T")[0],
        studentId: activeStudent.id,
        originalMarkdown: extractedMarkdown
      };

      const revisedGuides = [freshGuide, ...savedGuides];
      syncGuides(revisedGuides);
      setActiveGuide(freshGuide);
      setGuideViewerTab("overview");
      setActiveTab("reviewer");
    } catch (genError: any) {
      console.error("Generator execution failure:", genError);
      alert("Error: " + genError.message);
    } finally {
      setIsGeneratingWorkspace(false);
    }
  };

  // Load target reviewer from history logs
  const handleSelectGuideFromHistory = (guide: StudyGuide) => {
    setActiveGuide(guide);
    setGuideViewerTab("overview");
    setActiveTab("reviewer");
  };

  const handleLaunchMockDemo = () => {
    const updatedStudents = upsertDemoStudent(students);
    const updatedGuides = mergeSeededGuides(savedGuides);

    syncStudents(updatedStudents);
    syncGuides(updatedGuides);
    setCurrentStudentID(DEMO_STUDENT.id);
    localStorage.setItem("current_logged_in_student_id", DEMO_STUDENT.id);
    setActiveGuide(MOCK_DEMO_GUIDE);
    setGuideViewerTab("overview");
    setActiveTab("reviewer");
  };

  // Delete history item
  const handleDeleteGuide = (idToDelete: string) => {
    if (confirm("Are you sure you want to remove this saved review study sheet?")) {
      const filtered = savedGuides.filter((g) => g.id !== idToDelete);
      syncGuides(filtered);
      if (activeGuide?.id === idToDelete) {
        setActiveGuide(null);
      }
    }
  };

  // Filter history list
  const filteredHistoryGuides = savedGuides.filter((g) => {
    const term = searchHistoryQuery.toLowerCase();
    const belongsToActiveStudent = g.studentId === currentStudentID;
    if (!belongsToActiveStudent) return false;
    return g.title.toLowerCase().includes(term) || g.examName.toLowerCase().includes(term);
  });
  const activeStudentGuides = savedGuides.filter((g) => g.studentId === currentStudentID);

  return (
    <div id="main-scaffold" className="min-h-screen bg-[#F7F3EA] text-[#1F2933] flex flex-col font-sans">
      
      {/* API Key Missing warning banner */}
      {isApiKeyMissing && (
        <div id="api-key-warning" className="bg-orange-100 text-orange-950 px-4 py-3 text-center text-sm font-semibold flex items-center justify-center gap-2 border-b border-orange-200">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>
            <strong>Gemini API Key is not set yet!</strong> Please configure your <code>GEMINI_API_KEY</code> variable in the <strong>Settings &gt; Secrets</strong> panel of Google AI Studio.
          </span>
        </div>
      )}

      {/* Primary Top Header Nav */}
      <header id="app-header" className="sticky top-0 z-40 border-b border-teal-900/10 bg-white/90 shadow-sm backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col md:flex-row gap-3 items-center justify-between">
          
          {/* Main Logo (Branding) */}
          <div 
            onClick={() => setActiveTab("landing")} 
            className="flex items-center gap-3 cursor-pointer group flex-shrink-0 justify-center md:justify-start"
          >
            <div className="p-2 bg-[#2F5D50] text-white rounded-xl shadow-sm group-hover:bg-[#254A40] transition-colors duration-200">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div className="text-left">
              <span className="text-base sm:text-lg font-black tracking-normal text-[#1F2933] group-hover:text-[#2F5D50] transition-colors block leading-tight">
                ReviewStack
              </span>
              <span className="text-[10px] font-mono text-slate-500 block uppercase font-bold tracking-wider leading-none mt-0.5">
                PDF to Study Desk
              </span>
            </div>
          </div>

          {/* Centered Top Navigation Segment (requirement 3) */}
          {activeStudent ? (
            <div className="flex justify-center flex-1 md:px-4 w-full md:w-auto overflow-x-auto">
              <nav className="flex items-center gap-1 bg-[#EEF4EF] border border-teal-900/10 p-1 rounded-xl w-fit">
                <button
                  onClick={() => {
                    setActiveTab("workspace");
                    setShowProfileDropdown(false);
                  }}
                  className={`inline-flex cursor-pointer items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-colors duration-200 whitespace-nowrap ${
                    activeTab === "workspace"
                      ? "bg-white text-[#2F5D50] shadow-sm"
                      : "text-slate-600 hover:text-[#1F2933]"
                  }`}
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  Workspace
                </button>
                <button
                  onClick={() => {
                    setActiveTab("history");
                    setShowProfileDropdown(false);
                  }}
                  className={`inline-flex cursor-pointer items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-colors duration-200 whitespace-nowrap ${
                    activeTab === "history"
                      ? "bg-white text-[#2F5D50] shadow-sm"
                      : "text-slate-600 hover:text-[#1F2933]"
                  }`}
                >
                  <NotebookTabs className="w-3.5 h-3.5" />
                  Saved ({activeStudentGuides.length})
                </button>
                {activeGuide && (
                  <button
                    onClick={() => {
                      setActiveTab("reviewer");
                      setShowProfileDropdown(false);
                    }}
                    className={`inline-flex cursor-pointer items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-colors duration-200 whitespace-nowrap ${
                      activeTab === "reviewer"
                        ? "bg-white text-[#2F5D50] shadow-sm"
                        : "text-slate-600 hover:text-[#1F2933]"
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    Active Review
                  </button>
                )}
              </nav>
            </div>
          ) : (
            <div className="hidden md:block flex-1"></div>
          )}

          {/* Student Account Info, Credits, and Dropdown Trigger (requirement 4) */}
          {activeStudent ? (
            <div className="flex items-center gap-3 flex-shrink-0 justify-center md:justify-end">
              
              {/* Credit Ledger pill */}
              <div className="flex items-center gap-1.5 px-3 py-2 bg-white border border-teal-900/10 rounded-xl shadow-sm">
                <WalletCards className="w-4 h-4 text-[#2F5D50]" />
                <span className="text-xs font-bold text-slate-700">
                  <strong className="text-[#1F2933] font-black">{activeStudent.credits}</strong> coins
                </span>
                
                {/* Buy Link */}
                <button
                  onClick={() => initiateBuyCredits({name: "Super Pack", price: 520, credits: 50})}
                  className="ml-1 px-2 py-0.5 text-[10px] bg-[#B45309] hover:bg-[#92400E] text-white font-mono uppercase font-black rounded-md tracking-wider transition-colors duration-200 cursor-pointer"
                >
                  Buy
                </button>
              </div>

              {/* Profile Avatar logo trigger (Dropdown) */}
              <div className="relative">
                <button 
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className="flex items-center justify-center w-10 h-10 bg-[#1F2933] hover:bg-[#2F5D50] text-white rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-300 transition-colors duration-200 group relative border border-white cursor-pointer"
                  aria-label="Open account menu"
                >
                  <span className="text-xs font-bold font-mono tracking-tighter">
                    {activeStudent.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                  </span>
                  <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-white bg-emerald-400"></span>
                </button>

                {showProfileDropdown && (
                  <>
                    {/* Click-out overlay */}
                    <div 
                      className="fixed inset-0 z-40 cursor-default" 
                      onClick={() => setShowProfileDropdown(false)}
                    />
                    <div className="absolute right-0 mt-3.5 w-72 bg-white rounded-2xl shadow-xl border border-teal-900/10 py-4 px-4 z-50 space-y-3.5 animate-fade-up text-left">
                      {/* User Header Profile */}
                      <div className="border-b border-slate-100 pb-3 flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-full bg-[#EEF4EF] text-[#2F5D50] flex items-center justify-center font-bold text-xs">
                          {activeStudent.name[0].toUpperCase()}
                        </div>
                        <div className="text-xs overflow-hidden">
                          <span className="block font-black text-[#1F2933] truncate text-xs font-sans">
                            {activeStudent.name}
                          </span>
                          <span className="block text-[10px] text-slate-500 truncate font-mono">
                            {activeStudent.email}
                          </span>
                        </div>
                      </div>

                      {/* Academic detail rows */}
                      <div className="space-y-2 text-xs text-slate-600">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold">Year</span>
                          <span className="font-medium text-slate-800 text-right">{activeStudent.grade}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold">Major</span>
                          <span className="font-medium text-slate-800 text-right">{activeStudent.major}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold">Univ</span>
                          <span className="font-medium text-slate-800 text-right truncate max-w-[120px]">{activeStudent.university}</span>
                        </div>
                      </div>

                      {/* Action items inside menu */}
                      <div className="border-t border-slate-100 pt-3">
                        <button
                          onClick={() => {
                            setShowProfileDropdown(false);
                            handleLogOut();
                          }}
                          className="w-full py-2.5 hover:bg-rose-50 border border-slate-200 hover:border-rose-100 text-slate-600 hover:text-rose-600 text-xs font-bold rounded-xl transition-colors duration-200 text-center font-sans cursor-pointer flex items-center justify-center gap-2"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          Sign Out of Account
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>

            </div>
          ) : (
            <button
              id="btn-nav-login"
              onClick={() => setActiveTab("workspace")}
              className="px-4 py-2 bg-[#2F5D50] hover:bg-[#254A40] text-white text-xs font-bold rounded-xl shadow-sm transition-colors duration-200 cursor-pointer"
            >
              Log In
            </button>
          )}
        </div>
      </header>

      {/* Main Workspace Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        
        {/* SECURE UNDERGRADUATE AUTH PORTAL */}
        {!activeStudent && activeTab !== "landing" && (
          <div id="auth-viewport" className="max-w-5xl mx-auto py-10 animate-fade-up">
            <div className="grid overflow-hidden rounded-3xl border border-teal-900/10 bg-white shadow-xl shadow-teal-950/5 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="hidden bg-[#1F2933] p-8 text-white lg:flex lg:flex-col lg:justify-between">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-bold text-teal-50">
                    <ShieldCheck className="h-4 w-4 text-[#B45309]" />
                    Local student profile
                  </div>
                  <h2 className="mt-8 text-3xl font-black tracking-normal">Keep every reviewer tied to your study account.</h2>
                  <p className="mt-4 text-sm leading-7 text-teal-50">
                    Sign in to save generated guides, revisit flashcards, and keep your study coin balance visible while you prepare.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="rounded-xl border border-white/10 bg-white/10 p-4">
                    <div className="text-2xl font-black">{activeStudentGuides.length}</div>
                    <div className="mt-1 text-teal-100">Saved guides</div>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/10 p-4">
                    <div className="text-2xl font-black">30</div>
                    <div className="mt-1 text-teal-100">Starter coins</div>
                  </div>
                </div>
              </div>
              <div className="p-6 sm:p-8 lg:p-10 space-y-6">
              
              {/* Header Branding */}
              <div className="text-center space-y-2">
                <div className="p-3 bg-[#EEF4EF] text-[#2F5D50] rounded-2xl w-fit mx-auto shadow-sm">
                  <GraduationCap className="w-8 h-8 text-[#2F5D50]" />
                </div>
                <h2 className="text-2xl font-black text-[#1F2933] tracking-normal">
                  {isSignUpMode ? "Create Academic Account" : "Welcome Back"}
                </h2>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  {isSignUpMode 
                    ? "Create a local profile to save reviewers and track study coins." 
                    : "Sign in with your profile or use the demo account."}
                </p>
              </div>

              {authError && (
                <div className="p-3 bg-rose-50 border border-rose-100 text-rose-700 rounded-xl text-xs font-semibold text-center" role="alert">
                  {authError}
                </div>
              )}

              {/* Form block */}
              {!isSignUpMode ? (
                /* LOGIN FORM */
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-1.5">
                    <label htmlFor="login-email" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Email</label>
                    <input
                      id="login-email"
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="student@university.edu"
                      className="w-full text-xs sm:text-sm p-3 border border-slate-200 rounded-xl bg-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#2F5D50] focus:bg-white transition"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="login-password" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Password</label>
                    <input
                      id="login-password"
                      type="password"
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Your password"
                      className="w-full text-xs sm:text-sm p-3 border border-slate-200 rounded-xl bg-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#2F5D50] focus:bg-white transition"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-[#2F5D50] hover:bg-[#254A40] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors duration-200 shadow-sm cursor-pointer"
                  >
                    Log in
                  </button>
                </form>
              ) : (
                /* SIGN UP FORM */
                <form onSubmit={handleSignUp} className="space-y-3.5 flex flex-col">
                  <div className="space-y-1">
                    <label htmlFor="signup-name" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Full Student Name</label>
                    <input
                      id="signup-name"
                      type="text"
                      required
                      value={signUpName}
                      onChange={(e) => setSignUpName(e.target.value)}
                      placeholder="e.g. Johnathan Smith"
                      className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#2F5D50] focus:bg-white transition"
                    />
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="signup-email" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Email</label>
                    <input
                      id="signup-email"
                      type="email"
                      required
                      value={signUpEmail}
                      onChange={(e) => setSignUpEmail(e.target.value)}
                      placeholder="e.g. student@university.edu"
                      className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#2F5D50] focus:bg-white transition"
                    />
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="signup-password" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Password</label>
                    <input
                      id="signup-password"
                      type="password"
                      required
                      value={signUpPassword}
                      onChange={(e) => setSignUpPassword(e.target.value)}
                      placeholder="Minimum 6 characters"
                      className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#2F5D50] focus:bg-white transition"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label htmlFor="signup-major" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Academic Major</label>
                      <input
                        id="signup-major"
                        type="text"
                        value={signUpMajor}
                        onChange={(e) => setSignUpMajor(e.target.value)}
                        placeholder="e.g. Computer Science"
                        className="w-full text-xs p-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2F5D50] cursor-pointer text-slate-700 bg-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="signup-university" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">University</label>
                      <input
                        id="signup-university"
                        type="text"
                        value={signUpUniversity}
                        onChange={(e) => setSignUpUniversity(e.target.value)}
                        placeholder="e.g. Your school"
                        className="w-full text-xs p-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2F5D50] cursor-pointer text-slate-700 bg-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="signup-grade" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Class Level</label>
                    <select
                      id="signup-grade"
                      value={signUpGrade}
                      onChange={(e) => setSignUpGrade(e.target.value)}
                      className="w-full text-xs p-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2F5D50] cursor-pointer font-sans text-slate-700 bg-white"
                    >
                      <option value="Freshman Undergraduate">Freshman Student (Year 1)</option>
                      <option value="Sophomore Undergraduate">Sophomore Student (Year 2)</option>
                      <option value="Junior Undergraduate">Junior Student (Year 3)</option>
                      <option value="Senior Undergraduate">Senior Student (Year 4)</option>
                      <option value="Graduate Candidate">Graduate School</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 mt-1.5 bg-[#2F5D50] hover:bg-[#254A40] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors duration-200 shadow-sm cursor-pointer"
                  >
                    Register and Login
                  </button>
                </form>
              )}

              {/* Login Toggle */}
              <div className="text-center pt-2">
                <button
                  onClick={() => {
                    setIsSignUpMode(!isSignUpMode);
                    setAuthError("");
                  }}
                  className="text-xs text-[#2F5D50] hover:text-[#254A40] hover:underline font-bold cursor-pointer"
                >
                  {isSignUpMode 
                    ? "Already have an account? Sign In" 
                    : "register Now"}
                </button>
              </div>

              </div>
            </div>
          </div>
        )}

        {activeTab === "landing" && (
          <QuickStartLanding
            onStart={() => setActiveTab("workspace")}
            onViewDemo={handleLaunchMockDemo}
          />
        )}

        {/* STUDY WORKSPACE (UPLOADER & BUILD PANEL) */}
        {activeStudent && activeTab === "workspace" && (
          <div id="workspace-grid" className="space-y-6 animate-fade-up">
            <section className="rounded-lg border border-slate-200 bg-[#FBFAF6] px-5 py-4 shadow-sm">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-bold text-slate-600">
                    <Target className="h-3.5 w-3.5 text-[#2F5D50]" />
                    {activeStudent.name}'s study desk
                  </div>
                  <h2 className="mt-3 font-display text-3xl font-semibold tracking-normal text-[#1F2933]">
                    Source notes on the left. Reviewer settings on the right.
                  </h2>
                  <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-600">
                    Paste or upload course material, choose how it should be simplified, then generate a focused reviewer.
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="rounded-md border border-slate-200 bg-white px-3 py-2">
                    <div className="font-mono text-base font-black text-[#1F2933]">{activeStudent.credits}</div>
                    <div className="text-slate-500">Coins</div>
                  </div>
                  <div className="rounded-md border border-slate-200 bg-white px-3 py-2">
                    <div className="font-mono text-base font-black text-[#1F2933]">{activeStudentGuides.length}</div>
                    <div className="text-slate-500">Guides</div>
                  </div>
                  <div className="rounded-md border border-slate-200 bg-white px-3 py-2">
                    <div className="font-mono text-base font-black text-[#1F2933]">{extractedMarkdown.trim() ? "Ready" : "Empty"}</div>
                    <div className="text-slate-500">Notes</div>
                  </div>
                </div>
              </div>
            </section>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              <div className="lg:col-span-8 space-y-6">
                <section className="bg-white p-5 sm:p-6 rounded-lg border border-teal-900/10 shadow-sm space-y-5">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="text-lg sm:text-xl font-black text-[#1F2933] flex items-center gap-2">
                        <FileText className="w-5 h-5 text-[#2F5D50]" /> Source Material
                      </h3>
                      <p className="text-slate-600 text-xs sm:text-sm mt-1">
                        Upload a PDF or paste lesson notes. The text stays editable before generation.
                      </p>
                    </div>
                    {extractedMarkdown && (
                      <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-emerald-700">
                        <Check className="h-3.5 w-3.5" />
                        Text loaded
                      </span>
                    )}
                  </div>

                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`relative rounded-lg border-2 border-dashed p-6 text-center transition-colors duration-200 cursor-pointer ${
                      isDraggingOver
                        ? "border-[#2F5D50] bg-[#EEF4EF]"
                        : "border-teal-900/15 bg-[#F8FAFC] hover:border-[#2F5D50]/70"
                    }`}
                  >
                    <input
                      id="file-upload-input"
                      type="file"
                      accept="application/pdf"
                      aria-label="Upload lesson PDF"
                      onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                          handlePdfFileSelection(e.target.files[0]);
                        }
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#EEF4EF] text-[#2F5D50]">
                        {isParsingPDF ? (
                          <Loader2 className="w-6 h-6 animate-spin" />
                        ) : (
                          <CloudUpload className="w-6 h-6" />
                        )}
                      </div>
                      {isParsingPDF ? (
                        <div>
                          <p className="text-sm font-bold text-[#2F5D50]">Parsing PDF inside this browser session...</p>
                          <p className="text-xs text-slate-500 mt-1">Reading page text and preserving headings.</p>
                        </div>
                      ) : (
                        <div>
                          <p className="text-sm font-bold text-[#1F2933]">
                            {fileToUpload ? fileToUpload.name : "Drop a PDF here or click to browse"}
                          </p>
                          <p className="text-xs text-slate-500 mt-1">
                            Standard PDF, up to 10MB.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs text-slate-500 font-mono">
                      <label htmlFor="lesson-text-editor" className="font-bold flex items-center gap-1 text-slate-600">
                        Session Lesson Text
                      </label>
                      <span>{extractedMarkdown.length.toLocaleString()} chars</span>
                    </div>
                    <textarea
                      id="lesson-text-editor"
                      value={extractedMarkdown}
                      onChange={(e) => setExtractedMarkdown(e.target.value)}
                      placeholder="Paste lecture notes, textbook excerpts, definitions, or extracted PDF content here."
                      className="w-full min-h-80 p-4 text-xs sm:text-sm bg-[#F8FAFC] border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F5D50] focus:bg-white font-mono transition-all leading-relaxed resize-y"
                    />
                  </div>
                </section>
              </div>

              <div className="lg:col-span-4 space-y-6">
                <section className="bg-white p-5 sm:p-6 rounded-lg border border-teal-900/10 shadow-sm space-y-5">
                  <div>
                    <h3 className="text-lg font-black text-[#1F2933] flex items-center gap-2">
                      <WandSparkles className="w-5 h-5 text-[#B45309]" /> Generation Settings
                    </h3>
                    <p className="text-slate-600 text-xs mt-1">Tune the output for the exam and learner level.</p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label htmlFor="exam-title-input" className="text-xs font-bold text-slate-600 uppercase tracking-wider block">Exam or Lesson Focus</label>
                      <input
                        id="exam-title-input"
                        type="text"
                        value={examNameInput}
                        onChange={(e) => setExamNameInput(e.target.value)}
                        placeholder="e.g. CS 101 Midterm, Organic Chemistry Quiz"
                        className="w-full text-xs sm:text-sm p-3 border border-slate-200 rounded-lg bg-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#2F5D50] focus:bg-white transition"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">Simplification Style</label>
                      <div className="grid grid-cols-1 gap-2">
                        {[
                          { id: "Accessible Primary Clarity", name: "Plain-language clarity", badge: "Minimal jargon with respectful, concrete examples" },
                          { id: "Analogical Undergrad Explanations", name: "Undergrad analogies", badge: "Everyday metaphors for complex curriculum ideas" },
                          { id: "Introductory Undergrad Analogies", name: "Intro learner mode", badge: "Gentle ramp for first-pass exam preparation" }
                        ].map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => setVocabularyLevel(item.id)}
                            className={`w-full text-left p-3 rounded-lg border transition-colors duration-200 flex items-center justify-between gap-3 text-xs sm:text-sm cursor-pointer ${
                              vocabularyLevel === item.id
                                ? "border-[#2F5D50] bg-[#EEF4EF] text-[#1F2933]"
                                : "border-slate-200 text-slate-600 hover:border-[#2F5D50]/50 hover:bg-[#F8FAFC]"
                            }`}
                          >
                            <div>
                              <span className="block font-black">{item.name}</span>
                              <span className="block text-[10px] text-slate-500 mt-0.5 font-mono leading-4">{item.badge}</span>
                            </div>
                            {vocabularyLevel === item.id && (
                              <Check className="w-4 h-4 text-[#2F5D50] flex-shrink-0" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-5">
                    <div className="flex items-start gap-2.5 p-3 bg-orange-50 border border-orange-100 rounded-lg mb-4 text-xs">
                      <WalletCards className="w-4 h-4 text-[#B45309] flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-black text-orange-950 block">Generation cost: 1 Study Coin</span>
                        <span className="text-slate-600 block mt-0.5">
                          You have <strong>{activeStudent.credits} coins</strong> available.
                        </span>
                      </div>
                    </div>

                    <button
                      id="btn-generate-reviewer"
                      disabled={isGeneratingWorkspace || !extractedMarkdown.trim()}
                      onClick={handleGenerateStudyGuide}
                      className={`w-full py-4 font-bold rounded-lg flex items-center justify-center gap-2 text-sm transition-colors duration-200 ${
                        isGeneratingWorkspace || !extractedMarkdown.trim()
                          ? "bg-slate-200 cursor-not-allowed text-slate-500"
                          : "bg-[#B45309] hover:bg-[#92400E] text-white shadow-lg shadow-orange-900/10 cursor-pointer"
                      }`}
                    >
                      {isGeneratingWorkspace ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" /> Building reviewer...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5" /> Build Study Guide Reviewer
                        </>
                      )}
                    </button>
                  </div>
                </section>

                <aside className="bg-white p-5 rounded-lg border border-teal-900/10 shadow-sm space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                    <h4 className="text-sm font-black text-[#1F2933] flex items-center gap-1.5">
                      <History className="w-4 h-4 text-[#2F5D50]" /> Recent Reviewers
                    </h4>
                    <button
                      onClick={() => setActiveTab("history")}
                      className="text-xs text-[#2F5D50] hover:text-[#254A40] hover:underline font-bold cursor-pointer"
                    >
                      View All
                    </button>
                  </div>
                  {activeStudentGuides.length === 0 ? (
                    <p className="text-xs text-slate-500">No reviewers saved under this profile yet.</p>
                  ) : (
                    <div className="space-y-2">
                      {activeStudentGuides.slice(0, 3).map((guide) => (
                        <button
                          key={guide.id}
                          onClick={() => handleSelectGuideFromHistory(guide)}
                          className="group w-full p-3 hover:bg-[#F7F3EA] rounded-lg border border-slate-100 cursor-pointer flex items-center justify-between text-xs transition-colors duration-200 text-left"
                        >
                          <span>
                            <span className="font-bold text-[#1F2933] line-clamp-1 group-hover:text-[#2F5D50]">{guide.title}</span>
                            <span className="text-[10px] text-slate-500 block mt-0.5">{guide.createdDate}</span>
                          </span>
                          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#2F5D50]" />
                        </button>
                      ))}
                    </div>
                  )}
                </aside>
              </div>
            </div>
          </div>
        )}

        {/* STUDY GUIDE ACTIVE VIEWER */}
        {activeTab === "reviewer" && activeGuide && (
          <div id="reviewer-space" className="space-y-6 animate-fade-up">
            <section className="rounded-lg bg-[#1F2933] p-5 sm:p-6 text-white shadow-lg shadow-teal-950/10">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-mono font-black uppercase tracking-wider text-orange-100 bg-white/10 border border-white/10 px-2.5 py-1 rounded">
                    {activeGuide.examName}
                  </span>
                    <span className="text-xs text-teal-100">Target: {activeGuide.level}</span>
                  </div>
                  <h2 id="active-reviewer-title" className="max-w-3xl text-2xl sm:text-3xl font-black tracking-normal leading-tight">
                    {activeGuide.title}
                  </h2>
                </div>
                <div className="grid grid-cols-3 gap-3 text-center text-xs">
                  <div className="rounded-lg border border-white/10 bg-white/10 p-3">
                    <div className="text-xl font-black">{activeGuide.concepts.length}</div>
                    <div className="text-teal-100">Terms</div>
                  </div>
                  <div className="rounded-lg border border-white/10 bg-white/10 p-3">
                    <div className="text-xl font-black">{activeGuide.quiz.length}</div>
                    <div className="text-teal-100">Questions</div>
                  </div>
                  <button
                    onClick={() => setActiveTab("workspace")}
                    className="rounded-lg bg-[#B45309] px-4 py-3 text-xs font-black text-white transition-colors duration-200 hover:bg-[#92400E] cursor-pointer"
                  >
                    New Guide
                  </button>
                </div>
              </div>
            </section>

            {/* Viewer Tab Selection Segment */}
            <div className="overflow-x-auto rounded-lg border border-teal-900/10 bg-white p-1 shadow-sm">
              <div className="flex min-w-max items-center gap-1">
              {[
                { id: "overview", label: "Overview", icon: Sparkles },
                { id: "dictionary", label: "Dictionary", icon: BookOpen },
                { id: "flashcards", label: "Flashcards", icon: HelpCircle },
                { id: "quiz", label: "Quiz", icon: ClipboardCheck },
                { id: "pdfContent", label: "Source", icon: FileText }
              ].map((tab) => {
                const IconComp = tab.icon;
                const isSelected = guideViewerTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setGuideViewerTab(tab.id as any)}
                    className={`flex cursor-pointer items-center gap-1.5 rounded-md px-3 py-2 text-xs sm:text-sm font-bold transition-colors duration-200 whitespace-nowrap ${
                      isSelected
                        ? "bg-[#EEF4EF] text-[#2F5D50]"
                        : "text-slate-500 hover:bg-slate-50 hover:text-[#1F2933]"
                    }`}
                  >
                    <IconComp className="w-4 h-4" /> {tab.label}
                  </button>
                );
              })}
              </div>
            </div>

            {/* Sub-Views */}
            {guideViewerTab === "overview" && (
              <div id="view-overview" className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Column 1: Core recap */}
                <div className="md:col-span-8 bg-white p-5 sm:p-6 rounded-lg border border-teal-900/10 shadow-sm space-y-5">
                  <div>
                    <h3 className="text-lg font-black text-[#1F2933]">Study Brief</h3>
                    <p className="text-slate-500 text-xs mt-1">A plain-language recap generated from the uploaded material.</p>
                  </div>
                  <p className="text-slate-700 text-sm leading-7 whitespace-pre-wrap bg-[#F8FAFC] p-5 rounded-lg border border-slate-100">
                    {activeGuide.summary}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div className="p-4 bg-[#EEF4EF] border border-teal-900/10 rounded-lg">
                      <h4 className="text-xs font-mono text-[#2F5D50] uppercase font-black tracking-wider mb-2">Memory Boost</h4>
                      <p className="text-xs text-[#1F2933] leading-relaxed">
                        Flip to <strong>Flashcards</strong> for term-by-term mnemonic recall.
                      </p>
                    </div>
                    <div className="p-4 bg-orange-50 border border-orange-100 rounded-lg">
                      <h4 className="text-xs font-mono text-emerald-700 uppercase font-black tracking-wider mb-2">Self-Assessment</h4>
                      <p className="text-xs text-orange-950 leading-relaxed">
                        Use the <strong>Quiz</strong> tab to spot weak recall before the exam.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Column 2: Quick list review stats */}
                <div className="md:col-span-4 bg-white p-5 rounded-lg border border-teal-900/10 shadow-sm space-y-4">
                  <h4 className="text-sm font-black text-[#1F2933] flex items-center gap-1.5 mb-2">
                    <Lightbulb className="w-4 h-4 text-[#B45309]" /> Guide Facts
                  </h4>
                  <div className="divide-y divide-slate-100">
                    <div className="py-3 flex justify-between items-center text-xs">
                      <span className="text-slate-500">Total Terms</span>
                      <span className="font-mono text-slate-800 font-semibold">{activeGuide.concepts.length} vocabulary words</span>
                    </div>
                    <div className="py-3 flex justify-between items-center text-xs">
                      <span className="text-slate-500">Quiz Items</span>
                      <span className="font-mono text-slate-800 font-semibold">{activeGuide.quiz.length} practice questions</span>
                    </div>
                    <div className="py-3 flex justify-between items-center text-xs">
                      <span className="text-slate-500">Word Level</span>
                      <span className="text-[#2F5D50] font-black uppercase font-mono text-[10px] text-right">{activeGuide.level}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Sub-View: Vocabulary Dictionary table of absolute terms */}
            {guideViewerTab === "dictionary" && (
              <div id="view-dictionary" className="bg-white rounded-lg border border-teal-900/10 shadow-sm overflow-hidden p-5 sm:p-6 space-y-5">
                <div>
                  <h3 className="text-lg font-black text-[#1F2933]">Definition Dictionary</h3>
                  <p className="text-xs text-slate-500 mt-1">Terms, mnemonics, analogies, and concrete examples extracted from the lesson.</p>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {activeGuide.concepts.map((concept, index) => (
                    <div key={index} className="p-4 bg-[#F8FAFC] rounded-lg border border-slate-200/70 hover:border-[#2F5D50]/40 transition-colors duration-200">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                        <span className="text-sm font-black text-[#1F2933] px-3 py-1 bg-white rounded-md shadow-sm border border-slate-100 flex items-center gap-1.5">
                          <Check className="w-4 h-4 text-[#2F5D50]" /> {concept.exactWord}
                        </span>
                        
                        {/* Mnemonic bubble badge */}
                        <span className="text-[10px] font-semibold font-mono bg-orange-50 border border-orange-100 text-orange-900 px-2.5 py-1 rounded-full">
                          Memory Trick: "{concept.mnemonic}"
                        </span>
                      </div>

                      <div className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-3">
                        <p className="mt-1 font-semibold text-[#2F5D50]">From PDF</p>
                        <p className="mt-0 font-semibold text-[#2F5D50]">{getConceptSourceMeaning(concept)}</p>
                        <strong className="text-[#1F2933] font-bold">Easy Analogy</strong>
                        <p className="mt-0">{concept.elementaryExplanation}</p>
                      </div>

                      <div className="p-3 bg-emerald-50/70 rounded-lg border border-emerald-100 text-xs text-emerald-800 flex gap-2">
                        <span className="font-semibold select-none">Example:</span>
                        <p className="italic">{concept.example}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sub-View: Double Sided Flipping Flashcards */}
            {guideViewerTab === "flashcards" && (
              <div id="view-flashcards" className="bg-white p-5 sm:p-6 rounded-lg border border-teal-900/10 shadow-sm space-y-5">
                <div className="text-center max-w-sm mx-auto space-y-2">
                  <h3 className="text-lg font-black text-[#1F2933]">Mnemonic Flash Trainer</h3>
                  <p className="text-slate-500 text-xs">
                    Flip each card to move from term recognition to active recall.
                  </p>
                </div>
                <FlashcardViewer concepts={activeGuide.concepts} />
              </div>
            )}

            {/* Sub-View: Interactive Assessment quiz */}
            {guideViewerTab === "quiz" && (
              <div id="view-quiz" className="bg-white p-5 sm:p-6 rounded-lg border border-teal-900/10 shadow-sm space-y-2">
                <PracticeQuiz quiz={activeGuide.quiz} />
              </div>
            )}

            {/* Sub-View: PDF Source Markdown Content */}
            {guideViewerTab === "pdfContent" && (
              <div id="view-pdf-content" className="bg-white p-5 sm:p-6 rounded-lg border border-teal-900/10 shadow-sm space-y-4">
                <div>
                  <h3 className="text-lg font-black text-[#1F2933]">Original Lecture Material</h3>
                  <p className="text-slate-500 text-xs">
                    This is the raw, structured text captured from your course notes or syllabus document.
                  </p>
                </div>
                {activeGuide.originalMarkdown ? (
                  <div className="p-5 bg-[#F8FAFC] rounded-lg border border-slate-200 text-slate-700 text-sm font-sans whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto">
                    {activeGuide.originalMarkdown}
                  </div>
                ) : (
                  <div className="p-6 text-center text-slate-500 text-xs italic bg-[#F8FAFC] rounded-lg">
                    No raw text stored for this study guide document.
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* STUDY HISTORICAL LOG SHEET */}
        {activeTab === "history" && (
          <div id="history-panel" className="bg-white p-5 sm:p-6 rounded-lg border border-teal-900/10 shadow-sm space-y-6 animate-fade-up">
            <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-[#1F2933] flex items-center gap-2">
                  <History className="w-6 h-6 text-[#2F5D50]" /> Saved Reviewers
                </h2>
                <p className="text-slate-500 text-xs sm:text-sm mt-1">
                  Search and reopen generated guides for the current student profile.
                </p>
              </div>

              {/* Quick Filter */}
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                <input
                  aria-label="Search saved reviewers"
                  type="text"
                  value={searchHistoryQuery}
                  onChange={(e) => setSearchHistoryQuery(e.target.value)}
                  placeholder="Search reviewer sheets..."
                  className="w-full pl-9 pr-4 py-2.5 text-xs sm:text-sm border border-slate-200 rounded-lg bg-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#2F5D50] transition"
                />
              </div>
            </div>

            {filteredHistoryGuides.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <div className="w-12 h-12 bg-[#EEF4EF] text-[#2F5D50] mx-auto rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6" />
                </div>
                <p className="text-sm text-slate-500 font-medium">No saved reviewers found for this student account.</p>
                <button
                  onClick={() => setActiveTab("workspace")}
                  className="px-5 py-2.5 bg-[#2F5D50] hover:bg-[#254A40] text-white text-xs font-bold rounded-lg transition-colors duration-200 shadow-sm cursor-pointer"
                >
                  Create First Reviewer
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredHistoryGuides.map((guide) => (
                  <div 
                    key={guide.id}
                    className="p-5 rounded-lg border border-slate-200 bg-[#F8FAFC] hover:bg-white hover:border-[#2F5D50]/50 hover:shadow-md transition-colors duration-200 flex flex-col justify-between group"
                  >
                    <div className="space-y-2">
                      <div className="flex justify-between items-start gap-2">
                        <span className="text-[10px] font-mono font-bold text-[#2F5D50] bg-[#EEF4EF] px-2 py-0.5 rounded uppercase">
                          {guide.examName}
                        </span>
                        <button
                          type="button"
                          aria-label={`Delete ${guide.title}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteGuide(guide.id);
                          }}
                          className="text-slate-400 hover:text-rose-600 p-1 rounded transition-colors duration-200 text-xs font-bold cursor-pointer inline-flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Delete
                        </button>
                      </div>

                      <h4 className="font-black text-[#1F2933] group-hover:text-[#2F5D50] transition-colors duration-200 text-base">
                        {guide.title}
                      </h4>
                      <p className="text-xs text-slate-600 line-clamp-2 leading-5">
                        {guide.summary}
                      </p>
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-200/60 flex items-center justify-between">
                      <span className="text-[10px] text-slate-500 font-mono">Created: {guide.createdDate}</span>
                      <button
                        onClick={() => handleSelectGuideFromHistory(guide)}
                        className="text-xs text-[#2F5D50] group-hover:text-[#254A40] font-black flex items-center gap-1 cursor-pointer"
                      >
                        Launch Guide <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Floating Action Navigation (Footer Style) */}
      <footer className="mt-auto bg-white border-t border-teal-900/10">
        <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col sm:flex-row gap-4 items-center justify-between text-xs text-slate-500">
          <div>
            ReviewStack MVP &bull; Undergraduate study companion
          </div>
          <div>
            Secure local browser processing
          </div>
        </div>
      </footer>

      {/* MODAL: BUY STUDY CREDITS Simulative checkout */}
      {showCheckoutModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-xl overflow-hidden border border-teal-900/10 animate-fade-up">
            
            <div className="grid grid-cols-1 md:grid-cols-12">
              
              {/* Checkout pricing tiers */}
              <div className="md:col-span-5 bg-[#1F2933] text-white p-6 sm:p-8 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-orange-200 font-bold block mb-1">
                    Buy Study Coins
                  </span>
                  <h3 className="text-xl font-bold font-display text-white">Select Coin Tier</h3>
                  <p className="text-xs text-slate-400 mt-1">Top up your balance instantly to generate study reviewers.</p>

                  <div className="mt-6 space-y-3">
                    {[
                      { name: "Starter Tier", price: 120, credits: 10, bonus: "Basic Pack" },
                      { name: "Super Pack", price: 520, credits: 50, bonus: "Popular Option!" },
                      { name: "Unbounded VIP", price: 1100, credits: 120, bonus: "Best Price Factor" }
                    ].map((pack) => (
                      <button
                        key={pack.name}
                        onClick={() => setSelectedPlan(pack)}
                        className={`w-full text-left p-3 rounded-xl border-2 transition-all flex flex-col justify-center ${
                          selectedPlan?.name === pack.name
                            ? "border-orange-300 bg-white/15 text-white"
                            : "border-white/10 text-teal-100 hover:border-white/35"
                        }`}
                      >
                        <div className="flex justify-between items-center w-full">
                          <span className="text-xs font-semibold text-white">{pack.name}</span>
                          <span className="text-xs font-bold text-orange-200">₱{pack.price}</span>
                        </div>
                        <div className="flex justify-between items-center w-full mt-1.5 text-[10px]">
                          <span>{pack.credits} Coins</span>
                          <span className="text-orange-200 italic leading-none">{pack.bonus}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="text-[10px] text-slate-500 pt-6 border-t border-slate-800/60 font-mono mt-6 leading-relaxed">
                  Mock purchase workspace for MVP phase. No actual charges levied.
                </div>
              </div>

              {/* simulated forms box */}
              <div className="md:col-span-7 p-6 sm:p-8 space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-base font-bold font-display text-slate-900">Credit Card Gateway</h4>
                    <p className="text-xs text-slate-500 mt-1">Safe simulative sandbox checkout panel.</p>
                  </div>
                  <button 
                    onClick={() => {
                      setShowCheckoutModal(false);
                      setSelectedPlan(null);
                    }}
                    className="text-slate-400 hover:text-slate-600 font-bold"
                  >
                    &times;
                  </button>
                </div>

                {paymentSuccess ? (
                  <div className="h-64 flex flex-col items-center justify-center text-center space-y-3">
                    <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center">
                      <Check className="w-8 h-8 animate-bounce" />
                    </div>
                    <div className="space-y-1">
                      <h5 className="text-base font-bold text-slate-950">Payment Successful!</h5>
                      <p className="text-xs text-slate-500">
                        Added <strong>{selectedPlan?.credits} Study Coins</strong> to {activeStudent?.name} successfully!
                      </p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSimulatedPayment} className="space-y-4">
                    {/* card specs */}
                    <div className="space-y-1.5">
                      <label htmlFor="checkout-card-number" className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">Card Number</label>
                      <div className="relative">
                        <input
                          id="checkout-card-number"
                          type="text"
                          required
                          maxLength={19}
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim())}
                          placeholder="4111 2222 3333 4444"
                          className="w-full text-xs p-3 pl-10 border border-slate-200 rounded-lg bg-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#2F5D50] focus:bg-white transition"
                        />
                        <CreditCard className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="checkout-card-holder" className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">Cardholder Name</label>
                      <input
                        id="checkout-card-holder"
                        type="text"
                        required
                        value={cardHolder}
                        onChange={(e) => setCardHolder(e.target.value)}
                        placeholder="ALEX JOHNSON"
                        className="w-full text-xs p-3 border border-slate-200 rounded-lg bg-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#2F5D50] focus:bg-white transition uppercase"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label htmlFor="checkout-card-expiry" className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">Expiry Date</label>
                        <input
                          id="checkout-card-expiry"
                          type="text"
                          required
                          maxLength={5}
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          placeholder="MM/YY"
                          className="w-full text-xs p-3 border border-slate-200 rounded-lg bg-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#2F5D50] focus:bg-white transition text-center"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label htmlFor="checkout-card-cvv" className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">CVV</label>
                        <input
                          id="checkout-card-cvv"
                          type="password"
                          required
                          maxLength={3}
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          placeholder="123"
                          className="w-full text-xs p-3 border border-slate-200 rounded-lg bg-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#2F5D50] focus:bg-white transition text-center"
                        />
                      </div>
                    </div>

                    <div className="pt-3">
                      <button
                        type="submit"
                        disabled={isProcessingPayment || !selectedPlan}
                        className={`w-full py-3 text-xs font-semibold text-white rounded-xl shadow transition duration-150 flex items-center justify-center gap-1.5 ${
                          !selectedPlan 
                            ? "bg-slate-300 text-slate-500 cursor-not-allowed shadow-none"
                            : isProcessingPayment 
                              ? "bg-[#2F5D50]/60 cursor-not-allowed" 
                              : "bg-[#B45309] hover:bg-[#92400E] hover:shadow-lg cursor-pointer"
                        }`}
                      >
                        {isProcessingPayment ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" /> Authorizing simulation...
                          </>
                        ) : (
                          <>
                            Authorize Top-up (₱{selectedPlan?.price || 0}.00)
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
