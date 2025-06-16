import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
  Share,
} from 'react-native';
import {
  Appbar,
  Card,
  Title,
  Paragraph,
  FAB,
  Button,
  TextInput,
  Dialog,
  Portal,
  List,
  Avatar,
  Chip,
} from 'react-native-paper';
import { useTask } from '../context/TaskContext';

export default function TeamCollaboration() {
  const { teamTasks, fetchTeamTasks, addTeamTask } = useTask();
  const [dialogVisible, setDialogVisible] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [selectedTask, setSelectedTask] = useState(null);
  const [comment, setComment] = useState('');

  useEffect(() => {
    fetchTeamTasks();
  }, []);

  const handleAddTeamTask = async () => {
    if (!newTaskTitle.trim()) {
      Alert.alert('Error', 'Please enter a task title');
      return;
    }

    const newTask = {
      title: newTaskTitle.trim(),
      description: newTaskDescription.trim(),
      assignedTo: 'Current User',
      status: 'In Progress',
      comments: [],
    };

    await addTeamTask(newTask);
    setNewTaskTitle('');
    setNewTaskDescription('');
    setDialogVisible(false);
  };

  const handleShareLink = async () => {
    try {
      const shareUrl = 'https://studyplanner.app/join/team123';
      await Share.share({
        message: `Join our study team! Use this link: ${shareUrl}`,
        url: shareUrl,
        title: 'Join Study Team',
      });
    } catch (error) {
      Alert.alert('Error', 'Could not share the link');
    }
  };

  const addComment = (taskId) => {
    if (!comment.trim()) return;
    
    // In a real app, this would make an API call
    Alert.alert('Comment Added', 'Your comment has been added to the task');
    setComment('');
    setSelectedTask(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return '#4caf50';
      case 'In Progress': return '#ff9800';
      case 'Pending': return '#f44336';
      default: return '#757575';
    }
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Team Collaboration" />
        <Appbar.Action icon="share" onPress={handleShareLink} />
      </Appbar.Header>

      <View style={styles.headerSection}>
        <Button
          mode="contained"
          onPress={handleShareLink}
          style={styles.shareButton}
          icon="account-plus"
        >
          Invite Team Members
        </Button>
      </View>

      <ScrollView style={styles.scrollView}>
        {teamTasks.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Title>No team tasks yet</Title>
            <Paragraph>Create your first team task to get started!</Paragraph>
          </View>
        ) : (
          teamTasks.map((task) => (
            <Card key={task.id} style={styles.taskCard}>
              <Card.Content>
                <View style={styles.taskHeader}>
                  <Title style={styles.taskTitle}>{task.title}</Title>
                  <Chip
                    style={[styles.statusChip, { backgroundColor: getStatusColor(task.status) }]}
                    textStyle={{ color: 'white' }}
                  >
                    {task.status}
                  </Chip>
                </View>
                <Paragraph style={styles.taskDescription}>{task.description}</Paragraph>
                
                <List.Item
                  title="Assigned to"
                  description={task.assignedTo}
                  left={() => <Avatar.Text size={40} label={task.assignedTo.charAt(0)} />}
                />

                <View style={styles.commentsSection}>
                  <Title style={styles.commentsTitle}>Comments ({task.comments?.length || 0})</Title>
                  {task.comments && task.comments.map((comment, index) => (
                    <View key={index} style={styles.comment}>
                      <Paragraph style={styles.commentText}>{comment.text}</Paragraph>
                      <Paragraph style={styles.commentAuthor}>- {comment.author}</Paragraph>
                    </View>
                  ))}
                </View>
              </Card.Content>
              <Card.Actions>
                <Button onPress={() => setSelectedTask(task)}>Add Comment</Button>
              </Card.Actions>
            </Card>
          ))
        )}
      </ScrollView>

      {/* Add Team Task Dialog */}
      <Portal>
        <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
          <Dialog.Title>Create Team Task</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Task Title"
              value={newTaskTitle}
              onChangeText={setNewTaskTitle}
              style={styles.dialogInput}
              mode="outlined"
            />
            <TextInput
              label="Description"
              value={newTaskDescription}
              onChangeText={setNewTaskDescription}
              style={styles.dialogInput}
              mode="outlined"
              multiline
              numberOfLines={3}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDialogVisible(false)}>Cancel</Button>
            <Button onPress={handleAddTeamTask}>Create</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* Add Comment Dialog */}
      <Portal>
        <Dialog visible={!!selectedTask} onDismiss={() => setSelectedTask(null)}>
          <Dialog.Title>Add Comment</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Your comment"
              value={comment}
              onChangeText={setComment}
              style={styles.dialogInput}
              mode="outlined"
              multiline
              numberOfLines={3}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setSelectedTask(null)}>Cancel</Button>
            <Button onPress={() => addComment(selectedTask?.id)}>Add Comment</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => setDialogVisible(true)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerSection: {
    padding: 16,
    backgroundColor: 'white',
    elevation: 2,
  },
  shareButton: {
    marginBottom: 8,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
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
  statusChip: {
    marginLeft: 8,
  },
  taskDescription: {
    marginBottom: 12,
    color: '#666',
  },
  commentsSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  commentsTitle: {
    fontSize: 16,
    marginBottom: 8,
  },
  comment: {
    marginBottom: 8,
    padding: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 4,
  },
  commentText: {
    fontSize: 14,
  },
  commentAuthor: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  dialogInput: {
    marginBottom: 12,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});