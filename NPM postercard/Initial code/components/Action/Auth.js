import { Avatar, Button, Container, Grid, Grow, Paper, Typography } from '@material-ui/core'
import useStyles from './AuthStyle'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import Input from './Input'
import { useState } from 'react'
import { GoogleLogin } from 'react-google-login'
import Icon from './Icon'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { signin, signup } from '../../actions/auth'

const Auth = () => {
  const initialValue = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  }
  const classes = useStyles()
  const dispatch = useDispatch()
  const [showPassword, setShowPassword] = useState(false)
  const [isSignup, setIsSignup] = useState(false)
  const [formData, setFormData] = useState(initialValue)
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    if(isSignup){
      dispatch(signup(formData, navigate))
    } else{
      dispatch(signin(formData, navigate))
    }
  }

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value})
  }

  const handleShowPassword = () => setShowPassword(!showPassword)

  const switchMode = () => {
    setIsSignup(!isSignup)
    if(showPassword) handleShowPassword()
  }

  const googleSuccess = async (res) => {
    const result = res?.profileObj;
    const token = res?.tokenId;

    try {
      dispatch({
        type: 'AUTH',
        data: {
          result,
          token
        }
      })
      navigate('/')
    } catch (error) {
      console.log(error);
    }
  }

  const googleFailure = (error) => {
    console.log("Google Sign In Was Unsuccessful. Try Again Later");
    console.log(error);
  }

  return (
    <Grow in>
      <Container component="main" maxWidth="xs">
        <Paper className={classes.paper} elevation={3}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography variant='h5'>{isSignup? 'Sign Up' : "Sign In"}</Typography>
          <form className={classes.form} onSubmit={handleSubmit}>
            <Grid container spacing={2}>
                {isSignup && (
                    <>
                      <Input name='firstName' label="First Name" handleChange={handleChange} autoFocus half/>
                      <Input name='lastName' label="Last Name" handleChange={handleChange} half/>
                    </>
                )}
                <Input name="email" label="Email Address" handleChange={handleChange} type="email" autoFocus={!isSignup} />
                <Input name="password" label="Password" handleChange={handleChange} type={showPassword? "text" : "password"} handleShowPassword={handleShowPassword} />
                {isSignup && <Input name="confirmPassword" label="Repeat Password" handleChange={handleChange} type={showPassword? "text" : "password"} handleShowPassword={handleShowPassword}/>}
            </Grid>
            <Button type="submit" fullWidth variant='contained' color="primary" className={classes.submit}>
              {isSignup? 'Sign Up' : 'Sign In'}
            </Button>
            <GoogleLogin 
                clientId='432246367488-qjc0g4pd7vnhck7nu3bq858dagkl1mhc.apps.googleusercontent.com'
                render={(renderProps) => (
                  <Button 
                    className={classes.googleButton} 
                    color="primary" 
                    fullWidth 
                    onClick={renderProps.onClick} 
                    disabled={renderProps.disabled} 
                    startIcon={<Icon />} 
                    variant='contained'
                  >
                    Google Sign In
                  </Button>
                )}
                onSuccess={googleSuccess}
                onFailure={googleFailure}
                cookiePolicy="single_host_origin"
            />
            <Grid container justifyContent='flex-end'>
              <Grid item>
                <Button onClick={switchMode}>
                  {isSignup? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Container>
    </Grow>
  )
}

export default Auth