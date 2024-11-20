import { FormControl, FormLabel, Input, Button, VStack, useToast, FormErrorMessage } from '@chakra-ui/react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const Register = () => {
  const toast = useToast();

  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .min(3, 'Must be at least 3 characters')
        .required('Username is required'),
      email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
      password: Yup.string()
        .min(6, 'Must be at least 6 characters')
        .required('Password is required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords must match')
        .required('Please confirm your password'),
    }),
    onSubmit: (values, { resetForm }) => {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      
      if (users.some((user: any) => user.email === values.email)) {
        toast({
          title: 'Registration failed',
          description: 'Email already exists',
          status: 'error',
          duration: 3000,
        });
        return;
      }

      const newUser = {
        id: Date.now(),
        username: values.username,
        email: values.email,
        password: values.password,
        favorites: [],
        uploads: [],
        createdAt: new Date().toISOString(),
      };

      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));

      toast({
        title: 'Registration successful',
        description: 'You can now login with your credentials',
        status: 'success',
        duration: 3000,
      });

      resetForm();
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <VStack spacing={4}>
        <FormControl isInvalid={formik.touched.username && !!formik.errors.username}>
          <FormLabel>Username</FormLabel>
          <Input
            id="username"
            name="username"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.username}
          />
          <FormErrorMessage>{formik.errors.username}</FormErrorMessage>
        </FormControl>

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

        <FormControl isInvalid={formik.touched.confirmPassword && !!formik.errors.confirmPassword}>
          <FormLabel>Confirm Password</FormLabel>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.confirmPassword}
          />
          <FormErrorMessage>{formik.errors.confirmPassword}</FormErrorMessage>
        </FormControl>

        <Button
          width="100%"
          colorScheme="blue"
          type="submit"
          isLoading={formik.isSubmitting}
        >
          Register
        </Button>
      </VStack>
    </form>
  );
};

export default Register;