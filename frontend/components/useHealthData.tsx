import { useEffect, useState } from 'react';
import AppleHealthKit, { HealthKitPermissions } from 'react-native-health';
import { Platform } from 'react-native';

const permissions: HealthKitPermissions = {
    permissions: {
      read: [
        AppleHealthKit.Constants.Permissions.HeartRate,
        AppleHealthKit.Constants.Permissions.StepCount,
        AppleHealthKit.Constants.Permissions.OxygenSaturation,
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
    bloodOxygen: '--',
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

      AppleHealthKit.getOxygenSaturationSamples(options, (e, results) => {
        if (!e && results.length > 0) {
          const latest = results[results.length - 1];
          setVitals((v) => ({ ...v, bloodOxygen: `${latest.value.toFixed(0)}%` }));
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
        if (!e && results.length > 0) {
          const latest = results[results.length - 1];
          const durationMs = new Date(latest.endDate).getTime() - new Date(latest.startDate).getTime();
          const hours = Math.floor(durationMs / 3600000);
          const minutes = Math.floor((durationMs % 3600000) / 60000);
          setVitals((v) => ({ ...v, sleepDuration: `${hours}hr ${minutes}min` }));
        }
      });
    });
  }, []);

  return vitals;
}
