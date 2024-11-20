import {
    Box,
    VStack,
    HStack,
    Button,
    IconButton,
    Text,
    useToast,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    List,
    ListItem,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Drawer,
    DrawerBody,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    FormControl,
    FormLabel,
    Input,
    Textarea,
    Badge,
  } from '@chakra-ui/react';
  import {
    DragHandleIcon,
    EditIcon,
    DeleteIcon,
    ViewIcon,
    ChevronDownIcon,
  } from '@chakra-ui/icons';
  import { useState, useRef, useEffect } from 'react';
  import { DragDropContext, Droppable, Draggable, DroppableProps } from 'react-beautiful-dnd';
  
  interface Chapter {
    id: number;
    title: string;
    content: string;
    isDraft?: boolean;
    createdAt: string;
    updatedAt?: string;
  }
  
  interface ChapterManagementProps {
    novelId: number;
    chapters: Chapter[];
    onChaptersUpdate: (chapters: Chapter[]) => void;
  }
  
  const ChapterManagement = ({ novelId, chapters, onChaptersUpdate }: ChapterManagementProps) => {
    const toast = useToast();
    const { isOpen: isPreviewOpen, onOpen: onPreviewOpen, onClose: onPreviewClose } = useDisclosure();
    const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
    const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
    const [editedChapter, setEditedChapter] = useState<Chapter | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const cancelRef = useRef(null);
  
    const handleDragEnd = (result: any) => {
      if (!result.destination) return;
  
      const items = Array.from(chapters);
      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedItem);
  
      // Update chapter numbers
      const updatedChapters = items.map((chapter, index) => ({
        ...chapter,
        id: index + 1,
      }));
  
      onChaptersUpdate(updatedChapters);
      setIsDragging(false);
    };
  
    const handleEdit = (chapter: Chapter) => {
      setEditedChapter({ ...chapter });
      onEditOpen();
    };
  
    const handlePreview = (chapter: Chapter) => {
      setSelectedChapter(chapter);
      onPreviewOpen();
    };
  
    const handleSaveEdit = () => {
      if (!editedChapter) return;
  
      const updatedChapters = chapters.map(chapter =>
        chapter.id === editedChapter.id
          ? {
              ...editedChapter,
              updatedAt: new Date().toISOString(),
              isDraft: editedChapter.isDraft,
            }
          : chapter
      );
  
      onChaptersUpdate(updatedChapters);
      toast({
        title: editedChapter.isDraft ? 'Draft saved' : 'Chapter updated',
        status: 'success',
        duration: 2000,
      });
      onEditClose();
    };
  
    const handleDelete = (chapterId: number) => {
      if (window.confirm('Are you sure you want to delete this chapter?')) {
        const updatedChapters = chapters
          .filter(chapter => chapter.id !== chapterId)
          .map((chapter, index) => ({
            ...chapter,
            id: index + 1,
          }));
  
        onChaptersUpdate(updatedChapters);
        toast({
          title: 'Chapter deleted',
          status: 'info',
          duration: 2000,
        });
      }
    };
  
    const handlePublishDraft = (chapter: Chapter) => {
      const updatedChapters = chapters.map(ch =>
        ch.id === chapter.id
          ? { ...ch, isDraft: false, updatedAt: new Date().toISOString() }
          : ch
      );
  
      onChaptersUpdate(updatedChapters);
      toast({
        title: 'Chapter published',
        status: 'success',
        duration: 2000,
      });
    };
  
    // Create a custom droppable component with default props
    const StrictModeDroppable = ({ children, droppableId }: DroppableProps) => {
      const [enabled, setEnabled] = useState(false);
      
      useEffect(() => {
        const animation = requestAnimationFrame(() => setEnabled(true));
        return () => {
          cancelAnimationFrame(animation);
          setEnabled(false);
        };
      }, []);

      if (!enabled) {
        return null;
      }

      return (
        <Droppable droppableId={droppableId}>
          {(provided) => children(provided)}
        </Droppable>
      );
    };
  
    return (
      <Box>
        <DragDropContext onDragEnd={handleDragEnd} onDragStart={() => setIsDragging(true)}>
          <StrictModeDroppable droppableId="chapters">
            {(provided) => (
              <List
                {...provided.droppableProps}
                ref={provided.innerRef}
                spacing={3}
              >
                {chapters.map((chapter, index) => (
                  <Draggable
                    key={chapter.id}
                    draggableId={chapter.id.toString()}
                    index={index}
                  >
                    {(provided) => (
                      <ListItem
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        bg="white"
                        p={4}
                        borderRadius="md"
                        boxShadow="sm"
                      >
                        <HStack justify="space-between">
                          <HStack>
                            <IconButton
                              {...provided.dragHandleProps}
                              icon={<DragHandleIcon />}
                              aria-label="Reorder"
                              variant="ghost"
                              cursor="grab"
                            />
                            <Text>
                              Chapter {chapter.id}: {chapter.title}
                              {chapter.isDraft && (
                                <Badge ml={2} colorScheme="yellow">
                                  Draft
                                </Badge>
                              )}
                            </Text>
                          </HStack>
                          <HStack>
                            <IconButton
                              icon={<ViewIcon />}
                              aria-label="Preview"
                              onClick={() => handlePreview(chapter)}
                            />
                            <IconButton
                              icon={<EditIcon />}
                              aria-label="Edit"
                              onClick={() => handleEdit(chapter)}
                            />
                            <Menu>
                              <MenuButton
                                as={IconButton}
                                icon={<ChevronDownIcon />}
                                variant="ghost"
                              />
                              <MenuList>
                                {chapter.isDraft && (
                                  <MenuItem
                                    onClick={() => handlePublishDraft(chapter)}
                                  >
                                    Publish
                                  </MenuItem>
                                )}
                                <MenuItem
                                  icon={<DeleteIcon />}
                                  onClick={() => handleDelete(chapter.id)}
                                  color="red.500"
                                >
                                  Delete
                                </MenuItem>
                              </MenuList>
                            </Menu>
                          </HStack>
                        </HStack>
                      </ListItem>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </List>
            )}
          </StrictModeDroppable>
        </DragDropContext>
  
        {/* Preview Modal */}
        <Modal isOpen={isPreviewOpen} onClose={onPreviewClose} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              Chapter {selectedChapter?.id}: {selectedChapter?.title}
            </ModalHeader>
            <ModalBody>
              <Text whiteSpace="pre-wrap">{selectedChapter?.content}</Text>
            </ModalBody>
            <ModalFooter>
              <Button onClick={onPreviewClose}>Close</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
  
        {/* Edit Drawer */}
        <Drawer
          isOpen={isEditOpen}
          placement="right"
          onClose={onEditClose}
          size="lg"
        >
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Edit Chapter</DrawerHeader>
  
            <DrawerBody>
              <VStack spacing={4}>
                <FormControl>
                  <FormLabel>Title</FormLabel>
                  <Input
                    value={editedChapter?.title || ''}
                    onChange={(e) =>
                      setEditedChapter(prev =>
                        prev ? { ...prev, title: e.target.value } : null
                      )
                    }
                  />
                </FormControl>
  
                <FormControl>
                  <FormLabel>Content</FormLabel>
                  <Textarea
                    value={editedChapter?.content || ''}
                    onChange={(e) =>
                      setEditedChapter(prev =>
                        prev ? { ...prev, content: e.target.value } : null
                      )
                    }
                    rows={20}
                  />
                </FormControl>
  
                <HStack spacing={4} alignSelf="flex-end">
                  <Button
                    onClick={() => {
                      if (editedChapter) {
                        setEditedChapter({ ...editedChapter, isDraft: true });
                        handleSaveEdit();
                      }
                    }}
                  >
                    Save as Draft
                  </Button>
                  <Button
                    colorScheme="blue"
                    onClick={() => {
                      if (editedChapter) {
                        setEditedChapter({ ...editedChapter, isDraft: false });
                        handleSaveEdit();
                      }
                    }}
                  >
                    Publish
                  </Button>
                </HStack>
              </VStack>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </Box>
    );
  };
  
  export default ChapterManagement;