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
  User, 
  Plus, 
  UserCheck, 
  CreditCard, 
  FileText, 
  Sparkles, 
  Loader2, 
  FileCheck, 
  Clock, 
  Search, 
  History, 
  HelpCircle, 
  Share2, 
  Check, 
  ChevronRight, 
  BookOpen, 
  AlertTriangle,
  Lightbulb,
  GraduationCap,
  Sparkle
} from "lucide-react";

// Demo review content for instant try-out if they don't upload a PDF (Undergraduate Level)
const MOCK_DEMO_GUIDE: StudyGuide = {
  id: "demo-guide-123",
  title: "CS 101: Algorithmic Complexity (Big O Notation) Core Review",
  examName: "Computer Science Exam 1",
  level: "Accessible Simplification (Basic Schooling Clarity)",
  summary: "Algorithmic Complexity defines how computer operations scale when the workload goes up. It is similar to predicting how long it takes to wash dishes or catalog folders as the pile grows larger!",
  concepts: [
    {
      exactWord: "Big O Notation",
      mnemonic: "Big O = Big Obstacle! The absolute WORST case duration for your workload loop!",
      elementaryExplanation: "Imagine you are looking for a specific paper invoice in a filing cabinet. In the worst-case scenario, you have to shift through every single folder until finding it in the absolute last slot. Big O notation is a simple mathematical mathematical shorthand used to describe how many total operations are needed in that absolute worst-case scenario as the archive scales.",
      example: "If checking a stack of N documents one-by-one by hand, the longest lookup time is directly proportional to N. That's described as O(N) linear complexity."
    },
    {
      exactWord: "Recursion",
      mnemonic: "Recursion = Re-Running! Tasks nesting inside themselves until hitting a stop code!",
      elementaryExplanation: "Recursion is when a process refers back to itself to solve smaller pieces of the exact same problem. Think of it like peeling an onion layer by layer, or drilling down through successive physical templates: each layer demands the same action until you reach the core (the base case) where the task is successfully solved.",
      example: "A program that calculates your family tree by looking at your parents, then their parents, and so on, until reaching the oldest single ancestor record."
    },
    {
      exactWord: "Hash Collision",
      mnemonic: "Collision = Crash! Two files getting assigned the exact same parking slot!",
      elementaryExplanation: "Imagine a sorting system with filing slots labeled 0 to 9. You organize papers based on the last digit of their numerical ID. If you have two different documents whose IDs end in 5, they both try to slot into box 5! A collision is when two distinct pieces of information map to the exact same lookup indicator.",
      example: "Two employees sharing the exact same birthday in an office, prompting the filing clerk to store both of their background sheets inside the same physical folder tab."
    }
  ],
  quiz: [
    {
      question: "What does Big O Notation represent in software design?",
      options: [
        "The absolute worst-case mathematical runtime limit as inputs scale",
        "The total monetary cost of running a cloud computing container",
        "The size of the physical computer screen needed to display an application",
        "The font size used when writing complex database index queries"
      ],
      answer: "The absolute worst-case mathematical runtime limit as inputs scale",
      explanation: "Excellent! Big O measures the upper bound of process steps as inputs grow, outlining the worst-case scenario."
    },
    {
      question: "In recursion, why must you always include a 'base-case'?",
      options: [
        "To provide a stopping condition so the function doesn't loop infinitely and crash the stack",
        "To compile the source code into raw binary assembly language",
        "To style the user interface with responsive design layouts",
        "To increase the speed of network response times across foreign countries"
      ],
      answer: "To provide a stopping condition so the function doesn't loop infinitely and crash the stack",
      explanation: "Superb! Without a base case, recursion continues infinitely and causes a stack overflow crash!"
    }
  ],
  originalMarkdown: `# COURSE NOTES: CS 101 - SECTION 3: COMPLEXITY ANALYSIS\n\n## Big O Notation\nIn Computer Science, complexity analysis lets us evaluate how the runtime or memory requirements of an algorithm scale with input size. Formally, Big O describes the asymptotic upper bound of runtime steps.\n\n## Recursion\nA design pattern where a function references itself in its definition. Every recursion needs a base case to exit safely without stack-overflow.\n\n## Hash Collisions\nHash tables use index math to assign buckets. Collisions occur when distinct keys produce identical hash indices.`,
  createdDate: new Date().toISOString().split("T")[0],
  studentId: "student-demo"
};

