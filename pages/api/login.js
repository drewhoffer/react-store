import connectDb from '../../utils/connectDb';
import User from '../../models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


connectDb();


export default async (req, res) => {
    const { email, password } = req.body;

    try{
        const user = await User.findOne( { email }).select('+password');

        if (!user){
            return res.status(404).send("Username or password is incorrect");
        }
        //check iif password is correct
        const passwordsMatch = await bcrypt.compare(password, user.password);
        if (passwordsMatch){
            const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET, {
                expiresIn: '4h'
            });
            res.status(200).json(token);
        }
        else {
            res.status(401).send("Username or password is incorrect");
        }
    }catch(error) {
        console.error(error);
        res.status(500).send("Error logging in user");
    }
}