import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

export type UserRole = 'patient' | 'hospital' | 'admin';

export interface Department {
  id: string;
  name: string;
  queueSize: number;
  avgWaitTime: number; // in minutes
  doctors: string[];
}

export interface Hospital {
  id: string;
  name: string;
  location: string;
  image: string;
  distance: string;
  rating: number;
  services: string[];
  departments: Department[];
  isVerified: boolean;
  bedsAvailable: number;
}

export interface QueueEntry {
  id: string;
  hospitalId: string;
  departmentId: string;
  patientName: string;
  patientPhone: string;
  status: 'waiting' | 'called' | 'served' | 'cancelled';
  number: number;
  timestamp: number;
}

export interface Referral {
  id: string;
  fromHospitalId: string;
  toHospitalId: string;
  patientName: string;
  patientPhone: string;
  department: string;
  urgency: 'low' | 'medium' | 'high';
  status: 'pending' | 'accepted' | 'completed' | 'rejected';
  note: string;
  timestamp: number;
}

export interface Appointment {
  id: string;
  hospitalId: string;
  patientName: string;
  department: string;
  date: string;
  time: string;
  status: 'confirmed' | 'cancelled' | 'completed';
}

interface DataContextType {
  hospitals: Hospital[];
  queues: QueueEntry[];
  referrals: Referral[];
  appointments: Appointment[];
  language: 'en' | 'sw';
  setLanguage: (lang: 'en' | 'sw') => void;
  currentUser: { id: string; role: UserRole; hospitalId?: string } | null;
  login: (role: UserRole, hospitalId?: string) => void;
  logout: () => void;
  joinQueue: (hospitalId: string, deptId: string, name: string, phone: string) => void;
  createReferral: (referral: Omit<Referral, 'id' | 'timestamp' | 'status'>) => void;
  updateReferralStatus: (id: string, status: Referral['status']) => void;
  bookAppointment: (appointment: Omit<Appointment, 'id' | 'status'>) => void;
  updateQueueStatus: (id: string, status: QueueEntry['status']) => void;
}

