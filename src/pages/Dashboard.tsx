import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuthState } from '../hooks/useAuthState';
import { Calendar, Clock, XCircle } from 'lucide-react';

interface Appointment {
  id: string;
  service: string;
  date: string;
  time: string;
  status: string;
  patientName: string;
}

export default function Dashboard() {
  const { user } = useAuthState();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!user) return;
      try {
        const q = query(collection(db, 'appointments'), where('patientId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        const apps = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Appointment[];
        
        // Sort by date descending
        apps.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setAppointments(apps);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [user]);

  const handleCancel = async (id: string) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
    
    try {
      await updateDoc(doc(db, 'appointments', id), {
        status: 'cancelled'
      });
      setAppointments(apps => apps.map(app => app.id === id ? { ...app, status: 'cancelled' } : app));
    } catch (error) {
      console.error("Error cancelling appointment:", error);
      alert("Failed to cancel appointment.");
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-[60vh]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back, {user?.displayName}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900">My Appointments</h2>
          </div>
          
          {appointments.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <Calendar className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <p>You don't have any appointments yet.</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {appointments.map((app) => (
                <li key={app.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{app.service}</h3>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                        <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> {app.date}</span>
                        <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {app.time}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize
                        ${app.status === 'approved' ? 'bg-green-100 text-green-800' : 
                          app.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                          app.status === 'cancelled' ? 'bg-gray-100 text-gray-800' : 
                          'bg-red-100 text-red-800'}`}
                      >
                        {app.status}
                      </span>
                      
                      {app.status === 'pending' && (
                        <button 
                          onClick={() => handleCancel(app.id)}
                          className="text-red-600 hover:text-red-800 flex items-center gap-1 text-sm font-medium transition-colors"
                        >
                          <XCircle className="h-4 w-4" /> Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
