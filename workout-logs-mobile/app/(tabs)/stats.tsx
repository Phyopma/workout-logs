import { View, StyleSheet, ScrollView } from "react-native";
import { Text, Card, SegmentedButtons } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Stats() {
  return (
    <SafeAreaView style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        Progress Stats
      </Text>

      <SegmentedButtons
        value="volume"
        onValueChange={() => {}}
        buttons={[
          { value: "volume", label: "Volume" },
          { value: "pr", label: "PRs" },
          { value: "frequency", label: "Frequency" },
        ]}
        style={styles.segmentedButton}
      />

      <ScrollView>
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium">Weekly Volume Trend</Text>
            <View style={styles.chartPlaceholder}>
              <Text>Chart will be implemented here</Text>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium">Top Exercises</Text>
            <View style={styles.listPlaceholder}>
              <Text>1. Bench Press - 12,450 lbs total</Text>
              <Text>2. Deadlift - 10,890 lbs total</Text>
              <Text>3. Squat - 9,870 lbs total</Text>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium">Category Distribution</Text>
            <View style={styles.chartPlaceholder}>
              <Text>Distribution chart will be implemented here</Text>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
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
  segmentedButton: {
    marginBottom: 16,
  },
  card: {
    marginBottom: 16,
  },
  chartPlaceholder: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e5e7eb",
    borderRadius: 8,
    marginTop: 12,
  },
  listPlaceholder: {
    marginTop: 12,
    gap: 8,
  },
});