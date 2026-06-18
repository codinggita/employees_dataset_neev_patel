import React from 'react';
import { Box, Typography, Link as MuiLink } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form } from 'formik';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import registerSchema from '../features/auth/registerSchema';
import BubbleChartIcon from '@mui/icons-material/BubbleChart';

export default function RegisterPage() {
  const navigate = useNavigate();

  const handleFormSubmit = (values, { setSubmitting }) => {
    console.log('Register form submitted:', values);
    // Connection to Redux registerUser thunk will be integrated in Commit 4.
    setSubmitting(false);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        bgcolor: 'background.default',
        px: 2,
        py: 4,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4 }}>
        <Box
          sx={{
            bgcolor: 'primary.main',
            borderRadius: '12px',
            width: 40,
            height: 40,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
          }}
        >
          <BubbleChartIcon fontSize="medium" />
        </Box>
        <Typography variant="h4" fontWeight={800} color="primary.main">
          EmpSphere
        </Typography>
      </Box>

      <Card
        title="Create Account"
        sx={{
          width: '100%',
          maxWidth: 400,
          boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.08)',
        }}
      >
        <Formik
          initialValues={{ name: '', email: '', password: '', confirmPassword: '' }}
          validationSchema={registerSchema}
          onSubmit={handleFormSubmit}
        >
          {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
            <Form noValidate>
              <Input
                label="Full Name"
                name="name"
                type="text"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.name && Boolean(errors.name)}
                helperText={touched.name && errors.name}
              />
              <Input
                label="Email Address"
                name="email"
                type="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.email && Boolean(errors.email)}
                helperText={touched.email && errors.email}
              />
              <Input
                label="Password"
                name="password"
                type="password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.password && Boolean(errors.password)}
                helperText={touched.password && errors.password}
              />
              <Input
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={values.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.confirmPassword && Boolean(errors.confirmPassword)}
                helperText={touched.confirmPassword && errors.confirmPassword}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                loading={isSubmitting}
                sx={{ mt: 1 }}
              >
                Sign Up
              </Button>
            </Form>
          )}
        </Formik>

        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Already have an account?{' '}
            <MuiLink component={Link} to="/login" color="primary" fontWeight={600} sx={{ textDecoration: 'none' }}>
              Sign In
            </MuiLink>
          </Typography>
        </Box>
      </Card>
    </Box>
  );
}
