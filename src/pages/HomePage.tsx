import {
    Box,
    Container,
    Input,
    SimpleGrid,
    Heading,
    InputGroup,
    InputLeftElement,
    Text,
    Button,
    VStack,
    useToast,
  } from '@chakra-ui/react';
  import { SearchIcon } from '@chakra-ui/icons';
  import { useState, useEffect } from 'react';
  import NovelCard from '../components/Novel/NovelCard';
  import Header from '../components/Layout/Header';
  
  interface Novel {
    id: number;
    title: string;
    cover: string;
    author: string;
    authorId: number;
    summary: string;
    chapters: Array<{
      id: number;
      title: string;
      content: string;
      views: number;
      createdAt: string;
    }>;
    tags: string[];
    genre: string;
    status: string;
    rating: number;
    reviews: any[];
    views: number;
    favorites: number;
    createdAt: string;
    updatedAt: string;
  }
  
  const sampleNovels: Novel[] = [
    {
      id: 1,
      title: "The Dragon's Realm",
      cover: "https://images.unsplash.com/photo-1618519764620-7403abdbdfe9?w=500",
      author: "John Doe",
      authorId: 1,
      summary: "A tale of dragons and magic in a mystical world...",
      chapters: [
        {
          id: 1,
          title: "The Beginning",
          content: "In a world where dragons ruled the skies, young Aria discovered she had a gift - the ability to communicate with these magnificent creatures. As she stood atop the ancient tower of her village, watching the sunset paint the clouds in brilliant hues of orange and purple, a massive shadow passed overhead...",
          views: 0,
          createdAt: new Date().toISOString()
        }
      ],
      tags: ["Fantasy", "Dragons", "Magic"],
      genre: "Fantasy",
      status: "ongoing",
      rating: 4.5,
      reviews: [],
      views: 0,
      favorites: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 2,
      title: "Cyber City Dreams",
      cover: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=500",
      author: "Jane Smith",
      authorId: 2,
      summary: "A cyberpunk adventure in the neon-lit streets...",
      chapters: [
        {
          id: 1,
          title: "Neon Nights",
          content: "The city never sleeps, and neither do its secrets. Maya's cybernetic implants hummed softly as she navigated through the holographic advertisements that floated between the towering skyscrapers. Tonight's job would either make her career or end it - possibly along with her life...",
          views: 0,
          createdAt: new Date().toISOString()
        }
      ],
      tags: ["Cyberpunk", "Sci-Fi", "Action"],
      genre: "Science Fiction",
      status: "ongoing",
      rating: 4.2,
      reviews: [],
      views: 0,
      favorites: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];
  
  const HomePage = () => {
    const [novels, setNovels] = useState<Novel[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const toast = useToast();
  
    useEffect(() => {
      const storedNovels = JSON.parse(localStorage.getItem('novels') || '[]');
      if (storedNovels.length === 0) {
        localStorage.setItem('novels', JSON.stringify(sampleNovels));
        setNovels(sampleNovels);
      } else {
        setNovels(storedNovels);
      }
    }, []);
  
    const filteredNovels = novels.filter(novel =>
      novel.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      novel.author.toLowerCase().includes(searchQuery.toLowerCase())
    );
  
    return (
      <Box minH="100vh" bg="gray.50">
        <Header />
        <Container maxW="container.xl" py={8}>
          <VStack spacing={8} align="stretch">
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <SearchIcon color="gray.300" />
              </InputLeftElement>
              <Input
                bg="white"
                placeholder="Search novels by title or author..."
                onChange={(e) => setSearchQuery(e.target.value)}
                value={searchQuery}
              />
            </InputGroup>
  
            <Box>
              <Heading size="lg" mb={4}>Popular Novels</Heading>
              {filteredNovels.length > 0 ? (
                <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
                  {filteredNovels.map((novel) => (
                    <NovelCard key={novel.id} novel={novel} />
                  ))}
                </SimpleGrid>
              ) : (
                <Box textAlign="center" py={10}>
                  <Text mb={4}>No novels found</Text>
                  <Button
                    colorScheme="blue"
                    onClick={() => {
                      localStorage.setItem('novels', JSON.stringify(sampleNovels));
                      setNovels(sampleNovels);
                      toast({
                        title: "Sample novels added",
                        status: "success",
                        duration: 3000,
                      });
                    }}
                  >
                    Load Sample Novels
                  </Button>
                </Box>
              )}
            </Box>
          </VStack>
        </Container>
      </Box>
    );
  };
  
  export default HomePage;