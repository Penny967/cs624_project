import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Import screens
import TaskDashboard from './src/screens/TaskDashboard';
import TeamCollaboration from './src/screens/TeamCollaboration';
import ProgressAnalytics from './src/screens/ProgressAnalytics';
import TaskDetail from './src/screens/TaskDetail';
import AddTask from './src/screens/AddTask';

// Import context
import { TaskProvider } from './src/context/TaskContext';
import { theme } from './src/theme/theme';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Stack Navigator for Task-related screens
function TaskStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="TaskDashboard" 
        component={TaskDashboard} 
        options={{ title: 'My Tasks' }}
      />
      <Stack.Screen 
        name="TaskDetail" 
        component={TaskDetail} 
        options={{ title: 'Task Details' }}
      />
      <Stack.Screen 
        name="AddTask" 
        component={AddTask} 
        options={{ title: 'Add New Task' }}
      />
    </Stack.Navigator>
  );
}

// Main Tab Navigator
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          
          if (route.name === 'Tasks') {
            iconName = focused ? 'clipboard-check' : 'clipboard-check-outline';
          } else if (route.name === 'Team') {
            iconName = focused ? 'account-group' : 'account-group-outline';
          } else if (route.name === 'Analytics') {
            iconName = focused ? 'chart-line' : 'chart-line-variant';
          }
          
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Tasks" component={TaskStack} />
      <Tab.Screen name="Team" component={TeamCollaboration} />
      <Tab.Screen name="Analytics" component={ProgressAnalytics} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <TaskProvider>
        <NavigationContainer>
          <StatusBar style="auto" />
          <MainTabs />
        </NavigationContainer>
      </TaskProvider>
    </PaperProvider>
  );
}