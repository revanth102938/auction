import mongoose, { Schema } from "mongoose";

const auctionrequestschema = new Schema({
    item:{
        type : mongoose.Schema.Types.ObjectId,
        ref: 'Item',
        required: true
    },
    requestedby:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status : {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending'
    }
},{timestamps: true});

export default Auctionrequest = mongoose.model('AuctionRequest', auctionrequestschema);