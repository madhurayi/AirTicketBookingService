const {StatusCodes} = require('http-status-codes');
const { BookingService }= require('../services/index');

const {createChannel,publishMessage} = require('../utils/messageQueue');
const {REMAINDER_BINDING_KEY} = require('../config/serverConfig');
const bookingService = new BookingService();

class BookingController {
    
    constructor(){
    
    }

    async sendMessageToQueue(req,res){
        const channel= await createChannel();
        const data={message:"SUCCESS"};
        publishMessage(channel, REMAINDER_BINDING_KEY,JSON.stringify(data)); 
        return res.status(200).json({
            message: "successfully published the event"
        })
    }
    async create (req,res){
        try{
            console.log(req.body);
            const response= await bookingService.createBooking(req.body);
            console.log(response);
            return res.status(StatusCodes.OK).json({
                data:response,
                message: " Successfully completed booking",
                success: true,
                err:{}
            })
        }catch(error){
            return res.status(400).json({
                data:{},
                message: error.message,
                success: false,
                err:error.explanation
            })
        }
    }
}

module.exports=BookingController;