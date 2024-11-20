import {
    Box,
    Container,
    VStack,
    HStack,
    Image,
    Heading,
    Text,
    Button,
    List,
    ListItem,
    Badge,
    Icon,
    useToast,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
  } from '@chakra-ui/react';
  import { AddIcon, EditIcon } from '@chakra-ui/icons';
  import { FaUser, FaBookOpen, FaHeart } from 'react-icons/fa';
  import { Link, useParams, useNavigate } from 'react-router-dom';
  import { useState, useEffect } from 'react';
  import Header from '../components/Layout/Header';
  import ChapterManagement from '../components/Novel/ChapterManagement';
  
  interface Chapter {
    id: number;
    title: string;
    content: string;
    views: number;
    createdAt: string;
  }
  
  interface Novel {
    id: number;
    title: string;
    cover: string;
    author: string;
    authorId: number;
    summary: string;
    chapters: Chapter[];
    genre: string;
    tags: string[];
    status: 'ongoing' | 'completed' | 'hiatus';
    createdAt: string;
    updatedAt: string;
  }
  
  const NovelPage = () => {
    const { id } = useParams();
    const [novel, setNovel] = useState<Novel | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const toast = useToast();
    const [isFavorited, setIsFavorited] = useState(false);
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const [isAuthor, setIsAuthor] = useState(false);
  
    useEffect(() => {
      if (!id) return;
  
      const novels = JSON.parse(localStorage.getItem('novels') || '[]');
      const foundNovel = novels.find((n: Novel) => n.id.toString() === id.toString());
      
      if (!foundNovel) {
        toast({
          title: 'Novel not found',
          status: 'error',
          duration: 3000,
        });
        navigate('/home');
        return;
      }
  
      setNovel(foundNovel);
      setIsAuthor(foundNovel.authorId === currentUser.id);
      
      // Check if novel is in user's favorites
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find((u: any) => u.id === currentUser.id);
      if (user) {
        setIsFavorited(user.favorites?.includes(foundNovel.id) || false);
      }
  
      setIsLoading(false);
    }, [id, navigate, toast, currentUser.id]);
  
    const handleFavorite = () => {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userIndex = users.findIndex((u: any) => u.id === currentUser.id);
  
      if (userIndex !== -1) {
        if (!users[userIndex].favorites) {
          users[userIndex].favorites = [];
        }
  
        if (isFavorited) {
          users[userIndex].favorites = users[userIndex].favorites.filter(
            (fid: number) => fid !== novel?.id
          );
        } else {
          users[userIndex].favorites.push(novel?.id);
        }
  
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(users[userIndex]));
        setIsFavorited(!isFavorited);
  
        toast({
          title: isFavorited ? 'Removed from favorites' : 'Added to favorites',
          status: 'success',
          duration: 2000,
        });
      }
    };
  
    const handleChaptersUpdate = (updatedChapters: Chapter[]) => {
      if (!novel) return;
  
      const novels = JSON.parse(localStorage.getItem('novels') || '[]');
      const novelIndex = novels.findIndex((n: Novel) => n.id === novel.id);
      
      if (novelIndex !== -1) {
        novels[novelIndex] = {
          ...novels[novelIndex],
          chapters: updatedChapters,
          updatedAt: new Date().toISOString(),
        };
        
        localStorage.setItem('novels', JSON.stringify(novels));
        setNovel(novels[novelIndex]);
  
        toast({
          title: 'Chapters updated successfully',
          status: 'success',
          duration: 2000,
        });
      }
    };
  
    const handleChapterClick = (chapterId: number) => {
      navigate(`/novel/${novel?.id}/chapter/${chapterId}`);
    };
  
    if (isLoading) {
      return (
        <Box minH="100vh" bg="gray.50">
          <Header />
          <Container maxW="container.xl" py={8}>
            <Text>Loading...</Text>
          </Container>
        </Box>
      );
    }
  
    if (!novel) {
      return (
        <Box minH="100vh" bg="gray.50">
          <Header />
          <Container maxW="container.xl" py={8}>
            <Text>Novel not found</Text>
          </Container>
        </Box>
      );
    }
  
    return (
      <Box minH="100vh" bg="gray.50">
        <Header />
        <Container maxW="container.xl" py={8}>
          <VStack spacing={8} align="stretch">
            <HStack align="start" spacing={8} wrap={{ base: 'wrap', md: 'nowrap' }}>
              <Box width={{ base: '100%', md: '300px' }}>
                <Image
                  src={novel.cover}
                  alt={novel.title}
                  borderRadius="lg"
                  objectFit="cover"
                  width="100%"
                  fallbackSrc="https://via.placeholder.com/300x400?text=No+Cover"
                />
                <VStack mt={4} spacing={4} width="100%">
                  <Button
                    leftIcon={isFavorited ? <FaHeart /> : <FaHeart />}
                    colorScheme={isFavorited ? 'red' : 'gray'}
                    width="100%"
                    onClick={handleFavorite}
                  >
                    {isFavorited ? 'Remove from Favorites' : 'Add to Favorites'}
                  </Button>
                </VStack>
              </Box>
  
              <VStack align="start" flex={1} spacing={4}>
                <Heading size="xl">{novel.title}</Heading>
                <HStack>
                  <Icon as={FaUser} color="gray.500" />
                  <Text color="gray.600">{novel.author}</Text>
                  <Badge colorScheme={novel.status === 'ongoing' ? 'green' : 'blue'}>
                    {novel.status}
                  </Badge>
                </HStack>
                <Text color="gray.700">{novel.summary}</Text>
                <HStack spacing={4}>
                  <Text color="gray.600">Genre: {novel.genre}</Text>
                  <Text color="gray.600">
                    Tags: {novel.tags.join(', ')}
                  </Text>
                </HStack>
              </VStack>
            </HStack>
  
            <Tabs>
              <TabList>
                <Tab>Chapters</Tab>
                {isAuthor && <Tab>Manage Chapters</Tab>}
              </TabList>
  
              <TabPanels>
                <TabPanel>
                  <VStack spacing={4} align="stretch">
                    {isAuthor && (
                      <Button
                        leftIcon={<AddIcon />}
                        colorScheme="green"
                        as={Link}
                        to={`/novel/${novel.id}/add-chapter`}
                      >
                        Add New Chapter
                      </Button>
                    )}
                    <List spacing={3}>
                      {novel.chapters
                        .filter(chapter => !chapter.isDraft)
                        .map((chapter) => (
                          <ListItem 
                            key={chapter.id}
                            p={3}
                            _hover={{ bg: 'gray.50', cursor: 'pointer' }}
                            onClick={() => handleChapterClick(chapter.id)}
                          >
                            <Text>Chapter {chapter.id}: {chapter.title}</Text>
                          </ListItem>
                        ))}
                    </List>
                  </VStack>
                </TabPanel>
  
                {isAuthor && (
                  <TabPanel>
                    <ChapterManagement
                      novelId={novel.id}
                      chapters={novel.chapters}
                      onChaptersUpdate={handleChaptersUpdate}
                    />
                  </TabPanel>
                )}
              </TabPanels>
            </Tabs>
          </VStack>
        </Container>
      </Box>
    );
  };
  
  export default NovelPage;