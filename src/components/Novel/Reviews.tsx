import {
    VStack,
    HStack,
    Box,
    Text,
    Avatar,
    Button,
    Textarea,
    useToast,
    Divider,
    IconButton,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    FormControl,
    FormLabel,
    Select,
  } from '@chakra-ui/react';
  import { StarIcon, MoreVerticalIcon } from '@chakra-ui/icons';
  import { useState, useEffect } from 'react';
  import { Review, User } from '../../types';
  import { formatDistanceToNow } from 'date-fns';
  
  interface ReviewsProps {
    novelId: number;
    reviews: Review[];
    onReviewUpdate: (reviews: Review[]) => void;
  }
  
  const Reviews = ({ novelId, reviews, onReviewUpdate }: ReviewsProps) => {
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [newReview, setNewReview] = useState({
      rating: 5,
      comment: '',
    });
  
    useEffect(() => {
      const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
      setCurrentUser(user);
    }, []);
  
    const handleSubmitReview = () => {
      if (!currentUser) return;
  
      const review: Review = {
        id: Date.now(),
        userId: currentUser.id,
        username: currentUser.username,
        rating: newReview.rating,
        comment: newReview.comment,
        createdAt: new Date().toISOString(),
        likes: [],
      };
  
      const updatedReviews = [...reviews, review];
      onReviewUpdate(updatedReviews);
  
      // Update novels in localStorage
      const novels = JSON.parse(localStorage.getItem('novels') || '[]');
      const novelIndex = novels.findIndex((n: any) => n.id === novelId);
      if (novelIndex !== -1) {
        novels[novelIndex].reviews = updatedReviews;
        novels[novelIndex].rating = calculateAverageRating(updatedReviews);
        localStorage.setItem('novels', JSON.stringify(novels));
      }
  
      toast({
        title: 'Review submitted successfully',
        status: 'success',
        duration: 3000,
      });
  
      setNewReview({ rating: 5, comment: '' });
      onClose();
    };
  
    const handleDeleteReview = (reviewId: number) => {
      const updatedReviews = reviews.filter(review => review.id !== reviewId);
      onReviewUpdate(updatedReviews);
  
      // Update novels in localStorage
      const novels = JSON.parse(localStorage.getItem('novels') || '[]');
      const novelIndex = novels.findIndex((n: any) => n.id === novelId);
      if (novelIndex !== -1) {
        novels[novelIndex].reviews = updatedReviews;
        novels[novelIndex].rating = calculateAverageRating(updatedReviews);
        localStorage.setItem('novels', JSON.stringify(novels));
      }
  
      toast({
        title: 'Review deleted',
        status: 'info',
        duration: 3000,
      });
    };
  
    const handleLikeReview = (reviewId: number) => {
      if (!currentUser) return;
  
      const updatedReviews = reviews.map(review => {
        if (review.id === reviewId) {
          const likes = review.likes.includes(currentUser.id)
            ? review.likes.filter(id => id !== currentUser.id)
            : [...review.likes, currentUser.id];
          return { ...review, likes };
        }
        return review;
      });
  
      onReviewUpdate(updatedReviews);
  
      // Update novels in localStorage
      const novels = JSON.parse(localStorage.getItem('novels') || '[]');
      const novelIndex = novels.findIndex((n: any) => n.id === novelId);
      if (novelIndex !== -1) {
        novels[novelIndex].reviews = updatedReviews;
        localStorage.setItem('novels', JSON.stringify(novels));
      }
    };
  
    const calculateAverageRating = (reviews: Review[]) => {
      if (reviews.length === 0) return 0;
      const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
      return sum / reviews.length;
    };
  
    return (
      <VStack spacing={6} align="stretch">
        <HStack justify="space-between">
          <Text fontSize="xl" fontWeight="bold">
            Reviews ({reviews.length})
          </Text>
          <Button colorScheme="blue" onClick={onOpen}>
            Write Review
          </Button>
        </HStack>
  
        {reviews.map((review) => (
          <Box key={review.id} p={4} borderWidth="1px" borderRadius="lg">
            <HStack justify="space-between" mb={2}>
              <HStack>
                <Avatar size="sm" name={review.username} />
                <VStack align="start" spacing={0}>
                  <Text fontWeight="bold">{review.username}</Text>
                  <Text fontSize="sm" color="gray.500">
                    {formatDistanceToNow(new Date(review.createdAt))} ago
                  </Text>
                </VStack>
              </HStack>
              {currentUser?.id === review.userId && (
                <Menu>
                  <MenuButton
                    as={IconButton}
                    icon={<MoreVerticalIcon />}
                    variant="ghost"
                    size="sm"
                  />
                  <MenuList>
                    <MenuItem onClick={() => handleDeleteReview(review.id)}>
                      Delete Review
                    </MenuItem>
                  </MenuList>
                </Menu>
              )}
            </HStack>
  
            <HStack mb={2}>
              {Array(5)
                .fill('')
                .map((_, i) => (
                  <StarIcon
                    key={i}
                    color={i < review.rating ? 'yellow.400' : 'gray.300'}
                  />
                ))}
            </HStack>
  
            <Text>{review.comment}</Text>
  
            <HStack mt={4}>
              <Button
                size="sm"
                variant="ghost"
                leftIcon={<StarIcon />}
                onClick={() => handleLikeReview(review.id)}
                color={
                  currentUser && review.likes.includes(currentUser.id)
                    ? 'blue.500'
                    : undefined
                }
              >
                {review.likes.length} Likes
              </Button>
            </HStack>
          </Box>
        ))}
  
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Write a Review</ModalHeader>
            <ModalBody>
              <VStack spacing={4}>
                <FormControl>
                  <FormLabel>Rating</FormLabel>
                  <Select
                    value={newReview.rating}
                    onChange={(e) =>
                      setNewReview({ ...newReview, rating: Number(e.target.value) })
                    }
                  >
                    <option value="5">5 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="2">2 Stars</option>
                    <option value="1">1 Star</option>
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel>Comment</FormLabel>
                  <Textarea
                    value={newReview.comment}
                    onChange={(e) =>
                      setNewReview({ ...newReview, comment: e.target.value })
                    }
                    placeholder="Write your review here..."
                    rows={5}
                  />
                </FormControl>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="blue" onClick={handleSubmitReview}>
                Submit Review
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </VStack>
    );
  };
  
  export default Reviews;