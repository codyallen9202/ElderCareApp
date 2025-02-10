// This is the default entry point for the entire tab bar
// Equivalent to App.tsx from older versions of React Native
// Should only be used as a container to call navigation

import { Tabs } from 'expo-router';
import React from 'react';

import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: true,
      }}>
      <Tabs.Screen
        name="HomePage"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="Medications"
        options={{
          title: 'Meds',
          tabBarIcon: ({ color }) => <FontAwesome5 size={28} name="pills" color={color} />,
        }}
      />
      <Tabs.Screen
        name="Vitals"
        options={{
          title: 'Vitals',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="heartbeat" color={color} />,
        }}
      />
      <Tabs.Screen
        name="CheckMedications"
        options={{
          title: 'CheckMed',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="heartbeat" color={color} />,
        }}
      />
      <Tabs.Screen
        name="Schedule"
        options={{
          title: 'Schedule',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="calendar" color={color} />,
        }}
      />
      <Tabs.Screen
        name="CaregiversList"
        options={{
          title: 'Caregivers',
          tabBarIcon: ({ color }) => <FontAwesome5 size={28} name="user-friends" color={color} />,
        }}
      />

    </Tabs>
  );
}
