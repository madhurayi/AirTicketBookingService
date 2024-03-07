const axios = require('axios');

const { BookingRepository } = require('../repository/index');
const {FLIGHT_SERVICE_PATH} = require('../config/serverConfig');
const { ServiceError } = require('../utils/errors');

class BookingService{
    constructor(){
        this.bookingRepository= new BookingRepository();
    }
    async createBooking(data){
       try{
        const flightid= data.flightId;
        let getFlightRequestURL= `${FLIGHT_SERVICE_PATH}/api/v1/flights/${flightid}`;
        console.log(getFlightRequestURL);
        const response= await axios.get(getFlightRequestURL);
        const flightdata=response.data.data;
        let priceOfTheFlight=flightdata.price;
        if(data.noOfSeats>flightdata.totalSeats){
            throw new ServiceError(
                "Something went wrong in the booking process",
                "Insufficient Seats");
        }
        const totalCost = priceOfTheFlight * data.noOfSeats;
        const bookingPayload = {...data , totalCost};
        const booking = await this.bookingRepository.create(bookingPayload);
        
        const updateFlightRequestURL= `${FLIGHT_SERVICE_PATH}/api/v1/flights/${booking.flightId}`;
        await axios.patch(updateFlightRequestURL,{totalSeats:flightdata.totalSeats-booking.noOfSeats});
        const finalBooking=await this.bookingRepository.update(booking.id,{status:"Booked"});
        return finalBooking;
        //return flight.data.data;
       }catch(error){
            if(error.name ==  'RepositoryError' || 
            error.name == 'ValidationError'){
                throw error;
            }
             throw new ServiceError();
       }

    }
}

module.exports= BookingService;