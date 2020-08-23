import React, { useContext, useEffect } from 'react'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import CssBaseline from '@material-ui/core/CssBaseline'
import TextField from '@material-ui/core/TextField'
import Link from '@material-ui/core/Link'
import Grid from '@material-ui/core/Grid'
import MouseOutlined from '@material-ui/icons/MouseOutlined'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import { useQueryGenerator } from '../hooks'
import { api } from '../helpers'
import { useFormik } from 'formik'
import { ErrorMessage } from '../components'
import * as Yup from 'yup'

const SignUpSchema = Yup.object().shape({
  email: Yup.string().email('Invalid Email Address').required('Required'),
  password: Yup.string().required('Required'),
  full_name: Yup.string().required(),
})

export const SignUpScreen = () => {
  let isUnmounted = false
  const classes = useStyles()
  const { loading, data, error, request: asyncSignUp } = useQueryGenerator(api.signup)

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      full_name: '',
      detail: '',
    },
    validationSchema: SignUpSchema,
    onSubmit: async (values) => {
      await asyncSignUp({ localData: values, isCancelled: isUnmounted })
    },
  })

  useEffect(() => {
    if (error && error.response && error.response.status == 400) {
      formik.setErrors(error.response.data)
    } else {
      formik.setErrors({ detail: 'There is an error with your request' })
    }
  }, [error])

  useEffect(() => {
    return () => {
      isUnmounted = true
    }
  }, [])

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <MouseOutlined />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>

        {data ? (
          <Typography variant="body1" data-cy="success_message">
            Your account has been created. Please check your email to activate it.
          </Typography>
        ) : (
          <form className={classes.form} noValidate onSubmit={formik.handleSubmit}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              autoComplete="email"
              data-cy="email"
              id="email"
              label="Email Address"
              name="email"
              autoFocus
              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.touched.email && formik.errors.email && true}
            />
            <ErrorMessage message={formik.touched.email && formik.errors.email} />

            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              data-cy="full_name"
              label="Full name"
              id="full_name"
              name="full_name"
              value={formik.values.full_name}
              onChange={formik.handleChange}
              error={formik.touched.full_name && formik.errors.full_name && true}
            />
            <ErrorMessage message={formik.touched.full_name && formik.errors.full_name} />

            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              data-cy="password"
              label="Password"
              type="password"
              id="password"
              name="password"
              autoComplete="current-password"
              value={formik.values.password}
              onChange={formik.handleChange}
              error={formik.touched.password && formik.errors.password && true}
            />
            <ErrorMessage message={formik.touched.password && formik.errors.password} />

            <Button
              data-cy="signup_button"
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              disabled={loading}
            >
              Sign Up
            </Button>
            <Grid container>
              <Grid item>
                <Link href="/login" variant="body2">
                  Have an account? Login.
                </Link>
              </Grid>
            </Grid>
          </form>
        )}
      </div>
    </Container>
  )
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}))
