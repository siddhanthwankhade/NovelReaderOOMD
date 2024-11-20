import {
    Box,
    Container,
    VStack,
    FormControl,
    FormLabel,
    Input,
    Textarea,
    Button,
    useToast,
    Heading,
    FormErrorMessage,
    HStack,
    Text,
    Image,
  } from '@chakra-ui/react';
  import { useFormik } from 'formik';
  import * as Yup from 'yup';
  import { useState } from 'react';
  import { useNavigate } from 'react-router-dom';
  import Header from '../Layout/Header';
  
  const UploadStory = () => {
    const toast = useToast();
    const navigate = useNavigate();
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const [coverUrl, setCoverUrl] = useState('');
  
    const formik = useFormik({
      initialValues: {
        title: '',
        summary: '',
        chapters: [{ id: 1, title: '', content: '' }],
        tags: '',
        genre: '',
        coverUrl: '', // Optional cover URL
      },
      validationSchema: Yup.object({
        title: Yup.string()
          .min(3, 'Must be at least 3 characters')
          .required('Required'),
        summary: Yup.string()
          .min(50, 'Must be at least 50 characters')
          .required('Required'),
        chapters: Yup.array().of(
          Yup.object({
            title: Yup.string()
              .min(3, 'Must be at least 3 characters')
              .required('Chapter title required'),
            content: Yup.string()
              .min(100, 'Must be at least 100 characters')
              .required('Chapter content required'),
          })
        ).min(1, 'At least one chapter is required'),
        genre: Yup.string().required('Required'),
        coverUrl: Yup.string().url('Must be a valid URL').optional(),
      }),
      onSubmit: (values) => {
        const novels = JSON.parse(localStorage.getItem('novels') || '[]');
        
        const newNovel = {
          id: Date.now(),
          title: values.title,
          cover: values.coverUrl || 'https://via.placeholder.com/300x400?text=No+Cover',
          author: currentUser.username,
          authorId: currentUser.id,
          summary: values.summary,
          chapters: values.chapters.map(chapter => ({
            ...chapter,
            views: 0,
            createdAt: new Date().toISOString()
          })),
          tags: values.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
          genre: values.genre,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          status: 'ongoing',
          views: 0,
          favorites: 0,
          reviews: [],
        };
  
        novels.push(newNovel);
        localStorage.setItem('novels', JSON.stringify(novels));
  
        // Update user's uploads
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userIndex = users.findIndex((u: any) => u.id === currentUser.id);
        if (userIndex !== -1) {
          users[userIndex].uploads = [...(users[userIndex].uploads || []), newNovel.id];
          localStorage.setItem('users', JSON.stringify(users));
          localStorage.setItem('currentUser', JSON.stringify(users[userIndex]));
        }
  
        toast({
          title: 'Story uploaded successfully',
          description: 'You can now add more chapters from the novel page',
          status: 'success',
          duration: 3000,
        });
  
        navigate(`/novel/${newNovel.id}`);
      },
    });
  
    const handleCoverUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const url = e.target.value;
      formik.setFieldValue('coverUrl', url);
      setCoverUrl(url);
    };
  
    return (
      <Box minH="100vh" bg="gray.50">
        <Header />
        <Container maxW="container.xl" py={8}>
          <VStack spacing={8} align="stretch">
            <Heading>Upload New Story</Heading>
  
            <form onSubmit={formik.handleSubmit}>
              <VStack spacing={6} align="stretch">
                <HStack align="start" spacing={8}>
                  <Box flex={1}>
                    <FormControl isInvalid={!!formik.errors.title && formik.touched.title}>
                      <FormLabel>Title</FormLabel>
                      <Input
                        name="title"
                        onChange={formik.handleChange}
                        value={formik.values.title}
                        bg="white"
                      />
                      <FormErrorMessage>{formik.errors.title}</FormErrorMessage>
                    </FormControl>
  
                    <FormControl mt={4}>
                      <FormLabel>Cover Image URL (Optional)</FormLabel>
                      <Input
                        name="coverUrl"
                        onChange={handleCoverUrlChange}
                        value={formik.values.coverUrl}
                        placeholder="https://example.com/image.jpg"
                        bg="white"
                      />
                      <Text fontSize="sm" color="gray.500" mt={1}>
                        Leave empty to use default cover
                      </Text>
                    </FormControl>
  
                    {coverUrl && (
                      <Box mt={4}>
                        <Image
                          src={coverUrl}
                          alt="Cover preview"
                          maxH="200px"
                          borderRadius="md"
                          fallbackSrc="https://via.placeholder.com/300x400?text=Invalid+URL"
                        />
                      </Box>
                    )}
  
                    <FormControl mt={4} isInvalid={!!formik.errors.genre && formik.touched.genre}>
                      <FormLabel>Genre</FormLabel>
                      <Input
                        name="genre"
                        onChange={formik.handleChange}
                        value={formik.values.genre}
                        bg="white"
                      />
                      <FormErrorMessage>{formik.errors.genre}</FormErrorMessage>
                    </FormControl>
  
                    <FormControl mt={4}>
                      <FormLabel>Tags (Optional, comma-separated)</FormLabel>
                      <Input
                        name="tags"
                        onChange={formik.handleChange}
                        value={formik.values.tags}
                        placeholder="action, adventure, fantasy"
                        bg="white"
                      />
                    </FormControl>
                  </Box>
                </HStack>
  
                <FormControl isInvalid={!!formik.errors.summary && formik.touched.summary}>
                  <FormLabel>Summary</FormLabel>
                  <Textarea
                    name="summary"
                    onChange={formik.handleChange}
                    value={formik.values.summary}
                    rows={4}
                    bg="white"
                  />
                  <FormErrorMessage>{formik.errors.summary}</FormErrorMessage>
                </FormControl>
  
                <Box>
                  <Heading size="md" mb={4}>First Chapter</Heading>
                  <VStack spacing={4}>
                    <FormControl isInvalid={!!formik.errors.chapters?.[0]?.title}>
                      <FormLabel>Chapter Title</FormLabel>
                      <Input
                        name="chapters.0.title"
                        onChange={formik.handleChange}
                        value={formik.values.chapters[0].title}
                        bg="white"
                      />
                      <FormErrorMessage>
                        {formik.errors.chapters?.[0]?.title}
                      </FormErrorMessage>
                    </FormControl>
  
                    <FormControl isInvalid={!!formik.errors.chapters?.[0]?.content}>
                      <FormLabel>Chapter Content</FormLabel>
                      <Textarea
                        name="chapters.0.content"
                        onChange={formik.handleChange}
                        value={formik.values.chapters[0].content}
                        rows={10}
                        bg="white"
                      />
                      <FormErrorMessage>
                        {formik.errors.chapters?.[0]?.content}
                      </FormErrorMessage>
                    </FormControl>
                  </VStack>
                </Box>
  
                <Button
                  type="submit"
                  colorScheme="blue"
                  size="lg"
                  isLoading={formik.isSubmitting}
                >
                  Upload Story
                </Button>
              </VStack>
            </form>
          </VStack>
        </Container>
      </Box>
    );
  };
  
  export default UploadStory;