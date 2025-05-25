import { apierror } from "../utils/apierror.js";
import { apiresponse } from "../utils/apiresponse.js";
import { asynchandler } from "../utils/asynchandler.js";
import Auctionrequest from './../models/auctionrequest.models';

const getallrequestsbyme = asynchandler(async(req ,res)=>{
    const user = req.user;
    if (!user) {
        throw new apierror(400, "User not authenticated");
    }
    const auctionreqbyme = await Auctionrequest.aggregate([
        {
            $match:{
                requestedby: user._id,
            }
        },
        {
            $lookup:{
                from: "items",
                localField: "item",
                foreignField: "_id",
                as: "requesteditemdetails",
                pipeline:[
                    {
                        $project: {
                            name: 1,
                            description: 1,
                            imageUrl: 1,
                            baseprice: 1,
                            isactive: 1,
                        }
                    }
                ]
            }
        },
        {
            $addFields:{
                requesteditemdetails:{
                    $first: "$requesteditemdetails"
                }   
            }
        }
    ])
    if (!auctionreqbyme || auctionreqbyme.length === 0) {
        return res
        .status(404)
        .json(
            new apiresponse(404, [], "No requests found")
        );
    }
    return res
    .status(200)
    .json(
        new apiresponse(200, auctionreqbyme, "Requests retrieved successfully")
    );
})
