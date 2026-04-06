import { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuthState } from '../hooks/useAuthState';
import { CheckCircle, XCircle } from 'lucide-react';

interface Appointment {
  id: string;
  service: string;
  date: string;
  time: string;
  status: string;
  patientName: string;
  phone: string;
}

export default function Admin() {
  const { role } = useAuthState();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'appointments'));
        const apps = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Appointment[];
        
        apps.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setAppointments(apps);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      } finally {
        setLoading(false);
      }
    };

    if (role === 'admin') {
      fetchAppointments();
    }
  }, [role]);

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, 'appointments', id), {
        status: newStatus
      });
      setAppointments(apps => apps.map(app => app.id === id ? { ...app, status: newStatus } : app));
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status.");
    }
  };

  if (role !== 'admin') {
    return <div className="min-h-screen flex items-center justify-center"><p className="text-xl text-gray-600">Access Denied. Admins only.</p></div>;
  }

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-gray-600 mt-2">Manage clinic appointments</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="p-4 font-semibold text-gray-900">Patient</th>
                  <th className="p-4 font-semibold text-gray-900">Service</th>
                  <th className="p-4 font-semibold text-gray-900">Date & Time</th>
                  <th className="p-4 font-semibold text-gray-900">Phone</th>
                  <th className="p-4 font-semibold text-gray-900">Status</th>
                  <th className="p-4 font-semibold text-gray-900 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {appointments.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50">
                    <td className="p-4 text-gray-900 font-medium">{app.patientName}</td>
                    <td className="p-4 text-gray-600">{app.service}</td>
                    <td className="p-4 text-gray-600">{app.date} at {app.time}</td>
                    <td className="p-4 text-gray-600">{app.phone}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize
                        ${app.status === 'approved' ? 'bg-green-100 text-green-800' : 
                          app.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                          app.status === 'cancelled' ? 'bg-gray-100 text-gray-800' : 
                          'bg-red-100 text-red-800'}`}
                      >
                        {app.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {app.status === 'pending' && (
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => handleStatusUpdate(app.id, 'approved')}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Approve"
                          >
                            <CheckCircle className="h-5 w-5" />
                          </button>
                          <button 
                            onClick={() => handleStatusUpdate(app.id, 'rejected')}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Reject"
                          >
                            <XCircle className="h-5 w-5" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {appointments.length === 0 && (
              <div className="p-8 text-center text-gray-500">No appointments found.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
