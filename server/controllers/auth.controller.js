const User = require('../models/User');
createSession = () => {

};

getSession = () => {

};

deleteSession = () => {

};

createUser = (req, res) => {
    const email = req.body.email; 
    User.findOne({email: email})
        .then(userDoc => {
            if(userDoc){
                return res.status(400).json({
                    success: false,
                    error: 'Email Already Exists'
                })
            }
            const user = new User(req.body);
            user.save().then(userSession => {
                return res.status(201).json({
                    success: true,
                    user: userSession
                });
            })
            .catch(err => {
                return res.status(400).json({
                    success: false,
                    error
                });
            });
        })
        .catch(err => {
            console.error(err);
        });
};
module.exports = {
    createSession,
    getSession,
    deleteSession,
    createUser
};