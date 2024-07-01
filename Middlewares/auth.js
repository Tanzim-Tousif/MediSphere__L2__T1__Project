const userauthenticate = require('../Database/auth')

const auth = async(req,res) =>{
    const { username, password } = req.body;
  
    const result = await userauthenticate(username);
    if (result.rows.length === 1) {
        const user = {
            username: result.rows[0].NAME,
            id:result.rows[0].ID
        };
        if (user) {
            console.log('Authenticated user:', user);
            req.session.user = user;
            console.log(req.session.user.username);
            console.log(req.session.user.id);
            // Redirect to the landing page after successful login
            res.redirect('/landing/dashboard');
        } else {
            res.send('Invalid username or password');
        }
        
    } else {
        console.log('return null');
    }

}
module.exports = auth;