import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Spinner,
  Alert,
  AlertIcon,
  Select,
  Container,
  useColorModeValue,
  IconButton,
  useToast,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  NumberInput,
  NumberInputField,
  Textarea,
  useDisclosure,
} from "@chakra-ui/react";

import { DeleteIcon, EditIcon, AddIcon } from "@chakra-ui/icons";
import { useQueryClient } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

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

function WorkoutHistory() {
  const [timeframe, setTimeframe] = useState("week");
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [selectedWorkoutId, setSelectedWorkoutId] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const bgGradient = useColorModeValue(
    "linear(to-r, blue.400, purple.500)",
    "linear(to-r, blue.600, purple.700)"
  );

  const {
    data: workouts,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["workouts", timeframe],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        throw new Error("Authentication required");
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/workouts?timeframe=${timeframe}`,
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
        throw new Error("Failed to fetch workouts");
      }

      return response.json();
    },
    staleTime: 5 * 60 * 1000,
    cacheTime: 30 * 60 * 1000,
    refetchInterval: false,
  });
  const handleEditExercise = (workoutId, exercise) => {
    setSelectedWorkoutId(workoutId);
    setSelectedExercise(JSON.parse(JSON.stringify(exercise)));
    onOpen();
  };

  const handleCloseModal = () => {
    setSelectedExercise(null);
    setSelectedWorkoutId(null);
    onClose();
  };

  // const handleUpdateExercise = async (e) => {
  //   e.preventDefault();

  //   try {
  //     const response = await fetch(
  //       `${
  //         import.meta.env.VITE_API_BASE_URL
  //       }/workouts/${selectedWorkoutId}/exercises/${selectedExercise._id}`,
  //       {
  //         method: "PATCH",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${localStorage.getItem("token")}`,
  //         },
  //         body: JSON.stringify({
  //           ...selectedExercise,
  //           sets: selectedExercise.sets.map((set) => ({
  //             ...set,
  //             weight: Number(set.weight),
  //             reps: Number(set.reps),
  //           })),
  //         }),
  //       }
  //     );

  //     if (!response.ok) {
  //       throw new Error("Failed to update exercise");
  //     }

  //     toast({
  //       title: "Exercise updated successfully",
  //       status: "success",
  //       duration: 3000,
  //       isClosable: true,
  //     });

  //     onClose();
  //     queryClient.invalidateQueries(["workouts"]);
  //   } catch (error) {
  //     toast({
  //       title: "Failed to update exercise",
  //       description: error.message,
  //       status: "error",
  //       duration: 3000,
  //       isClosable: true,
  //     });
  //   }
  // };

  const handleDeleteWorkout = async (workoutId) => {
    if (
      !window.confirm("Are you sure you want to delete this workout session?")
    ) {
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/workouts/${workoutId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete workout");
      }

      toast({
        title: "Workout deleted successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      queryClient.invalidateQueries(["workouts"]);
    } catch (error) {
      toast({
        title: "Failed to delete workout",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleAddExerciseToWorkout = async (workoutId) => {
    setSelectedWorkoutId(workoutId);
    setSelectedExercise({
      name: "",
      category: "push",
      sets: [{ weight: "", reps: "", unit: "lbs" }],
      notes: "",
      isNew: true,
    });
    onOpen();
  };

  const handleAddSet = () => {
    setSelectedExercise((prev) => ({
      ...prev,
      sets: [...prev.sets, { weight: "", reps: "", unit: "lbs" }],
    }));
  };

  const handleUpdateExercise = async (e) => {
    e.preventDefault();

    try {
      const exerciseData = {
        exercises: selectedExercise.isNew
          ? [
              ...(workouts.find((w) => w._id === selectedWorkoutId)
                ?.exercises || []),
              {
                ...selectedExercise,
                sets: selectedExercise.sets.map((set) => ({
                  ...set,
                  weight: Number(set.weight),
                  reps: Number(set.reps),
                })),
              },
            ]
          : workouts
              .find((w) => w._id === selectedWorkoutId)
              ?.exercises.map((e) =>
                e._id === selectedExercise._id
                  ? {
                      ...selectedExercise,
                      sets: selectedExercise.sets.map((set) => ({
                        ...set,
                        weight: Number(set.weight),
                        reps: Number(set.reps),
                      })),
                    }
                  : e
              ) || [],
      };

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/workouts/${selectedWorkoutId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(exerciseData),
        }
      );

      if (!response.ok) {
        throw new Error(
          selectedExercise.isNew
            ? "Failed to add exercise"
            : "Failed to update exercise"
        );
      }

      toast({
        title: selectedExercise.isNew
          ? "Exercise added successfully"
          : "Exercise updated successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      onClose();
      queryClient.invalidateQueries(["workouts"]);
    } catch (error) {
      toast({
        title: selectedExercise.isNew
          ? "Failed to add exercise"
          : "Failed to update exercise",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDeleteExercise = async (workoutId, exerciseId) => {
    if (!window.confirm("Are you sure you want to delete this exercise?")) {
      return;
    }

    try {
      const workout = workouts.find((w) => w._id === workoutId);
      if (!workout) {
        throw new Error("Workout not found");
      }

      const exerciseData = {
        exercises: workout.exercises.filter((e) => e._id !== exerciseId),
      };

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/workouts/${workoutId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(exerciseData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete exercise");
      }

      toast({
        title: "Exercise deleted successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      queryClient.invalidateQueries(["workouts"]);
    } catch (error) {
      toast({
        title: "Failed to delete exercise",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleSetChange = (setIndex, field, value) => {
    setSelectedExercise((prev) => ({
      ...prev,
      sets: prev.sets.map((set, idx) =>
        idx === setIndex ? { ...set, [field]: value } : set
      ),
    }));
  };

  const handleExerciseChange = (field, value) => {
    setSelectedExercise((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleRemoveSet = (setIndex) => {
    setSelectedExercise((prev) => {
      if (prev.sets.length <= 1) return prev;
      const newSets = [...prev.sets];
      newSets.splice(setIndex, 1);
      return { ...prev, sets: newSets };
    });
  };

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

  return (
    <Box minH="calc(100vh - 12rem)" py={8}>
      <Container maxW="container.xl">
        <VStack spacing={8} align="stretch">
          <Heading
            textAlign="center"
            bgGradient={bgGradient}
            bgClip="text"
            fontSize={{ base: "3xl", md: "4xl" }}>
            Workout History
          </Heading>

          <Select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            maxW="200px"
            alignSelf="flex-end">
            <option value="all">All Time</option>
            <option value="week">Past Week</option>
            <option value="month">Past Month</option>
            <option value="year">Past Year</option>
          </Select>

          <Accordion
            allowMultiple
            defaultIndex={timeframe === "week" ? [0, 1, 2] : []}>
            {workouts?.map((workout) => (
              <AccordionItem key={workout._id}>
                <AccordionButton>
                  <Box flex="1" textAlign="left">
                    <Text fontWeight="bold">
                      {new Date(workout.date).toLocaleDateString()}
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      {workout.exercises.length} exercises
                    </Text>
                  </Box>
                  <HStack spacing={3} paddingRight={6}>
                    <IconButton
                      icon={<DeleteIcon />}
                      aria-label="Delete workout"
                      size="sm"
                      variant="ghost"
                      colorScheme="red"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteWorkout(workout._id);
                      }}
                    />
                    <IconButton
                      icon={<AddIcon />}
                      aria-label="Add exercise"
                      size="sm"
                      variant="ghost"
                      colorScheme="green"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddExerciseToWorkout(workout._id);
                      }}
                    />
                  </HStack>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4}>
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th width="25%">Exercise</Th>
                        <Th width="15%">Category</Th>
                        <Th width="30%">Sets</Th>
                        <Th width="15%">Volume</Th>
                        <Th width="15%">Actions</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {workout.exercises.map((exercise, index) => (
                        <Tr key={index}>
                          <Td width="25%">{exercise.name}</Td>
                          <Td width="15%">
                            <Badge colorScheme="blue">
                              {exercise.category}
                            </Badge>
                          </Td>
                          <Td width="30%">
                            {exercise.sets.map((set, setIndex) => (
                              <Text
                                key={setIndex}
                                fontSize="sm"
                                display="flex"
                                alignItems="stretch">
                                <Box flex={1}>
                                  {set.weight} {set.unit}
                                </Box>
                                <Box mx={2}>x</Box>
                                <Box flex="1">{set.reps} reps</Box>
                              </Text>
                            ))}
                          </Td>
                          <Td width="15%">
                            {exercise.sets.reduce(
                              (total, set) => total + set.weight * set.reps,
                              0
                            )}
                          </Td>
                          <Td width="15%">
                            <HStack spacing={2}>
                              <IconButton
                                icon={<EditIcon />}
                                aria-label="Edit exercise"
                                size="sm"
                                variant="ghost"
                                onClick={() =>
                                  handleEditExercise(workout._id, exercise)
                                }
                              />
                              <IconButton
                                icon={<DeleteIcon />}
                                aria-label="Delete exercise"
                                size="sm"
                                variant="ghost"
                                colorScheme="red"
                                onClick={() =>
                                  handleDeleteExercise(
                                    workout._id,
                                    exercise._id
                                  )
                                }
                              />
                            </HStack>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                  {workout.notes && (
                    <Box mt={4}>
                      <Text fontWeight="bold">Notes:</Text>
                      <Text>{workout.notes}</Text>
                    </Box>
                  )}
                </AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>
        </VStack>
      </Container>

      {/* Edit Exercise Modal */}
      <Modal isOpen={isOpen} onClose={handleCloseModal} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {selectedExercise?.isNew ? "Add Exercise" : "Edit Exercise"}
          </ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleUpdateExercise}>
            <ModalBody>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Exercise Name</FormLabel>
                  <Input
                    value={selectedExercise?.name || ""}
                    onChange={(e) =>
                      handleExerciseChange("name", e.target.value)
                    }
                    placeholder="e.g., Bench Press"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Category</FormLabel>
                  <Select
                    value={selectedExercise?.category || "push"}
                    onChange={(e) =>
                      handleExerciseChange("category", e.target.value)
                    }>
                    {exerciseCategories.map((category) => (
                      <option key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                <Box width="100%">
                  <Text mb={2} fontWeight="bold">
                    Sets
                  </Text>
                  <VStack spacing={2} align="stretch">
                    {selectedExercise?.sets.map((set, setIndex) => (
                      <HStack key={setIndex} spacing={4}>
                        <FormControl isRequired>
                          <NumberInput min={0} value={set.weight}>
                            <NumberInputField
                              value={set.weight}
                              onChange={(e) =>
                                handleSetChange(
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
                          <NumberInput min={0} value={set.reps}>
                            <NumberInputField
                              value={set.reps}
                              onChange={(e) =>
                                handleSetChange(
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
                            handleSetChange(setIndex, "unit", e.target.value)
                          }
                          width="100px">
                          <option value="lbs">lbs</option>
                          <option value="kg">kg</option>
                        </Select>
                        {selectedExercise.sets.length > 1 && (
                          <IconButton
                            icon={<DeleteIcon />}
                            onClick={() => handleRemoveSet(setIndex)}
                            colorScheme="red"
                            variant="ghost"
                          />
                        )}
                      </HStack>
                    ))}
                  </VStack>
                  <Button
                    leftIcon={<AddIcon />}
                    onClick={handleAddSet}
                    size="sm"
                    mt={2}
                    variant="ghost">
                    Add Set
                  </Button>
                </Box>

                <FormControl>
                  <FormLabel>Notes</FormLabel>
                  <Textarea
                    value={selectedExercise?.notes || ""}
                    onChange={(e) =>
                      handleExerciseChange("notes", e.target.value)
                    }
                    placeholder="Optional notes about this exercise"
                  />
                </FormControl>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button mr={3} onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button type="submit" colorScheme="blue">
                {selectedExercise?.isNew ? "Add Exercise" : "Update Exercise"}
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default WorkoutHistory;
