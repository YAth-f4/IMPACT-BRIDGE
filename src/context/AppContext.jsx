import React, { createContext, useContext, useState, useEffect } from 'react';
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
  // Role Session: 'guest' | 'admin' | 'volunteer' | 'donor'
  const [userRole, setUserRole] = useState(() => {
    return localStorage.getItem('ib_user_role') || 'guest';
  });

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

  // UI Toast State
  const [toasts, setToasts] = useState([]);

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

  // Toast Helper
  const addToast = (message, type = 'success') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Role Switcher
  const switchRole = (newRole) => {
    setUserRole(newRole);
    addToast(`Active session role: ${newRole.toUpperCase()}`, 'info');
  };

  // PROGRAM CRUD
  const addProgram = (programData) => {
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
      tags: Array.isArray(programData.tags) ? programData.tags : (programData.tags || '').split(',').map(s => s.trim()).filter(Boolean),
      image: programData.image || 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80'
    };
    setPrograms([newProg, ...programs]);
    addToast(`Program "${newProg.title}" created successfully!`, 'success');
    return newProg;
  };

  const updateProgram = (id, updatedFields) => {
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

  const deleteProgram = (id) => {
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

  // DONATIONS
  const addDonation = (donationData) => {
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

  // MESSAGES
  const sendMessage = (msgData) => {
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
    addToast('System restored to default mock datasets.', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        userRole,
        switchRole,
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
