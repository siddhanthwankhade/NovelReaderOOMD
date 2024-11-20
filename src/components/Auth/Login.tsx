import { FormControl, FormLabel, Input, Button, VStack, useToast, FormErrorMessage } from '@chakra-ui/react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const toast = useToast();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Email is required'),
      password: Yup.string().required('Password is required'),
    }),
    onSubmit: (values) => {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find((u: any) => u.email === values.email);

      if (user && user.password === values.password) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        toast({
          title: 'Login successful',
          status: 'success',
          duration: 2000,
        });
        navigate('/home');
      } else {
        toast({
          title: 'Invalid credentials',
          description: 'Please check your email and password',
          status: 'error',
          duration: 3000,
        });
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <VStack spacing={4}>
        <FormControl isInvalid={formik.touched.email && !!formik.errors.email}>
          <FormLabel>Email</FormLabel>
          <Input
            id="email"
            name="email"
            type="email"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
          />
          <FormErrorMessage>{formik.errors.email}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={formik.touched.password && !!formik.errors.password}>
          <FormLabel>Password</FormLabel>
          <Input
            id="password"
            name="password"
            type="password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
          />
          <FormErrorMessage>{formik.errors.password}</FormErrorMessage>
        </FormControl>

        <Button
          width="100%"
          colorScheme="blue"
          type="submit"
          isLoading={formik.isSubmitting}
        >
          Login
        </Button>
      </VStack>
    </form>
  );
};

export default Login;