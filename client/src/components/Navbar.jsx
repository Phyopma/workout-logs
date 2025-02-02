import {
  Box,
  Button,
  Flex,
  Heading,
  Spacer,
  useToast,
  IconButton,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  VStack,
  useBreakpointValue,
} from "@chakra-ui/react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../context/useAuth";
import { HamburgerIcon } from "@chakra-ui/icons";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const toast = useToast();
  const { user, isLoading } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isMobile = useBreakpointValue({ base: true, md: false });

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      localStorage.removeItem("token");
      queryClient.setQueryData(["user"], null);
      queryClient.invalidateQueries(["workouts"]);

      toast({
        title: "Logged out successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      navigate("/login");
    } catch (error) {
      toast({
        title: "Logout failed",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (isLoading) {
    return null; // Return null while loading to prevent flash of incorrect content
  }

  return (
    <Box bg="white" px={4} shadow="sm">
      <Flex h={16} alignItems="center" maxW="container.xl" mx="auto">
        <Heading size="md" as={Link} to="/" color="blue.500">
          Workout Logs
        </Heading>

        <Spacer />

        {isMobile ? (
          <>
            <IconButton
              icon={<HamburgerIcon />}
              aria-label="Open menu"
              variant="ghost"
              onClick={onOpen}
            />
            <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
              <DrawerOverlay />
              <DrawerContent>
                <DrawerCloseButton />
                <DrawerHeader>Menu</DrawerHeader>
                <DrawerBody>
                  {user ? (
                    <VStack spacing={4} align="stretch">
                      <Button
                        as={Link}
                        to="/log-workout"
                        colorScheme={isActive("/log-workout") ? "blue" : "gray"}
                        variant={isActive("/log-workout") ? "solid" : "ghost"}
                        onClick={onClose}>
                        Log Workout
                      </Button>
                      <Button
                        as={Link}
                        to="/history"
                        colorScheme={isActive("/history") ? "blue" : "gray"}
                        variant={isActive("/history") ? "solid" : "ghost"}
                        onClick={onClose}>
                        History
                      </Button>
                      <Button
                        as={Link}
                        to="/stats"
                        colorScheme={isActive("/stats") ? "blue" : "gray"}
                        variant={isActive("/stats") ? "solid" : "ghost"}
                        onClick={onClose}>
                        Stats
                      </Button>
                      <Button
                        onClick={() => {
                          handleLogout();
                          onClose();
                        }}
                        variant="ghost">
                        Logout
                      </Button>
                    </VStack>
                  ) : (
                    <VStack spacing={4} align="stretch">
                      <Button
                        as={Link}
                        to="/login"
                        variant="ghost"
                        onClick={onClose}>
                        Login
                      </Button>
                      <Button
                        as={Link}
                        to="/register"
                        colorScheme="blue"
                        onClick={onClose}>
                        Register
                      </Button>
                    </VStack>
                  )}
                </DrawerBody>
              </DrawerContent>
            </Drawer>
          </>
        ) : user ? (
          <Flex gap={4} align="center" justify="center">
            <Button
              as={Link}
              to="/log-workout"
              colorScheme={isActive("/log-workout") ? "blue" : "gray"}
              variant={isActive("/log-workout") ? "solid" : "ghost"}>
              Log Workout
            </Button>
            <Button
              as={Link}
              to="/history"
              colorScheme={isActive("/history") ? "blue" : "gray"}
              variant={isActive("/history") ? "solid" : "ghost"}>
              History
            </Button>
            <Button
              as={Link}
              to="/stats"
              colorScheme={isActive("/stats") ? "blue" : "gray"}
              variant={isActive("/stats") ? "solid" : "ghost"}>
              Stats
            </Button>
            <Button onClick={handleLogout} variant="ghost">
              Logout
            </Button>
          </Flex>
        ) : (
          <Flex gap={4} align="center" justify="center">
            <Button
              as={Link}
              to="/login"
              colorScheme={isActive("/login") ? "blue" : "gray"}
              variant={isActive("/login") ? "solid" : "ghost"}>
              Login
            </Button>
            <Button
              as={Link}
              to="/register"
              colorScheme={isActive("/register") ? "blue" : "gray"}
              variant={isActive("/register") ? "solid" : "ghost"}>
              Register
            </Button>
          </Flex>
        )}
      </Flex>
    </Box>
  );
}

export default Navbar;
