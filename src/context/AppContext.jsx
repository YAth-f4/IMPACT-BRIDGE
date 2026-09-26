import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import {
  INITIAL_PROGRAMS,
  INITIAL_VOLUNTEERS,
  INITIAL_BENEFICIARIES,
  INITIAL_DONATIONS,
  INITIAL_LOCATIONS,
  INITIAL_MESSAGES,
  NGO_PROFILE
} from '../data/mockData';
import { generateId } from '../utils/formatters';

const AppContext = createContext();

export function AppProvider({ children }) {
  // Real Authenticated User State
  const [token, setToken] = useState(() => {
    return localStorage.getItem('ib_auth_token') || sessionStorage.getItem('ib_auth_token') || null;
  });
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // Role Session: strictly 'guest' unless authenticated with a verified token from backend
  const [userRole, setUserRole] = useState('guest');

  // Verify stored JWT session with backend on initial load
  useEffect(() => {
    const verifyToken = async () => {
      const storedToken = localStorage.getItem('ib_auth_token') || sessionStorage.getItem('ib_auth_token');
      if (!storedToken) {
        setIsAuthLoading(false);
        setUserRole('guest');
        setCurrentUser(null);
        return;
      }
      try {
        const res = await fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${storedToken}` }
        });
        const data = await res.json();
        if (data.success && data.user) {
          setCurrentUser(data.user);
          setUserRole(data.user.role);
          setToken(storedToken);
        } else {
          // Token invalid or expired - reset to GUEST
          localStorage.removeItem('ib_auth_token');
          sessionStorage.removeItem('ib_auth_token');
          localStorage.removeItem('ib_user_role');
          setToken(null);
          setCurrentUser(null);
          setUserRole('guest');
        }
      } catch (err) {
        console.error('[Auth] Verification failed:', err.message);
        setUserRole('guest');
        setCurrentUser(null);
      } finally {
        setIsAuthLoading(false);
      }
    };
    verifyToken();
  }, []);

  // Global Mock Entities with LocalStorage Persistence
  const [programs, setPrograms] = useState(() => {
    const saved = localStorage.getItem('ib_programs');
    return saved ? JSON.parse(saved) : INITIAL_PROGRAMS;
  });

  const [volunteers, setVolunteers] = useState(() => {
    const saved = localStorage.getItem('ib_volunteers');
    return saved ? JSON.parse(saved) : INITIAL_VOLUNTEERS;
  });

  const [beneficiaries, setBeneficiaries] = useState(() => {
    const saved = localStorage.getItem('ib_beneficiaries');
    return saved ? JSON.parse(saved) : INITIAL_BENEFICIARIES;
  });

  const [donations, setDonations] = useState(() => {
    const saved = localStorage.getItem('ib_donations');
    return saved ? JSON.parse(saved) : INITIAL_DONATIONS;
  });

  // Fetch real programs and donations from persistent backend on mount
  useEffect(() => {
    let isMounted = true;
    const loadBackendData = async () => {
      try {
        const [progRes, donRes] = await Promise.allSettled([
          fetch('/api/programs'),
          fetch('/api/donations')
        ]);
        if (isMounted && progRes.status === 'fulfilled') {
          const progData = await progRes.value.json();
          if (progData.success && Array.isArray(progData.programs) && progData.programs.length > 0) {
            setPrograms(progData.programs);
          }
        }
        if (isMounted && donRes.status === 'fulfilled') {
          const donData = await donRes.value.json();
          if (donData.success && Array.isArray(donData.recentDonations) && donData.recentDonations.length > 0) {
            setDonations(donData.recentDonations);
          }
        }
      } catch (err) {
        // preserve local cache fallback
      }
    };
    loadBackendData();
    return () => { isMounted = false; };
  }, []);

  const [locations, setLocations] = useState(() => {
    const saved = localStorage.getItem('ib_locations');
    return saved ? JSON.parse(saved) : INITIAL_LOCATIONS;
  });

  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('ib_messages');
    return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
  });

  const [ngoProfile, setNgoProfile] = useState(() => {
    const saved = localStorage.getItem('ib_profile');
    return saved ? JSON.parse(saved) : NGO_PROFILE;
  });

  // Beneficiary Support Requests
  const [supportRequests, setSupportRequests] = useState(() => {
    const saved = localStorage.getItem('ib_support_requests');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'REQ-101',
        name: 'Laxmi Devi',
        phone: '+91 98765 43210',
        city: 'Mumbai',
        category: 'Education Support',
        need: 'School kit & tablet for 8th grade student',
        status: 'Verified by Field Lead',
        date: '2026-09-08',
        assignedCenter: 'Mumbai Slum Innovation Lab (Dharavi)',
        notes: 'Family verified by Dr. Ananya Iyer. Device allocated from digital classroom batch.'
      },
      {
        id: 'REQ-102',
        name: 'Ramesh Patel',
        phone: '+91 91234 56789',
        city: 'New Delhi',
        category: 'Food & Nutrition',
        need: 'Emergency monthly nutrition ration pack for family of 4',
        status: 'Aid Dispatched',
        date: '2026-09-10',
        assignedCenter: 'Okhla Mega Nutrition Kitchen',
        notes: 'Ration delivery dispatched via volunteer team.'
      }
    ];
  });

  // Volunteer Tasks
  const [volunteerTasks, setVolunteerTasks] = useState(() => {
    const saved = localStorage.getItem('ib_volunteer_tasks');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'TASK-01',
        title: 'Conduct Scratch Coding Session',
        program: 'GyanSetu: Digital Classrooms',
        location: 'Dharavi Slum Center, Mumbai',
        time: 'Sunday, 10:00 AM - 12:30 PM',
        completed: false,
        hours: 2.5
      },
      {
        id: 'TASK-02',
        title: 'Distribute Nutrition Meal Packets',
        program: 'Annapurna Seva: Poshan & Daily Meals',
        location: 'Okhla Community Shed, Delhi',
        time: 'Saturday, 1:00 PM - 3:00 PM',
        completed: true,
        hours: 2.0
      },
      {
        id: 'TASK-03',
        title: 'Volunteer Orientation & Kit Handover',
        program: 'Yuva Kaushal Coding Bootcamp',
        location: 'Koramangala Tech Hub, Bengaluru',
        time: 'Wednesday, 4:00 PM - 6:00 PM',
        completed: false,
        hours: 2.0
      }
    ];
  });

  // UI Toast State & Refs for Deduplication and Timer Cleanup
  const [toasts, setToasts] = useState([]);
  const toastTimersRef = useRef(new Map());
  const recentToastMessagesRef = useRef(new Map());

  // Toast Cleanup on unmount
  useEffect(() => {
    return () => {
      toastTimersRef.current.forEach((timer) => clearTimeout(timer));
      toastTimersRef.current.clear();
      recentToastMessagesRef.current.clear();
    };
  }, []);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('ib_user_role', userRole);
  }, [userRole]);

  useEffect(() => {
    localStorage.setItem('ib_programs', JSON.stringify(programs));
  }, [programs]);

  useEffect(() => {
    localStorage.setItem('ib_volunteers', JSON.stringify(volunteers));
  }, [volunteers]);

  useEffect(() => {
    localStorage.setItem('ib_beneficiaries', JSON.stringify(beneficiaries));
  }, [beneficiaries]);

  useEffect(() => {
    localStorage.setItem('ib_donations', JSON.stringify(donations));
  }, [donations]);

  useEffect(() => {
    localStorage.setItem('ib_locations', JSON.stringify(locations));
  }, [locations]);

  useEffect(() => {
    localStorage.setItem('ib_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('ib_profile', JSON.stringify(ngoProfile));
  }, [ngoProfile]);

  useEffect(() => {
    localStorage.setItem('ib_support_requests', JSON.stringify(supportRequests));
  }, [supportRequests]);

  useEffect(() => {
    localStorage.setItem('ib_volunteer_tasks', JSON.stringify(volunteerTasks));
  }, [volunteerTasks]);

  // Toast Helpers with Idempotency, Deduplication & Timer Cleanup
  const removeToast = useCallback((id) => {
    if (toastTimersRef.current.has(id)) {
      clearTimeout(toastTimersRef.current.get(id));
      toastTimersRef.current.delete(id);
    }
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((message, type = 'success') => {
    if (!message) return;

    const cleanMsg = typeof message === 'string' ? message.trim() : String(message);
    const now = Date.now();

    // 1. Time-window debounce (prevent identical message triggered rapidly within 3 seconds)
    const lastSeen = recentToastMessagesRef.current.get(cleanMsg);
    if (lastSeen && (now - lastSeen) < 3000) {
      return;
    }
    recentToastMessagesRef.current.set(cleanMsg, now);

    // 2. Prevent adding if identical message already in active toasts
    setToasts((prev) => {
      if (prev.some((t) => t.message === cleanMsg)) {
        return prev;
      }
      const id = `${now}-${Math.random().toString(36).slice(2, 7)}`;

      const timer = setTimeout(() => {
        removeToast(id);
      }, 4000);
      toastTimersRef.current.set(id, timer);

      return [...prev, { id, message: cleanMsg, type }];
    });
  }, [removeToast]);

  // PROGRAM CRUD (Connected to Backend API with safe local fallback)
  const fetchPrograms = async (query = '') => {
    try {
      const res = await fetch(`/api/programs?${query}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.programs)) {
        setPrograms(data.programs);
        return data.programs;
      }
    } catch (err) {
      console.warn('[AppContext] fetchPrograms fallback:', err.message);
    }
    return programs;
  };

  const addProgram = async (programData) => {
    try {
      const res = await fetch('/api/admin/programs', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(programData)
      });
      const data = await res.json();
      if (data.success && data.program) {
        setPrograms((prev) => [data.program, ...prev]);
        addToast(`Program "${data.program.title}" created successfully!`, 'success');
        return data.program;
      }
    } catch (err) {
      console.warn('[AppContext] addProgram API fallback:', err.message);
    }

    const newProg = {
      ...programData,
      id: generateId('PRG'),
      fundsRaised: Number(programData.fundsRaised || 0),
      budget: Number(programData.budget || 1000000),
      progress: Math.min(100, Math.round((Number(programData.fundsRaised || 0) / Number(programData.budget || 1)) * 100)),
      volunteersEnrolled: Number(programData.volunteersEnrolled || 0),
      actualBeneficiaries: Number(programData.actualBeneficiaries || 0),
      status: programData.status || 'Upcoming',
      objectives: Array.isArray(programData.objectives) ? programData.objectives : (programData.objectives || '').split('\n').filter(Boolean),
      tags: Array.isArray(programData.tags) ? programData.tags : (programData.tags || '').split(',').map((s) => s.trim()).filter(Boolean),
      image: programData.image || 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80'
    };
    setPrograms([newProg, ...programs]);
    addToast(`Program "${newProg.title}" created successfully!`, 'success');
    return newProg;
  };

  const updateProgram = async (id, updatedFields) => {
    try {
      const res = await fetch(`/api/admin/programs/${id}`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify(updatedFields)
      });
      const data = await res.json();
      if (data.success && data.program) {
        setPrograms((prev) => prev.map((p) => (p.id === id ? data.program : p)));
        addToast('Program updated successfully!', 'success');
        return data.program;
      }
    } catch (err) {
      console.warn('[AppContext] updateProgram API fallback:', err.message);
    }

    setPrograms((prev) =>
      prev.map((prog) => {
        if (prog.id === id) {
          const updated = { ...prog, ...updatedFields };
          if (updated.budget && updated.fundsRaised) {
            updated.progress = Math.min(100, Math.round((Number(updated.fundsRaised) / Number(updated.budget)) * 100));
          }
          return updated;
        }
        return prog;
      })
    );
    addToast('Program updated successfully!', 'success');
  };

  const deleteProgram = async (id) => {
    try {
      const res = await fetch(`/api/admin/programs/${id}`, {
        method: 'DELETE',
        headers: authHeaders()
      });
      const data = await res.json();
      if (data.success) {
        setPrograms((prev) => prev.filter((p) => p.id !== id));
        addToast('Program deleted from system.', 'info');
        return;
      }
    } catch (err) {
      console.warn('[AppContext] deleteProgram API fallback:', err.message);
    }

    setPrograms((prev) => prev.filter((p) => p.id !== id));
    addToast('Program deleted from system.', 'info');
  };

  // VOLUNTEER CRUD
  const addVolunteer = (volData) => {
    const newVol = {
      ...volData,
      id: generateId('VOL'),
      status: volData.status || 'Active',
      hoursLogged: Number(volData.hoursLogged || 0),
      joinedDate: new Date().toISOString().split('T')[0],
      assignedPrograms: volData.assignedPrograms || [],
      badges: volData.badges || ['New Volunteer', 'Changemaker 2026'],
      avatar: volData.avatar || `https://images.unsplash.com/photo-${1535713875002 + Math.floor(Math.random()*1000)}?auto=format&fit=crop&w=200&q=80`
    };
    setVolunteers([newVol, ...volunteers]);
    addToast(`Welcome ${newVol.name}! Volunteer registered.`, 'success');
    return newVol;
  };

  const updateVolunteer = (id, updatedFields) => {
    setVolunteers((prev) =>
      prev.map((vol) => (vol.id === id ? { ...vol, ...updatedFields } : vol))
    );
    addToast('Volunteer profile updated.', 'success');
  };

  const toggleVolunteerStatus = (id) => {
    setVolunteers((prev) =>
      prev.map((vol) => {
        if (vol.id === id) {
          const nextStatus = vol.status === 'Active' ? 'On-Leave' : 'Active';
          addToast(`${vol.name}'s status changed to ${nextStatus}`, 'info');
          return { ...vol, status: nextStatus };
        }
        return vol;
      })
    );
  };

  const deleteVolunteer = (id) => {
    setVolunteers((prev) => prev.filter((v) => v.id !== id));
    addToast('Volunteer record removed.', 'info');
  };

  // BENEFICIARY CRUD
  const addBeneficiary = (benData) => {
    const newBen = {
      ...benData,
      id: generateId('BEN'),
      status: benData.status || 'Active Support',
      registeredDate: new Date().toISOString().split('T')[0],
      verified: true,
      timeline: [
        {
          date: new Date().toISOString().split('T')[0],
          title: 'Registered with Impact Bridge',
          note: `Assigned under category: ${benData.category}`
        }
      ]
    };
    setBeneficiaries([newBen, ...beneficiaries]);
    addToast(`Beneficiary record created for ${newBen.name}`, 'success');
    return newBen;
  };

  const updateBeneficiary = (id, updatedFields) => {
    setBeneficiaries((prev) =>
      prev.map((ben) => (ben.id === id ? { ...ben, ...updatedFields } : ben))
    );
    addToast('Beneficiary record updated.', 'success');
  };

  const deleteBeneficiary = (id) => {
    setBeneficiaries((prev) => prev.filter((b) => b.id !== id));
    addToast('Beneficiary record deleted.', 'info');
  };

  // DONATIONS (Connected to Backend API with safe local fallback)
  const addDonation = async (donationData) => {
    try {
      const res = await fetch('/api/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(donationData)
      });
      const data = await res.json();
      if (data.success && data.donation) {
        setDonations((prev) => [data.donation, ...prev]);
        addToast(`Thank you! ₹${Number(donationData.amount).toLocaleString('en-IN')} donation recorded. 80G Receipt generated.`, 'success');
        return data.donation;
      }
    } catch (err) {
      console.warn('[AppContext] addDonation API fallback:', err.message);
    }

    const newDonation = {
      ...donationData,
      id: generateId('DON'),
      date: new Date().toISOString().split('T')[0],
      paymentStatus: 'Completed',
      taxExempt80G: `IB-80G-2026-${Math.floor(1000 + Math.random() * 9000)}`
    };
    setDonations([newDonation, ...donations]);
    
    // Update program raised funds if linked
    if (donationData.programId) {
      setPrograms((prev) =>
        prev.map((p) => {
          if (p.id === donationData.programId) {
            const fundsRaised = (p.fundsRaised || 0) + Number(donationData.amount);
            const progress = Math.min(100, Math.round((fundsRaised / (p.budget || 1)) * 100));
            return { ...p, fundsRaised, progress };
          }
          return p;
        })
      );
    }

    addToast(`Thank you! ₹${donationData.amount} donation recorded. 80G Receipt generated.`, 'success');
    return newDonation;
  };

  // LOCATIONS
  const addLocation = (locData) => {
    const newLoc = {
      ...locData,
      id: generateId('LOC'),
      coordinates: locData.coordinates || [28.6139, 77.2090],
      status: locData.status || 'Active Hub'
    };
    setLocations([newLoc, ...locations]);
    addToast(`Location "${newLoc.name}" added to Impact Map!`, 'success');
    return newLoc;
  };

  const updateLocation = (id, updatedFields) => {
    setLocations((prev) =>
      prev.map((l) => (l.id === id ? { ...l, ...updatedFields } : l))
    );
    addToast('Location updated.', 'success');
  };

  // MESSAGES (Connected to Backend API with safe local fallback)
  const sendMessage = async (msgData) => {
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(msgData)
      });
      const data = await res.json();
      if (data.success && data.data) {
        setMessages((prev) => [data.data, ...prev]);
        addToast('Your message has been sent to the Impact Bridge team!', 'success');
        return data.data;
      }
    } catch (err) {
      console.warn('[AppContext] sendMessage API fallback:', err.message);
    }

    const newMsg = {
      ...msgData,
      id: generateId('MSG'),
      folder: 'Inbox',
      date: new Date().toISOString(),
      read: false,
      starred: false,
      replyHistory: []
    };
    setMessages([newMsg, ...messages]);
    addToast('Your message has been sent to the Impact Bridge team!', 'success');
    return newMsg;
  };

  const replyMessage = (id, replyText) => {
    setMessages((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const newReply = {
            date: new Date().toISOString(),
            author: 'Admin Team',
            text: replyText
          };
          return {
            ...m,
            read: true,
            replyHistory: [...(m.replyHistory || []), newReply]
          };
        }
        return m;
      })
    );
    addToast('Reply dispatched to sender.', 'success');
  };

  const toggleStarMessage = (id) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, starred: !m.starred } : m))
    );
  };

  const markMessageRead = (id, readStatus = true) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, read: readStatus } : m))
    );
  };

  const deleteMessage = (id) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
    addToast('Message deleted.', 'info');
  };

  // BENEFICIARY SUPPORT REQUESTS
  const addSupportRequest = (reqData) => {
    const newReq = {
      ...reqData,
      id: generateId('REQ'),
      date: new Date().toISOString().split('T')[0],
      status: 'Application Received',
      assignedCenter: reqData.assignedCenter || 'Nearest Impact Bridge Hub',
      notes: 'Application registered. Our local field coordinator will contact you within 24-48 hours.'
    };
    setSupportRequests((prev) => [newReq, ...prev]);
    addToast(`Support request submitted! Reference ID: ${newReq.id}`, 'success');
    return newReq;
  };

  const updateSupportRequestStatus = (id, newStatus, note) => {
    setSupportRequests((prev) =>
      prev.map((req) =>
        req.id === id
          ? {
              ...req,
              status: newStatus,
              ...(note ? { notes: note } : {})
            }
          : req
      )
    );
    addToast('Application status updated.', 'info');
  };

  // VOLUNTEER TASKS & HOURS
  const toggleVolunteerTask = (taskId) => {
    setVolunteerTasks((prev) =>
      prev.map((task) => {
        if (task.id === taskId) {
          const updated = !task.completed;
          addToast(
            updated ? `Great job! Completed: "${task.title}"` : `Reopened: "${task.title}"`,
            'success'
          );
          return { ...task, completed: updated };
        }
        return task;
      })
    );
  };

  const addVolunteerTask = (taskData) => {
    const newTask = {
      ...taskData,
      id: generateId('TASK'),
      completed: false
    };
    setVolunteerTasks((prev) => [newTask, ...prev]);
    addToast(`Task "${newTask.title}" added to your schedule.`, 'success');
    return newTask;
  };

  const logVolunteerHours = (hours, programTitle) => {
    addToast(`Logged ${hours} volunteer hours for ${programTitle || 'community service'}!`, 'success');
  };

  // REAL AUTHENTICATION METHODS
  const loginUser = async ({ email, password, rememberMe = true }) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, rememberMe })
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        return { success: false, message: data.message || 'Invalid email or password.' };
      }

      // Persist token based on Remember Me
      if (rememberMe) {
        localStorage.setItem('ib_auth_token', data.token);
        sessionStorage.removeItem('ib_auth_token');
      } else {
        sessionStorage.setItem('ib_auth_token', data.token);
        localStorage.removeItem('ib_auth_token');
      }

      setToken(data.token);
      setCurrentUser(data.user);
      setUserRole(data.user.role);

      return {
        success: true,
        message: data.message,
        user: data.user,
        token: data.token
      };
    } catch (err) {
      console.error('[Auth] Login error:', err.message);
      return { success: false, message: 'Unable to connect to server. Please try again.' };
    }
  };

  const registerUser = async ({ name, email, password, role }) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role })
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        return { success: false, message: data.message || 'Registration failed.' };
      }

      return { success: true, message: data.message, user: data.user };
    } catch (err) {
      console.error('[Auth] Register error:', err.message);
      return { success: false, message: 'Unable to connect to server. Please try again.' };
    }
  };

  const loginWithGoogle = async (googleCredentials) => {
    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(googleCredentials)
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        return {
          success: false,
          message: data.message || 'Unable to sign in with Google. Please try again.'
        };
      }

      // Store in existing token storage
      localStorage.setItem('ib_auth_token', data.token);
      sessionStorage.removeItem('ib_auth_token');

      setToken(data.token);
      setCurrentUser(data.user);
      setUserRole(data.user.role);

      return {
        success: true,
        message: data.message,
        user: data.user,
        token: data.token
      };
    } catch (err) {
      console.error('[Auth] Google login error:', err.message);
      return {
        success: false,
        message: 'Unable to connect to authentication server. Please try again.'
      };
    }
  };

  const logoutUser = () => {
    localStorage.removeItem('ib_auth_token');
    sessionStorage.removeItem('ib_auth_token');
    localStorage.removeItem('ib_user_role');
    setToken(null);
    setCurrentUser(null);
    setUserRole('guest');
    addToast('You have been signed out successfully.', 'info');
  };

  // BACKEND API CLIENT HELPERS
  const authHeaders = () => {
    const currentToken = token || localStorage.getItem('ib_auth_token') || sessionStorage.getItem('ib_auth_token');
    return {
      'Content-Type': 'application/json',
      ...(currentToken ? { Authorization: `Bearer ${currentToken}` } : {})
    };
  };

  // Find Help API
  const submitFindHelp = async (formData) => {
    try {
      const res = await fetch('/api/requests/find-help', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, message: data.message || 'Submission failed.' };
      }
      addToast('Your help request has been submitted and is awaiting admin review.', 'success');
      return { success: true, ...data };
    } catch (err) {
      console.error('[API] submitFindHelp error:', err.message);
      return { success: false, message: 'Server connection error.' };
    }
  };

  const fetchMyFindHelpRequests = async () => {
    try {
      const res = await fetch('/api/requests/my-find-help', {
        headers: authHeaders()
      });
      const data = await res.json();
      return data.success ? data.requests : [];
    } catch (err) {
      console.error('[API] fetchMyFindHelpRequests error:', err.message);
      return [];
    }
  };

  // Fund Raise API
  const submitFundRaise = async (formData) => {
    try {
      const res = await fetch('/api/requests/fund-raise', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, message: data.message || 'Submission failed.' };
      }
      addToast('Campaign proposal submitted and awaiting admin approval.', 'success');
      return { success: true, ...data };
    } catch (err) {
      return { success: false, message: 'Server connection error.' };
    }
  };

  const fetchMyFundRaiseRequests = async () => {
    try {
      const res = await fetch('/api/requests/my-fund-raise', {
        headers: authHeaders()
      });
      const data = await res.json();
      return data.success ? data.campaigns : [];
    } catch (err) {
      return [];
    }
  };

  const fetchApprovedFundraisers = async () => {
    try {
      const res = await fetch('/api/requests/fund-raise/approved');
      const data = await res.json();
      return data.success ? data.campaigns : [];
    } catch (err) {
      return [];
    }
  };

  // Volunteer API
  const submitVolunteerApplication = async (formData) => {
    try {
      const res = await fetch('/api/requests/volunteer', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, message: data.message || 'Submission failed.' };
      }
      addToast('Volunteer application submitted and placed in review queue.', 'success');
      return { success: true, ...data };
    } catch (err) {
      return { success: false, message: 'Server connection error.' };
    }
  };

  const fetchMyVolunteerApplications = async () => {
    try {
      const res = await fetch('/api/requests/my-volunteer', {
        headers: authHeaders()
      });
      const data = await res.json();
      return data.success ? data.applications : [];
    } catch (err) {
      return [];
    }
  };

  const submitVolunteerHours = async (hours, programTitle) => {
    try {
      const res = await fetch('/api/requests/my-volunteer/log-hours', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ hours, programTitle })
      });
      const data = await res.json();
      if (data.success) {
        addToast(`Successfully logged ${hours} volunteer hours!`, 'success');
      }
      return data;
    } catch (err) {
      return { success: false, message: 'Failed to record hours.' };
    }
  };

  // Admin Operations
  const fetchAdminDashboard = async () => {
    try {
      const res = await fetch('/api/admin/dashboard', { headers: authHeaders() });
      const data = await res.json();
      return data.success ? data : null;
    } catch (err) {
      console.error('[API] fetchAdminDashboard error:', err.message);
      return null;
    }
  };

  const fetchAdminStats = async () => {
    try {
      const res = await fetch('/api/admin/dashboard', { headers: authHeaders() });
      const data = await res.json();
      return data.success ? (data.data || data.stats) : null;
    } catch (err) {
      return null;
    }
  };

  const fetchAdminFindHelp = async (query = '') => {
    try {
      const res = await fetch(`/api/admin/requests/find-help?${query}`, { headers: authHeaders() });
      const data = await res.json();
      return data.success ? data : { requests: [], total: 0 };
    } catch (err) {
      return { requests: [], total: 0 };
    }
  };

  const updateAdminFindHelpStatus = async (id, status, note = '') => {
    try {
      const res = await fetch(`/api/admin/requests/find-help/${id}/status`, {
        method: 'PATCH',
        headers: authHeaders(),
        body: JSON.stringify({ status, note })
      });
      const data = await res.json();
      if (data.success) {
        addToast(`Request ${id} status set to ${status}.`, 'success');
      }
      return data;
    } catch (err) {
      return { success: false, message: 'Update failed.' };
    }
  };

  const fetchAdminFundRaise = async (query = '') => {
    try {
      const res = await fetch(`/api/admin/requests/fund-raise?${query}`, { headers: authHeaders() });
      const data = await res.json();
      return data.success ? data : { requests: [], total: 0 };
    } catch (err) {
      return { requests: [], total: 0 };
    }
  };

  const updateAdminFundRaiseStatus = async (id, status, note = '') => {
    try {
      const res = await fetch(`/api/admin/requests/fund-raise/${id}/status`, {
        method: 'PATCH',
        headers: authHeaders(),
        body: JSON.stringify({ status, note })
      });
      const data = await res.json();
      if (data.success) {
        addToast(`Campaign ${id} status set to ${status}.`, 'success');
      }
      return data;
    } catch (err) {
      return { success: false, message: 'Update failed.' };
    }
  };

  const fetchAdminVolunteers = async (query = '') => {
    try {
      const res = await fetch(`/api/admin/requests/volunteers?${query}`, { headers: authHeaders() });
      const data = await res.json();
      return data.success ? data : { applications: [], total: 0 };
    } catch (err) {
      return { applications: [], total: 0 };
    }
  };

  const updateAdminVolunteerStatus = async (id, status, note = '') => {
    try {
      const res = await fetch(`/api/admin/requests/volunteers/${id}/status`, {
        method: 'PATCH',
        headers: authHeaders(),
        body: JSON.stringify({ status, note })
      });
      const data = await res.json();
      if (data.success) {
        addToast(`Volunteer application ${id} set to ${status}.`, 'success');
      }
      return data;
    } catch (err) {
      return { success: false, message: 'Update failed.' };
    }
  };

  const fetchAdminUsers = async () => {
    try {
      const res = await fetch('/api/admin/users', { headers: authHeaders() });
      const data = await res.json();
      return data.success ? data.users : [];
    } catch (err) {
      return [];
    }
  };

  const updateAdminUserRole = async (id, role) => {
    try {
      const res = await fetch(`/api/admin/users/${id}/role`, {
        method: 'PATCH',
        headers: authHeaders(),
        body: JSON.stringify({ role })
      });
      const data = await res.json();
      if (data.success) {
        addToast(`User role updated to ${role.toUpperCase()}.`, 'success');
      }
      return data;
    } catch (err) {
      return { success: false, message: 'Role update failed.' };
    }
  };

  // Admin Donations API
  const fetchAdminDonations = async (query = '') => {
    try {
      const res = await fetch(`/api/admin/donations?${query}`, { headers: authHeaders() });
      const data = await res.json();
      return data.success ? data : { donations: [], total: 0, totalAmount: 0 };
    } catch (err) {
      return { donations: [], total: 0, totalAmount: 0 };
    }
  };

  const createAdminDonation = async (donationData) => {
    try {
      const res = await fetch('/api/admin/donations', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(donationData)
      });
      const data = await res.json();
      if (data.success && data.donation) {
        setDonations((prev) => [data.donation, ...prev]);
        addToast(`Donation of ₹${Number(data.donation.amount).toLocaleString('en-IN')} recorded successfully.`, 'success');
      }
      return data;
    } catch (err) {
      return { success: false, message: 'Failed to record donation.' };
    }
  };

  // Admin Messages API
  const fetchAdminMessages = async (query = '') => {
    try {
      const res = await fetch(`/api/admin/messages?${query}`, { headers: authHeaders() });
      const data = await res.json();
      return data.success ? data : { messages: [], total: 0, stats: {} };
    } catch (err) {
      return { messages: [], total: 0, stats: {} };
    }
  };

  const updateAdminMessageStatus = async (id, status, note = '') => {
    try {
      const res = await fetch(`/api/admin/messages/${id}/status`, {
        method: 'PATCH',
        headers: authHeaders(),
        body: JSON.stringify({ status, note })
      });
      const data = await res.json();
      if (data.success) {
        addToast(`Message status set to ${status}.`, 'success');
      }
      return data;
    } catch (err) {
      return { success: false, message: 'Status update failed.' };
    }
  };

  const deleteAdminMessage = async (id) => {
    try {
      const res = await fetch(`/api/admin/messages/${id}`, {
        method: 'DELETE',
        headers: authHeaders()
      });
      const data = await res.json();
      if (data.success) {
        setMessages((prev) => prev.filter((m) => m.id !== id));
        addToast('Message deleted.', 'info');
      }
      return data;
    } catch (err) {
      return { success: false, message: 'Delete failed.' };
    }
  };

  // Admin Verified Hubs API
  const fetchAdminVerifiedHubs = async (query = '') => {
    try {
      const res = await fetch(`/api/admin/verified-hubs?${query}`, { headers: authHeaders() });
      const data = await res.json();
      return data.success ? data : { results: [], count: 0 };
    } catch (err) {
      return { results: [], count: 0 };
    }
  };

  const createAdminVerifiedHub = async (hubData) => {
    try {
      const res = await fetch('/api/admin/verified-hubs', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(hubData)
      });
      const data = await res.json();
      if (data.success) {
        addToast(`Verified Hub "${hubData.name}" created!`, 'success');
      }
      return data;
    } catch (err) {
      return { success: false, message: 'Failed to create hub.' };
    }
  };

  const updateAdminVerifiedHub = async (id, updates) => {
    try {
      const res = await fetch(`/api/admin/verified-hubs/${id}`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify(updates)
      });
      const data = await res.json();
      if (data.success) {
        addToast('Verified Hub details updated.', 'success');
      }
      return data;
    } catch (err) {
      return { success: false, message: 'Failed to update hub.' };
    }
  };

  const deleteAdminVerifiedHub = async (id) => {
    try {
      const res = await fetch(`/api/admin/verified-hubs/${id}`, {
        method: 'DELETE',
        headers: authHeaders()
      });
      const data = await res.json();
      if (data.success) {
        addToast('Verified Hub deleted.', 'info');
      }
      return data;
    } catch (err) {
      return { success: false, message: 'Failed to delete hub.' };
    }
  };

  // NGO Registration & Directory API
  const submitNgoRegistration = async (formData) => {
    try {
      const res = await fetch('/api/ngos', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, message: data.message || data.error || 'Registration submission failed.' };
      }
      addToast('NGO registration submitted successfully! Awaiting administrator verification.', 'success');
      return { success: true, ...data };
    } catch (err) {
      console.error('[API] submitNgoRegistration error:', err.message);
      return { success: false, message: 'Server connection error.' };
    }
  };

  const fetchPublicNgos = async (query = '') => {
    try {
      const queryString = query ? (query.startsWith('?') ? query : `?${query}`) : '';
      const res = await fetch(`/api/ngos${queryString}`);
      const data = await res.json();
      if (res.ok && data.success) {
        return { success: true, count: data.count || data.ngos?.length || 0, ngos: data.ngos || [] };
      }
      return { success: false, ngos: [], error: data.message || 'Unable to load verified NGOs.' };
    } catch (err) {
      console.error('[API] fetchPublicNgos error:', err.message);
      return { success: false, ngos: [], error: 'A connection error occurred while retrieving verified organizations.' };
    }
  };

  const fetchPublicNgoById = async (id) => {
    try {
      const res = await fetch(`/api/ngos/${id}`, { headers: authHeaders() });
      const data = await res.json();
      return data.success ? data.ngo : null;
    } catch (err) {
      console.error('[API] fetchPublicNgoById error:', err.message);
      return null;
    }
  };

  const fetchMyNgos = async () => {
    try {
      const res = await fetch('/api/ngos/my', { headers: authHeaders() });
      const data = await res.json();
      return data.success ? data.ngos : [];
    } catch (err) {
      console.error('[API] fetchMyNgos error:', err.message);
      return [];
    }
  };

  const updateMyNgo = async (id, updates) => {
    try {
      const res = await fetch(`/api/ngos/${id}`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify(updates)
      });
      const data = await res.json();
      if (data.success) {
        addToast('NGO details updated successfully.', 'success');
      }
      return data;
    } catch (err) {
      return { success: false, message: 'Update failed.' };
    }
  };

  const resubmitNgo = async (id, note = '') => {
    try {
      const res = await fetch(`/api/ngos/${id}/resubmit`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ note })
      });
      const data = await res.json();
      if (data.success) {
        addToast('NGO application resubmitted for admin review.', 'success');
      }
      return data;
    } catch (err) {
      return { success: false, message: 'Resubmission failed.' };
    }
  };

  const fetchAdminNgos = async (status = 'ALL') => {
    try {
      const cleanStatus = status && status !== 'ALL' && status !== 'null' ? status : '';
      const query = cleanStatus ? `?status=${encodeURIComponent(cleanStatus)}` : '';
      const res = await fetch(`/api/admin/ngos${query}`, { headers: authHeaders() });
      const data = await res.json();
      return data.success ? data : { ngos: [], total: 0, counts: {} };
    } catch (err) {
      return { ngos: [], total: 0, counts: {} };
    }
  };

  const fetchAdminNgoById = async (id) => {
    try {
      const res = await fetch(`/api/admin/ngos/${id}`, { headers: authHeaders() });
      const data = await res.json();
      return data.success ? data.ngo : null;
    } catch (err) {
      return null;
    }
  };

  const updateAdminNgoStatus = async (id, status, note = '') => {
    try {
      let targetStatus = String(status || '').toUpperCase().trim();
      if (targetStatus === 'APPROVE') targetStatus = 'APPROVED';
      if (targetStatus === 'REJECT') targetStatus = 'REJECTED';

      const res = await fetch(`/api/admin/ngos/${id}/status`, {
        method: 'PATCH',
        headers: authHeaders(),
        body: JSON.stringify({ status: targetStatus, note })
      });
      const data = await res.json();
      if (data.success) {
        addToast(`NGO status updated to ${targetStatus}.`, 'success');
      }
      return data;
    } catch (err) {
      return { success: false, message: 'Status update failed.', error: 'Status update failed.' };
    }
  };

  // Reset to default mock data
  const resetToMockData = () => {
    setPrograms(INITIAL_PROGRAMS);
    setVolunteers(INITIAL_VOLUNTEERS);
    setBeneficiaries(INITIAL_BENEFICIARIES);
    setDonations(INITIAL_DONATIONS);
    setLocations(INITIAL_LOCATIONS);
    setMessages(INITIAL_MESSAGES);
    setNgoProfile(NGO_PROFILE);
    localStorage.clear();
    sessionStorage.clear();
    setToken(null);
    setCurrentUser(null);
    setUserRole('guest');
    addToast('System restored to default mock datasets.', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        token,
        currentUser,
        isAuthenticated: Boolean(currentUser && token),
        isAuthLoading,
        loginUser,
        loginWithGoogle,
        registerUser,
        logoutUser,
        userRole,
        programs,
        addProgram,
        updateProgram,
        deleteProgram,
        volunteers,
        addVolunteer,
        updateVolunteer,
        deleteVolunteer,
        toggleVolunteerStatus,
        beneficiaries,
        addBeneficiary,
        updateBeneficiary,
        deleteBeneficiary,
        donations,
        addDonation,
        locations,
        addLocation,
        updateLocation,
        messages,
        sendMessage,
        replyMessage,
        toggleStarMessage,
        markMessageRead,
        deleteMessage,
        ngoProfile,
        setNgoProfile,
        supportRequests,
        addSupportRequest,
        updateSupportRequestStatus,
        volunteerTasks,
        toggleVolunteerTask,
        addVolunteerTask,
        logVolunteerHours,
        // Live Request Management API methods
        submitFindHelp,
        fetchMyFindHelpRequests,
        submitFundRaise,
        fetchMyFundRaiseRequests,
        fetchApprovedFundraisers,
        submitVolunteerApplication,
        fetchMyVolunteerApplications,
        submitVolunteerHours,
        fetchAdminStats,
        fetchAdminDashboard,
        fetchAdminFindHelp,
        updateAdminFindHelpStatus,
        fetchAdminFundRaise,
        updateAdminFundRaiseStatus,
        fetchAdminVolunteers,
        updateAdminVolunteerStatus,
        fetchAdminUsers,
        updateAdminUserRole,
        fetchAdminDonations,
        createAdminDonation,
        fetchAdminMessages,
        updateAdminMessageStatus,
        deleteAdminMessage,
        fetchAdminVerifiedHubs,
        createAdminVerifiedHub,
        updateAdminVerifiedHub,
        deleteAdminVerifiedHub,
        fetchPrograms,
        // NGO Registration & Directory Methods
        submitNgoRegistration,
        fetchPublicNgos,
        fetchPublicNgoById,
        fetchMyNgos,
        updateMyNgo,
        resubmitNgo,
        fetchAdminNgos,
        fetchAdminNgoById,
        updateAdminNgoStatus,
        toasts,
        addToast,
        removeToast,
        resetToMockData
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
