import {
    Box,
    Container,
    VStack,
    Heading,
    SimpleGrid,
    Text,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
  } from '@chakra-ui/react';
  import { useState, useEffect } from 'react';
  import Header from '../components/Layout/Header';
  import NovelCard from '../components/Novel/NovelCard';
  
  interface Novel {
    id: number;
    title: string;
    cover: string;
    author: string;
    summary: string;
    chapters: any[];
    // ... other novel properties
  }
  
  const LibraryPage = () => {
    const [favorites, setFavorites] = useState<Novel[]>([]);
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  
    useEffect(() => {
      const loadFavorites = () => {
        const novels = JSON.parse(localStorage.getItem('novels') || '[]');
        const userFavorites = currentUser.favorites || [];
        
        const favoriteNovels = novels.filter((novel: Novel) => 
          userFavorites.includes(novel.id)
        );
        
        setFavorites(favoriteNovels);
      };
  
      loadFavorites();
    }, [currentUser.favorites]);
  
    return (
      <Box minH="100vh" bg="gray.50">
        <Header />
        <Container maxW="container.xl" py={8}>
          <VStack spacing={8} align="stretch">
            <Heading>My Library</Heading>
  
            <Tabs>
              <TabList>
                <Tab>Favorites</Tab>
              </TabList>
  
              <TabPanels>
                <TabPanel>
                  {favorites.length > 0 ? (
                    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                      {favorites.map((novel) => (
                        <NovelCard key={novel.id} novel={novel} />
                      ))}
                    </SimpleGrid>
                  ) : (
                    <Text color="gray.600">
                      You haven't added any novels to your favorites yet.
                    </Text>
                  )}
                </TabPanel>
              </TabPanels>
            </Tabs>
          </VStack>
        </Container>
      </Box>
    );
  };
  
  export default LibraryPage;