import {
    Box,
    Container,
    VStack,
    Heading,
    List,
    ListItem,
    Text,
    HStack,
    Button,
    Icon,
    IconButton,
    useToast,
  } from '@chakra-ui/react';
  import { FaBookOpen, FaTrash } from 'react-icons/fa';
  import { useState, useEffect } from 'react';
  import { Link } from 'react-router-dom';
  import Header from '../components/Layout/Header';
  
  interface ReadingHistory {
    novelId: number;
    novelTitle: string;
    chapterId: number;
    chapterTitle: string;
    timestamp: string;
  }
  
  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const past = new Date(timestamp);
    const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);
  
    if (diffInSeconds < 60) {
      return 'just now';
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) {
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    }
    
    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
      return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
    }
    
    const diffInYears = Math.floor(diffInMonths / 12);
    return `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`;
  };
  
  const HistoryPage = () => {
    const [history, setHistory] = useState<ReadingHistory[]>([]);
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const toast = useToast();
  
    useEffect(() => {
      const loadHistory = () => {
        const userHistory = currentUser.readingHistory || [];
        setHistory(userHistory);
      };
  
      loadHistory();
    }, [currentUser.id]);
  
    const clearHistory = () => {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userIndex = users.findIndex((u: any) => u.id === currentUser.id);
  
      if (userIndex !== -1) {
        users[userIndex].readingHistory = [];
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(users[userIndex]));
        setHistory([]);
  
        toast({
          title: 'Reading history cleared',
          status: 'success',
          duration: 2000,
        });
      }
    };
  
    return (
      <Box minH="100vh" bg="gray.50">
        <Header />
        <Container maxW="container.xl" py={8}>
          <VStack spacing={8} align="stretch">
            <HStack justify="space-between">
              <Heading>Reading History</Heading>
              {history.length > 0 && (
                <Button
                  leftIcon={<FaTrash />}
                  colorScheme="red"
                  variant="ghost"
                  onClick={clearHistory}
                >
                  Clear History
                </Button>
              )}
            </HStack>
  
            {history.length > 0 ? (
              <List spacing={4}>
                {history.map((item, index) => (
                  <ListItem
                    key={index}
                    p={4}
                    bg="white"
                    borderRadius="md"
                    borderWidth="1px"
                  >
                    <HStack justify="space-between">
                      <VStack align="start" spacing={1}>
                        <Link to={`/novel/${item.novelId}`}>
                          <Text fontWeight="bold">{item.novelTitle}</Text>
                        </Link>
                        <Link to={`/novel/${item.novelId}/chapter/${item.chapterId}`}>
                          <Text color="gray.600">
                            Chapter {item.chapterId}: {item.chapterTitle}
                          </Text>
                        </Link>
                        <Text fontSize="sm" color="gray.500">
                          {formatTimeAgo(item.timestamp)}
                        </Text>
                      </VStack>
                      <Link to={`/novel/${item.novelId}/chapter/${item.chapterId}`}>
                        <IconButton
                          icon={<FaBookOpen />}
                          aria-label="Continue reading"
                          colorScheme="blue"
                          variant="ghost"
                        />
                      </Link>
                    </HStack>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Text color="gray.600">Your reading history is empty.</Text>
            )}
          </VStack>
        </Container>
      </Box>
    );
  };
  
  export default HistoryPage;