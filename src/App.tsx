import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
import NovelPage from './pages/NovelPage';
import UploadStory from './components/User/UploadStory';
import ChapterReader from './components/Novel/ChapterReader';
import Profile from './components/User/Profile';
import AddChapter from './components/Novel/AddChapter';
import LibraryPage from './pages/LibraryPage';
import HistoryPage from './pages/HistoryPage';
import { sampleNovels } from './data/sampleData';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem('currentUser');
  return isAuthenticated ? <>{children}</> : <Navigate to="/" />;
};

function initializeLocalStorage() {
  // Only initialize if novels don't exist in localStorage
  if (!localStorage.getItem('novels')) {
    localStorage.setItem('novels', JSON.stringify(sampleNovels));
  }
}

function App() {
  return (
    <ChakraProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AuthPage />} />
          <Route
            path="/home"
            element={
              <PrivateRoute>
                <HomePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/novel/:id"
            element={
              <PrivateRoute>
                <NovelPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/novel/:id/chapter/:chapterId"
            element={
              <PrivateRoute>
                <ChapterReader />
              </PrivateRoute>
            }
          />
          <Route
            path="/upload"
            element={
              <PrivateRoute>
                <UploadStory />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route
            path="/novel/:id/add-chapter"
            element={
              <PrivateRoute>
                <AddChapter />
              </PrivateRoute>
            }
          />
          <Route
            path="/library"
            element={
              <PrivateRoute>
                <LibraryPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/history"
            element={
              <PrivateRoute>
                <HistoryPage />
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;