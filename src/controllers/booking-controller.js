const {StatusCodes} = require('http-status-codes');
const { BookingService }= require('../services/index');

const bookingService = new BookingService();

const create= async (req,res)=>{
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

module.exports={
    create

}