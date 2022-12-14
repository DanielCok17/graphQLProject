const bcrypt = require('bcryptjs');

const Event = require('../../models/event');
const User = require('../../models/user');
const Booking = require('../../models/booking');
const booking = require('../../models/booking');

const singleEvent = async eventId => {
    try{
        const event = await Event.findById(eventId);
        return {...event._doc,
            creator: user.bind(this, event.creator)
        }
    }
    catch(err){
        throw err;
    }
}

const events = async eventIds => {
    try {
    const events = await Event.find({_id: {$in: eventIds}})
        events.map(event => {
            return {
                ...event._doc,
                _id: event.id,
                date: new Date(event._doc.date).toISOString(),
                creator: user.bind(this, event.creator)
            };        
    });
    return events;
    } 
    catch(err) {
        throw err;
    }
}

const user = async userId => {
    try{
    const user =  await User.findById(userId)
            return {
            ...user._doc,
            _id: user.id,
            createdEvents: events.bind(this, user._doc.createdEvents)
        };    
    }
    catch(err) {
        throw err;
    }
}

module.exports = {
    events: () => {
        return Event.find()
        .then(results => {
            return results.map( event => {
                return {...event._doc, _id: event._doc._id.toString(),
                    date: new Date(event._doc.date).toISOString(),
                    creator: user.bind(this, event._doc.creator)
                };
            } )
        }).catch(err => {
            throw err;
        });
    },

    bookings: async () => {
        try{
            const bookings = await Booking.find();
            return bookings.map(booking => {
                return { ...booking._doc,
                    user: user.bind(this, booking._doc.user),
                    event: singleEvent.bind(this, booking._doc.event),
                    createdAt: new Date(booking._doc.createdAt).toISOString(),
                    updatedAt: new Date(booking._doc.updatedAt).toISOString()}
            })
        }
        catch(err){
            throw err;
        }
    },

    createEvent: (args) => {
        const obj = new Event({
            title: args.eventInputt.title,
            description: args.eventInputt.description,
            price: args.eventInputt.price,
            date: new Date(args.eventInputt.date),
            creator: "630129922036b0e336d34e87"
        });
        
        let createdEvent;

        return obj
        .save()
        .then(result  => {
            createdEvent = {...result._doc,
                date: new Date(result._doc.date).toISOString(),
                creator: user.bind(this, result._doc.creator) };
            return User.findById('630129922036b0e336d34e87')
         })
         .then(user => {
            user.createdEvents.push(obj);
            return user.save();
         })
         .then(result => {
            return createdEvent;
         })
         .catch(err => {
            console.log(err);
            throw err;
        });
    },       
    
    createUser: args => {
        return User.findOne({email: args.userInputt.email}).then(user => {
            if(user) {
                throw new Error('User exists already!')                    
            }
            return bcrypt.hash(args.userInputt.password, 12);
        }).then(hashPassword => {
            const usr = new User({
                email: args.userInputt.email,
                password: hashPassword
            });
            return usr.save();
        })
        .then(result => {
            return {...result._doc };
        })
        .catch(err => {
            console.log(err);
            throw(err);
        }) ; 
    },

    bookEvent: async args  => {
        const fetchEvent = await Event.findOne({_id: args.eventId});
        try{
            const booking = new Booking({
                user: '630129922036b0e336d34e87',
                event: fetchEvent
            });
            const result = await booking.save();
            return { ...result._doc,                        
                user: user.bind(this, booking._doc.user),
                event: singleEvent.bind(this, booking._doc.event),        
                createdAt: new Date(result._doc.createdAt).toISOString(),
                updatedAt: new Date(result._doc.updatedAt).toISOString()    
            }
        }
        catch(err){
            throw err;
        }
    },

    cancelBooking: async args => {
        try{
            const booking = await Booking.findById({_id: args.bookingId}).populate('event');
            const event =  {
                ...booking.event._doc,
                creator: user.bind(this, booking.event._doc.creator)
            }
            await Booking.deleteOne({_id: args.bookingId});
            return event;
        }
        catch(err){
            throw err;
        }
    }
};