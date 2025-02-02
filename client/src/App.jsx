import { ChakraProvider, Box, Container } from "@chakra-ui/react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AuthProvider } from "./context/AuthProvider";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import WorkoutLog from "./pages/WorkoutLog";
import WorkoutHistory from "./pages/WorkoutHistory";
import ExerciseStats from "./pages/ExerciseStats";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
      onError: (error) => {
        if (
          error.message === "Authentication required" ||
          error.message === "Session expired. Please login again."
        ) {
          localStorage.removeItem("token");
        }
      },
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider>
        <Router>
          <AuthProvider>
            <Box minH="100vh" minW="100vw" bg="gray.50">
              <Navbar />
              <Container maxW="container.xl" py={8}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/log-workout" element={<WorkoutLog />} />
                  <Route path="/history" element={<WorkoutHistory />} />
                  <Route path="/stats" element={<ExerciseStats />} />
                </Routes>
              </Container>
            </Box>
          </AuthProvider>
        </Router>
      </ChakraProvider>
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
  );
}

export default App;
