import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  VStack,
  Heading,
  Button,
  HStack,
  useToast,
} from '@chakra-ui/react';
import Header from '../Layout/Header';
import { Novel, Chapter } from '../../types/novel';

const ChapterReader = () => {
  const { id: novelId, chapterId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  
  const [novel, setNovel] = useState<Novel | null>(null);
  const [chapter, setChapter] = useState<Chapter | null>(null);

  useEffect(() => {
    const loadChapter = () => {
      try {
        // Get novels from localStorage
        const novels = JSON.parse(localStorage.getItem('novels') || '[]');
        const currentNovelId = Number(novelId);
        const currentChapterId = Number(chapterId);

        // Find the novel
        const foundNovel = novels.find((n: Novel) => n.id === currentNovelId);
        if (!foundNovel) {
          throw new Error('Novel not found');
        }

        // Find the chapter
        const foundChapter = foundNovel.chapters.find(
          (c: Chapter) => c.id === currentChapterId
        );
        if (!foundChapter) {
          throw new Error('Chapter not found');
        }

        setNovel(foundNovel);
        setChapter(foundChapter);

        // Update reading history
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        if (currentUser.id) {
          const readingHistory = {
            novelId: foundNovel.id,
            novelTitle: foundNovel.title,
            chapterId: foundChapter.id,
            chapterTitle: foundChapter.title,
            timestamp: new Date().toISOString(),
          };

          const users = JSON.parse(localStorage.getItem('users') || '[]');
          const userIndex = users.findIndex((u: any) => u.id === currentUser.id);
          if (userIndex !== -1) {
            users[userIndex].readingHistory = [
              readingHistory,
              ...(users[userIndex].readingHistory || []).filter(
                (h: any) => h.novelId !== foundNovel.id
              ),
            ].slice(0, 20);
            localStorage.setItem('users', JSON.stringify(users));
            localStorage.setItem('currentUser', JSON.stringify(users[userIndex]));
          }
        }
      } catch (error: any) {
        toast({
          title: error.message,
          status: 'error',
          duration: 3000,
        });
        navigate(error.message === 'Novel not found' ? '/home' : `/novel/${novelId}`);
      }
    };

    loadChapter();
  }, [novelId, chapterId, navigate, toast]);

  const handleChapterChange = (newChapterId: number) => {
    if (!novel) return;
    navigate(`/novel/${novel.id}/chapter/${newChapterId}`);
  };

  if (!novel || !chapter) {
    return (
      <Box minH="100vh" bg="gray.50">
        <Header />
        <Container maxW="container.xl" py={8}>
          <VStack spacing={4}>
            <Heading size="md">Loading...</Heading>
          </VStack>
        </Container>
      </Box>
    );
  }

  return (
    <Box minH="100vh" bg="gray.50">
      <Header />
      <Container maxW="container.xl" py={8}>
        <VStack spacing={6} align="stretch">
          <Heading size="xl">{novel.title}</Heading>
          <Heading size="lg">Chapter {chapter.id}: {chapter.title}</Heading>
          
          <Box 
            bg="white" 
            p={6} 
            borderRadius="lg" 
            boxShadow="sm"
            whiteSpace="pre-wrap"
          >
            {chapter.content}
          </Box>

          <HStack spacing={4} justify="center">
            <Button
              isDisabled={chapter.id === 1}
              onClick={() => handleChapterChange(chapter.id - 1)}
            >
              Previous Chapter
            </Button>
            <Button
              isDisabled={chapter.id === novel.chapters.length}
              onClick={() => handleChapterChange(chapter.id + 1)}
            >
              Next Chapter
            </Button>
          </HStack>
        </VStack>
      </Container>
    </Box>
  );
};

export default ChapterReader;