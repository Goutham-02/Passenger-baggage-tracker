import mongoose, { Schema } from 'mongoose';

const baggageSchema = new Schema(
    {
        passengerId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        flightId: {
            type: Schema.Types.ObjectId,
            ref: 'Plane',
            required: true
        },
        baggageID: {
            type: String,
            required: true,
            unique: true
        },
        weight: {
            type: Number,
            required: true
        },
        status: {
            type: String,
            enum: ['checked-in', 'in-transit', 'delivered', 'delayed', 'lost'],
            default: 'checked-in',
            required: true
        },
        location: {
            type: String,
        }
    },
    { timestamps: true }
)

export const Baggage = mongoose.model('Baggage', baggageSchema);