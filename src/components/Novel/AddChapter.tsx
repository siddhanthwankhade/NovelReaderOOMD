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
    Text,
    HStack,
  } from '@chakra-ui/react';
  import { useFormik } from 'formik';
  import * as Yup from 'yup';
  import { useNavigate, useParams } from 'react-router-dom';
  import { useState, useEffect } from 'react';
  import Header from '../Layout/Header';
  
  const AddChapter = () => {
    const toast = useToast();
    const navigate = useNavigate();
    const { id: novelId } = useParams();
    const [novelTitle, setNovelTitle] = useState('');
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const [saveAsDraft, setSaveAsDraft] = useState(false);
  
    useEffect(() => {
      // Check if the novel exists and user is the author
      const novels = JSON.parse(localStorage.getItem('novels') || '[]');
      const novel = novels.find((n: any) => n.id === Number(novelId));
      
      if (!novel) {
        toast({
          title: 'Novel not found',
          status: 'error',
          duration: 3000,
        });
        navigate('/home');
        return;
      }
  
      if (novel.authorId !== currentUser.id) {
        toast({
          title: 'Unauthorized',
          description: 'You can only add chapters to your own novels',
          status: 'error',
          duration: 3000,
        });
        navigate('/home');
        return;
      }
  
      setNovelTitle(novel.title);
    }, [novelId, currentUser.id, navigate, toast]);
  
    const formik = useFormik({
      initialValues: {
        title: '',
        content: '',
      },
      validationSchema: Yup.object({
        title: Yup.string()
          .min(3, 'Must be at least 3 characters')
          .required('Chapter title required'),
        content: Yup.string()
          .min(100, 'Must be at least 100 characters')
          .required('Chapter content required'),
      }),
      onSubmit: (values) => {
        const novels = JSON.parse(localStorage.getItem('novels') || '[]');
        const novelIndex = novels.findIndex((n: any) => n.id === Number(novelId));
        
        if (novelIndex === -1) return;
  
        const newChapter = {
          id: novels[novelIndex].chapters.length + 1,
          title: values.title,
          content: values.content,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          views: 0,
          isDraft: saveAsDraft,
        };
  
        novels[novelIndex].chapters.push(newChapter);
        novels[novelIndex].updatedAt = new Date().toISOString();
        
        localStorage.setItem('novels', JSON.stringify(novels));
  
        // Only send notifications if not a draft
        if (!saveAsDraft) {
          // Create notifications for users who have favorited this novel
          const users = JSON.parse(localStorage.getItem('users') || '[]');
          users.forEach((user: any) => {
            if (user.favorites?.includes(Number(novelId))) {
              const notification = {
                id: Date.now(),
                type: 'chapter',
                message: `New chapter added to "${novels[novelIndex].title}": ${values.title}`,
                read: false,
                createdAt: new Date().toISOString(),
                link: `/novel/${novelId}/chapter/${newChapter.id}`,
              };
              user.notifications = [notification, ...(user.notifications || [])];
            }
          });
          localStorage.setItem('users', JSON.stringify(users));
        }
  
        toast({
          title: saveAsDraft ? 'Draft saved successfully' : 'Chapter published successfully',
          status: 'success',
          duration: 3000,
        });
  
        navigate(`/novel/${novelId}`);
      },
    });
  
    return (
      <Box minH="100vh" bg="gray.50">
        <Header />
        <Container maxW="container.xl" py={8}>
          <VStack spacing={8} align="stretch">
            <Box>
              <Heading size="lg">Add New Chapter</Heading>
              <Text color="gray.600" mt={2}>
                Adding to: {novelTitle}
              </Text>
            </Box>
  
            <form onSubmit={formik.handleSubmit}>
              <VStack spacing={6} align="stretch">
                <FormControl isInvalid={!!formik.errors.title && formik.touched.title}>
                  <FormLabel>Chapter Title</FormLabel>
                  <Input
                    name="title"
                    onChange={formik.handleChange}
                    value={formik.values.title}
                    placeholder="Enter chapter title"
                    bg="white"
                  />
                  <FormErrorMessage>{formik.errors.title}</FormErrorMessage>
                </FormControl>
  
                <FormControl isInvalid={!!formik.errors.content && formik.touched.content}>
                  <FormLabel>Chapter Content</FormLabel>
                  <Textarea
                    name="content"
                    onChange={formik.handleChange}
                    value={formik.values.content}
                    placeholder="Write your chapter content here..."
                    rows={15}
                    bg="white"
                  />
                  <FormErrorMessage>{formik.errors.content}</FormErrorMessage>
                </FormControl>
  
                <HStack spacing={4}>
                  <Button
                    colorScheme="blue"
                    size="lg"
                    onClick={() => {
                      setSaveAsDraft(false);
                      formik.handleSubmit();
                    }}
                    isLoading={formik.isSubmitting}
                  >
                    Publish Chapter
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => {
                      setSaveAsDraft(true);
                      formik.handleSubmit();
                    }}
                    isLoading={formik.isSubmitting}
                  >
                    Save as Draft
                  </Button>
                  <Button
                    size="lg"
                    variant="ghost"
                    onClick={() => navigate(`/novel/${novelId}`)}
                  >
                    Cancel
                  </Button>
                </HStack>
              </VStack>
            </form>
          </VStack>
        </Container>
      </Box>
    );
  };
  
  export default AddChapter;