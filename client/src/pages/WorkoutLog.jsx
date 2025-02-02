import { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  VStack,
  Heading,
  useToast,
  IconButton,
  HStack,
  Text,
  Textarea,
  NumberInput,
  NumberInputField,
  Grid,
  Container,
  GridItem,
  useColorModeValue,
} from "@chakra-ui/react";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

const exerciseCategories = [
  "push",
  "pull",
  "legs",
  "chest",
  "back",
  "shoulders",
  "arms",
  "core",
  "cardio",
  "other",
];

function WorkoutLog() {
  const bgGradient = useColorModeValue(
    "linear(to-r, blue.400, purple.500)",
    "linear(to-r, blue.600, purple.700)"
  );
  const [exercises, setExercises] = useState([
    {
      name: "",
      category: "push",
      sets: [{ weight: "", reps: "", unit: "lbs" }],
      notes: "",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();
  const queryClient = useQueryClient();

  const handleAddExercise = () => {
    setExercises([
      ...exercises,
      {
        name: "",
        category: "push",
        sets: [{ weight: "", reps: "", unit: "lbs" }],
        notes: "",
      },
    ]);
  };

  const handleRemoveExercise = (index) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  const handleAddSet = (exerciseIndex) => {
    const newExercises = [...exercises];
    newExercises[exerciseIndex].sets.push({
      weight: "",
      reps: "",
      unit: "lbs",
    });
    setExercises(newExercises);
  };

  const handleRemoveSet = (exerciseIndex, setIndex) => {
    const newExercises = [...exercises];
    newExercises[exerciseIndex].sets.splice(setIndex, 1);
    setExercises(newExercises);
  };

  const handleExerciseChange = (index, field, value) => {
    const newExercises = [...exercises];
    newExercises[index][field] = value;
    setExercises(newExercises);
  };

  const handleSetChange = (exerciseIndex, setIndex, field, value) => {
    const newExercises = [...exercises];
    newExercises[exerciseIndex].sets[setIndex][field] = value;
    setExercises(newExercises);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/workouts`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            exercises: exercises.map((exercise) => ({
              ...exercise,
              sets: exercise.sets.map((set) => ({
                ...set,
                weight: Number(set.weight),
                reps: Number(set.reps),
              })),
            })),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to log workout");
      }

      queryClient.invalidateQueries(["workouts"]);

      toast({
        title: "Workout logged successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      navigate("/history");
    } catch (error) {
      toast({
        title: "Failed to log workout",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box minH="calc(100vh - 12rem)" py={8}>
      <Container maxW="container.xl">
        <VStack spacing={8} align="stretch">
          <Heading
            textAlign="center"
            bgGradient={bgGradient}
            bgClip="text"
            fontSize={{ base: "3xl", md: "4xl" }}>
            Log Your Workout
          </Heading>
          <form onSubmit={handleSubmit}>
            <VStack spacing={6}>
              {exercises.map((exercise, exerciseIndex) => (
                <Box
                  key={exerciseIndex}
                  p={6}
                  borderWidth="1px"
                  borderRadius="lg"
                  bg="white">
                  <VStack spacing={4} align="stretch">
                    <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                      <GridItem>
                        <FormControl isRequired>
                          <FormLabel>Exercise Name</FormLabel>
                          <Input
                            value={exercise.name}
                            onChange={(e) =>
                              handleExerciseChange(
                                exerciseIndex,
                                "name",
                                e.target.value
                              )
                            }
                            placeholder="e.g., Bench Press"
                          />
                        </FormControl>
                      </GridItem>
                      <GridItem>
                        <FormControl isRequired>
                          <FormLabel>Category</FormLabel>
                          <Select
                            value={exercise.category}
                            onChange={(e) =>
                              handleExerciseChange(
                                exerciseIndex,
                                "category",
                                e.target.value
                              )
                            }>
                            {exerciseCategories.map((category) => (
                              <option key={category} value={category}>
                                {category.charAt(0).toUpperCase() +
                                  category.slice(1)}
                              </option>
                            ))}
                          </Select>
                        </FormControl>
                      </GridItem>
                    </Grid>

                    <Box>
                      <Text mb={2} fontWeight="bold">
                        Sets
                      </Text>
                      <VStack spacing={2} align="stretch">
                        {exercise.sets.map((set, setIndex) => (
                          <HStack key={setIndex} spacing={4}>
                            <FormControl isRequired>
                              <NumberInput min={0}>
                                <NumberInputField
                                  value={set.weight}
                                  onChange={(e) =>
                                    handleSetChange(
                                      exerciseIndex,
                                      setIndex,
                                      "weight",
                                      e.target.value
                                    )
                                  }
                                  placeholder="Weight"
                                />
                              </NumberInput>
                            </FormControl>
                            <FormControl isRequired>
                              <NumberInput min={0}>
                                <NumberInputField
                                  value={set.reps}
                                  onChange={(e) =>
                                    handleSetChange(
                                      exerciseIndex,
                                      setIndex,
                                      "reps",
                                      e.target.value
                                    )
                                  }
                                  placeholder="Reps"
                                />
                              </NumberInput>
                            </FormControl>
                            <Select
                              value={set.unit}
                              onChange={(e) =>
                                handleSetChange(
                                  exerciseIndex,
                                  setIndex,
                                  "unit",
                                  e.target.value
                                )
                              }
                              width="100px">
                              <option value="lbs">lbs</option>
                              <option value="kg">kg</option>
                            </Select>
                            {exercise.sets.length > 1 && (
                              <IconButton
                                icon={<DeleteIcon />}
                                onClick={() =>
                                  handleRemoveSet(exerciseIndex, setIndex)
                                }
                                colorScheme="red"
                                variant="ghost"
                              />
                            )}
                          </HStack>
                        ))}
                      </VStack>
                      <Button
                        leftIcon={<AddIcon />}
                        onClick={() => handleAddSet(exerciseIndex)}
                        size="sm"
                        mt={2}
                        variant="ghost">
                        Add Set
                      </Button>
                    </Box>

                    <FormControl>
                      <FormLabel>Notes</FormLabel>
                      <Textarea
                        value={exercise.notes}
                        onChange={(e) =>
                          handleExerciseChange(
                            exerciseIndex,
                            "notes",
                            e.target.value
                          )
                        }
                        placeholder="Optional notes about this exercise"
                      />
                    </FormControl>

                    {exercises.length > 1 && (
                      <Button
                        leftIcon={<DeleteIcon />}
                        onClick={() => handleRemoveExercise(exerciseIndex)}
                        colorScheme="red"
                        variant="ghost">
                        Remove Exercise
                      </Button>
                    )}
                  </VStack>
                </Box>
              ))}

              <Button
                leftIcon={<AddIcon />}
                onClick={handleAddExercise}
                colorScheme="blue"
                variant="ghost">
                Add Exercise
              </Button>

              <Button
                type="submit"
                colorScheme="blue"
                size="lg"
                width="full"
                isLoading={isLoading}>
                Save Workout
              </Button>
            </VStack>
          </form>
        </VStack>
      </Container>
    </Box>
  );
}

export default WorkoutLog;
