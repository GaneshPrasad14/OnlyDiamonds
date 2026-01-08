import mongoose from 'mongoose';

const WinnerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a winner name']
    },
    district: {
        type: String,
        required: [true, 'Please add a district']
    },
    prize: {
        type: String, // '5g' or '1g'
        enum: ['5g', '1g'],
        default: '1g'
    },
    position: {
        type: Number, // 1 for 5g, 2-5 for 1g
        required: true
    }
});

const DailyWinnerSchema = new mongoose.Schema({
    date: {
        type: Date,
        default: Date.now,
        required: true
    },
    winners: [WinnerSchema], // Array of 5 winners
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('DailyWinner', DailyWinnerSchema);
