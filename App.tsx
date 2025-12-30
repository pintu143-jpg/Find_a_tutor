import React, { useState, useMemo, useEffect } from 'react';
import { Search, GraduationCap, Users, ArrowRight, ArrowLeft, Star, Clock, CheckCircle2, BookOpen, Sparkles, Filter, LogOut, User as UserIcon, Shield, MessageCircle, LayoutDashboard, Sun, Moon, MapPin, Monitor, Building2, Quote, TrendingUp, Globe, Music, Briefcase, Bell, DollarSign, X, Check, Mail, Phone, Lock, ChevronRight } from 'lucide-react';
import { MOCK_TUTORS, MOCK_REQUESTS, MOCK_USERS, SUBJECTS, LEVELS, ADMIN_ID } from './constants';
import { ViewState, User, Tutor, ChatSession, ClassMode, StudentRequest, PlatformReview } from './types';
import BecomeTutor from './components/BecomeTutor';
import SmartMatchModal from './components/SmartMatchModal';
import AuthPage from './components/AuthPage';
import TutorProfile from './components/TutorProfile';
import AdminDashboard from './components/AdminDashboard';
import ChatWindow from './components/ChatWindow';
import TutorDashboard from './components/TutorDashboard';
import StudentDashboard from './components/StudentDashboard';
import StudentRequestWizard from './components/StudentRequestWizard';
import StudentRequestsBoard from './components/StudentRequestsBoard';

// Initial Dummy Data for Student Feedback (Converted to PlatformReview type)
const INITIAL_REVIEWS: PlatformReview[] = [
  {
    id: '1',
    studentId: 'S-001', // Matches Alex Mitchell in MOCK_USERS
    name: "Alex Mitchell",
    role: "Student",
    image: "https://ui-avatars.com/api/?name=Alex+Mitchell&background=random",
    content: "Found an amazing physics tutor in 2 days. The AI match was spot on! My grades have improved significantly since starting lessons.",
    rating: 5,
    status: 'approved',
    date: new Date().toISOString()
  },
  {
    id: '2',
    studentId: 'u-static-2',
    name: "Priya Patel",
    role: "Student",
    image: "https://ui-avatars.com/api/?name=Priya+Patel&background=random",
    content: "I love the offline mode option. Found a guitar teacher right in my neighborhood. Highly recommended for local learning!",
    rating: 4,
    status: 'approved',
    date: new Date().toISOString()
  },
  {
    id: '3',
    studentId: 'u-static-3',
    name: "Rahul Sharma",
    role: "Student",
    image: "https://ui-avatars.com/api/?name=Rahul+Sharma&background=random",
    content: "Great platform for finding specific subject experts. My math scores went from C to A in one term.",
    rating: 5,
    status: 'approved',
    date: new Date().toISOString()
  },
  {
    id: '4',
    studentId: 'u-static-4',
    name: "Emily Clark",
    role: "Student",
    image: "https://ui-avatars.com/api/?name=Emily+Clark&background=random",
    content: "The tutors are very professional and punctual. The dashboard is very easy to use and manage my schedule.",
    rating: 5,
    status: 'approved',
    date: new Date().toISOString()
  },
  {
    id: '5',
    studentId: 'u-static-5',
    name: "David Kim",
    role: "Student",
    image: "https://ui-avatars.com/api/?name=David+Kim&background=random",
    content: "User interface is clean and easy to navigate. Found a chemistry tutor within hours.",
    rating: 4,
    status: 'approved',
    date: new Date().toISOString()
  },
  {
    id: '6',
    studentId: 'u-static-6',
    name: "Sophia Lopez",
    role: "Student",
    image: "https://ui-avatars.com/api/?name=Sophia+Lopez&background=random",
    content: "I was struggling with Spanish, but my tutor from here helped me become conversational in 3 months.",
    rating: 5,
    status: 'approved',
    date: new Date().toISOString()
  }
];

// New Dummy Data for Tutor Feedback (kept static for now)
const TUTOR_REVIEWS = [
  {
    id: 101,
    name: "Sarah Jenkins",
    role: "Tutor",
    image: "https://picsum.photos/seed/sarah/200/200",
    content: "This platform helped me fill my schedule with motivated students. The dashboard is very easy to use and professional.",
    rating: 5
  },
  {
    id: 102,
    name: "Michael Ross",
    role: "Tutor",
    image: "https://picsum.photos/seed/michael/200/200",
    content: "Great for verified tutors. The verification process gives credibility, and I feel safe connecting with students here.",
    rating: 5
  },
  {
    id: 103,
    name: "Anjali Gupta",
    role: "Tutor",
    image: "https://picsum.photos/seed/anjali/200/200",
    content: "I've been teaching Math for 10 years, and this is by far the best platform for connecting with students locally.",
    rating: 5
  },
  {
    id: 104,
    name: "Robert Brown",
    role: "Tutor",
    image: "https://picsum.photos/seed/robert/200/200",
    content: "Good support team and transparent policies. Payments are handled securely which is a big plus.",
    rating: 4
  }
];

const POPULAR_CITIES = [
  "Bangalore", "Hyderabad", "Delhi", "Mumbai", "Chennai",
  "Kolkata", "Pune", "Gurgaon", "Navi Mumbai", "Noida",
  "Bhubaneswar", "Ghaziabad", "Kochi", "Ahmedabad", "Chandigarh",
  "Jaipur", "Thiruvananthapuram", "Indore", "Jamshedpur", "Lucknow",
  "Dehradun", "Agra", "Guwahati", "Kanpur", "Faridabad",
  "Cuttack", "Coimbatore", "Siliguri", "Ranchi", "Howrah"
];

const SCHOOL_CLASSES = [
  "Class V", "Class VI", "Class VII", "Class VIII", 
  "Class IX", "Class X", "Class XI", "Class XII"
];

const STATES = [
  "Andaman and Nicobar",
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chandigarh",
  "Chhattisgarh",
  "Dadra and Nagar Haveli",
  "Daman and Diu",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu and Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala"
];

