import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import {
  Appbar,
  Card,
  Title,
  Paragraph,
  Chip,
  FAB,
  IconButton,
  Searchbar,
  Menu,
  Button,
} from 'react-native-paper';
import { useTask } from '../context/TaskContext';
import { theme } from '../theme/theme';

export default function TaskDashboard({ navigation }) {
  const { tasks, deleteTask, completeTask } = useTask();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState('All');
  const [menuVisible, setMenuVisible] = useState(false);

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterPriority === 'All' || task.priority === filterPriority;
    return matchesSearch && matchesFilter;
  });

  const handleDeleteTask = (taskId) => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteTask(taskId) },
      ]
    );
  };

  const handleCompleteTask = (taskId) => {
    Alert.alert(
      'Complete Task',
      'Mark this task as completed?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Complete', onPress: () => completeTask(taskId) },
      ]
    );
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return '#f44336';
      case 'Medium': return '#ff9800';
      case 'Low': return '#4caf50';
      default: return '#757575';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Study Planner" subtitle={`${tasks.length} tasks`} />
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <Appbar.Action
              icon="filter"
              onPress={() => setMenuVisible(true)}
            />
          }
        >
          <Menu.Item onPress={() => { setFilterPriority('All'); setMenuVisible(false); }} title="All" />
          <Menu.Item onPress={() => { setFilterPriority('High'); setMenuVisible(false); }} title="High Priority" />
          <Menu.Item onPress={() => { setFilterPriority('Medium'); setMenuVisible(false); }} title="Medium Priority" />
          <Menu.Item onPress={() => { setFilterPriority('Low'); setMenuVisible(false); }} title="Low Priority" />
        </Menu>
      </Appbar.Header>

      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search tasks..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
        />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {filteredTasks.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Title>No tasks found</Title>
            <Paragraph>Create your first task to get started!</Paragraph>
            <Button 
              mode="contained" 
              onPress={() => navigation.navigate('AddTask')}
              style={styles.emptyButton}
            >
              Add Task
            </Button>
          </View>
        ) : (
          filteredTasks.map((task) => (
            <Card key={task.id} style={styles.taskCard}>
              <Card.Content>
                <View style={styles.taskHeader}>
                  <Title style={styles.taskTitle}>{task.title}</Title>
                  <Chip
                    style={[styles.priorityChip, { backgroundColor: getPriorityColor(task.priority) }]}
                    textStyle={{ color: 'white' }}
                  >
                    {task.priority}
                  </Chip>
                </View>
                <Paragraph style={styles.taskDescription}>{task.description}</Paragraph>
                <View style={styles.taskMeta}>
                  <Paragraph style={styles.dueDate}>Due: {formatDate(task.dueDate)}</Paragraph>
                  <Paragraph style={styles.course}>Course: {task.course}</Paragraph>
                </View>
              </Card.Content>
              <Card.Actions style={styles.cardActions}>
                <IconButton
                  icon="pencil"
                  onPress={() => navigation.navigate('TaskDetail', { task })}
                />
                <IconButton
                  icon="check"
                  onPress={() => handleCompleteTask(task.id)}
                />
                <IconButton
                  icon="delete"
                  onPress={() => handleDeleteTask(task.id)}
                />
              </Card.Actions>
            </Card>
          ))
        )}
      </ScrollView>

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('AddTask')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchContainer: {
    padding: 16,
  },
  searchbar: {
    elevation: 4,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyButton: {
    marginTop: 20,
  },
  taskCard: {
    marginBottom: 12,
    elevation: 4,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  taskTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
  },
  priorityChip: {
    marginLeft: 8,
  },
  taskDescription: {
    marginBottom: 12,
    color: '#666',
  },
  taskMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dueDate: {
    color: '#f44336',
    fontWeight: 'bold',
  },
  course: {
    color: '#2196f3',
  },
  cardActions: {
    justifyContent: 'flex-end',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.primary,
  },
});