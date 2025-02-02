import {
  Box,
  Button,
  Heading,
  Text,
  VStack,
  Grid,
  GridItem,
  Icon,
  Container,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaDumbbell, FaChartLine, FaUsers } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Home() {
  const { user } = useContext(AuthContext);
  const bgGradient = useColorModeValue(
    "linear(to-r, blue.400, purple.500)",
    "linear(to-r, blue.600, purple.700)"
  );

  return (
    <Box minH="calc(100vh - 12rem)" py={16}>
      <Container maxW="container.xl">
        <VStack spacing={16}>
          {/* Hero Section */}
          <VStack spacing={8} textAlign="center">
            <Heading
              fontSize={{ base: "4xl", md: "5xl", lg: "6xl" }}
              bgGradient={bgGradient}
              bgClip="text"
              lineHeight="shorter">
              Transform Your Fitness Journey
            </Heading>

            <Text
              fontSize={{ base: "lg", lg: "xl" }}
              color="gray.600"
              maxW="3xl">
              Take control of your fitness journey with our comprehensive
              workout tracking system. Log your progress, analyze your
              performance, and achieve your goals.
            </Text>

            {user ? (
              <Button
                as={Link}
                to="/log-workout"
                size="lg"
                colorScheme="blue"
                fontSize="xl"
                px={10}
                py={8}
                _hover={{ transform: "translateY(-2px)", boxShadow: "lg" }}
                transition="all 0.2s">
                Log Your Workout
              </Button>
            ) : (
              <Button
                as={Link}
                to="/register"
                size="lg"
                colorScheme="blue"
                fontSize="xl"
                px={10}
                py={8}
                _hover={{ transform: "translateY(-2px)", boxShadow: "lg" }}
                transition="all 0.2s">
                Get Started Now
              </Button>
            )}
          </VStack>

          {/* Features Grid */}
          <Grid
            templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
            gap={8}
            w="full"
            px={4}>
            <GridItem
              as={Box}
              p={8}
              borderRadius="xl"
              bg={useColorModeValue("white", "gray.700")}
              boxShadow="xl"
              textAlign="center"
              _hover={{ transform: "translateY(-4px)", boxShadow: "2xl" }}
              transition="all 0.3s">
              <Icon as={FaDumbbell} w={10} h={10} color="blue.400" mb={4} />
              <Heading size="md" mb={4}>
                Easy Workout Logging
              </Heading>
              <Text color="gray.600">
                Quickly log your exercises, sets, and reps with our intuitive
                interface.
              </Text>
            </GridItem>

            <GridItem
              as={Box}
              p={8}
              borderRadius="xl"
              bg={useColorModeValue("white", "gray.700")}
              boxShadow="xl"
              textAlign="center"
              _hover={{ transform: "translateY(-4px)", boxShadow: "2xl" }}
              transition="all 0.3s">
              <Icon as={FaChartLine} w={10} h={10} color="blue.400" mb={4} />
              <Heading size="md" mb={4}>
                Track Progress
              </Heading>
              <Text color="gray.600">
                Visualize your fitness journey with detailed progress charts and
                analytics.
              </Text>
            </GridItem>

            <GridItem
              as={Box}
              p={8}
              borderRadius="xl"
              bg={useColorModeValue("white", "gray.700")}
              boxShadow="xl"
              textAlign="center"
              _hover={{ transform: "translateY(-4px)", boxShadow: "2xl" }}
              transition="all 0.3s">
              <Icon as={FaUsers} w={10} h={10} color="blue.400" mb={4} />
              <Heading size="md" mb={4}>
                Community Support
              </Heading>
              <Text color="gray.600">
                Join a community of fitness enthusiasts and share your
                achievements.
              </Text>
            </GridItem>
          </Grid>
        </VStack>
      </Container>
    </Box>
  );
}

export default Home;
