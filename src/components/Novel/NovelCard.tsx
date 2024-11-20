import { Box, Image, Heading, Text, VStack, HStack, Icon, Badge } from '@chakra-ui/react';
import { FaHeart, FaBookOpen } from 'react-icons/fa';
import { Link } from 'react-router-dom';

interface NovelCardProps {
  novel: {
    id: number;
    title: string;
    cover: string;
    author: string;
    summary: string;
    chapters: Array<{
      id: number;
      title: string;
      content: string;
    }>;
  };
}

const NovelCard = ({ novel }: NovelCardProps) => {
  return (
    <Link to={`/novel/${novel.id}`}>
      <Box
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
        bg="white"
        transition="transform 0.2s, box-shadow 0.2s"
        _hover={{
          transform: 'translateY(-4px)',
          boxShadow: 'lg',
        }}
      >
        <Image
          src={novel.cover}
          alt={novel.title}
          height="250px"
          width="100%"
          objectFit="cover"
          fallbackSrc="https://via.placeholder.com/300x400?text=No+Cover"
        />
        
        <VStack p={4} align="start" spacing={2}>
          <Heading size="md" noOfLines={1}>
            {novel.title}
          </Heading>
          
          <Text fontSize="sm" color="gray.500">
            by {novel.author}
          </Text>
          
          <Text noOfLines={2} fontSize="sm" color="gray.600">
            {novel.summary}
          </Text>
          
          <HStack spacing={4} pt={2}>
            <HStack spacing={1}>
              <Icon as={FaBookOpen} color="blue.500" />
              <Text fontSize="sm">{novel.chapters.length} chapters</Text>
            </HStack>
            <Badge colorScheme="green">Active</Badge>
          </HStack>
        </VStack>
      </Box>
    </Link>
  );
};

export default NovelCard;