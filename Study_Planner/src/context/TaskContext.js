import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TaskContext = createContext();

const initialState = {
  tasks: [],
  teamTasks: [],
  completedTasks: [],
  loading: false,
  error: null,
};

function taskReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'LOAD_TASKS':
      return { ...state, tasks: action.payload, loading: false };
    case 'ADD_TASK':
      return { ...state, tasks: [...state.tasks, action.payload] };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id ? action.payload : task
        ),
      };
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload),
      };
    case 'COMPLETE_TASK':
      const completedTask = state.tasks.find(task => task.id === action.payload);
      if (completedTask) {
        return {
          ...state,
          tasks: state.tasks.filter(task => task.id !== action.payload),
          completedTasks: [...state.completedTasks, { ...completedTask, completedAt: new Date().toISOString() }],
        };
      }
      return state;
    case 'LOAD_TEAM_TASKS':
      return { ...state, teamTasks: action.payload };
    case 'ADD_TEAM_TASK':
      return { ...state, teamTasks: [...state.teamTasks, action.payload] };
    default:
      return state;
  }
}

export function TaskProvider({ children }) {
  const [state, dispatch] = useReducer(taskReducer, initialState);

  // Load tasks from AsyncStorage on app start
  useEffect(() => {
    loadTasksFromStorage();
  }, []);

  // Save tasks to AsyncStorage whenever tasks change
  useEffect(() => {
    saveTasksToStorage();
  }, [state.tasks, state.completedTasks]);

  const loadTasksFromStorage = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const storedTasks = await AsyncStorage.getItem('tasks');
      const storedCompletedTasks = await AsyncStorage.getItem('completedTasks');
      
      if (storedTasks) {
        dispatch({ type: 'LOAD_TASKS', payload: JSON.parse(storedTasks) });
      }
      if (storedCompletedTasks) {
        dispatch({ type: 'SET_LOADING', payload: false });
        // You can handle completed tasks here
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load tasks' });
    }
  };

  const saveTasksToStorage = async () => {
    try {
      await AsyncStorage.setItem('tasks', JSON.stringify(state.tasks));
      await AsyncStorage.setItem('completedTasks', JSON.stringify(state.completedTasks));
    } catch (error) {
      console.error('Failed to save tasks:', error);
    }
  };

  const addTask = (task) => {
    const newTask = {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      completed: false,
    };
    dispatch({ type: 'ADD_TASK', payload: newTask });
  };

  const updateTask = (task) => {
    dispatch({ type: 'UPDATE_TASK', payload: task });
  };

  const deleteTask = (taskId) => {
    dispatch({ type: 'DELETE_TASK', payload: taskId });
  };

  const completeTask = (taskId) => {
    dispatch({ type: 'COMPLETE_TASK', payload: taskId });
  };

  // API functions for team collaboration
  const fetchTeamTasks = async () => {
    try {
      // Replace with your JSON Server URL
      const response = await fetch('http://localhost:3000/teamTasks');
      const teamTasks = await response.json();
      dispatch({ type: 'LOAD_TEAM_TASKS', payload: teamTasks });
    } catch (error) {
      console.error('Failed to fetch team tasks:', error);
    }
  };

  const addTeamTask = async (task) => {
    try {
      const response = await fetch('http://localhost:3000/teamTasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...task,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
        }),
      });
      const newTeamTask = await response.json();
      dispatch({ type: 'ADD_TEAM_TASK', payload: newTeamTask });
    } catch (error) {
      console.error('Failed to add team task:', error);
    }
  };

  const value = {
    ...state,
    addTask,
    updateTask,
    deleteTask,
    completeTask,
    fetchTeamTasks,
    addTeamTask,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

export function useTask() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
}