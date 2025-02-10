import { View, StyleSheet, ScrollView } from "react-native";
import { Text, Card, List, Switch, Button } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../context/AuthContext";
import { router } from "expo-router";

export default function Profile() {
  const { user, logout } = useAuth();

  const handleSignOut = async () => {
    try {
      await logout();
      router.replace('/auth/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        Profile
      </Text>

      <ScrollView>
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.profileHeader}>
              <Text variant="headlineSmall">{user?.username || 'User'}</Text>
              <Text variant="bodyMedium">{user?.email || 'No email'}</Text>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Workout Stats
            </Text>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text variant="titleLarge">24</Text>
                <Text variant="bodyMedium">Workouts</Text>
              </View>
              <View style={styles.statItem}>
                <Text variant="titleLarge">12</Text>
                <Text variant="bodyMedium">PRs</Text>
              </View>
              <View style={styles.statItem}>
                <Text variant="titleLarge">6</Text>
                <Text variant="bodyMedium">Streak</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <List.Section>
              <List.Subheader>Settings</List.Subheader>
              <List.Item
                title="Dark Mode"
                right={() => <Switch value={false} onValueChange={() => {}} />}
              />
              <List.Item
                title="Units"
                description="lbs"
                right={(props) => <List.Icon {...props} icon="chevron-right" />}
                onPress={() => {}}
              />
              <List.Item
                title="Notifications"
                right={(props) => <List.Icon {...props} icon="chevron-right" />}
                onPress={() => {}}
              />
            </List.Section>
          </Card.Content>
        </Card>

        <Button
          mode="outlined"
          onPress={handleSignOut}
          style={styles.button}
          textColor="#ef4444">
          Sign Out
        </Button>
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
  card: {
    marginBottom: 16,
  },
  profileHeader: {
    alignItems: "center",
    gap: 4,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 8,
  },
  statItem: {
    alignItems: "center",
  },
  button: {
    marginVertical: 16,
  },
});