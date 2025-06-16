import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {
  Appbar,
  Card,
  Title,
  Paragraph,
  Button,
  Divider,
} from 'react-native-paper';
import {
  VictoryChart,
  VictoryLine,
  VictoryArea,
  VictoryBar,
  VictoryAxis,
  VictoryTheme,
  VictoryPie,
  VictoryLabel,
} from 'victory-native';
import { useTask } from '../context/TaskContext';

const { width } = Dimensions.get('window');
const chartWidth = width - 32;

export default function ProgressAnalytics() {
  const { tasks, completedTasks } = useTask();
  const [timeFrame, setTimeFrame] = useState('Week');

  // Generate sample data for charts
  const generateWeeklyData = () => {
    const weeklyData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayName = date.toLocaleDateString('en', { weekday: 'short' });
      
      // Simulate completed tasks for each day
      const completed = Math.floor(Math.random() * 5) + 1;
      weeklyData.push({
        day: dayName,
        completed: completed,
        x: dayName,
        y: completed,
      });
    }
    return weeklyData;
  };

  const generatePriorityData = () => {
    const highPriority = tasks.filter(task => task.priority === 'High').length;
    const mediumPriority = tasks.filter(task => task.priority === 'Medium').length;
    const lowPriority = tasks.filter(task => task.priority === 'Low').length;

    return [
      { x: 'High', y: highPriority },
      { x: 'Medium', y: mediumPriority },
      { x: 'Low', y: lowPriority },
    ];
  };

  const generateCompletionData = () => {
    const totalTasks = tasks.length + completedTasks.length;
    const completed = completedTasks.length;
    const pending = tasks.length;

    return [
      { x: 'Completed', y: completed },
      { x: 'Pending', y: pending },
    ];
  };

  const weeklyData = generateWeeklyData();
  const priorityData = generatePriorityData();
  const completionData = generateCompletionData();

  // Calculate statistics
  const totalTasks = tasks.length + completedTasks.length;
  const completionRate = totalTasks > 0 ? (completedTasks.length / totalTasks * 100).toFixed(1) : 0;
  const averageTasksPerDay = weeklyData.reduce((sum, day) => sum + day.completed, 0) / 7;

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Progress Analytics" />
      </Appbar.Header>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Statistics Cards */}
        <View style={styles.statsContainer}>
          <Card style={styles.statCard}>
            <Card.Content style={styles.statContent}>
              <Title style={styles.statValue}>{totalTasks}</Title>
              <Paragraph style={styles.statLabel}>Total Tasks</Paragraph>
            </Card.Content>
          </Card>
          
          <Card style={styles.statCard}>
            <Card.Content style={styles.statContent}>
              <Title style={styles.statValue}>{completionRate}%</Title>
              <Paragraph style={styles.statLabel}>Completion Rate</Paragraph>
            </Card.Content>
          </Card>
          
          <Card style={styles.statCard}>
            <Card.Content style={styles.statContent}>
              <Title style={styles.statValue}>{averageTasksPerDay.toFixed(1)}</Title>
              <Paragraph style={styles.statLabel}>Avg/Day</Paragraph>
            </Card.Content>
          </Card>
        </View>

        {/* Weekly Progress Chart */}
        <Card style={styles.chartCard}>
          <Card.Content>
            <Title style={styles.chartTitle}>Weekly Progress</Title>
            <VictoryChart
              theme={VictoryTheme.material}
              width={chartWidth}
              height={250}
              padding={{ left: 50, top: 40, right: 40, bottom: 60 }}
            >
              <VictoryArea
                data={weeklyData}
                style={{
                  data: { fill: "#c43a31", fillOpacity: 0.6, stroke: "#c43a31", strokeWidth: 2 }
                }}
                animate={{
                  duration: 1000,
                  onLoad: { duration: 500 }
                }}
              />
              <VictoryAxis dependentAxis />
              <VictoryAxis />
            </VictoryChart>
          </Card.Content>
        </Card>

        {/* Task Priority Distribution */}
        <Card style={styles.chartCard}>
          <Card.Content>
            <Title style={styles.chartTitle}>Task Priority Distribution</Title>
            <VictoryPie
              data={priorityData}
              width={chartWidth}
              height={250}
              colorScale={["#f44336", "#ff9800", "#4caf50"]}
              labelComponent={<VictoryLabel style={{ fontSize: 14, fill: "white" }} />}
              animate={{
                duration: 1000,
              }}
            />
          </Card.Content>
        </Card>

        {/* Completion Status */}
        <Card style={styles.chartCard}>
          <Card.Content>
            <Title style={styles.chartTitle}>Task Completion Status</Title>
            <VictoryChart
              theme={VictoryTheme.material}
              width={chartWidth}
              height={250}
              domainPadding={50}
              padding={{ left: 80, top: 40, right: 40, bottom: 60 }}
            >
              <VictoryBar
                data={completionData}
                style={{
                  data: { fill: ({ datum }) => datum.x === 'Completed' ? '#4caf50' : '#ff9800' }
                }}
                animate={{
                  duration: 1000,
                  onLoad: { duration: 500 }
                }}
              />
              <VictoryAxis dependentAxis />
              <VictoryAxis />
            </VictoryChart>
          </Card.Content>
        </Card>

        {/* Time Frame Selector */}
        <Card style={styles.chartCard}>
          <Card.Content>
            <Title style={styles.chartTitle}>View Options</Title>
            <View style={styles.buttonContainer}>
              <Button
                mode={timeFrame === 'Week' ? 'contained' : 'outlined'}
                onPress={() => setTimeFrame('Week')}
                style={styles.timeButton}
              >
                Week
              </Button>
              <Button
                mode={timeFrame === 'Month' ? 'contained' : 'outlined'}
                onPress={() => setTimeFrame('Month')}
                style={styles.timeButton}
              >
                Month
              </Button>
              <Button
                mode={timeFrame === 'Year' ? 'contained' : 'outlined'}
                onPress={() => setTimeFrame('Year')}
                style={styles.timeButton}
              >
                Year
              </Button>
            </View>
          </Card.Content>
        </Card>

        {/* Study Insights */}
        <Card style={styles.chartCard}>
          <Card.Content>
            <Title style={styles.chartTitle}>Study Insights</Title>
            <Divider style={styles.divider} />
            <Paragraph style={styles.insight}>
              📈 You've completed {completedTasks.length} tasks this week!
            </Paragraph>
            <Paragraph style={styles.insight}>
              🎯 Your completion rate is {completionRate}% - {parseFloat(completionRate) > 70 ? 'Great job!' : 'Keep pushing!'}
            </Paragraph>
            <Paragraph style={styles.insight}>
              ⏰ You have {tasks.length} tasks remaining.
            </Paragraph>
            {tasks.filter(task => new Date(task.dueDate) <= new Date(Date.now() + 7*24*60*60*1000)).length > 0 && (
              <Paragraph style={styles.insight}>
                ⚠️ {tasks.filter(task => new Date(task.dueDate) <= new Date(Date.now() + 7*24*60*60*1000)).length} tasks due this week!
              </Paragraph>
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
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    paddingBottom: 8,
  },
  statCard: {
    flex: 1,
    marginHorizontal: 4,
    elevation: 4,
  },
  statContent: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2196f3',
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
    color: '#666',
  },
  chartCard: {
    margin: 16,
    marginTop: 8,
    elevation: 4,
  },
  chartTitle: {
    fontSize: 18,
    marginBottom: 16,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  timeButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  divider: {
    marginVertical: 16,
  },
  insight: {
    fontSize: 16,
    marginBottom: 12,
    lineHeight: 24,
  },
});
