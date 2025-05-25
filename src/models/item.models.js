import mongoose, { Schema } from "mongoose";

const itemschema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    baseprice: {
        type: Number,
        required: true
    },
    imageUrl: {
        type: String,
        default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    starttime:{
        type: Date,
    },
    endtime:{
        type: Date,
    },
    isactive: {
        type: Boolean,
        default: true
    }
}, {timestamps: true});

export default Item = mongoose.model('Item', itemschema);