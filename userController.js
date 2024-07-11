const { generateToken } = require('./authMiddleware');
const User = require('./user');
const bcrypt = require('bcryptjs');
const Organisation = require('./organisation');
const { v4: uuidv4 } = require('uuid');

// Helper function to capitalize the first letter of an email
function capitalizeEmail(email) {
    return email.charAt(0).toUpperCase() + email.slice(1);
}

// Helper function to capitalize the first letter of each word in a string
function capitalizeEachWord(str) {
    return str
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}
// Function to register new users
const registerUser = async (req, res) => {
    const { firstname, lastname, email, password, phone } = req.body;

    try {
        const emailExists = await User.findOne({ email });
        if (emailExists) {
            return res.status(409).json({ message: `${email} already exists` });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            firstname: capitalizeEachWord(firstname),
            lastname: capitalizeEachWord(lastname),
            email: capitalizeEmail(email),
            password: hashedPassword,
            phone
        });

        const savedUser = await newUser.save();

        const newOrganisation = new Organisation({
            user: savedUser._id,
            orgId: uuidv4(),
            name: `${firstname}'s Organisation`,
            description: '',
        });

        await newOrganisation.save();

        const token = generateToken(newUser._id);

        return res.status(201).json({
            status: 'success',
            message: 'Registration successful',
            data: {
                accessToken: token,
                user: {
                    userId: newUser._id,
                    firstName: newUser.firstname,
                    lastName: newUser.lastname,
                    email: newUser.email,
                    phone: newUser.phone,
                },
            },
        });
    } catch (error) {
        console.error("Error registering user:", error);
        return res.status(400).json({ status: "sucess", message: "Registration unsuccessful" });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "Email does not exist" });
        }
        const comparePassword = await bcrypt.compare(password, user.password);
        if (!comparePassword) {
            return res.status(402).json({ message: "Incorrect password" });
        }
        const token = generateToken(user._id);
        req.session.userId = (user._id).toString();
        req.session.token = token;

        await req.session.save();
        return res.status(200).json({ status: "sucess", message: "Registration successful", data: { accessToken: token, user: { userId: user._id, user } } });
    } catch (err) {
        console.log(err)
        return res.status(401).json({ status: "sucess", message: "Registration unsuccessful" });
    }
}


module.exports = { loginUser, registerUser }