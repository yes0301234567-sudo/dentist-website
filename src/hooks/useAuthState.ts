import { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

export function useAuthState() {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<'patient' | 'admin' | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Check if user exists in Firestore
        const userRef = doc(db, 'users', currentUser.uid);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
          setRole(userSnap.data().role);
        } else {
          // Create new user document
          const isDefaultAdmin = currentUser.email === 'ayazgujjar123345@gmail.com';
          const newRole = isDefaultAdmin ? 'admin' : 'patient';
          
          await setDoc(userRef, {
            uid: currentUser.uid,
            name: currentUser.displayName || 'Unknown User',
            email: currentUser.email,
            role: newRole,
            createdAt: new Date().toISOString()
          });
          setRole(newRole);
        }
      } else {
        setRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { user, role, loading };
}
