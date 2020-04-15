import mongoose from 'mongoose';

const { String } = mongoose.Schema.Types;
//password sellect false will prevent password from being sent back to user
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email : {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    role: {
        type: String,
        required: true,
        default: 'user',
        enum: ["user", "admin", "root"]
    }
    
}, {
    timestamps: true
});

//If the model is instantiatd then use that instead
export default mongoose.models.User || mongoose.model("User", UserSchema);