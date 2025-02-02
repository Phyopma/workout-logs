import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  VStack,
  Heading,
  Select,
  Spinner,
  Alert,
  AlertIcon,
  Text,
  Grid,
  GridItem,
  Card,
  CardHeader,
  CardBody,
  Container,
  useColorModeValue,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  ResponsiveContainer,
} from "recharts";

function ExerciseStats() {
  const [timeframe, setTimeframe] = useState("month");
  const navigate = useNavigate();

  const bgGradient = useColorModeValue(
    "linear(to-r, blue.400, purple.500)",
    "linear(to-r, blue.600, purple.700)"
  );

  const {
    data: stats,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["exerciseStats", timeframe],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        throw new Error("Authentication required");
      }

      const response = await fetch(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/workouts/stats/exercises?timeframe=${timeframe}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
        throw new Error("Session expired. Please login again.");
      }

      if (!response.ok) {
        throw new Error("Failed to fetch exercise statistics");
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000,
    cacheTime: 30 * 60 * 1000,
    refetchInterval: false,
  });

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minH="60vh">
        <Spinner size="xl" />
      </Box>
    );
  }

  if (error) {
    if (error.message === "Authentication required") {
      return null;
    }
    return (
      <Alert status="error">
        <AlertIcon />
        {error.message}
      </Alert>
    );
  }

  const exercises = Object.entries(stats || {}).map(([name, data]) => ({
    name,
    ...data,
    volumeData: data.volumeOverTime.map((v) => ({
      date: new Date(v.date).toLocaleDateString(),
      volume: v.volume,
    })),
  }));

  const frequencyData = exercises.map((exercise) => ({
    name: exercise.name,
    frequency: exercise.frequency,
    category: exercise.category,
  }));

  return (
    <Box minH="calc(100vh - 12rem)" py={8}>
      <Container maxW="container.xl">
        <VStack spacing={8} align="stretch">
          <Heading
            textAlign="center"
            bgGradient={bgGradient}
            bgClip="text"
            fontSize={{ base: "3xl", md: "4xl" }}>
            Exercise Statistics
          </Heading>

          <Select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            maxW="200px"
            alignSelf="flex-end">
            <option value="week">Past Week</option>
            <option value="month">Past Month</option>
            <option value="year">Past Year</option>
          </Select>

          <Grid templateColumns="repeat(auto-fit, minmax(300px, 1fr))" gap={6}>
            {exercises.map((exercise) => (
              <GridItem key={exercise.name}>
                <Card>
                  <CardHeader>
                    <Heading size="md">{exercise.name}</Heading>
                    <Text color="gray.600">{exercise.category}</Text>
                  </CardHeader>
                  <CardBody>
                    <Box height="200px">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={exercise.volumeData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="volume"
                            stroke="#3182ce"
                            name="Volume"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </Box>
                  </CardBody>
                </Card>
              </GridItem>
            ))}
          </Grid>

          <Card>
            <CardHeader>
              <Heading size="md">Exercise Frequency</Heading>
            </CardHeader>
            <CardBody>
              <Box height="400px">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={frequencyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="frequency" fill="#3182ce" name="Frequency" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardBody>
          </Card>
        </VStack>
      </Container>
    </Box>
  );
}

export default ExerciseStats;
