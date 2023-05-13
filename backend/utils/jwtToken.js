const sendToken = (user, statusCode, res) => {
    // Create a JWT token
    const token = user.getJwtToken();




    // localStorage.setItem('token', token);
    // Send the token to the client
    res.status(statusCode).json({ success: true, token, user });
  };
  
  module.exports = sendToken;