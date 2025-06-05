import { useEffect, useState } from 'react';
import { getFirestoreItemWithRetry } from '@/utils/firestoreUtils';

export const useFirestoreDebug = () => {
  const [debugInfo, setDebugInfo] = useState({
    environment: '',
    timestamp: '',
    attempts: 0,
    errors: [],
    success: false
  });

  useEffect(() => {
    const testFirestoreConnection = async () => {
      const startTime = Date.now();
      setDebugInfo(prev => ({
        ...prev,
        environment: typeof window !== 'undefined' ? 
          (window.location.hostname.includes('vercel') ? 'production' : 'development') : 'server',
        timestamp: new Date().toISOString(),
        attempts: 0,
        errors: [],
        success: false
      }));

      try {
        console.log('Testing Firestore connection...');
        
        // Test simplu de conectivitate
        const testResult = await getFirestoreItemWithRetry('numere', 'ultimulNumar');
        
        setDebugInfo(prev => ({
          ...prev,
          success: true,
          attempts: prev.attempts + 1,
          testResult: testResult ? 'Data found' : 'No data found'
        }));
        
        console.log('Firestore test successful:', testResult);
      } catch (error) {
        setDebugInfo(prev => ({
          ...prev,
          success: false,
          attempts: prev.attempts + 1,
          errors: [...prev.errors, error.message]
        }));
        
        console.error('Firestore test failed:', error);
      }
      
      const endTime = Date.now();
      setDebugInfo(prev => ({
        ...prev,
        duration: endTime - startTime
      }));
    };

    if (typeof window !== 'undefined') {
      testFirestoreConnection();
    }
  }, []);

  return debugInfo;
};

export default useFirestoreDebug; 