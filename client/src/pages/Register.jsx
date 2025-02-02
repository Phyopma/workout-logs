import { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  useToast,
  useColorModeValue,
  Container,
  Text,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();
  const queryClient = useQueryClient();

  const bgGradient = useColorModeValue(
    "linear(to-r, blue.400, purple.500)",
    "linear(to-r, blue.600, purple.700)"
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, email, password }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      localStorage.setItem("token", data.token);
      queryClient.setQueryData(["user"], data.user);

      toast({
        title: "Registration successful",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      navigate("/");
    } catch (error) {
      toast({
        title: "Registration failed",
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
    <Box minH="calc(100vh - 12rem)" py={16} display="flex" alignItems="center">
      <Container maxW="container.sm">
        <VStack
          spacing={8}
          align="stretch"
          bg={useColorModeValue("white", "gray.700")}
          p={8}
          borderRadius="xl"
          boxShadow="xl">
          <Heading textAlign="center" bgGradient={bgGradient} bgClip="text">
            Start Your Fitness Journey
          </Heading>
          <Text textAlign="center" color="gray.600">
            Create an account to track your workouts and progress
          </Text>
          <form onSubmit={handleSubmit}>
            <VStack spacing={6}>
              <FormControl isRequired>
                <FormLabel>Username</FormLabel>
                <Input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  size="lg"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  size="lg"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  size="lg"
                />
              </FormControl>
              <Button
                type="submit"
                colorScheme="blue"
                width="full"
                size="lg"
                isLoading={isLoading}
                _hover={{ transform: "translateY(-2px)", boxShadow: "lg" }}
                transition="all 0.2s">
                Create Account
              </Button>
            </VStack>
          </form>
        </VStack>
      </Container>
    </Box>
  );
}

export default Register;