const INITIAL_HOSPITALS: Hospital[] = [
  {
    id: 'h1',
    name: 'Nairobi National Hospital',
    location: 'Upper Hill, Nairobi',
    image: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/b9bbb050-2e00-4329-8696-dfe118cde763/nairobi-hospital-c447bcad-1779049456623.webp',
    distance: '2.5 km',
    rating: 4.8,
    isVerified: true,
    bedsAvailable: 45,
    services: ['Emergency', 'Surgery', 'Maternity', 'Pediatrics', 'Diagnostics'],
    departments: [
      { id: 'd1', name: 'General OPD', queueSize: 12, avgWaitTime: 45, doctors: ['Dr. Kamau', 'Dr. Otieno'] },
      { id: 'd2', name: 'Pediatrics', queueSize: 5, avgWaitTime: 20, doctors: ['Dr. Sarah'] },
      { id: 'd3', name: 'Maternity', queueSize: 3, avgWaitTime: 15, doctors: ['Dr. Amina'] },
    ]
  },
  {
    id: 'h2',
    name: 'St. Mary’s Specialist Clinic',
    location: 'Westlands, Nairobi',
    image: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/b9bbb050-2e00-4329-8696-dfe118cde763/clinic-interior-4c24e16a-1779049456235.webp',
    distance: '4.1 km',
    rating: 4.5,
    isVerified: true,
    bedsAvailable: 12,
    services: ['Dental', 'Eye Care', 'Cardiology'],
    departments: [
      { id: 'd4', name: 'Dental Care', queueSize: 2, avgWaitTime: 10, doctors: ['Dr. Mutua'] },
      { id: 'd5', name: 'Eye Clinic', queueSize: 8, avgWaitTime: 60, doctors: ['Dr. Wangari'] },
    ]
  },
  {
    id: 'h3',
    name: 'Aga Khan University Hospital',
    location: 'Parklands, Nairobi',
    image: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/b9bbb050-2e00-4329-8696-dfe118cde763/doctor-portrait-5eab74a1-1779049456973.webp',
    distance: '5.8 km',
    rating: 4.9,
    isVerified: true,
    bedsAvailable: 120,
    services: ['Emergency', 'Specialist Care', 'Oncology', 'ICU'],
    departments: [
      { id: 'd6', name: 'Emergency Care', queueSize: 1, avgWaitTime: 5, doctors: ['Dr. Patel'] },
      { id: 'd7', name: 'Specialist Clinic', queueSize: 15, avgWaitTime: 90, doctors: ['Dr. Kipchoge'] },
    ]
  }
];

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hospitals, setHospitals] = useState<Hospital[]>(() => {
    const saved = localStorage.getItem('afya_hospitals');
    return saved ? JSON.parse(saved) : INITIAL_HOSPITALS;
  });

  const [queues, setQueues] = useState<QueueEntry[]>(() => {
    const saved = localStorage.getItem('afya_queues');
    return saved ? JSON.parse(saved) : [];
  });

  const [referrals, setReferrals] = useState<Referral[]>(() => {
    const saved = localStorage.getItem('afya_referrals');
    return saved ? JSON.parse(saved) : [];
  });

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem('afya_appointments');
    return saved ? JSON.parse(saved) : [];
  });

  const [language, setLanguage] = useState<'en' | 'sw'>(() => {
    return (localStorage.getItem('afya_lang') as 'en' | 'sw') || 'en';
  });

  const [currentUser, setCurrentUser] = useState<{ id: string; role: UserRole; hospitalId?: string } | null>(() => {
    const saved = localStorage.getItem('afya_user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    localStorage.setItem('afya_hospitals', JSON.stringify(hospitals));
    localStorage.setItem('afya_queues', JSON.stringify(queues));
    localStorage.setItem('afya_referrals', JSON.stringify(referrals));
    localStorage.setItem('afya_appointments', JSON.stringify(appointments));
    localStorage.setItem('afya_lang', language);
    localStorage.setItem('afya_user', JSON.stringify(currentUser));
  }, [hospitals, queues, referrals, appointments, language, currentUser]);

  const login = (role: UserRole, hospitalId?: string) => {
    const user = { id: Math.random().toString(36).substr(2, 9), role, hospitalId };
    setCurrentUser(user);
    toast.success(`Logged in as ${role === 'hospital' ? 'Hospital Staff' : role === 'admin' ? 'Admin' : 'Patient'}`);
  };

  const logout = () => {
    setCurrentUser(null);
    toast.info('Logged out successfully');
  };

  const joinQueue = (hospitalId: string, deptId: string, name: string, phone: string) => {
    const newEntry: QueueEntry = {
      id: Math.random().toString(36).substr(2, 9),
      hospitalId,
      departmentId: deptId,
      patientName: name,
      patientPhone: phone,
      status: 'waiting',
      number: queues.filter(q => q.hospitalId === hospitalId && q.departmentId === deptId).length + 1,
      timestamp: Date.now(),
    };
    setQueues([...queues, newEntry]);
    
    // Increment hospital dept queue size locally
    setHospitals(prev => prev.map(h => {
      if (h.id === hospitalId) {
        return {
          ...h,
          departments: h.departments.map(d => 
            d.id === deptId ? { ...d, queueSize: d.queueSize + 1 } : d
          )
        };
      }
      return h;
    }));

    toast.success(`Joined queue! Your number is ${newEntry.number}`);
  };

  const createReferral = (ref: Omit<Referral, 'id' | 'timestamp' | 'status'>) => {
    const newRef: Referral = {
      ...ref,
      id: 'REF-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
      status: 'pending',
      timestamp: Date.now(),
    };
    setReferrals([...referrals, newRef]);
    toast.success('Referral sent successfully');
  };

  const updateReferralStatus = (id: string, status: Referral['status']) => {
    setReferrals(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    toast.info(`Referral status updated to ${status}`);
  };

  const bookAppointment = (app: Omit<Appointment, 'id' | 'status'>) => {
    const newApp: Appointment = {
      ...app,
      id: Math.random().toString(36).substr(2, 9),
      status: 'confirmed',
    };
    setAppointments([...appointments, newApp]);
    toast.success('Appointment booked successfully');
  };

  const updateQueueStatus = (id: string, status: QueueEntry['status']) => {
    setQueues(prev => prev.map(q => {
      if (q.id === id) {
        // If finishing service, update hospital stats
        if (status === 'served' || status === 'cancelled') {
           setHospitals(hospitalsPrev => hospitalsPrev.map(h => {
             if (h.id === q.hospitalId) {
               return {
                 ...h,
                 departments: h.departments.map(d => 
                   d.id === q.departmentId ? { ...d, queueSize: Math.max(0, d.queueSize - 1) } : d
                 )
               };
             }
             return h;
           }));
        }
        return { ...q, status };
      }
      return q;
    }));
  };

  return (
    <DataContext.Provider value={{
      hospitals, queues, referrals, appointments, language, setLanguage,
      currentUser, login, logout, joinQueue, createReferral, updateReferralStatus,
      bookAppointment, updateQueueStatus
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within DataProvider');
  return context;
};