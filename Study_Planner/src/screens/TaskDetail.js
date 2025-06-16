import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import {
  Appbar,
  TextInput,
  Button,
  Card,
  Title,
  RadioButton,
  Text,
  Chip,
} from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTask } from '../context/TaskContext';

export default function TaskDetail({ route, navigation }) {
  const { task } = route.params;
  const { updateTask } = useTask();
  
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [course, setCourse] = useState(task.course);
  const [priority, setPriority] = useState(task.priority);
  const [dueDate, setDueDate] = useState(new Date(task.dueDate));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a task title');
      return;
    }

    const updatedTask = {
      ...task,
      title: title.trim(),
      description: description.trim(),
      course: course.trim(),
      priority,
      dueDate: dueDate.toISOString(),
    };

    updateTask(updatedTask);
    setIsEditing(false);
    Alert.alert('Success', 'Task updated successfully');
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDueDate(selectedDate);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return '#f44336';
      case 'Medium': return '#ff9800';
      case 'Low': return '#4caf50';
      default: return '#757575';
    }
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Task Details" />
        {isEditing ? (
          <Appbar.Action icon="check" onPress={handleSave} />
        ) : (
          <Appbar.Action icon="pencil" onPress={() => setIsEditing(true)} />
        )}
      </Appbar.Header>

      <ScrollView style={styles.scrollView}>
        <Card style={styles.card}>
          <Card.Content>
            {!isEditing && (
              <View style={styles.header}>
                <Title style={styles.title}>{task.title}</Title>
                <Chip
                  style={[styles.priorityChip, { backgroundColor: getPriorityColor(task.priority) }]}
                  textStyle={{ color: 'white' }}
                >
                  {task.priority}
                </Chip>
              </View>
            )}

            {isEditing ? (
              <>
                <TextInput
                  label="Task Title"
                  value={title}
                  onChangeText={setTitle}
                  style={styles.input}
                  mode="outlined"
                />

                <TextInput
                  label="Description"
                  value={description}
                  onChangeText={setDescription}
                  style={styles.input}
                  mode="outlined"
                  multiline
                  numberOfLines={3}
                />

                <TextInput
                  label="Course"
                  value={course}
                  onChangeText={setCourse}
                  style={styles.input}
                  mode="outlined"
                />

                <Title style={styles.sectionTitle}>Priority</Title>
                <RadioButton.Group onValueChange={setPriority} value={priority}>
                  <View style={styles.radioContainer}>
                    <RadioButton value="High" />
                    <Text style={styles.radioLabel}>High</Text>
                  </View>
                  <View style={styles.radioContainer}>
                    <RadioButton value="Medium" />
                    <Text style={styles.radioLabel}>Medium</Text>
                  </View>
                  <View style={styles.radioContainer}>
                    <RadioButton value="Low" />
                    <Text style={styles.radioLabel}>Low</Text>
                  </View>
                </RadioButton.Group>

                <Title style={styles.sectionTitle}>Due Date</Title>
                <Button
                  mode="outlined"
                  onPress={() => setShowDatePicker(true)}
                  style={styles.dateButton}
                >
                  {dueDate.toDateString()}
                </Button>

                {showDatePicker && (
                  <DateTimePicker
                    value={dueDate}
                    mode="date"
                    display="default"
                    onChange={onDateChange}
                    minimumDate={new Date()}
                  />
                )}

                <View style={styles.buttonContainer}>
                  <Button
                    mode="outlined"
                    onPress={() => setIsEditing(false)}
                    style={styles.cancelButton}
                  >
                    Cancel
                  </Button>
                  <Button
                    mode="contained"
                    onPress={handleSave}
                    style={styles.saveButton}
                  >
                    Save Changes
                  </Button>
                </View>
              </>
            ) : (
              <>
                <Text style={styles.description}>{task.description}</Text>
                
                <View style={styles.infoContainer}>
                  <Text style={styles.infoLabel}>Course:</Text>
                  <Text style={styles.infoValue}>{task.course}</Text>
                </View>

                <View style={styles.infoContainer}>
                  <Text style={styles.infoLabel}>Due Date:</Text>
                  <Text style={styles.infoValue}>{new Date(task.dueDate).toDateString()}</Text>
                </View>

                <View style={styles.infoContainer}>
                  <Text style={styles.infoLabel}>Created:</Text>
                  <Text style={styles.infoValue}>{new Date(task.createdAt).toDateString()}</Text>
                </View>

                <Button
                  mode="contained"
                  onPress={() => setIsEditing(true)}
                  style={styles.editButton}
                >
                  Edit Task
                </Button>
              </>
            )}
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  card: {
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    flex: 1,
    fontSize: 24,
    fontWeight: 'bold',
  },
  priorityChip: {
    marginLeft: 8,
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    lineHeight: 24,
  },
  infoContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  infoLabel: {
    fontWeight: 'bold',
    width: 80,
    color: '#666',
  },
  infoValue: {
    flex: 1,
    color: '#333',
  },
  editButton: {
    marginTop: 20,
  },
  sectionTitle: {
    marginTop: 16,
    marginBottom: 8,
    fontSize: 18,
  },
  input: {
    marginBottom: 16,
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  radioLabel: {
    marginLeft: 8,
    fontSize: 16,
  },
  dateButton: {
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    flex: 0.45,
  },
  saveButton: {
    flex: 0.45,
  },
});