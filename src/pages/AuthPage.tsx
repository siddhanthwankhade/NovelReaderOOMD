import { useState } from 'react';
import { Box, Container, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import Login from '../components/Auth/Login';
import Register from '../components/Auth/Register';

const AuthPage = () => {
  const [tabIndex, setTabIndex] = useState(0);

  return (
    <Box minH="100vh" display="flex" alignItems="center" bg="gray.50">
      <Container maxW="xl">
        <Box p={8} bg="white" borderRadius={8} boxShadow="lg">
          <Tabs isFitted variant="enclosed" index={tabIndex} onChange={setTabIndex}>
            <TabList mb="1em">
              <Tab>Login</Tab>
              <Tab>Register</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Login />
              </TabPanel>
              <TabPanel>
                <Register />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Container>
    </Box>
  );
};

export default AuthPage;