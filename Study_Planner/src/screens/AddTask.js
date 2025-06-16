import React, { useState } from 'react';
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
} from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTask } from '../context/TaskContext';

export default function AddTask({ navigation }) {
  const { addTask } = useTask();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [course, setCourse] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleSubmit = () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a task title');
      return;
    }

    const newTask = {
      title: title.trim(),
      description: description.trim(),
      course: course.trim(),
      priority,
      dueDate: dueDate.toISOString(),
    };

    addTask(newTask);
    Alert.alert('Success', 'Task created successfully', [
      { text: 'OK', onPress: () => navigation.goBack() }
    ]);
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDueDate(selectedDate);
    }
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Add New Task" />
        <Appbar.Action icon="check" onPress={handleSubmit} />
      </Appbar.Header>

      <ScrollView style={styles.scrollView}>
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Task Details</Title>
            
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

            <Button
              mode="contained"
              onPress={handleSubmit}
              style={styles.submitButton}
            >
              Create Task
            </Button>
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
  submitButton: {
    marginTop: 24,
  },
});