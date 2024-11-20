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
    IconButton,
    HStack,
    Text,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    ModalCloseButton,
  } from '@chakra-ui/react';
  import { DeleteIcon, AddIcon } from '@chakra-ui/icons';
  import { useFormik } from 'formik';
  import * as Yup from 'yup';
  import { useNavigate, useParams } from 'react-router-dom';
  import { useState, useEffect } from 'react';
  import Header from '../Layout/Header';
  
  interface Chapter {
    id: number;
    title: string;
    content: string;
  }
  
  interface Novel {
    id: number;
    title: string;
    cover: string;
    author: string;
    authorId: number;
    summary: string;
    chapters: Chapter[];
  }
  
  const EditNovel = () => {
    const { id } = useParams();
    const toast = useToast();
    const navigate = useNavigate();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [novel, setNovel] = useState<Novel | null>(null);
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  
    useEffect(() => {
      const novels = JSON.parse(localStorage.getItem('novels') || '[]');
      const foundNovel = novels.find((n: Novel) => n.id === Number(id));
      
      if (foundNovel) {
        if (foundNovel.authorId !== currentUser.id) {
          toast({
            title: 'Unauthorized',
            description: 'You can only edit your own novels',
            status: 'error',
            duration: 3000,
          });
          navigate('/home');
          return;
        }
        setNovel(foundNovel);
      } else {
        navigate('/home');
      }
    }, [id, currentUser.id, navigate, toast]);
  
    const formik = useFormik({
      initialValues: {
        title: novel?.title || '',
        summary: novel?.summary || '',
        cover: novel?.cover || '',
        chapters: novel?.chapters || [],
      },
      enableReinitialize: true,
      validationSchema: Yup.object({
        title: Yup.string().required('Required'),
        summary: Yup.string().required('Required'),
        cover: Yup.string().url('Must be a valid URL').required('Required'),
        chapters: Yup.array().of(
          Yup.object({
            title: Yup.string().required('Chapter title required'),
            content: Yup.string().required('Chapter content required'),
          })
        ),
      }),
      onSubmit: (values) => {
        const novels = JSON.parse(localStorage.getItem('novels') || '[]');
        const novelIndex = novels.findIndex((n: Novel) => n.id === Number(id));
        
        if (novelIndex !== -1) {
          novels[novelIndex] = {
            ...novels[novelIndex],
            ...values,
          };
          
          localStorage.setItem('novels', JSON.stringify(novels));
          
          toast({
            title: 'Novel updated successfully',
            status: 'success',
            duration: 3000,
          });
          
          navigate(`/novel/${id}`);
        }
      },
    });
  
    const handleAddChapter = () => {
      const newChapter = {
        id: (formik.values.chapters?.length || 0) + 1,
        title: '',
        content: '',
      };
      formik.setFieldValue('chapters', [...formik.values.chapters, newChapter]);
    };
  
    const handleDeleteChapter = (index: number) => {
      const updatedChapters = formik.values.chapters.filter((_, i) => i !== index);
      formik.setFieldValue('chapters', updatedChapters);
    };
  
    const handleDeleteNovel = () => {
      const novels = JSON.parse(localStorage.getItem('novels') || '[]');
      const updatedNovels = novels.filter((n: Novel) => n.id !== Number(id));
      localStorage.setItem('novels', JSON.stringify(updatedNovels));
      
      // Remove from user's uploads
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userIndex = users.findIndex((u: any) => u.id === currentUser.id);
      if (userIndex !== -1) {
        users[userIndex].uploads = users[userIndex].uploads.filter((uploadId: number) => uploadId !== Number(id));
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(users[userIndex]));
      }
      
      toast({
        title: 'Novel deleted successfully',
        status: 'success',
        duration: 3000,
      });
      navigate('/home');
    };
  
    if (!novel) return null;
  
    return (
      <Box minH="100vh" bg="gray.50">
        <Header />
        <Container maxW="container.xl" py={8}>
          <VStack spacing={8} align="stretch">
            <HStack justify="space-between">
              <Heading size="lg">Edit Novel</Heading>
              <Button colorScheme="red" onClick={onOpen}>
                Delete Novel
              </Button>
            </HStack>
  
            <form onSubmit={formik.handleSubmit}>
              <VStack spacing={6} align="stretch">
                <FormControl isInvalid={!!formik.errors.title && formik.touched.title}>
                  <FormLabel>Title</FormLabel>
                  <Input
                    name="title"
                    value={formik.values.title}
                    onChange={formik.handleChange}
                    bg="white"
                  />
                </FormControl>
  
                <FormControl isInvalid={!!formik.errors.cover && formik.touched.cover}>
                  <FormLabel>Cover Image URL</FormLabel>
                  <Input
                    name="cover"
                    value={formik.values.cover}
                    onChange={formik.handleChange}
                    bg="white"
                  />
                </FormControl>
  
                <FormControl isInvalid={!!formik.errors.summary && formik.touched.summary}>
                  <FormLabel>Summary</FormLabel>
                  <Textarea
                    name="summary"
                    value={formik.values.summary}
                    onChange={formik.handleChange}
                    rows={4}
                    bg="white"
                  />
                </FormControl>
  
                <Box>
                  <HStack justify="space-between" mb={4}>
                    <Heading size="md">Chapters</Heading>
                    <Button
                      leftIcon={<AddIcon />}
                      colorScheme="blue"
                      onClick={handleAddChapter}
                    >
                      Add Chapter
                    </Button>
                  </HStack>
  
                  <VStack spacing={6} align="stretch">
                    {formik.values.chapters.map((chapter, index) => (
                      <Box
                        key={index}
                        p={4}
                        borderWidth="1px"
                        borderRadius="lg"
                        bg="white"
                      >
                        <HStack justify="space-between" mb={4}>
                          <Text fontWeight="bold">Chapter {index + 1}</Text>
                          <IconButton
                            icon={<DeleteIcon />}
                            aria-label="Delete chapter"
                            colorScheme="red"
                            size="sm"
                            onClick={() => handleDeleteChapter(index)}
                          />
                        </HStack>
  
                        <VStack spacing={4}>
                          <FormControl>
                            <FormLabel>Chapter Title</FormLabel>
                            <Input
                              name={`chapters.${index}.title`}
                              value={chapter.title}
                              onChange={formik.handleChange}
                            />
                          </FormControl>
  
                          <FormControl>
                            <FormLabel>Chapter Content</FormLabel>
                            <Textarea
                              name={`chapters.${index}.content`}
                              value={chapter.content}
                              onChange={formik.handleChange}
                              rows={10}
                            />
                          </FormControl>
                        </VStack>
                      </Box>
                    ))}
                  </VStack>
                </Box>
  
                <Button type="submit" colorScheme="blue" size="lg">
                  Save Changes
                </Button>
              </VStack>
            </form>
          </VStack>
        </Container>
  
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Delete Novel</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              Are you sure you want to delete this novel? This action cannot be undone.
            </ModalBody>
            <ModalFooter>
              <Button mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleDeleteNovel}>
                Delete
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    );
  };
  
  export default EditNovel;