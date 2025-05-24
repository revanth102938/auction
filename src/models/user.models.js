import { mongoose, Schema } from 'mongoose';
import { jwt } from 'jsonwebtoken';
import { bcrypt } from 'bcrypt';

const userschema = new Schema(
    {
        username :{
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        fullname: {
            type: String,
            required: true,
            trim: true,
            index: true
        },
        avatar: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: [true, "Password is required"]
        },
        refreshtoken: {
            type: String
        }
    },
    {timestamps: true}
)

userschema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hashSync(this.password, 10);
        next();
    } else {
        return next();
    }
});

userschema.methods.ispasswordcorrect = async function (password){
    return await bcrypt.compare(password, this.password);
}

userschema.methods.createaccesstoken = function (){
    return jwt.sign(
        { id: this._id, username: this.username, email: this.email },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    )
}

userschema.methods.createrefreshtoken = function () {
    return jwt.sign(
        { id: this._id },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    )
}

const User = mongoose.model('User', userschema);
export default User;