export default function App() {
  // App navigation state
  const [activeTab, setActiveTab] = useState<"landing" | "workspace" | "reviewer" | "history">("landing");
  
  // Accounts State
  const [students, setStudents] = useState<StudentAccount[]>([]);
  const [currentStudentID, setCurrentStudentID] = useState<string>("");
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [newStudentName, setNewStudentName] = useState("");
  const [newStudentGrade, setNewStudentGrade] = useState("Junior Undergraduate");

  // Authentication states
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signUpName, setSignUpName] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [signUpGrade, setSignUpGrade] = useState("Junior Undergraduate");
  const [signUpMajor, setSignUpMajor] = useState("Computer Science");
  const [signUpUniversity, setSignUpUniversity] = useState("Stamford University");
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

    // 2. Load accounts from LocalStorage & Seed credentials
    const storedStudents = localStorage.getItem("lesson_reviewer_students");
    let parsedStudents: StudentAccount[] = [];
    if (storedStudents) {
      parsedStudents = JSON.parse(storedStudents);
    }

    // Check if demo user already exists, if not, append it
    const hasDemo = parsedStudents.some(s => s.email === "demo@university.edu");
    if (!hasDemo) {
      const demoStudent: StudentAccount = {
        id: "student-demo",
        name: "Jane Doe",
        email: "demo@university.edu",
        password: "password123",
        grade: "Junior Undergraduate",
        major: "Biomedical Science",
        university: "Stamford University",
        credits: 45,
        createdDate: new Date().toISOString().split("T")[0]
      };
      parsedStudents.push(demoStudent);
      localStorage.setItem("lesson_reviewer_students", JSON.stringify(parsedStudents));
    }
    setStudents(parsedStudents);

    // Retrieve active logged in session
    const activeSessionID = localStorage.getItem("current_logged_in_student_id");
    if (activeSessionID) {
      setCurrentStudentID(activeSessionID);
    }

    // 3. Load study guides & Seed removable sample guides
    const storedGuides = localStorage.getItem("lesson_reviewer_guides");
    let parsedGuides: StudyGuide[] = [];
    if (storedGuides) {
      parsedGuides = JSON.parse(storedGuides);
    }

    if (parsedGuides.length === 0) {
      const dummyDiscreteMath: StudyGuide = {
        id: "dummy-disc-math-401",
        title: "Discrete Mathematics: Graph Theory and Matrix Operations",
        examName: "Discrete Math Prep",
        level: "Accessible Simplification (Basic Schooling Clarity)",
        summary: "Graph Theory studies the connections between individual points called nodes. It forms the underlying backbone of modern internet routing protocols, social networks, and map navigation guides!",
        concepts: [
          {
            exactWord: "Bipartite Graph",
            mnemonic: "Bipartite = Bi-Part (Two Parts)! Points only connect with members of the opposite group, never their own!",
            elementaryExplanation: "Imagine customers and service providers. A transaction line only ever links a customer to a service provider, never directly between two customers or two service providers. That represents a bipartite configuration! Nodes are partitioned into two separate sets, and connections only exist between the opposite sets.",
            example: "A group of customers and a group of restaurants. Customers only buy food from restaurants; customers don't buy food from other customers directly."
          },
          {
            exactWord: "Adjacency Matrix",
            mnemonic: "Adjacency Grid: A spreadsheet of connections where '1' means directly linked, and '0' means disconnected!",
            elementaryExplanation: "A neat grid of numbers where rows and columns represent points. A '1' at coordinate (A, B) means point A has a direct path to point B, while '0' means they are disconnected. It helps computer programs lookup connections instantly.",
            example: "A flight lookup chart on an airline database: rows are departure cities, columns are arrival cities, and a checked mark means there is a direct flight routing available."
          }
        ],
        quiz: [
          {
            question: "In a Bipartite Graph, which of the following connections is strictly forbidden?",
            options: [
              "A connection between two nodes in the exact same partition group",
              "A connection between two nodes in different partition groups",
              "A connection from a node back to itself as a self-loop",
              "A graph containing more than two separate groups"
            ],
            answer: "A connection between two nodes in the exact same partition group",
            explanation: "Perfect! Bipartite graph constraints specify that edges can only exist between different partition groups, never within a single group."
          }
        ],
        originalMarkdown: `# COURSE SYLLABUS NOTES: DISCRETE MATHEMATICS\n\n## Graph Theory Fundamentals\nA graph is composed of Vertices (or Nodes) and Edges. In Bipartite Graphs, the partition sets V1 and V2 have no internal relationships. Edges only construct cross-links between key sets.\n\n## Adjacency Matrix Representation\nTo analyze connections computationally, we map graphs into arbitrary N x N binary grids where matrix cell adjacency values equal 1 if there is a direct edge between nodes, and 0 otherwise.`,
        createdDate: new Date().toISOString().split("T")[0],
        studentId: "student-demo"
      };

      const dummyBiochemistry: StudyGuide = {
        id: "dummy-bioc-402",
        title: "Biochemistry 301: Oxidative Phosphorylation Pathways",
        examName: "Biochem Midterm 2",
        level: "Accessible Simplification (Basic Schooling Clarity)",
        summary: "Oxidative Phosphorylation is how our cellular mitochondria turn the food we eat into actual energetic currency. It behaves like a massive hydroelectric dam built inside every cell of your body!",
        concepts: [
          {
            exactWord: "Electron Transport Chain",
            mnemonic: "ETC = Electrons Traveling Continuously along the inner membrane lane!",
            elementaryExplanation: "A series of active chemical checkpoints that pass high-energy electrons down a physical line. It behaves like a network of automated pumps, where passing the high-energy flow from station to station releases key power used to pump fluids uphill into a storage tank.",
            example: "A high-efficiency agricultural irrigation setup passing water uphill to build up backpressure inside a hilltop water tower."
          },
          {
            exactWord: "ATP Synthase",
            mnemonic: "Synthase = Spinning Turbine Harnessing Proton Surge to print cellular cash!",
            elementaryExplanation: "A rotating nano-scale turbine motor. When positive protons rush back down through this motor, it spins, capturing the physical turn to lock power into an energy-carrying molecule called ATP.",
            example: "A classic waterwheel at a grinding mill that revolves as river water crashes over it, using the kinetic spin to grind wheat."
          }
        ],
        quiz: [
          {
            question: "What powers the rotary turbine of ATP Synthase?",
            options: [
              "The energetic flow of protons down their electrochemical concentration gradient",
              "The direct electrical impulse sent by nerve synaptic terminals",
              "The mechanical contraction of cell membranes during mitotic replication",
              "The burning of glucose inside ribosome protein factories"
            ],
            answer: "The energetic flow of protons down their electrochemical concentration gradient",
            explanation: "Spot on! The sheer pressure of proton accumulation forces them through the ATP Synthase rotor, inducing the mechanical spin that manufactures ATP."
          }
        ],
        originalMarkdown: `# MITOCHONDRIAL BIOCHEMISTRY: SECTIONS 5-7\n\n## Oxidative Phosphorylation Pathways\nLiving organisms generate ATP inside the inner mitochondrial membrane. The electron flow establishes a high-frequency electrochemical gradient.\n\n## Electron Transport Chain\nComplexes I, II, III and IV pump hydrogen molecules outwards using energy released by redox reactions.\n\n## ATP Synthase Rotational Catalysis\nProtons flow back into the matrix down their chemical charge gradient, spinning the asymmetric rotary rotor catalyst to synthesize adenosine triphosphate.`,
        createdDate: new Date().toISOString().split("T")[0],
        studentId: "student-demo"
      };

      parsedGuides = [dummyDiscreteMath, dummyBiochemistry];
      localStorage.setItem("lesson_reviewer_guides", JSON.stringify(parsedGuides));
    }
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
      setAuthError("Incorrect email or password. Feel free to use the preloaded demo account below!");
    }
  };

  // One-Click Demo Development account quick login
  const handleQuickDemoLogin = () => {
    setAuthError("");
    const matched = students.find((s) => s.email === "demo@university.edu");
    if (matched) {
      setCurrentStudentID(matched.id);
      localStorage.setItem("current_logged_in_student_id", matched.id);
      setActiveTab("workspace");
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
      major: signUpMajor,
      university: signUpUniversity,
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
    setSignUpMajor("Computer Science");
    setSignUpUniversity("Stamford University");
    
    // Auto-navigate to workspace
    setActiveTab("workspace");
  };

  // Log Out handler
  const handleLogOut = () => {
    setCurrentStudentID("");
    localStorage.removeItem("current_logged_in_student_id");
    setActiveTab("landing");
  };

  // Add Profile Action (deprecating but keeping as optional API compatibility wrapper)
  const handleCreateStudentProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim()) return;

    const newProfile: StudentAccount = {
      id: "student-" + Date.now(),
      name: newStudentName.trim(),
      email: "local_" + Date.now() + "@university.edu",
      grade: newStudentGrade,
      major: "General Science",
      university: "Stamford University",
      credits: 15,
      createdDate: new Date().toISOString().split("T")[0]
    };

    const list = [...students, newProfile];
    syncStudents(list);
    setCurrentStudentID(newProfile.id);
    setNewStudentName("");
    setShowAddStudentModal(false);
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

  // Action: Launch a quick demo guide to see how the app looks
  const handleLaunchMockDemo = () => {
    const matched = students.find((s) => s.email === "demo@university.edu");
    if (matched) {
      setCurrentStudentID(matched.id);
      localStorage.setItem("current_logged_in_student_id", matched.id);
    }
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

  return (
    <div id="main-scaffold" class="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* API Key Missing warning banner */}
      {isApiKeyMissing && (
        <div id="api-key-warning" class="bg-amber-500 text-slate-900 px-4 py-3 text-center text-sm font-medium flex items-center justify-center gap-2 border-b border-amber-600/20">
          <AlertTriangle class="w-4 h-4 flex-shrink-0 animate-bounce" />
          <span>
            <strong>Gemini API Key is not set yet!</strong> Please configure your <code>GEMINI_API_KEY</code> variable in the <strong>Settings &gt; Secrets</strong> panel of Google AI Studio.
          </span>
        </div>
      )}

      {/* Primary Top Header Nav */}
      <header id="app-header" class="bg-white border-b border-slate-100 shadow-sm sticky top-0 z-40">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row gap-4 items-center justify-between">
          
          {/* Main Logo (Branding) */}
          <div 
            onClick={() => setActiveTab("landing")} 
            class="flex items-center gap-2.5 cursor-pointer group flex-shrink-0 justify-center md:justify-start"
          >
            <div class="p-2 bg-indigo-600 text-white rounded-xl shadow-md group-hover:bg-indigo-700 transition-colors">
              <GraduationCap class="w-6 h-6" />
            </div>
            <div class="text-left">
              <span class="text-base sm:text-lg font-bold font-display tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors block leading-tight">
                ReviewStack
              </span>
              <span class="text-[9px] sm:text-[10px] font-mono text-slate-400 block uppercase font-bold tracking-widest leading-none mt-0.5">
                Smart Study Companion
              </span>
            </div>
          </div>

          {/* Centered Top Navigation Segment (requirement 3) */}
          {activeStudent ? (
            <div class="flex justify-center flex-1 md:px-4">
              <nav class="flex items-center gap-1 bg-slate-100 border border-slate-200/60 p-1 rounded-xl w-fit">
                <button
                  onClick={() => {
                    setActiveTab("workspace");
                    setShowProfileDropdown(false);
                  }}
                  class={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    activeTab === "workspace"
                      ? "bg-white text-indigo-600 shadow-3xs font-bold"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Workspace
                </button>
                <button
                  onClick={() => {
                    setActiveTab("history");
                    setShowProfileDropdown(false);
                  }}
                  class={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    activeTab === "history"
                      ? "bg-white text-indigo-600 shadow-3xs font-bold"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Saved ({savedGuides.filter((g) => g.studentId === currentStudentID).length})
                </button>
                {activeGuide && (
                  <button
                    onClick={() => {
                      setActiveTab("reviewer");
                      setShowProfileDropdown(false);
                    }}
                    class={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                      activeTab === "reviewer"
                        ? "bg-white text-indigo-600 shadow-3xs font-bold"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Active Review
                  </button>
                )}
              </nav>
            </div>
          ) : (
            <div class="hidden md:block flex-1"></div>
          )}

          {/* Student Account Info, Credits, and Dropdown Trigger (requirement 4) */}
          {activeStudent ? (
            <div class="flex items-center gap-4 flex-shrink-0 justify-center md:justify-end">
              
              {/* Credit Ledger pill */}
              <div class="flex items-center gap-1.5 px-3 py-2 bg-indigo-50 border border-indigo-100/60 rounded-xl">
                <Sparkles class="w-4 h-4 text-indigo-600 animate-pulse" />
                <span class="text-xs font-semibold text-slate-700">
                  <strong class="text-indigo-700 font-bold">{activeStudent.credits}</strong> Study Coins
                </span>
                
                {/* Buy Link */}
                <button
                  onClick={() => initiateBuyCredits({name: "Super Pack", price: 520, credits: 50})}
                  class="ml-1.5 px-2 py-0.5 text-[10px] bg-indigo-600 hover:bg-indigo-700 text-white font-mono uppercase font-black rounded-md tracking-wider transition"
                >
                  Buy
                </button>
              </div>

              {/* Profile Avatar logo trigger (Dropdown) */}
              <div class="relative">
                <button 
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  class="flex items-center justify-center w-9 h-9 bg-linear-to-tr from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white rounded-full shadow-md focus:outline-none transition-all group relative border border-indigo-200"
                >
                  <span class="text-xs font-bold font-mono tracking-tighter">
                    {activeStudent.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                  </span>
                  <span class="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-white bg-emerald-400"></span>
                </button>

                {showProfileDropdown && (
                  <>
                    {/* Click-out overlay */}
                    <div 
                      class="fixed inset-0 z-40 cursor-default" 
                      onClick={() => setShowProfileDropdown(false)}
                    />
                    <div class="absolute right-0 mt-3.5 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 py-4 px-4 z-50 space-y-3.5 animate-fade-in text-left">
                      {/* User Header Profile */}
                      <div class="border-b border-slate-100 pb-3 flex items-center gap-2.5">
                        <div class="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">
                          {activeStudent.name[0].toUpperCase()}
                        </div>
                        <div class="text-xs overflow-hidden">
                          <span class="block font-bold text-slate-800 truncate text-xs font-sans">
                            {activeStudent.name}
                          </span>
                          <span class="block text-[10px] text-slate-450 truncate font-mono">
                            {activeStudent.email}
                          </span>
                        </div>
                      </div>

                      {/* Academic detail rows */}
                      <div class="space-y-2 text-xs text-slate-600">
                        <div class="flex items-center justify-between">
                          <span class="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold">Year</span>
                          <span class="font-medium text-slate-800 text-right">{activeStudent.grade}</span>
                        </div>
                        <div class="flex items-center justify-between">
                          <span class="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold">Major</span>
                          <span class="font-medium text-slate-800 text-right">{activeStudent.major}</span>
                        </div>
                        <div class="flex items-center justify-between">
                          <span class="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold">Univ</span>
                          <span class="font-medium text-slate-800 text-right truncate max-w-[120px]">{activeStudent.university}</span>
                        </div>
                      </div>

                      {/* Action items inside menu */}
                      <div class="border-t border-slate-100 pt-3">
                        <button
                          onClick={() => {
                            setShowProfileDropdown(false);
                            handleLogOut();
                          }}
                          class="w-full py-2 hover:bg-rose-50 border border-slate-200 hover:border-rose-100 text-slate-600 hover:text-rose-600 text-xs font-bold rounded-xl transition text-center font-sans"
                        >
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
              class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-sm transition cursor-pointer"
            >
              Log In
            </button>
          )}
        </div>
      </header>

      {/* Main Workspace Body */}
      <main class="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        
        {/* SECURE UNDERGRADUATE AUTH PORTAL */}
        {!activeStudent && activeTab !== "landing" && (
          <div id="auth-viewport" class="max-w-md mx-auto py-12 px-4 sm:px-6 animate-fade-up">
            <div class="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6">
              
              {/* Header Branding */}
              <div class="text-center space-y-2">
                <div class="p-3 bg-indigo-50 text-indigo-650 rounded-2xl w-fit mx-auto shadow-sm">
                  <GraduationCap class="w-8 h-8 text-indigo-600" />
                </div>
                <h2 class="text-2xl font-bold font-display text-slate-900 tracking-tight">
                  {isSignUpMode ? "Create Academic Account" : "Login"}
                </h2>
                <p class="text-xs text-slate-500 max-w-xs mx-auto">
                  {isSignUpMode 
                    ? "Establish your local, client-encrypted profile to save advanced curriculum reviews." 
                    : "to get started"}
                </p>
              </div>

              {authError && (
                <div class="p-3 bg-rose-50 border border-rose-100 text-rose-700 rounded-xl text-xs font-medium text-center">
                  {authError}
                </div>
              )}

              {/* Form block */}
              {!isSignUpMode ? (
                /* LOGIN FORM */
                <form onSubmit={handleLogin} class="space-y-4">
                  <div class="space-y-1.5">
                    <label class="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Email</label>
                    <input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="demo@university.edu"
                      class="w-full text-xs sm:text-sm p-3 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition"
                    />
                  </div>

                  <div class="space-y-1.5">
                    <label class="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Password</label>
                    <input
                      type="password"
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="•••••••• (default: password123)"
                      class="w-full text-xs sm:text-sm p-3 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition"
                    />
                  </div>

                  <button
                    type="submit"
                    class="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition shadow shadow-indigo-100"
                  >
                    Log in
                  </button>
                </form>
              ) : (
                /* SIGN UP FORM */
                <form onSubmit={handleSignUp} class="space-y-3.5 flex flex-col">
                  <div class="space-y-1">
                    <label class="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Full Student Name</label>
                    <input
                      type="text"
                      required
                      value={signUpName}
                      onChange={(e) => setSignUpName(e.target.value)}
                      placeholder="e.g. Johnathan Smith"
                      class="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition"
                    />
                  </div>

                  <div class="space-y-1">
                    <label class="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Email</label>
                    <input
                      type="email"
                      required
                      value={signUpEmail}
                      onChange={(e) => setSignUpEmail(e.target.value)}
                      placeholder="e.g. student@university.edu"
                      class="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition"
                    />
                  </div>

                  <div class="space-y-1">
                    <label class="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Password</label>
                    <input
                      type="password"
                      required
                      value={signUpPassword}
                      onChange={(e) => setSignUpPassword(e.target.value)}
                      placeholder="Minimum 6 characters"
                      class="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition"
                    />
                  </div>

                  <div class="grid grid-cols-2 gap-2">
                    <div class="space-y-1">
                      <label class="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Academic Major</label>
                      <select
                        value={signUpMajor}
                        onChange={(e) => setSignUpMajor(e.target.value)}
                        class="w-full text-xs p-2 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-600 cursor-pointer text-slate-700 bg-white"
                      >
                        <option value="Computer Science">Computer Science</option>
                        <option value="Biochemistry">Biochemistry</option>
                        <option value="Mechanical Engineering">Mechanical Eng</option>
                        <option value="Nursing / Pre-Med">Nursing / Pre-Med</option>
                        <option value="Business Administration">Business Admin</option>
                        <option value="Political Science">Political Science</option>
                      </select>
                    </div>

                    <div class="space-y-1">
                      <label class="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">University</label>
                      <select
                        value={signUpUniversity}
                        onChange={(e) => setSignUpUniversity(e.target.value)}
                        class="w-full text-xs p-2 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-600 cursor-pointer text-slate-700 bg-white"
                      >
                        <option value="Stamford University">Stamford University</option>
                        <option value="State Tech College">State Tech College</option>
                        <option value="Eastern University">Eastern University</option>
                        <option value="Metropolitan College">Metropolitan College</option>
                      </select>
                    </div>
                  </div>

                  <div class="space-y-1">
                    <label class="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Class Level</label>
                    <select
                      value={signUpGrade}
                      onChange={(e) => setSignUpGrade(e.target.value)}
                      class="w-full text-xs p-2 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-600 cursor-pointer font-sans text-slate-700 bg-white"
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
                    class="w-full py-3 mt-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition shadow shadow-indigo-100"
                  >
                    Register and Login
                  </button>
                </form>
              )}

              {/* Login Toggle */}
              <div class="text-center pt-2">
                <button
                  onClick={() => {
                    setIsSignUpMode(!isSignUpMode);
                    setAuthError("");
                  }}
                  class="text-xs text-indigo-600 hover:underline font-semibold"
                >
                  {isSignUpMode 
                    ? "Already have an account? Sign In" 
                    : "register Now"}
                </button>
              </div>

            </div>
          </div>
        )}

        {/* Landing/Intro page structure */}
        {activeTab === "landing" && (
          <QuickStartLanding 
            onStart={() => {
              setActiveTab("workspace");
            }} 
            onViewDemo={handleLaunchMockDemo} 
          />
        )}

        {/* STUDY WORKSPACE (UPLOADER & BUILD PANEL) */}
        {activeStudent && activeTab === "workspace" && (
          <div id="workspace-grid" class="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-up">
            
            {/* Column 1: PDF Local browser parsing */}
            <div class="lg:col-span-7 space-y-6">
              <div class="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                <div>
                  <h2 class="text-xl sm:text-2xl font-bold font-display text-slate-900 flex items-center gap-2">
                    <FileText class="w-6 h-6 text-indigo-600" /> Load Lesson Documents
                  </h2>
                  <p class="text-slate-500 text-xs sm:text-sm mt-1">
                    Upload your lesson PDF file. We will extract its text structure locally using your secure browser session.
                  </p>
                </div>

                {/* PDF Dropzone */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-150 cursor-pointer relative ${
                    isDraggingOver
                      ? "border-indigo-500 bg-indigo-50/50"
                      : "border-slate-250 hover:border-slate-400 bg-slate-50"
                  }`}
                >
                  <input
                    id="file-upload-input"
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        handlePdfFileSelection(e.target.files[0]);
                      }
                    }}
                    class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div class="flex flex-col items-center justify-center space-y-3">
                    <div class="p-3.5 bg-indigo-100 text-indigo-700 rounded-full">
                      {isParsingPDF ? (
                        <Loader2 class="w-6 h-6 animate-spin" />
                      ) : (
                        <FileText class="w-6 h-6" />
                      )}
                    </div>
                    {isParsingPDF ? (
                      <div>
                        <p class="text-sm font-semibold text-indigo-700">Parsing PDF inside browser session...</p>
                        <p class="text-xs text-slate-400 mt-1">Reading page elements, formatting headings...</p>
                      </div>
                    ) : (
                      <div>
                        <p class="text-sm font-semibold text-slate-800">
                          {fileToUpload ? fileToUpload.name : "Click to select or drag PDF plan here"}
                        </p>
                        <p class="text-xs text-slate-400 mt-1">
                          Only standard PDF. Maximum 10MB capacity size limit.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Extracted Text Manual Block Area */}
                <div class="space-y-2">
                  <div class="flex justify-between items-center text-xs text-slate-500 font-mono">
                    <span class="font-medium flex items-center gap-1">
                      Current Session Lesson Text (Markdown)
                    </span>
                    {extractedMarkdown && (
                      <span class="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded font-bold">
                        Parsed Successfully
                      </span>
                    )}
                  </div>
                  <textarea
                    id="lesson-text-editor"
                    value={extractedMarkdown}
                    onChange={(e) => setExtractedMarkdown(e.target.value)}
                    placeholder="Extracted lesson content details will appear here inside your safe browser session. You can also paste your lesson plans, bullet notes, science facts, or vocabulary directly!"
                    className="w-full h-64 p-4 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white font-mono transition-all leading-relaxed"
                  />
                </div>
              </div>
            </div>

            {/* Column 2: Teacher Setup controls & trigger */}
            <div class="lg:col-span-5 space-y-6">
              <div class="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                <div>
                  <h3 class="text-lg font-bold font-display text-slate-900 flex items-center gap-2">
                    <Sparkles class="w-5 h-5 text-indigo-600 animate-pulse" /> Study Helper Settings
                  </h3>
                  <p class="text-slate-500 text-xs mt-1">Configure your grade objectives to tailor explanations.</p>
                </div>

                <div class="space-y-4">
                  {/* Title of exam */}
                  <div class="space-y-1.5">
                    <label class="text-xs font-semibold text-slate-600 uppercase tracking-wider block">Exam/Lesson Focus Title</label>
                    <input
                                            type="text"
                      value={examNameInput}
                      onChange={(e) => setExamNameInput(e.target.value)}
                      placeholder="e.g. CS 101 Midterm, Organic Chemistry Quiz"
                      class="w-full text-xs sm:text-sm p-3 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white transition"
                    />
                  </div>
 
                  {/* Level Selection options */}
                  <div class="space-y-1.5">
                    <label class="text-xs font-semibold text-slate-600 uppercase tracking-wider block">Target Simplified Level</label>
                    <div class="grid grid-cols-1 gap-2.5">
                      {[
                        { id: "Accessible Primary Clarity", name: "Accessible Primary Clarity (No Jargon)", badge: "Distills advanced collegiate frameworks into intuitive, respectful real-world analogies" },
                        { id: "Analogical Undergrad Explanations", name: "Analogical Undergrad Metaphors", badge: "Explains complex university curriculum concepts using everyday physical objects" },
                        { id: "Introductory Undergrad Analogies", name: "Introductory Undergrad Analogies", badge: "Ideal for fresh learners, reducing jargon into clear physical analogies" }
                      ].map((item) => (
                        <button
                          key={item.id}
                          onClick={() => setVocabularyLevel(item.id)}
                          className={`w-full text-left p-3.5 rounded-xl border-2 transition-all flex items-center justify-between text-xs sm:text-sm ${
                            vocabularyLevel === item.id
                              ? "border-indigo-600 bg-indigo-50/20 text-indigo-900 font-medium"
                              : "border-slate-100 text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          <div>
                            <span class="block text-xs sm:text-sm font-semibold">{item.name}</span>
                            <span class="block text-[10px] text-slate-500 mt-0.5 font-mono">{item.badge}</span>
                          </div>
                          {vocabularyLevel === item.id && (
                            <Check class="w-4 h-4 text-indigo-600 flex-shrink-0" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Ledger verification warning */}
                <div class="border-t border-slate-100 pt-6">
                  {activeStudent && (
                    <div class="flex items-start gap-2.5 p-3.5 bg-indigo-50/50 border border-indigo-100 rounded-xl mb-4 text-xs">
                      <Sparkles class="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <span class="font-semibold text-indigo-950 block">This generation costs: 1 Study Coin</span>
                        <span class="text-slate-500 block mt-0.5">
                          You have <strong>{activeStudent.credits} coins</strong> remaining. We'll debit your account on completion!
                        </span>
                      </div>
                    </div>
                  )}

                  <button
                    id="btn-generate-reviewer"
                    disabled={isGeneratingWorkspace || !extractedMarkdown.trim()}
                    onClick={handleGenerateStudyGuide}
                    className={`w-full py-4 font-semibold text-white rounded-xl shadow-lg flex items-center justify-center gap-2 text-base transition duration-150 ${
                      isGeneratingWorkspace || !extractedMarkdown.trim()
                        ? "bg-slate-350 cursor-not-allowed text-slate-500"
                        : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100"
                    }`}
                  >
                    {isGeneratingWorkspace ? (
                      <>
                        <Loader2 class="w-5 h-5 animate-spin" /> Simplifying Vocabulary... (Takes a second)
                      </>
                    ) : (
                      <>
                        <Sparkles class="w-5 h-5 fill-white" /> Build Study Guide Reviewer
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Saved Sheets Sidebar */}
              <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div class="flex justify-between items-center border-b border-slate-50 pb-3">
                  <h4 class="text-sm font-bold font-display text-slate-950 flex items-center gap-1.5">
                    <History class="w-4 h-4 text-indigo-600" /> Saved Reviewers
                  </h4>
                  <button
                    onClick={() => setActiveTab("history")}
                    class="text-xs text-indigo-600 hover:underline font-semibold"
                  >
                    View All
                  </button>
                </div>
                {savedGuides.filter((g) => g.studentId === currentStudentID).length === 0 ? (
                  <p class="text-xs text-slate-400 italic">No reviewers saved under this profile yet.</p>
                ) : (
                  <div class="space-y-2">
                    {savedGuides
                      .filter((g) => g.studentId === currentStudentID)
                      .slice(0, 3)
                      .map((guide) => (
                        <div 
                          key={guide.id}
                          onClick={() => handleSelectGuideFromHistory(guide)}
                          class="group p-3 hover:bg-slate-50 rounded-xl border border-slate-100 cursor-pointer flex items-center justify-between text-xs transition"
                        >
                          <div>
                            <span class="font-semibold text-slate-800 line-clamp-1 group-hover:text-indigo-600">{guide.title}</span>
                            <span class="text-[10px] text-slate-400 block mt-0.5">{guide.createdDate}</span>
                          </div>
                          <ChevronRight class="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* STUDY GUIDE ACTIVE VIEWER */}
        {activeTab === "reviewer" && activeGuide && (
          <div id="reviewer-space" class="space-y-8 animate-fade-up">
            
            {/* Reviewer Header Breadcrumb */}
            <div class="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div class="space-y-1">
                <div class="flex items-center gap-2">
                  <span class="text-xs font-mono font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded">
                    {activeGuide.examName}
                  </span>
                  <span class="text-xs text-slate-400 block">Grade Targets: {activeGuide.level}</span>
                </div>
                <h2 id="active-reviewer-title" class="text-xl sm:text-2xl font-bold font-display text-slate-900 tracking-tight leading-tight">
                  {activeGuide.title}
                </h2>
              </div>
              <div class="flex gap-2">
                <button
                  onClick={() => setActiveTab("workspace")}
                  class="px-5 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-sm font-semibold transition"
                >
                  Create Another Sheet
                </button>
              </div>
            </div>

            {/* Viewer Tab Selection Segment */}
            <div class="flex border-b border-slate-200 space-x-6 overflow-x-auto pb-1">
              {[
                { id: "overview", label: "Easy Overview", icon: Sparkles },
                { id: "dictionary", label: "Vocabulary Dictionary", icon: BookOpen },
                { id: "flashcards", label: "Mnemonic Flashcards", icon: HelpCircle },
                { id: "quiz", label: "Practice Quiz", icon: Check },
                { id: "pdfContent", label: "Original Material", icon: FileText }
              ].map((tab) => {
                const IconComp = tab.icon;
                const isSelected = guideViewerTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setGuideViewerTab(tab.id as any)}
                    className={`flex items-center gap-1.5 py-3 text-xs sm:text-sm font-semibold transition border-b-2 whitespace-nowrap ${
                      isSelected
                        ? "border-indigo-600 text-indigo-600 font-bold"
                        : "border-transparent text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    <IconComp class="w-4 h-4" /> {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Sub-Views */}
            {guideViewerTab === "overview" && (
              <div id="view-overview" class="grid grid-cols-1 md:grid-cols-12 gap-8">
                {/* Column 1: Core recap */}
                <div class="md:col-span-8 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                  <div>
                    <h3 class="text-lg font-bold font-display text-slate-950">Curriculum Story Book</h3>
                    <p class="text-slate-500 text-xs mt-1">Here is the whole lesson summed up in simple, straightforward storybook comparisons!</p>
                  </div>
                  <p class="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap bg-slate-50 p-5 rounded-2xl border border-slate-100">
                    {activeGuide.summary}
                  </p>

                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div class="p-5 bg-indigo-50 border border-indigo-100 rounded-2xl">
                      <h4 class="text-xs font-mono text-indigo-700 uppercase font-black tracking-wider mb-2">Memory Boost</h4>
                      <p class="text-xs text-indigo-900 leading-relaxed">
                        Flip over to the <strong>Mnemonic Flashcards</strong> tab to use custom memory visual associations for easy recall.
                      </p>
                    </div>
                    <div class="p-5 bg-emerald-50 border border-emerald-100 rounded-2xl">
                      <h4 class="text-xs font-mono text-emerald-700 uppercase font-black tracking-wider mb-2">Self-Assessment</h4>
                      <p class="text-xs text-emerald-900 leading-relaxed">
                        Ready to shine? Jump onto the <strong>Practice Quiz</strong> to take simulated recall trial-runs.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Column 2: Quick list review stats */}
                <div class="md:col-span-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                  <h4 class="text-sm font-bold font-display text-slate-900 flex items-center gap-1.5 mb-2">
                    <Lightbulb class="w-4 h-4 text-indigo-600" /> Exam Quick Facts
                  </h4>
                  <div class="divide-y divide-slate-100">
                    <div class="py-3 flex justify-between items-center text-xs">
                      <span class="text-slate-400">Total Terms:</span>
                      <span class="font-mono text-slate-800 font-semibold">{activeGuide.concepts.length} vocabulary words</span>
                    </div>
                    <div class="py-3 flex justify-between items-center text-xs">
                      <span class="text-slate-400">Quiz items:</span>
                      <span class="font-mono text-slate-800 font-semibold">{activeGuide.quiz.length} practice questions</span>
                    </div>
                    <div class="py-3 flex justify-between items-center text-xs">
                      <span class="text-slate-400">Word Level:</span>
                      <span class="text-indigo-600 font-semibold uppercase font-mono text-[10px]">{activeGuide.level}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Sub-View: Vocabulary Dictionary table of absolute terms */}
            {guideViewerTab === "dictionary" && (
              <div id="view-dictionary" class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-6">
                <div>
                  <h3 class="text-lg font-bold font-display text-slate-950">Definition Dictionary</h3>
                  <p class="text-xs text-slate-500 mt-1">Exact phrasing and simplified conceptual analogies extracted from your lesson assets.</p>
                </div>

                <div class="grid grid-cols-1 gap-4">
                  {activeGuide.concepts.map((concept, index) => (
                    <div key={index} class="p-5 bg-slate-50 rounded-xl border border-slate-200/50 hover:bg-slate-100/50 transition">
                      <div class="flex flex-wrap items-center justify-between gap-2 mb-3">
                        <span class="text-base font-bold font-display text-slate-900 px-3 py-1 bg-white rounded-lg shadow-sm border border-slate-100 flex items-center gap-1.5">
                          <Check class="w-4 h-4 text-indigo-600" /> {concept.exactWord}
                        </span>
                        
                        {/* Mnemonic bubble badge */}
                        <span class="text-[10px] font-semibold font-mono bg-amber-50 border border-amber-100 text-amber-800 px-2.5 py-1 rounded-full">
                          Memory Trick: "{concept.mnemonic}"
                        </span>
                      </div>

                      <p class="text-xs sm:text-sm text-slate-600 leading-relaxed mb-3">
                        <strong class="text-indigo-950 font-semibold">Easy Analogy:</strong> {concept.elementaryExplanation}
                      </p>

                      <div class="p-3 bg-emerald-50/50 rounded-lg border border-emerald-100 text-xs text-emerald-800 flex gap-2">
                        <span class="font-semibold select-none">Example:</span>
                        <p class="italic">{concept.example}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sub-View: Double Sided Flipping Flashcards */}
            {guideViewerTab === "flashcards" && (
              <div id="view-flashcards" class="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                <div class="text-center max-w-sm mx-auto space-y-2">
                  <h3 class="text-lg font-bold font-display text-slate-950">Mnemonic Flash Trainer</h3>
                  <p class="text-slate-500 text-xs">
                    Flip these interactive double-sided card segments to commit terms to your active memory bank!
                  </p>
                </div>
                <FlashcardViewer concepts={activeGuide.concepts} />
              </div>
            )}

            {/* Sub-View: Interactive Assessment quiz */}
            {guideViewerTab === "quiz" && (
              <div id="view-quiz" class="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                <PracticeQuiz quiz={activeGuide.quiz} />
              </div>
            )}

            {/* Sub-View: PDF Source Markdown Content */}
            {guideViewerTab === "pdfContent" && (
              <div id="view-pdf-content" class="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div>
                  <h3 class="text-lg font-bold font-display text-slate-950">Original Lecture Material</h3>
                  <p class="text-slate-500 text-xs">
                    This is the raw, structured text captured from your course notes or syllabus document.
                  </p>
                </div>
                {activeGuide.originalMarkdown ? (
                  <div class="p-5 bg-slate-50 rounded-2xl border border-slate-200 text-slate-700 text-sm font-sans whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto">
                    {activeGuide.originalMarkdown}
                  </div>
                ) : (
                  <div class="p-6 text-center text-slate-400 text-xs italic bg-slate-50 rounded-2xl">
                    No raw text stored for this study guide document.
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* STUDY HISTORICAL LOG SHEET */}
        {activeTab === "history" && (
          <div id="history-panel" class="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6 animate-fade-up">
            <div class="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between border-b border-slate-100 pb-5">
              <div>
                <h2 class="text-xl sm:text-2xl font-bold font-display text-slate-900 flex items-center gap-2">
                  <History class="w-6 h-6 text-indigo-600" /> Saved Review Workspace Sheets
                </h2>
                <p class="text-slate-500 text-xs sm:text-sm mt-1">
                  Revisit previously generated study advisors and review tests.
                </p>
              </div>

              {/* Quick Filter */}
              <div class="relative w-full sm:w-64">
                <Search class="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchHistoryQuery}
                  onChange={(e) => setSearchHistoryQuery(e.target.value)}
                  placeholder="Search reviewer sheets..."
                  class="w-full pl-9 pr-4 py-2.5 text-xs sm:text-sm border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                />
              </div>
            </div>

            {filteredHistoryGuides.length === 0 ? (
              <div class="text-center py-16 space-y-3">
                <div class="w-12 h-12 bg-indigo-50 text-indigo-600 mx-auto rounded-full flex items-center justify-center">
                  <FileText class="w-6 h-6" />
                </div>
                <p class="text-sm text-slate-500 font-medium">No saved reviewers found for this student account.</p>
                <button
                  onClick={() => setActiveTab("workspace")}
                  class="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl transition shadow shadow-indigo-100"
                >
                  Create Your First Plan Reviewer
                </button>
              </div>
            ) : (
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredHistoryGuides.map((guide) => (
                  <div 
                    key={guide.id}
                    class="p-5 rounded-2xl border border-slate-250 bg-slate-50 hover:bg-white hover:border-indigo-400 hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
                  >
                    <div class="space-y-2">
                      <div class="flex justify-between items-start gap-2">
                        <span class="text-[10px] font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded uppercase">
                          {guide.examName}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteGuide(guide.id);
                          }}
                          className="text-slate-400 hover:text-rose-600 p-1 rounded transition text-xs font-semibold"
                        >
                          Delete
                        </button>
                      </div>

                      <h4 class="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors text-base font-display">
                        {guide.title}
                      </h4>
                      <p class="text-xs text-slate-500 line-clamp-2">
                        {guide.summary}
                      </p>
                    </div>

                    <div class="mt-4 pt-4 border-t border-slate-200/60 flex items-center justify-between">
                      <span class="text-[10px] text-slate-400 font-mono">Created: {guide.createdDate}</span>
                      <button
                        onClick={() => handleSelectGuideFromHistory(guide)}
                        class="text-xs text-indigo-600 group-hover:text-indigo-700 font-bold flex items-center gap-1"
                      >
                        Launch Guide <ChevronRight class="w-3.5 h-3.5" />
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
      <footer class="mt-auto bg-white border-t border-slate-100">
        <div class="max-w-7xl mx-auto px-4 py-5 flex flex-col sm:flex-row gap-4 items-center justify-between text-xs text-slate-500">
          <div>
            Collegiate Study Guide Reviewer MVP &bull; Undergraduate Study Companion
          </div>
          <div>
            Secure local browser processing
          </div>
        </div>
      </footer>

      {/* MODAL 1: ADD STUDENT ACCOUNT PROFILE */}
      {showAddStudentModal && (
        <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div class="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 sm:p-8 space-y-6 border border-slate-100 animate-fade-up">
            <div class="flex justify-between items-start">
              <div>
                <h3 class="text-lg font-bold font-display text-slate-950 flex items-center gap-1.5">
                  <UserCheck class="w-5 h-5 text-indigo-600" /> Create Student Profile
                </h3>
                <p class="text-xs text-slate-500 mt-1">Add a new local account profile for personalized saved charts.</p>
              </div>
              <button 
                onClick={() => setShowAddStudentModal(false)}
                class="text-slate-400 hover:text-slate-600 font-bold"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateStudentProfile} class="space-y-4">
              <div class="space-y-1.5">
                <label class="text-xs font-semibold text-slate-600 uppercase">Student First Name</label>
                <input
                  type="text"
                  required
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  placeholder="e.g. Liam Johnson"
                  class="w-full text-xs sm:text-sm p-3 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition"
                />
              </div>

              <div class="space-y-1.5">
                <label class="text-xs font-semibold text-slate-600 uppercase">Class Grade Level</label>
                <select
                  value={newStudentGrade}
                  onChange={(e) => setNewStudentGrade(e.target.value)}
                  class="w-full text-xs sm:text-sm p-3 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-600 cursor-pointer"
                >
                  <option value="1st Grade">1st Grade (Elementary)</option>
                  <option value="2nd Grade">2nd Grade (Elementary)</option>
                  <option value="3rd Grade">3rd Grade (Elementary)</option>
                  <option value="4th Grade">4th Grade (Elementary)</option>
                  <option value="5th Grade">5th Grade (Elementary)</option>
                  <option value="6th Grade">6th Grade (Elementary)</option>
                </select>
              </div>

              <div class="pt-2 flex justify-end gap-2.5 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setShowAddStudentModal(false)}
                  class="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  class="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition shadow shadow-indigo-100"
                >
                  Add Profile Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: BUY STUDY CREDITS Simulative checkout */}
      {showCheckoutModal && (
        <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div class="bg-white rounded-3xl shadow-xl w-full max-w-xl overflow-hidden border border-slate-100 animate-fade-up">
            
            <div class="grid grid-cols-1 md:grid-cols-12">
              
              {/* Checkout pricing tiers */}
              <div class="md:col-span-5 bg-slate-900 text-white p-6 sm:p-8 flex flex-col justify-between">
                <div>
                  <span class="text-[10px] font-mono uppercase tracking-widest text-indigo-400 font-bold block mb-1">
                    Buy Study Coins
                  </span>
                  <h3 class="text-xl font-bold font-display text-white">Select Coin Tier</h3>
                  <p class="text-xs text-slate-400 mt-1">Top up your balance instantly to generate study reviewers.</p>

                  <div class="mt-6 space-y-3">
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
                            ? "border-indigo-400 bg-indigo-600/30 text-white"
                            : "border-slate-800 text-slate-400 hover:border-slate-705"
                        }`}
                      >
                        <div class="flex justify-between items-center w-full">
                          <span class="text-xs font-semibold text-white">{pack.name}</span>
                          <span class="text-xs font-bold text-indigo-400">₱{pack.price}</span>
                        </div>
                        <div class="flex justify-between items-center w-full mt-1.5 text-[10px]">
                          <span>{pack.credits} Coins</span>
                          <span class="text-indigo-400 italic leading-none">{pack.bonus}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div class="text-[10px] text-slate-500 pt-6 border-t border-slate-800/60 font-mono mt-6 leading-relaxed">
                  Mock purchase workspace for MVP phase. No actual charges levied.
                </div>
              </div>

              {/* simulated forms box */}
              <div class="md:col-span-7 p-6 sm:p-8 space-y-6">
                <div class="flex justify-between items-start">
                  <div>
                    <h4 class="text-base font-bold font-display text-slate-900">Credit Card Gateway</h4>
                    <p class="text-xs text-slate-500 mt-1">Safe simulative sandbox checkout panel.</p>
                  </div>
                  <button 
                    onClick={() => {
                      setShowCheckoutModal(false);
                      setSelectedPlan(null);
                    }}
                    class="text-slate-400 hover:text-slate-600 font-bold"
                  >
                    &times;
                  </button>
                </div>

                {paymentSuccess ? (
                  <div class="h-64 flex flex-col items-center justify-center text-center space-y-3">
                    <div class="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center">
                      <Check className="w-8 h-8 animate-bounce" />
                    </div>
                    <div class="space-y-1">
                      <h5 class="text-base font-bold text-slate-950">Payment Successful!</h5>
                      <p class="text-xs text-slate-500">
                        Added <strong>{selectedPlan?.credits} Study Coins</strong> to {activeStudent?.name} successfully!
                      </p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSimulatedPayment} class="space-y-4">
                    {/* card specs */}
                    <div class="space-y-1.5">
                      <label class="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">Card Number</label>
                      <div class="relative">
                        <input
                          type="text"
                          required
                          maxLength={19}
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim())}
                          placeholder="4111 2222 3333 4444"
                          class="w-full text-xs p-3 pl-10 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition"
                        />
                        <CreditCard class="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                      </div>
                    </div>

                    <div class="space-y-1.5">
                      <label class="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">Cardholder Name</label>
                      <input
                        type="text"
                        required
                        value={cardHolder}
                        onChange={(e) => setCardHolder(e.target.value)}
                        placeholder="ALEX JOHNSON"
                        class="w-full text-xs p-3 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition uppercase"
                      />
                    </div>

                    <div class="grid grid-cols-2 gap-3">
                      <div class="space-y-1.5">
                        <label class="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">Expiry Date</label>
                        <input
                          type="text"
                          required
                          maxLength={5}
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          placeholder="MM/YY"
                          class="w-full text-xs p-3 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition text-center"
                        />
                      </div>
                      <div class="space-y-1.5">
                        <label class="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">CVV</label>
                        <input
                          type="password"
                          required
                          maxLength={3}
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          placeholder="123"
                          class="w-full text-xs p-3 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition text-center"
                        />
                      </div>
                    </div>

                    <div class="pt-3">
                      <button
                        type="submit"
                        disabled={isProcessingPayment || !selectedPlan}
                        className={`w-full py-3 text-xs font-semibold text-white rounded-xl shadow transition duration-150 flex items-center justify-center gap-1.5 ${
                          !selectedPlan 
                            ? "bg-slate-300 text-slate-500 cursor-not-allowed shadow-none"
                            : isProcessingPayment 
                              ? "bg-indigo-400 cursor-not-allowed" 
                              : "bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg"
                        }`}
                      >
                        {isProcessingPayment ? (
                          <>
                            <Loader2 class="w-4 h-4 animate-spin" /> Authorizing simulation...
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
