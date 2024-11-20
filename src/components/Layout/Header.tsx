import {
    Box,
    Flex,
    Button,
    Avatar,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    useColorModeValue,
    Container,
    Text,
    Icon,
    HStack,
    Divider,
  } from '@chakra-ui/react';
  import { Link, useNavigate, useLocation } from 'react-router-dom';
  import { FaBook, FaUpload, FaUser, FaSignOutAlt, FaHome, FaHeart, FaHistory } from 'react-icons/fa';
  
  const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const bgColor = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');
  
    const handleLogout = () => {
      localStorage.removeItem('currentUser');
      navigate('/');
    };
  
    const isActive = (path: string) => location.pathname === path;
  
    return (
      <Box 
        bg={bgColor} 
        borderBottom="1px" 
        borderColor={borderColor} 
        position="sticky" 
        top={0} 
        zIndex={1000}
        shadow="sm"
      >
        <Container maxW="container.xl">
          <Flex py={4} justify="space-between" align="center">
            {/* Left side - Logo and primary navigation */}
            <HStack spacing={8}>
              <Link to="/home">
                <HStack spacing={2}>
                  <Icon as={FaBook} w={6} h={6} color="blue.500" />
                  <Text fontSize="xl" fontWeight="bold">
                    NovelHub
                  </Text>
                </HStack>
              </Link>
  
              <HStack spacing={4}>
                <Button
                  as={Link}
                  to="/home"
                  leftIcon={<FaHome />}
                  variant={isActive('/home') ? 'solid' : 'ghost'}
                  colorScheme="blue"
                  size="md"
                >
                  Home
                </Button>
                
                <Button
                  as={Link}
                  to="/library"
                  leftIcon={<FaHeart />}
                  variant={isActive('/library') ? 'solid' : 'ghost'}
                  colorScheme="blue"
                  size="md"
                >
                  Library
                </Button>
  
                <Button
                  as={Link}
                  to="/history"
                  leftIcon={<FaHistory />}
                  variant={isActive('/history') ? 'solid' : 'ghost'}
                  colorScheme="blue"
                  size="md"
                >
                  History
                </Button>
              </HStack>
            </HStack>
  
            {/* Right side - User actions */}
            <HStack spacing={4}>
              <Button
                as={Link}
                to="/upload"
                leftIcon={<FaUpload />}
                colorScheme="blue"
                variant={isActive('/upload') ? 'solid' : 'ghost'}
              >
                Upload Story
              </Button>
              
              <Menu>
                <MenuButton>
                  <HStack spacing={2}>
                    <Avatar 
                      size="sm" 
                      name={currentUser.username}
                      bg="blue.500"
                    />
                    <Text display={{ base: 'none', md: 'block' }}>
                      {currentUser.username}
                    </Text>
                  </HStack>
                </MenuButton>
                <MenuList>
                  <MenuItem 
                    icon={<FaUser />} 
                    as={Link} 
                    to="/profile"
                  >
                    Profile
                  </MenuItem>
                  <Divider />
                  <MenuItem 
                    icon={<FaSignOutAlt />} 
                    onClick={handleLogout}
                    color="red.500"
                  >
                    Logout
                  </MenuItem>
                </MenuList>
              </Menu>
            </HStack>
          </Flex>
        </Container>
      </Box>
    );
  };
  
  export default Header;