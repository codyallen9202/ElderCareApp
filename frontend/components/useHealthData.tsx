import { useEffect, useState } from 'react';
import AppleHealthKit, { HealthKitPermissions } from 'react-native-health';
import { Platform } from 'react-native';

const permissions: HealthKitPermissions = {
    permissions: {
      read: [
        AppleHealthKit.Constants.Permissions.HeartRate,
        AppleHealthKit.Constants.Permissions.StepCount,
        AppleHealthKit.Constants.Permissions.RestingHeartRate,
        AppleHealthKit.Constants.Permissions.RespiratoryRate,
        AppleHealthKit.Constants.Permissions.ActiveEnergyBurned,
        AppleHealthKit.Constants.Permissions.SleepAnalysis,
      ],
      write: [], 
    },
  };

export default function useHealthData() {
  const [vitals, setVitals] = useState({
    heartRate: '--',
    steps: '--',
    restingHeartRate: '--',
    respiratoryRate: '--',
    calories: '--',
    sleepDuration: '--',
  });

  useEffect(() => {
    if (Platform.OS !== 'ios') {
        return;
      }
      /*AppleHealthKit.initHealthKit(permissions, (err, result) => {
        if (err) {
          console.error('❌ HealthKit init error:', err);
          return;
        }
      
        console.log('✅ HealthKit initialized successfully:', result);
      
        AppleHealthKit.getAuthStatus(permissions, (authErr, authResults) => {
          if (authErr) {
            console.error('❌ Auth check error:', authErr);
          } else {
            console.log('🔐 HealthKit Auth Status:', authResults);
          }
        });
      });*/
      
    AppleHealthKit.initHealthKit(permissions, (err) => {
      if (err) {
        console.log('HealthKit init error', err);
        return;
      }

      const today = new Date();
      const options = {
        startDate: new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString(),
      };

      AppleHealthKit.getHeartRateSamples(options, (e, results) => {
        if (!e && results.length > 0) {
          const latest = results[results.length - 1];
          setVitals((v) => ({ ...v, heartRate: `${Math.round(latest.value)}` }));
        }
      });

      AppleHealthKit.getStepCount(options, (e, result) => {
        if (!e && result) {
          setVitals((v) => ({ ...v, steps: `${result.value}` }));
        }
      });

      AppleHealthKit.getRestingHeartRateSamples(options, (e, results) => {
        if (!e && results.length > 0) {
          const latest = results[results.length - 1];
          setVitals((v) => ({ ...v, restingHeartRate: `${Math.round(latest.value)}` }));
        }
      });

      AppleHealthKit.getRespiratoryRateSamples(options, (e, results) => {
        if (!e && results.length > 0) {
          const latest = results[results.length - 1];
          setVitals((v) => ({ ...v, respiratoryRate: `${Math.round(latest.value)}` }));
        }
      });

      AppleHealthKit.getActiveEnergyBurned(options, (e, results) => {
        if (!e && Array.isArray(results) && results.length > 0) {
          const total = results.reduce((sum, item) => {
            const val = typeof item.value === 'string' ? parseFloat(item.value) : item.value;
            return !isNaN(val) ? sum + val : sum;
          }, 0);
      
          setVitals((v) => ({ ...v, calories: `${Math.round(total)}` }));
        }
      });
      
      

      AppleHealthKit.getSleepSamples(options, (e, results) => {
        if (e || !Array.isArray(results)) {
          console.error("❌ Sleep sample error:", e);
          return;
        }
      
        const asleepValues = ["REM", "CORE", "DEEP", "UNSPECIFIED"]; // match your string values
      
        let totalSleepMs = 0;
      
        results.forEach(sample => {
          if (asleepValues.includes(sample.value)) {
            const start = new Date(sample.startDate);
            const end = new Date(sample.endDate);
            if (!isNaN(start) && !isNaN(end)) {
              totalSleepMs += end.getTime() - start.getTime();
            }
          }
        });
      
        const totalMinutes = Math.floor(totalSleepMs / 60000);
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
      
        setVitals((v) => ({ ...v, sleepDuration: `${hours}hr ${minutes}min` }));
      });
      
      
      
      


    });
  }, []);

  return vitals;
}
