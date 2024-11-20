import {
    Box,
    Container,
    VStack,
    HStack,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
    Avatar,
    Text,
    Heading,
    SimpleGrid,
    Stat,
    StatLabel,
    StatNumber,
    Button,
    useToast,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    FormControl,
    FormLabel,
    Input,
    Divider,
  } from '@chakra-ui/react';
  import { useState, useEffect } from 'react';
  import { FaEdit, FaHeart, FaBook } from 'react-icons/fa';
  import NovelCard from '../Novel/NovelCard';
  import Header from '../Layout/Header';
  import { useNavigate } from 'react-router-dom';
  
  interface Novel {
    id: number;
    title: string;
    cover: string;
    author: string;
    summary: string;
    chapters: any[];
  }
  
  interface User {
    id: number;
    username: string;
    email: string;
    favorites: number[];
    uploads: number[];
    bio?: string;
    joinDate: string;
  }
  
  const Profile = () => {
    const toast = useToast();
    const navigate = useNavigate();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [uploadedNovels, setUploadedNovels] = useState<Novel[]>([]);
    const [favoriteNovels, setFavoriteNovels] = useState<Novel[]>([]);
    const [editForm, setEditForm] = useState({
      username: '',
      bio: '',
    });
  
    useEffect(() => {
      const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
      const allNovels = JSON.parse(localStorage.getItem('novels') || '[]');
      
      if (user) {
        setCurrentUser(user);
        setEditForm({
          username: user.username,
          bio: user.bio || '',
        });
  
        // Get uploaded novels
        const uploads = allNovels.filter((novel: Novel) => 
          user.uploads?.includes(novel.id)
        );
        setUploadedNovels(uploads);
  
        // Get favorite novels
        const favorites = allNovels.filter((novel: Novel) => 
          user.favorites?.includes(novel.id)
        );
        setFavoriteNovels(favorites);
      }
    }, []);
  
    const handleEditProfile = () => {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userIndex = users.findIndex((u: User) => u.id === currentUser?.id);
  
      if (userIndex !== -1) {
        users[userIndex] = {
          ...users[userIndex],
          username: editForm.username,
          bio: editForm.bio,
        };
  
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(users[userIndex]));
  
        setCurrentUser(users[userIndex]);
        toast({
          title: 'Profile updated successfully',
          status: 'success',
          duration: 3000,
        });
        onClose();
      }
    };
  
    const handleDeleteAccount = () => {
      if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const novels = JSON.parse(localStorage.getItem('novels') || '[]');
  
        // Remove user's novels
        const updatedNovels = novels.filter((novel: Novel) => 
          !currentUser?.uploads?.includes(novel.id)
        );
        localStorage.setItem('novels', JSON.stringify(updatedNovels));
  
        // Remove user
        const updatedUsers = users.filter((u: User) => u.id !== currentUser?.id);
        localStorage.setItem('users', JSON.stringify(updatedUsers));
        localStorage.removeItem('currentUser');
  
        toast({
          title: 'Account deleted successfully',
          status: 'info',
          duration: 3000,
        });
        navigate('/');
      }
    };
  
    if (!currentUser) return null;
  
    return (
      <Box minH="100vh" bg="gray.50">
        <Header />
        <Container maxW="container.xl" py={8}>
          <VStack spacing={8} align="stretch">
            <HStack spacing={8} align="start">
              <Avatar
                size="2xl"
                name={currentUser.username}
                bg="blue.500"
              />
              <VStack align="start" flex={1} spacing={4}>
                <Heading size="xl">{currentUser.username}</Heading>
                <Text color="gray.600">{currentUser.bio || 'No bio added yet'}</Text>
                <Text fontSize="sm" color="gray.500">
                  Joined on {new Date(currentUser.joinDate).toLocaleDateString()}
                </Text>
                <Button leftIcon={<FaEdit />} onClick={onOpen}>
                  Edit Profile
                </Button>
              </VStack>
              <SimpleGrid columns={2} spacing={8}>
                <Stat>
                  <StatLabel>Uploads</StatLabel>
                  <StatNumber>{uploadedNovels.length}</StatNumber>
                </Stat>
                <Stat>
                  <StatLabel>Favorites</StatLabel>
                  <StatNumber>{favoriteNovels.length}</StatNumber>
                </Stat>
              </SimpleGrid>
            </HStack>
  
            <Divider />
  
            <Tabs variant="enclosed">
              <TabList>
                <Tab><HStack><FaBook /><Text>My Uploads</Text></HStack></Tab>
                <Tab><HStack><FaHeart /><Text>Favorites</Text></HStack></Tab>
              </TabList>
  
              <TabPanels>
                <TabPanel>
                  {uploadedNovels.length > 0 ? (
                    <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
                      {uploadedNovels.map((novel) => (
                        <NovelCard key={novel.id} novel={novel} />
                      ))}
                    </SimpleGrid>
                  ) : (
                    <VStack py={8}>
                      <Text>You haven't uploaded any novels yet</Text>
                      <Button colorScheme="blue" onClick={() => navigate('/upload')}>
                        Upload Your First Novel
                      </Button>
                    </VStack>
                  )}
                </TabPanel>
  
                <TabPanel>
                  {favoriteNovels.length > 0 ? (
                    <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
                      {favoriteNovels.map((novel) => (
                        <NovelCard key={novel.id} novel={novel} />
                      ))}
                    </SimpleGrid>
                  ) : (
                    <Text py={8}>No favorite novels yet</Text>
                  )}
                </TabPanel>
              </TabPanels>
            </Tabs>
  
            <Box pt={8}>
              <Button colorScheme="red" onClick={handleDeleteAccount}>
                Delete Account
              </Button>
            </Box>
          </VStack>
  
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Edit Profile</ModalHeader>
              <ModalBody>
                <VStack spacing={4}>
                  <FormControl>
                    <FormLabel>Username</FormLabel>
                    <Input
                      value={editForm.username}
                      onChange={(e) => setEditForm({
                        ...editForm,
                        username: e.target.value
                      })}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Bio</FormLabel>
                    <Input
                      value={editForm.bio}
                      onChange={(e) => setEditForm({
                        ...editForm,
                        bio: e.target.value
                      })}
                    />
                  </FormControl>
                </VStack>
              </ModalBody>
              <ModalFooter>
                <Button variant="ghost" mr={3} onClick={onClose}>
                  Cancel
                </Button>
                <Button colorScheme="blue" onClick={handleEditProfile}>
                  Save Changes
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </Container>
      </Box>
    );
  };
  
  export default Profile;