export default function App() {
  const [view, setView] = useState<ViewState>('home');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedMode, setSelectedMode] = useState<string>('all'); // 'all', 'online', 'offline', 'both'
  
  // Advanced Filters State
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [minRating, setMinRating] = useState<number>(0);
  const [priceMin, setPriceMin] = useState<string>('');
  const [priceMax, setPriceMax] = useState<string>('');
  const [minExperience, setMinExperience] = useState<string>('');

  const [isSmartMatchOpen, setIsSmartMatchOpen] = useState(false);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  // Initialize darkMode based on system preference
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });
  
  // Notification State
  const [showNotification, setShowNotification] = useState(false);

  // Pending Actions (e.g. open wizard after login)
  const [pendingAction, setPendingAction] = useState<'wizard' | 'become-tutor' | 'find-tutor' | null>(null);

  // Data State
  const [tutors, setTutors] = useState<Tutor[]>(MOCK_TUTORS);
  const [students, setStudents] = useState<User[]>(MOCK_USERS);
  const [studentRequests, setStudentRequests] = useState<StudentRequest[]>(MOCK_REQUESTS);
  const [platformReviews, setPlatformReviews] = useState<PlatformReview[]>(INITIAL_REVIEWS);
  
  // User State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  // Tutor Selection State
  const [selectedTutor, setSelectedTutor] = useState<Tutor | null>(null);
  
  // Smart match state
  const [smartMatchIds, setSmartMatchIds] = useState<string[]>([]);
  const [smartMatchReasoning, setSmartMatchReasoning] = useState<string>('');
  const [isSmartMatchActive, setIsSmartMatchActive] = useState(false);

  // Chat State
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);

  // Timer for Notification
  useEffect(() => {
    // If user is logged in as tutor or admin, do not show notification
    if (currentUser && currentUser.role !== 'student') {
        setShowNotification(false);
        return;
    }

    const timer = setTimeout(() => {
      // Show if on home page and no modals open
      if (view === 'home' && !isWizardOpen && !isSmartMatchOpen) {
        setShowNotification(true);
      }
    }, 10000); // Show after 10 seconds

    return () => clearTimeout(timer);
  }, [view, isWizardOpen, isSmartMatchOpen, currentUser]);

  // Theme Logic
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  // Filter out only approved reviews for the home page marquee
  const visibleStudentReviews = useMemo(() => {
    return platformReviews.filter(review => review.status === 'approved');
  }, [platformReviews]);

  // Computed public tutors based on filters and approved status
  const filteredTutors = useMemo(() => {
    // Only show approved tutors to the public
    let candidates = tutors.filter(t => t.status === 'approved');

    // If smart match is active, prioritize smart matches and maintain their order
    if (isSmartMatchActive && smartMatchIds.length > 0) {
      return smartMatchIds
        .map(id => candidates.find(t => t.id === id))
        .filter((t): t is Tutor => !!t);
    }

    // Step 1: Standard Filters
    let results = candidates.filter(tutor => {
      const matchesSubject = selectedSubject ? tutor.subjects.includes(selectedSubject) : true;
      const matchesLevel = selectedLevel ? tutor.levels.includes(selectedLevel) : true;
      
      // City Filter
      const matchesCity = selectedCity ? tutor.city.toLowerCase().includes(selectedCity.toLowerCase()) : true;

      // Mode Filter
      let matchesMode = true;
      if (selectedMode === 'online') {
          matchesMode = tutor.classMode === 'online' || tutor.classMode === 'both';
      } else if (selectedMode === 'offline') {
          matchesMode = tutor.classMode === 'offline' || tutor.classMode === 'both';
      } else if (selectedMode === 'both') {
          matchesMode = tutor.classMode === 'both';
      }

      // Advanced Filters
      const matchesRating = tutor.rating >= minRating;
      
      let matchesPrice = true;
      if (priceMin && tutor.hourlyRate < parseInt(priceMin)) matchesPrice = false;
      if (priceMax && tutor.hourlyRate > parseInt(priceMax)) matchesPrice = false;

      let matchesExperience = true;
      if (minExperience && tutor.experienceYears < parseInt(minExperience)) matchesExperience = false;

      return matchesSubject && matchesLevel && matchesCity && matchesMode && matchesRating && matchesPrice && matchesExperience;
    });

    // Step 2: Advanced Search Term Filtering & Ranking
    if (searchTerm.trim()) {
        const lowerTerm = searchTerm.toLowerCase().trim();
        
        // Filter: Must match somewhere
        results = results.filter(tutor => 
            tutor.name.toLowerCase().includes(lowerTerm) || 
            tutor.bio.toLowerCase().includes(lowerTerm) ||
            tutor.subjects.some(s => s.toLowerCase().includes(lowerTerm)) ||
            tutor.city.toLowerCase().includes(lowerTerm)
        );

        // Sort: Calculate Relevance Score
        results.sort((a, b) => {
            const calculateScore = (t: Tutor) => {
                let score = 0;
                const nameLower = t.name.toLowerCase();
                
                // Name Matches: High priority
                if (nameLower === lowerTerm) score += 50;
                else if (nameLower.startsWith(lowerTerm)) score += 30;
                else if (nameLower.includes(lowerTerm)) score += 20;

                // Subject Matches: High priority
                if (t.subjects.some(s => s.toLowerCase() === lowerTerm)) score += 40;
                else if (t.subjects.some(s => s.toLowerCase().includes(lowerTerm))) score += 25;

                // City Match
                if (t.city.toLowerCase().includes(lowerTerm)) score += 10;

                // Bio Match: Lower priority
                if (t.bio.toLowerCase().includes(lowerTerm)) score += 5;

                return score;
            };

            const scoreA = calculateScore(a);
            const scoreB = calculateScore(b);

            // 1. Sort by Relevance Score
            if (scoreB !== scoreA) return scoreB - scoreA;
            
            // 2. Sort by Rating
            if (b.rating !== a.rating) return b.rating - a.rating;

            // 3. Sort by Review Count
            return b.reviews - a.reviews;
        });
    } else {
        // Default Sort: Rating Descending, then Reviews
        results.sort((a, b) => {
            if (b.rating !== a.rating) return b.rating - a.rating;
            return b.reviews - a.reviews;
        });
    }

    return results;
  }, [searchTerm, selectedSubject, selectedLevel, selectedCity, selectedMode, minRating, priceMin, priceMax, minExperience, smartMatchIds, isSmartMatchActive, tutors]);

  // Helper to determine what badge to show on the card
  const getMatchBadge = (tutor: Tutor) => {
      // Styles must be static for Tailwind to detect them
      const styles = {
          indigo: "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800",
          blue: "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-100 dark:border-blue-800",
          green: "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300 border border-green-100 dark:border-green-800",
          amber: "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 border border-amber-100 dark:border-amber-800",
          slate: "bg-slate-50 text-slate-700 dark:bg-slate-900/30 dark:text-slate-300 border border-slate-100 dark:border-slate-800",
          rose: "bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300 border border-rose-100 dark:border-rose-800",
          teal: "bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300 border border-teal-100 dark:border-teal-800",
      };

      if (isSmartMatchActive) return { label: 'AI Recommended', className: styles.indigo, icon: Sparkles };
      
      if (searchTerm.trim()) {
          const lowerTerm = searchTerm.toLowerCase().trim();
          if (tutor.name.toLowerCase().includes(lowerTerm)) return { label: 'Name Match', className: styles.blue, icon: UserIcon };
          if (tutor.subjects.some(s => s.toLowerCase().includes(lowerTerm))) return { label: 'Subject Match', className: styles.green, icon: BookOpen };
          if (tutor.city.toLowerCase().includes(lowerTerm)) return { label: 'Location Match', className: styles.amber, icon: MapPin };
          if (tutor.bio.toLowerCase().includes(lowerTerm)) return { label: 'Bio Match', className: styles.slate, icon: Search };
      }

      // Default Status Badges
      if (tutor.rating >= 4.9 && tutor.reviews > 10) return { label: 'Top Rated', className: styles.amber, icon: Star };
      if (tutor.reviews > 50) return { label: 'Highly Popular', className: styles.rose, icon: TrendingUp };
      if (tutor.reviews < 5 && tutor.status === 'approved') return { label: 'New Tutor', className: styles.teal, icon: Sparkles };

      return null;
  };

  // Compute visible sessions based on role
  const visibleChatSessions = useMemo(() => {
    if (!currentUser) return [];
    // Admin sees all chats
    if (currentUser.isAdmin) return chatSessions;
    // Users only see chats they are part of
    return chatSessions.filter(s => s.participantIds.includes(currentUser.id));
  }, [currentUser, chatSessions]);

  // Derive current tutor profile
  const myTutorProfile = useMemo(() => {
    if (currentUser?.role === 'tutor') {
      return tutors.find(t => t.id === currentUser.id) || null;
    }
    return null;
  }, [currentUser, tutors]);

  // Combined list of users for Auth checking
  const allUsersForAuth = useMemo(() => {
    // Map tutors to basic User shape for email checking
    const tutorUsers: User[] = tutors.map(t => ({
        id: t.id,
        name: t.name,
        email: t.email || '',
        avatar: t.avatar,
        role: 'tutor'
    }));
    return [...students, ...tutorUsers];
  }, [students, tutors]);

  const handleRegisterUser = (newUser: User) => {
    if (newUser.role === 'student') {
        setStudents(prev => [...prev, newUser]);
    } else if (newUser.role === 'tutor') {
        // Create a new Tutor profile from the User registration data
        const newTutorProfile: Tutor = {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            avatar: newUser.avatar,
            subjects: [],
            bio: 'Welcome! Please edit your profile to add your bio.',
            hourlyRate: 0,
            rating: 0,
            reviews: 0,
            experienceYears: 0,
            isVerified: false,
            availability: 'Flexible',
            reviewsList: [],
            levels: [],
            status: 'pending',
            classMode: 'online',
            city: newUser.address ? newUser.address.split(',')[0] : 'Unknown',
            phone: newUser.phone
         };
         setTutors(prev => [...prev, newTutorProfile]);
    }
  };

  const handleSmartMatchFound = (ids: string[], reasoning: string) => {
    setSmartMatchIds(ids);
    setSmartMatchReasoning(reasoning);
    setIsSmartMatchActive(true);
    setView('find-tutor'); 
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearSmartMatch = () => {
    setIsSmartMatchActive(false);
    setSmartMatchIds([]);
    setSmartMatchReasoning('');
  };

  const handleClearAllFilters = () => {
    setSearchTerm(''); 
    setSelectedSubject(''); 
    setSelectedLevel(''); 
    setSelectedCity(''); 
    setSelectedMode('all'); 
    setMinRating(0);
    setPriceMin('');
    setPriceMax('');
    setMinExperience('');
    clearSmartMatch();
  };

  const handleWizardComplete = (data: any) => {
    setIsWizardOpen(false);
    clearSmartMatch(); // Ensure we are using fresh filters, not locked to previous AI match
    
    // Create a new request based on wizard data
    const newRequest: StudentRequest = {
      id: `req-${Date.now()}`,
      studentId: currentUser ? currentUser.id : 'guest', // In real app, prompt login
      studentName: currentUser ? currentUser.name : 'Guest User',
      avatar: currentUser ? currentUser.avatar : `https://ui-avatars.com/api/?name=Guest&background=random`,
      subject: data.subject,
      level: data.level,
      mode: data.mode === 'offline' ? 'offline' : 'online',
      location: data.location,
      description: `Looking for a tutor for ${data.subject} (${data.level}).`,
      budget: 0, // Not captured in wizard yet
      postedAt: new Date(),
      status: 'pending'
    };
    
    setStudentRequests(prev => [newRequest, ...prev]);

    // UPDATED: Instead of navigating to find-tutor and filtering, we just save the request.
    // The previous logic for filtering is removed as per user request.
    alert("Request sent to our team! An Admin will review your request and match you with a tutor soon.");
    
    // Optional: Navigate to dashboard if logged in, else stay on home
    if (currentUser?.role === 'student') {
        setView('student-dashboard');
    }
  };

  const handleBookLesson = (tutorId: string) => {
      if (!currentUser) return;
      const tutor = tutors.find(t => t.id === tutorId);
      if (!tutor) return;

      const newRequest: StudentRequest = {
          id: `req-book-${Date.now()}`,
          studentId: currentUser.id,
          studentName: currentUser.name,
          avatar: currentUser.avatar,
          subject: tutor.subjects[0] || 'General',
          level: 'General', 
          mode: tutor.classMode === 'both' ? 'online' : tutor.classMode,
          location: tutor.city,
          description: `Direct booking request for ${tutor.name}`,
          budget: tutor.hourlyRate,
          postedAt: new Date(),
          status: 'pending',
          assignedTutorId: tutor.id 
      };
      
      setStudentRequests(prev => [newRequest, ...prev]);
  };

  const handleLogin = (user: User) => {
    let authenticatedUser = user;
    let nextView: ViewState = 'home';

    if (user.isAdmin) {
      authenticatedUser = user;
      nextView = 'admin-dashboard';
    } else {
      // Check if existing tutor by email
      const matchedTutor = tutors.find(t => t.email === user.email);
      
      if (matchedTutor) {
        // If email matches existing tutor, log them in as tutor
        authenticatedUser = { ...user, role: 'tutor', id: matchedTutor.id };
        // Check if profile is incomplete (newly registered via auth page)
        if (matchedTutor.subjects.length === 0) {
            nextView = 'become-tutor';
        } else {
            nextView = 'tutor-dashboard';
        }
      } else if (user.role === 'tutor') {
         // This block handles newly registered tutors who might not be in the 'tutors' array yet.
         // handleRegisterUser should have added them.
         // If they registered via AuthPage, they have an empty profile, send to become-tutor
         nextView = 'become-tutor';
         authenticatedUser = { ...user, role: 'tutor' };
      } else {
        // Regular Student Login
        authenticatedUser = { ...user, role: 'student' };
        nextView = 'home'; 
      }
    }
    
    setCurrentUser(authenticatedUser);
    setView(nextView);

    // Handle Pending Actions after Login
    if (pendingAction === 'wizard') {
        if (authenticatedUser.role === 'student') {
             // Delay slightly to allow UI transition
             setTimeout(() => setIsWizardOpen(true), 100);
        } else {
             alert('The wizard is optimized for students.');
        }
        setPendingAction(null);
    } else if (pendingAction === 'become-tutor') {
        if (authenticatedUser.role !== 'tutor') {
            setView('become-tutor');
        }
        setPendingAction(null);
    } else if (pendingAction === 'find-tutor') {
        setView('find-tutor');
        setPendingAction(null);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setView('home');
  };

  const handleTutorClick = (tutor: Tutor) => {
    setSelectedTutor(tutor);
    setView('tutor-profile');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Logic to handle "Start Wizard" button from toast
  const handleStartWizard = () => {
      setShowNotification(false);
      if (currentUser) {
          setIsWizardOpen(true);
      } else {
          setPendingAction('wizard');
          setView('login');
      }
  };

  // Logic to handle "Become a Tutor" button click
  const handleBecomeTutorClick = () => {
      if (currentUser) {
          if (currentUser.role === 'tutor') {
              // Check completion
              const tutor = tutors.find(t => t.id === currentUser.id);
              if (tutor && tutor.subjects.length === 0) {
                  setView('become-tutor');
              } else {
                  setView('tutor-dashboard');
              }
          } else {
              setView('become-tutor');
          }
      } else {
          setPendingAction('become-tutor');
          setView('login');
      }
  };
  
  // Logic to handle navigation to "Find a Tutor" page
  const navigateToFindTutor = () => {
    if (currentUser) {
      setView('find-tutor');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setPendingAction('find-tutor');
      setView('login');
    }
  };

  // Student Feedback Handler - Overwrites if exists
  const handleStudentFeedback = (rating: number, content: string) => {
    if (!currentUser) return;

    setPlatformReviews(prev => {
        const existingReviewIndex = prev.findIndex(r => r.studentId === currentUser.id);
        const newReview: PlatformReview = {
            id: existingReviewIndex >= 0 ? prev[existingReviewIndex].id : `review-${Date.now()}`,
            studentId: currentUser.id,
            name: currentUser.name,
            role: 'Student',
            image: currentUser.avatar,
            content: content,
            rating: rating,
            status: 'pending', // Pending Admin Approval
            date: new Date().toISOString()
        };

        if (existingReviewIndex >= 0) {
            // Overwrite existing
            const updated = [...prev];
            updated[existingReviewIndex] = newReview;
            alert("Your previous feedback has been updated and sent for admin approval.");
            return updated;
        } else {
            // Add new
            alert("Thank you! Your feedback has been sent for admin approval.");
            return [newReview, ...prev];
        }
    });
  };

  // Admin Review Approval Handler
  const handleReviewAction = (id: string, action: 'approve' | 'reject') => {
      setPlatformReviews(prev => prev.map(r => 
          r.id === id ? { ...r, status: action === 'approve' ? 'approved' : 'rejected' } : r
      ));
  };

  // Admin Actions
  const handleApproveTutor = (id: string) => {
    setTutors(prev => prev.map(t => t.id === id ? { ...t, status: 'approved' } : t));
  };

  const handleRejectTutor = (id: string) => {
    setTutors(prev => prev.map(t => t.id === id ? { ...t, status: 'rejected' } : t));
  };

  const handleVerifyTutor = (id: string) => {
    setTutors(prev => prev.map(t => t.id === id ? { ...t, isVerified: !t.isVerified } : t));
  };

  // UPDATED: When a tutor updates their profile, status goes to PENDING
  const handleUpdateTutor = (updatedTutor: Tutor) => {
    setTutors(prev => prev.map(t => {
      if (t.id === updatedTutor.id) {
        // Critical change: Reset status to pending and verification to false on update
        return { 
          ...updatedTutor, 
          status: 'pending', 
          isVerified: false 
        };
      }
      return t;
    }));
    
    if (currentUser && currentUser.id === updatedTutor.id) {
      setCurrentUser(prev => prev ? ({ 
        ...prev, 
        name: updatedTutor.name, 
        avatar: updatedTutor.avatar, 
        email: updatedTutor.email || prev.email 
      }) : null);
    }
    
    alert("Profile updated. Your profile is now pending admin approval before changes are public.");
  };

  const handleUpdateUser = (updatedUser: User) => {
    setCurrentUser(updatedUser);
  };

  // Admin Update Student Logic
  const handleAdminUpdateStudent = (updatedStudent: User) => {
    setStudents(prev => prev.map(s => s.id === updatedStudent.id ? updatedStudent : s));
    alert(`Student profile for ${updatedStudent.name} updated successfully.`);
  };

  // Student Admin Actions
  const handleStudentAction = (id: string, action: 'activate' | 'suspend') => {
    setStudents(prev => prev.map(s => {
        if (s.id === id) {
            return { ...s, status: action === 'activate' ? 'active' : 'suspended' };
        }
        return s;
    }));
  };

  const handleApplicationSubmit = (newTutorData: any) => {
    // Determine ID for new tutor
    const existingTutorIds = tutors.map(t => t.id).filter(id => id.startsWith('T-') && !isNaN(Number(id.split('-')[1])));
    let nextTutorNum = 1;
    if (existingTutorIds.length > 0) {
        const maxId = Math.max(...existingTutorIds.map(id => parseInt(id.split('-')[1], 10)));
        nextTutorNum = maxId + 1;
    }
    const nextTutorId = `T-${nextTutorNum.toString().padStart(3, '0')}`;

    // If currentUser exists (upgrading student), they keep their ID to maintain relationships.
    // If it's a new applicant (guest), they get the new sequential ID.
    const idToUse = currentUser ? currentUser.id : nextTutorId;

    const newTutor: Tutor = {
      ...newTutorData,
      id: idToUse,
      status: 'pending'
    };
    
    // Check if we are updating an existing placeholder profile (from AuthPage registration)
    setTutors(prev => {
        const index = prev.findIndex(t => t.id === idToUse);
        if (index !== -1) {
            const updated = [...prev];
            updated[index] = newTutor;
            return updated;
        }
        return [...prev, newTutor];
    });

    // Automatic account conversion for existing students
    if (currentUser) {
      const updatedUser: User = { ...currentUser, role: 'tutor' };
      setCurrentUser(updatedUser);
      // Wait for state update then redirect to tutor dashboard
      setTimeout(() => setView('tutor-dashboard'), 100); 
    }
  };

  const handleAdminMatchStudent = (requestId: string, tutorId?: string) => {
    // 1. Validate Tutor ID
    if (tutorId) {
        const tutor = tutors.find(t => t.id === tutorId);
        if (!tutor) {
            alert(`Tutor with ID "${tutorId}" not found.`);
            return;
        }
    }

    let requestToUpdate: StudentRequest | undefined;

    // 2. Update the Request Status and Assigned Tutor ID
    setStudentRequests(prev => {
        const newRequests = prev.map(req => {
            if (req.id === requestId) {
                requestToUpdate = req;
                return { ...req, status: 'matched' as const, assignedTutorId: tutorId };
            }
            return req;
        });
        return newRequests;
    });

    // 3. Automatically Create a Chat Session between Student and Tutor
    if (tutorId && requestToUpdate) {
        const studentId = requestToUpdate.studentId;
        
        // Check if session already exists
        const existingSession = chatSessions.find(s => 
            s.participantIds.includes(studentId) && s.participantIds.includes(tutorId)
        );

        if (!existingSession) {
            const newSession: ChatSession = {
                id: `chat-${Date.now()}`,
                participantIds: [studentId, tutorId],
                messages: [
                    {
                        id: `msg-system-${Date.now()}`,
                        senderId: ADMIN_ID,
                        text: "System: You have been matched! You can now start chatting.",
                        timestamp: new Date()
                    }
                ],
                lastMessagePreview: "System: You have been matched!",
                updatedAt: new Date()
            };
            setChatSessions(prev => [newSession, ...prev]);
        }
    }

    alert("Tutor assigned successfully. A chat session has been started between the student and tutor.");
  };

  // Chat Logic
  const handleStartChat = (otherId: string) => {
    if (!currentUser) {
      setView('login');
      return;
    }

    let session = chatSessions.find(s => 
      s.participantIds.includes(currentUser.id) && s.participantIds.includes(otherId)
    );

    if (!session) {
      const newSession: ChatSession = {
        id: `chat-${Date.now()}`,
        participantIds: [currentUser.id, otherId],
        messages: [],
        lastMessagePreview: '',
        updatedAt: new Date()
      };
      setChatSessions(prev => [newSession, ...prev]);
      session = newSession;
    }

    setActiveSessionId(session.id);
    setView('chat');
  };

  const handleContactAdmin = () => {
    if (!currentUser) {
      setView('login');
      return;
    }
    handleStartChat(ADMIN_ID);
  };

  const handleSendMessage = (sessionId: string, text: string) => {
    if (!currentUser) return;

    const newMessage = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      text,
      timestamp: new Date()
    };

    setChatSessions(prev => prev.map(session => {
      if (session.id === sessionId) {
        return {
          ...session,
          messages: [...session.messages, newMessage],
          lastMessagePreview: text,
          updatedAt: new Date()
        };
      }
      return session;
    }));
  };

  const renderHeader = () => (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer group" onClick={() => { setView('home'); clearSmartMatch(); }}>
          <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200 dark:shadow-none group-hover:scale-105 transition-transform">
            <GraduationCap className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">FindATeacher</span>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          <button 
            onClick={() => { setView('home'); clearSmartMatch(); }}
            className={`text-sm font-medium transition-all ${view === 'home' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400'}`}
          >
            Home
          </button>
          
          {currentUser?.role !== 'tutor' && (
             <button 
                onClick={navigateToFindTutor}
                className={`text-sm font-medium transition-all ${view === 'find-tutor' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400'}`}
             >
               Find a Tutor
             </button>
          )}

          {!currentUser && (
             <button 
                onClick={handleBecomeTutorClick}
                className={`text-sm font-medium transition-all ${view === 'become-tutor' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400'}`}
             >
               Become a Tutor
             </button>
          )}

          {/* New Link for Tutors to find students */}
          {currentUser?.role === 'tutor' && (
             <button 
                onClick={() => setView('find-students')}
                className={`text-sm font-medium transition-all ${view === 'find-students' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400'}`}
             >
               Find Students
             </button>
          )}

          {currentUser && (
             <button 
                onClick={() => setView('chat')}
                className={`text-sm font-medium transition-all flex items-center gap-1.5 ${view === 'chat' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400'}`}
             >
                <MessageCircle className="w-4 h-4" /> Messages
             </button>
          )}

          {currentUser?.isAdmin && (
             <button 
               onClick={() => setView('admin-dashboard')}
               className={`text-sm font-medium transition-all ${view === 'admin-dashboard' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400'}`}
             >
               Admin Panel
             </button>
          )}
        </nav>

        <div className="flex items-center gap-3">
          <button 
            onClick={toggleTheme}
            className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
            title="Toggle Theme"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          
          {currentUser ? (
            <div className="flex items-center gap-3 pl-3 border-l border-slate-200 dark:border-slate-700">
               <div 
                 className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity" 
                 onClick={() => {
                   if (currentUser.role === 'student') setView('student-dashboard');
                   else if (currentUser.role === 'tutor') setView('tutor-dashboard');
                   else if (currentUser.role === 'admin') setView('admin-dashboard');
                 }}
               >
                 <img 
                    src={currentUser.avatar} 
                    alt={currentUser.name} 
                    className={`w-9 h-9 rounded-full border-2 object-cover ${
                      currentUser.role === 'tutor' ? 'border-indigo-200 dark:border-indigo-700' : 
                      currentUser.role === 'student' ? 'border-green-200 dark:border-green-700' : 
                      'border-red-200 dark:border-red-700'
                    }`} 
                 />
                 <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 hidden sm:block">
                   {currentUser.name}
                 </span>
               </div>
               <button 
                 onClick={handleLogout}
                 className="p-2 text-slate-400 hover:text-red-500 transition-colors rounded-full hover:bg-red-50 dark:hover:bg-red-900/20"
                 title="Log Out"
               >
                 <LogOut className="w-4 h-4" />
               </button>
            </div>
          ) : (
            <button 
              onClick={() => setView('login')}
              className="text-sm font-semibold bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-5 py-2.5 rounded-full hover:shadow-lg hover:scale-105 transition-all duration-200"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );

  const renderReviewCard = (review: any) => (
    <div key={review.id} className="min-w-[320px] max-w-[320px] bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 relative hover:shadow-xl transition-all duration-300 mx-4 group">
        <div className="absolute -top-3 -left-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-2 text-white shadow-lg transform group-hover:rotate-12 transition-transform">
          <Quote className="w-4 h-4" />
        </div>
        
        <div className="flex items-center gap-1 mb-4 text-amber-400">
          {[...Array(review.rating)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
        </div>
        
        <p className="text-slate-600 dark:text-slate-300 mb-6 text-sm leading-relaxed line-clamp-3">"{review.content}"</p>
        
        <div className="flex items-center gap-3 mt-auto pt-4 border-t border-slate-50 dark:border-slate-700">
          <img src={review.image} alt={review.name} className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-50 dark:ring-indigo-900" />
          <div>
              <div className="font-bold text-slate-900 dark:text-white text-sm">{review.name}</div>
              <div className={`text-[10px] font-bold uppercase tracking-wide mt-0.5 ${review.role === 'Tutor' ? 'text-indigo-600 dark:text-indigo-400' : 'text-green-600 dark:text-green-400'}`}>
                {review.role}
              </div>
          </div>
        </div>
    </div>
  );

  const renderHome = () => (
    <div className="animate-in fade-in duration-500 font-sans">
      {/* Modern Hero Section */}
      <section className="relative pt-24 pb-32 overflow-hidden bg-slate-50 dark:bg-slate-900 transition-colors duration-500">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop" 
            alt="Learning Background" 
            className="w-full h-full object-cover opacity-5 dark:opacity-20 transition-opacity duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/0 via-white/80 to-white dark:from-slate-900/0 dark:via-slate-900/80 dark:to-slate-900"></div>
          {/* Animated Orbs */}
          <div className="absolute top-20 left-20 w-72 h-72 bg-indigo-400/20 dark:bg-indigo-600/30 rounded-full blur-[100px] animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-400/20 dark:bg-purple-600/20 rounded-full blur-[120px]"></div>
        </div>

        <div className="relative z-10 w-full max-w-5xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-300 text-xs font-medium mb-6 backdrop-blur-sm animate-in slide-in-from-top-4 fade-in">
             <Sparkles className="w-3 h-3" /> AI-Powered Matching
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 dark:text-white mb-6 leading-tight tracking-tight">
            Master Any Subject with <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">Expert Tutors</span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
            Connect with top-rated professionals for personalized learning. <br className="hidden md:block"/> Elevate your skills with tailored 1-on-1 sessions.
          </p>

          {/* Floating Search Bar */}
          <div className="bg-white dark:bg-white/10 backdrop-blur-md border border-slate-200 dark:border-white/20 p-2 rounded-2xl shadow-xl dark:shadow-2xl flex flex-col md:flex-row gap-2 max-w-3xl mx-auto transform transition-all hover:scale-[1.01]">
             <div className="flex-1 relative bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center border border-slate-100 dark:border-transparent">
                <Search className="absolute left-4 text-slate-400 w-5 h-5" />
                <input 
                  type="text"
                  placeholder="What do you want to learn?"
                  className="w-full pl-12 pr-4 py-4 bg-transparent focus:outline-none text-slate-900 dark:text-white placeholder-slate-400 font-medium"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && navigateToFindTutor()}
                />
             </div>
             <div className="flex-1 relative bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center md:max-w-xs border border-slate-100 dark:border-transparent">
                <MapPin className="absolute left-4 text-slate-400 w-5 h-5" />
                <input 
                  type="text"
                  placeholder="City (e.g. New York)"
                  className="w-full pl-12 pr-4 py-4 bg-transparent focus:outline-none text-slate-900 dark:text-white placeholder-slate-400 font-medium"
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && navigateToFindTutor()}
                />
             </div>
             <button 
               onClick={navigateToFindTutor}
               className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 px-8 rounded-xl transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
             >
               Search
             </button>
          </div>
          
          <div className="mt-10 flex flex-wrap justify-center items-center gap-3 text-sm font-medium">
             <span className="text-slate-500 dark:text-slate-400 mr-1">Popular:</span>
             {['Mathematics', 'English', 'Piano', 'Python', 'Chemistry'].map(tag => (
                <span 
                  key={tag} 
                  className="px-3 py-1 bg-white dark:bg-white/10 text-slate-600 dark:text-slate-200 rounded-full border border-slate-200 dark:border-white/10 shadow-sm hover:border-indigo-300 dark:hover:border-indigo-500/50 hover:text-indigo-600 dark:hover:text-indigo-300 cursor-pointer transition-all"
                  onClick={() => { setSearchTerm(tag); navigateToFindTutor(); }}
                >
                  {tag}
                </span>
             ))}
          </div>
        </div>
      </section>

      {/* Floating Stats Bar */}
      <div className="relative -mt-16 z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
         <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 py-8 px-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-slate-100 dark:divide-slate-700">
             <div className="group">
                <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1 group-hover:text-indigo-600 transition-colors">150k+</div>
                <div className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Students</div>
             </div>
             <div className="group">
                <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1 group-hover:text-indigo-600 transition-colors">50k+</div>
                <div className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Expert Tutors</div>
             </div>
             <div className="group">
                <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1 group-hover:text-indigo-600 transition-colors">1M+</div>
                <div className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Classes</div>
             </div>
             <div className="group">
                <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1 flex items-center justify-center gap-2">
                   4.8 <Star className="w-6 h-6 fill-yellow-400 text-yellow-400 group-hover:scale-110 transition-transform" />
                </div>
                <div className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Rating</div>
             </div>
         </div>
      </div>

      {/* Modern Categories */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
               <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">Explore Categories</h2>
               <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">
                 Find the perfect tutor for any subject, skill, or hobby.
               </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
               {[
                 { icon: BookOpen, label: "Tuition", desc: "K-12 Subjects", color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" },
                 { icon: Globe, label: "Languages", desc: "German, French", color: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" },
                 { icon: Music, label: "Hobbies", desc: "Guitar, Piano", color: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400" },
                 { icon: Monitor, label: "IT Courses", desc: "Python, AWS", color: "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400" },
                 { icon: Briefcase, label: "Exam Prep", desc: "SAT, GMAT", color: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400" },
                 { icon: GraduationCap, label: "College", desc: "Engineering", color: "bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400" }
               ].map((cat, i) => (
                 <div key={i} onClick={() => { setSelectedSubject(cat.label === 'Tuition' ? 'Mathematics' : cat.label === 'IT Courses' ? 'Computer Science' : ''); navigateToFindTutor(); }} className="group bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all cursor-pointer border border-slate-100 dark:border-slate-700 hover:-translate-y-1">
                    <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${cat.color}`}>
                       <cat.icon className="w-8 h-8" />
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-center mb-1">{cat.label}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 text-center">{cat.desc}</p>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* Why Choose Us - Enhanced Cards */}
      <section className="py-24 bg-white dark:bg-slate-950">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-16 text-center">Why Choose FindATeacher?</h2>
            
            <div className="grid md:grid-cols-4 gap-8">
               {[
                 { icon: Shield, title: "Verified Tutors", desc: "Background checked professionals.", color: "text-blue-600" },
                 { icon: Lock, title: "Secure Payments", desc: "Your money is safe with us.", color: "text-green-600" },
                 { icon: Users, title: "Genuine Reviews", desc: "100% real student feedback.", color: "text-purple-600" },
                 { icon: Sparkles, title: "AI Matching", desc: "Smart algorithms to find the best fit.", color: "text-amber-500" }
               ].map((item, i) => (
                 <div key={i} className="bg-slate-50 dark:bg-slate-900/50 p-8 rounded-3xl text-center hover:bg-white dark:hover:bg-slate-800 hover:shadow-xl transition-all duration-300 border border-transparent hover:border-slate-100 dark:hover:border-slate-700 group">
                    <div className={`w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm group-hover:shadow-md transition-all ${item.color}`}>
                       <item.icon className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{item.title}</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* Coverage/States Section */}
      <section className="py-20 bg-slate-100 dark:bg-black">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
               <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">We Provide Tutors In These States</h2>
               <div className="w-24 h-1 bg-indigo-600 mx-auto rounded-full"></div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
               {STATES.map((state, i) => (
                 <div key={i} className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm hover:shadow-md transition-all text-center border border-slate-200 dark:border-slate-800 flex items-center justify-center group cursor-pointer hover:-translate-y-1 hover:border-indigo-200 dark:hover:border-indigo-900 min-h-[80px]">
                    <h3 className="font-semibold text-slate-700 dark:text-slate-300 text-sm group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{state}</h3>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* STUDENT FEEDBACK MARQUEE */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900 overflow-hidden border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 text-center">
           <span className="text-indigo-600 dark:text-indigo-400 font-semibold tracking-wider text-sm uppercase">Testimonials</span>
           <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mt-2">Student Success Stories</h2>
        </div>
        
        {/* Marquee Container */}
        <div className="relative w-full overflow-hidden mask-linear-gradient">
           <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-slate-50 dark:from-slate-900 z-10"></div>
           <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-slate-50 dark:from-slate-900 z-10"></div>
           
           <div className="flex animate-scroll hover:pause-animation">
              <div className="flex gap-4">
                 {visibleStudentReviews.map(review => renderReviewCard(review))}
              </div>
              <div className="flex gap-4">
                 {visibleStudentReviews.map(review => renderReviewCard({...review, id: review.id + '-dup'}))}
              </div>
           </div>
        </div>
      </section>

      {/* TUTOR FEEDBACK MARQUEE */}
      <section className="py-24 bg-white dark:bg-slate-950 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 text-center">
           <span className="text-indigo-600 dark:text-indigo-400 font-semibold tracking-wider text-sm uppercase">Community</span>
           <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mt-2">Tutor Experiences</h2>
        </div>
        
        <div className="relative w-full overflow-hidden">
           <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white dark:from-slate-950 z-10"></div>
           <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white dark:from-slate-950 z-10"></div>

           <div className="flex animate-scroll" style={{ animationDuration: '60s' }}>
              <div className="flex gap-4">
                 {TUTOR_REVIEWS.map(review => renderReviewCard(review))}
              </div>
              <div className="flex gap-4">
                 {TUTOR_REVIEWS.map(review => renderReviewCard({...review, id: review.id + '-dup'}))}
              </div>
           </div>
        </div>
      </section>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300 font-sans">
      {renderHeader()}
      
      {view === 'home' && renderHome()}

      {/* RENDER VIEWS */}
      {view === 'tutor-profile' && selectedTutor && (
         <div className="fixed inset-0 z-50 overflow-y-auto bg-white dark:bg-slate-900">
             <TutorProfile 
               tutor={selectedTutor} 
               onBack={() => setView('find-tutor')}
               currentUser={currentUser}
               onStartChat={handleStartChat}
               onBookLesson={handleBookLesson}
             />
         </div>
      )}
      
      {view === 'login' && (
         <div className="fixed inset-0 z-50 overflow-y-auto bg-white dark:bg-slate-900">
             <AuthPage 
               onLogin={handleLogin} 
               onNavigateHome={() => setView('home')} 
               existingUsers={allUsersForAuth}
               onRegister={handleRegisterUser}
             />
         </div>
      )}

      {view === 'become-tutor' && (
         <div className="fixed inset-0 z-50 overflow-y-auto bg-white dark:bg-slate-900">
            <BecomeTutor 
              onBack={() => setView('home')} 
              onSubmitApplication={handleApplicationSubmit}
              currentUser={currentUser}
            />
         </div>
      )}
      
      {view === 'find-tutor' && (
         <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-50 dark:bg-slate-900">
            <div className="min-h-screen pb-20">
               {/* Find Tutor Header */}
               <div className="bg-white dark:bg-slate-800 sticky top-0 z-30 border-b border-slate-200 dark:border-slate-700 px-4 py-4 shadow-sm">
                  <div className="max-w-7xl mx-auto flex items-center justify-between">
                     <div className="flex items-center gap-4">
                        <button onClick={() => setView('home')} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors text-slate-600 dark:text-slate-300">
                           <ArrowLeft className="w-6 h-6" />
                        </button>
                        <h1 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                           Find a Tutor
                           {isSmartMatchActive && (
                              <span className="text-xs bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded-full font-medium flex items-center gap-1 border border-indigo-200 dark:border-indigo-800">
                                 <Sparkles className="w-3 h-3" /> AI Filter Active
                              </span>
                           )}
                        </h1>
                     </div>
                     
                     <div className="flex items-center gap-2">
                       <button 
                         onClick={() => setIsSmartMatchOpen(true)}
                         className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg text-sm font-semibold hover:shadow-lg transition-all hover:scale-105"
                       >
                         <Sparkles className="w-4 h-4" /> <span className="hidden sm:inline">AI Match</span>
                       </button>
                       <button 
                         onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                         className={`p-2 rounded-lg border transition-all ${showAdvancedFilters ? 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400' : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                       >
                         <Filter className="w-5 h-5" />
                       </button>
                     </div>
                  </div>
                  
                  {/* Filters Bar */}
                  {showAdvancedFilters && (
                    <div className="max-w-7xl mx-auto mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 animate-in slide-in-from-top-2">
                       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                          <input 
                            type="text" 
                            placeholder="Search by name, bio..." 
                            className="px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm dark:bg-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                          />
                          <select 
                            className="px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm dark:bg-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                            value={selectedSubject}
                            onChange={(e) => setSelectedSubject(e.target.value)}
                          >
                             <option value="">All Subjects</option>
                             {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                          <select 
                            className="px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm dark:bg-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                            value={selectedLevel}
                            onChange={(e) => setSelectedLevel(e.target.value)}
                          >
                             <option value="">All Levels</option>
                             {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                          </select>
                           <select 
                            className="px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm dark:bg-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                            value={selectedMode}
                            onChange={(e) => setSelectedMode(e.target.value)}
                          >
                             <option value="all">Any Mode</option>
                             <option value="online">Online</option>
                             <option value="offline">In-Person</option>
                             <option value="both">Both</option>
                          </select>
                          <div className="flex items-center gap-2">
                             <input 
                               type="number" 
                               placeholder="Min $" 
                               className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm dark:bg-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                               value={priceMin}
                               onChange={(e) => setPriceMin(e.target.value)}
                             />
                             <span className="text-slate-400">-</span>
                             <input 
                               type="number" 
                               placeholder="Max $" 
                               className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm dark:bg-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                               value={priceMax}
                               onChange={(e) => setPriceMax(e.target.value)}
                             />
                          </div>
                       </div>
                       <div className="flex justify-end mt-4">
                          <button onClick={handleClearAllFilters} className="text-xs text-red-500 hover:underline">Clear Filters</button>
                       </div>
                    </div>
                  )}
               </div>

               {/* Results Area */}
               <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                  {isSmartMatchActive && smartMatchReasoning && (
                     <div className="mb-8 p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 rounded-xl flex items-start gap-3">
                        <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" />
                        <div>
                           <h3 className="text-sm font-bold text-indigo-900 dark:text-indigo-300">AI Recommendation</h3>
                           <p className="text-sm text-indigo-700 dark:text-indigo-200 mt-1">{smartMatchReasoning}</p>
                           <button onClick={clearSmartMatch} className="text-xs text-indigo-600 dark:text-indigo-400 mt-2 font-semibold hover:underline">Clear AI Results</button>
                        </div>
                     </div>
                  )}

                  {filteredTutors.length === 0 ? (
                     <div className="text-center py-20">
                        <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                           <Search className="w-10 h-10 text-slate-400" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">No tutors found</h3>
                        <p className="text-slate-500 dark:text-slate-400 mt-2">Try adjusting your filters or search terms.</p>
                        <button onClick={handleClearAllFilters} className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors">
                           Clear All Filters
                        </button>
                     </div>
                  ) : (
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredTutors.map(tutor => {
                           const badge = getMatchBadge(tutor);
                           return (
                              <div key={tutor.id} onClick={() => handleTutorClick(tutor)} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer flex flex-col h-full hover:-translate-y-1">
                                 <div className="relative h-48 overflow-hidden bg-slate-100 dark:bg-slate-700">
                                    <img src={tutor.avatar} alt={tutor.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                                       <button className="w-full py-2 bg-white text-slate-900 font-bold rounded-lg text-sm hover:bg-indigo-50 transition-colors">View Profile</button>
                                    </div>
                                    <div className="absolute top-3 right-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold shadow-sm flex items-center gap-1">
                                       <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" /> {tutor.rating}
                                    </div>
                                    {badge && (
                                       <div className={`absolute top-3 left-3 px-2 py-1 rounded-lg text-[10px] font-bold shadow-sm flex items-center gap-1 uppercase tracking-wide ${badge.className}`}>
                                          <badge.icon className="w-3 h-3" /> {badge.label}
                                       </div>
                                    )}
                                 </div>
                                 
                                 <div className="p-5 flex-1 flex flex-col">
                                    <div className="flex justify-between items-start mb-2">
                                       <div>
                                          <h3 className="font-bold text-slate-900 dark:text-white text-lg leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{tutor.name}</h3>
                                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                                             {tutor.classMode === 'online' ? <Monitor className="w-3 h-3" /> : <MapPin className="w-3 h-3" />}
                                             {tutor.classMode === 'online' ? 'Online Only' : tutor.city}
                                          </p>
                                       </div>
                                    </div>
                                    
                                    <div className="flex flex-wrap gap-1.5 mb-4">
                                       {tutor.subjects.slice(0, 3).map(sub => (
                                          <span key={sub} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-[10px] font-semibold uppercase tracking-wide rounded">
                                             {sub}
                                          </span>
                                       ))}
                                       {tutor.subjects.length > 3 && (
                                          <span className="px-2 py-0.5 bg-slate-50 dark:bg-slate-800 text-slate-400 text-[10px] font-semibold rounded">+{tutor.subjects.length - 3}</span>
                                       )}
                                    </div>
                                    
                                    <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-4 flex-1">
                                       {tutor.bio}
                                    </p>
                                    
                                    <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                                       <div>
                                          <span className="text-lg font-bold text-slate-900 dark:text-white">${tutor.hourlyRate}</span>
                                          <span className="text-xs text-slate-500 dark:text-slate-400">/hr</span>
                                       </div>
                                       <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                                          {tutor.experienceYears} Yrs Exp.
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           );
                        })}
                     </div>
                  )}
               </div>
            </div>
         </div>
      )}

      {/* RENDER DASHBOARDS & OTHER VIEWS */}
      
      {view === 'admin-dashboard' && currentUser?.isAdmin && (
         <div className="fixed inset-0 z-50 overflow-y-auto bg-white dark:bg-slate-900">
             <AdminDashboard 
               tutors={tutors} 
               students={students}
               studentRequests={studentRequests}
               platformReviews={platformReviews}
               onApprove={handleApproveTutor} 
               onReject={handleRejectTutor} 
               onVerify={handleVerifyTutor}
               onUpdate={handleUpdateTutor}
               onUpdateStudent={handleAdminUpdateStudent}
               onMatchStudent={handleAdminMatchStudent}
               onActionStudent={handleStudentAction}
               onReviewAction={handleReviewAction}
             />
             <button onClick={() => setView('home')} className="fixed bottom-6 right-6 bg-slate-900 text-white px-4 py-2 rounded-full shadow-lg hover:bg-slate-800 z-50">
               Exit Admin
             </button>
         </div>
      )}

      {view === 'tutor-dashboard' && currentUser?.role === 'tutor' && myTutorProfile && (
         <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-50 dark:bg-slate-900">
             <TutorDashboard 
               currentUser={currentUser}
               tutorProfile={myTutorProfile}
               chatSessions={chatSessions}
               students={students}
               onUpdateProfile={handleUpdateTutor}
               onNavigateChat={() => setView('chat')}
               onContactAdmin={handleContactAdmin}
             />
             <button onClick={() => setView('home')} className="fixed bottom-6 right-6 bg-slate-900 text-white px-4 py-2 rounded-full shadow-lg hover:bg-slate-800 z-50">
               Exit Dashboard
             </button>
         </div>
      )}

      {view === 'student-dashboard' && currentUser?.role === 'student' && (
         <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-50 dark:bg-slate-900">
             <StudentDashboard 
               currentUser={currentUser}
               chatSessions={chatSessions}
               onUpdateUser={handleUpdateUser}
               onNavigateChat={() => setView('chat')}
               onContactAdmin={handleContactAdmin}
               onBecomeTutor={() => { setView('become-tutor'); }}
               onSubmitFeedback={handleStudentFeedback}
             />
             <button onClick={() => setView('home')} className="fixed bottom-6 right-6 bg-slate-900 text-white px-4 py-2 rounded-full shadow-lg hover:bg-slate-800 z-50">
               Exit Dashboard
             </button>
         </div>
      )}

      {/* REQUESTS BOARD FOR TUTORS TO FIND STUDENTS */}
      {view === 'find-students' && currentUser?.role === 'tutor' && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-50 dark:bg-slate-900">
             <div className="relative">
                 <button 
                    onClick={() => setView('home')} 
                    className="absolute top-4 left-4 p-2 bg-white dark:bg-slate-800 rounded-full shadow-md z-10 hover:bg-slate-100 dark:hover:bg-slate-700"
                 >
                    <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                 </button>
                 <StudentRequestsBoard requests={studentRequests} currentUserRole="tutor" />
             </div>
          </div>
      )}

      {view === 'chat' && currentUser && (
         <div className="fixed inset-0 z-50 overflow-hidden bg-white dark:bg-slate-900">
             <ChatWindow 
               currentUser={currentUser}
               activeSessionId={activeSessionId}
               sessions={visibleChatSessions}
               tutors={tutors}
               students={students}
               onSelectSession={(id) => setActiveSessionId(id)}
               onSendMessage={handleSendMessage}
               onBack={() => setView('home')}
             />
         </div>
      )}

      {/* MODALS */}
      <SmartMatchModal 
        isOpen={isSmartMatchOpen} 
        onClose={() => setIsSmartMatchOpen(false)} 
        onMatchesFound={handleSmartMatchFound}
        tutors={tutors}
      />

      <StudentRequestWizard 
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onComplete={handleWizardComplete}
      />

      {/* Notifications / Toasts */}
      {showNotification && !currentUser && (
        <div className="fixed bottom-6 right-6 max-w-sm bg-white dark:bg-slate-800 p-4 rounded-xl shadow-2xl border border-indigo-100 dark:border-indigo-900 animate-in slide-in-from-bottom-10 fade-in duration-500 z-40">
           <div className="flex items-start gap-4">
              <div className="bg-indigo-100 dark:bg-indigo-900/50 p-2 rounded-full text-indigo-600 dark:text-indigo-400">
                 <Sparkles className="w-6 h-6" />
              </div>
              <div className="flex-1">
                 <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1">Need help finding a tutor?</h4>
                 <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">Our AI wizard can match you with the perfect teacher in seconds.</p>
                 <div className="flex gap-2">
                    <button onClick={handleStartWizard} className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700">Start Wizard</button>
                    <button onClick={() => setShowNotification(false)} className="px-3 py-1.5 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 text-xs font-medium">Dismiss</button>
                 </div>
              </div>
              <button onClick={() => setShowNotification(false)} className="text-slate-400 hover:text-slate-600">
                 <X className="w-4 h-4" />
              </button>
           </div>
        </div>
      )}
    </div>
  );
}