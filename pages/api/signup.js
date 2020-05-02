import connectDb from '../../utils/connectDb';
import User from '../../models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import isEmail from 'validator/lib/isEmail';
import isLength from 'validator/lib/isLength';
import Cart from '../../models/Cart';

connectDb();

export default async (req, res) => {
    const { name, email, password } = req.body
    try{
        if (!isLength(name, { min: 3, max: 15})){
            return res.status(422).send("Name must be 3-15 characters long");
        } else if (!isLength( password, { min: 10 })){
            return res.status(422).send("Password must be at least 10 characters long");
        } else if (!isEmail(email)) {
            return res.status(422).send("Email must be valid");
        }

        //1) check if they already exist
        const user = await User.findOne( { email })
        if (user) {
            return res.status(422).send(`User already exists with email ${email}`);
        }
        //2)hash password
        const hash = await bcrypt.hash(password, 10);
        //3) create user
        const newUser = await new User({
            name,
            email,
            password: hash
        }).save();
        await new Cart({ user: newUser._id }).save();


        //4) create token for new user
        const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
            expiresIn: '4h'
        });
        res.status(201).json(token);
        //5) send back token
    }
    catch(error){
        console.error(error);
        res.status(500).send("Error signing up user, please try again later.");
    }
}