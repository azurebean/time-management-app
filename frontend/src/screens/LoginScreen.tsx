import React, { useContext, useEffect } from 'react'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import CssBaseline from '@material-ui/core/CssBaseline'
import TextField from '@material-ui/core/TextField'
import Link from '@material-ui/core/Link'
import Grid from '@material-ui/core/Grid'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import { useQueryGenerator } from '../hooks'
import { AuthContext } from '../contexts'
import { api } from '../helpers'
import { useFormik } from 'formik'
import { ErrorMessage } from '../components'
import * as Yup from 'yup'

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid Email Address').required('Required'),
  password: Yup.string().required('Required'),
})

export const LoginScreen = () => {
  let isUnmounted = false
  const classes = useStyles()
  const { saveTokensAndProfile } = useContext(AuthContext)
  const { loading, data, error, request: asyncLogin } = useQueryGenerator(api.login)

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      detail: '',
    },
    validationSchema: LoginSchema,
    onSubmit: (values) => {
      asyncLogin({ localData: values, isCancelled: isUnmounted })
    },
  })

  useEffect(() => {
    if (error && error.response && [400, 401].includes(error.response.status)) {
      formik.setErrors(error.response.data)
    } else {
      formik.setErrors({ detail: 'There is an error with your request' })
    }
  }, [error])

  useEffect(() => {
    if (data) {
      saveTokensAndProfile({ ...data })
    }
  }, [data])

  useEffect(() => {
    return () => {
      isUnmounted = true
    }
  }, [])

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Login
        </Typography>
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
          />
          <ErrorMessage message={formik.touched.email && formik.errors.email} />

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
          />
          <ErrorMessage message={formik.touched.password && formik.errors.password} />
          <ErrorMessage message={formik.touched.detail && formik.errors.detail} />

          <Button
            data-cy="login_button"
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            disabled={loading}
          >
            Login
          </Button>
          <Grid container>
            <Grid item>
              <Link href="/signup" variant="body2">
                Don't have an account? Sign Up
              </Link>
            </Grid>
          </Grid>
        </form>
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
