import { View, StyleSheet, ScrollView } from "react-native";
import { Text, Card, List, Divider, Chip } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

const mockWorkouts = [
  {
    id: 1,
    date: "2024-02-15",
    exercises: [
      { name: "Bench Press", sets: "3x8", weight: "185 lbs" },
      { name: "Shoulder Press", sets: "3x10", weight: "135 lbs" },
    ],
  },
  {
    id: 2,
    date: "2024-02-13",
    exercises: [
      { name: "Deadlift", sets: "4x5", weight: "275 lbs" },
      { name: "Barbell Row", sets: "3x8", weight: "165 lbs" },
    ],
  },
];

export default function History() {
  return (
    <SafeAreaView style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        Workout History
      </Text>

      <ScrollView>
        {mockWorkouts.map((workout) => (
          <Card key={workout.id} style={styles.workoutCard}>
            <Card.Content>
              <Text variant="titleMedium">{workout.date}</Text>
              <List.Accordion
                title={`${workout.exercises.length} exercises`}
                left={(props) => <List.Icon {...props} icon="dumbbell" />}>
                {workout.exercises.map((exercise, index) => (
                  <View key={index}>
                    <List.Item
                      title={exercise.name}
                      description={`${exercise.sets} @ ${exercise.weight}`}
                    />
                    {index < workout.exercises.length - 1 && <Divider />}
                  </View>
                ))}
              </List.Accordion>
            </Card.Content>
          </Card>
        ))}
      </ScrollView>

      <View style={styles.filterContainer}>
        <Chip
          selected
          onPress={() => {}}
          style={styles.filterChip}>
          Week
        </Chip>
        <Chip
          onPress={() => {}}
          style={styles.filterChip}>
          Month
        </Chip>
        <Chip
          onPress={() => {}}
          style={styles.filterChip}>
          All
        </Chip>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  title: {
    marginBottom: 24,
    textAlign: "center",
  },
  workoutCard: {
    marginBottom: 16,
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 8,
  },
  filterChip: {
    marginHorizontal: 4,
  },
});