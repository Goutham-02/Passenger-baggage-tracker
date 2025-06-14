import mongoose, { Schema } from 'mongoose';

const planeSchema = new Schema (
    {
        name: {
            type: String,
            required: true
        },
        from: {
            type: String,
            required: true
        },
        to: {
            type: String,
            required: true
        },
        departureTime: {
            type: Date,
            required: true
        },
        arrivalTime: {
            type: Date,
            required: true
        },
    },
    { timestamps: true }
)

export const Plane = mongoose.model('Plane', planeSchema);