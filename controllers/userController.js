
const bcrypt = require('bcrypt');
const { User } = require('../models/user');

module.exports.signUp = async (req, res) => {
    try {
        let user = await User.findOne({ email: req.body.email });
        if (user) return res.status(400).send('User already Exist');

        const hashpass = await bcrypt.hash(req.body.password, 10);
        user = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashpass
        })
        const token = user.generateJWT();
        const result = await user.save();
        return res.status(201).send({
            message: 'SignUp Successfull',
            token: token,
            user: {
                _id: result._id,
                email: result.email,
                name: result.name
            }
        })
    } catch (error) {
        console.log(error.message);
        return res.status(500).send(error.message);
    }

}

module.exports.signIn = async (req, res) => {
    try {
        let user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(404).send('User not found');

        const isvalid = await bcrypt.compare(req.body.password, user.password);
        if (!isvalid) return res.status(400).send('Incorrect Password');

        const token = user.generateJWT();
        return res.status(201).send({
            message: 'Login Successfull',
            token: token,
            user: {
                _id: user._id,
                email: user.email,
                name: user.name
            }
        })
    } catch (error) {
        console.log(error.message);
        return res.status(500).send(error.message)
    }

}
