import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    userStatus: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        maxlength: 72 // bcrypt hashes are longer; limit plaintext length if desired
    },
    // verifyOtp: {
    //     type: String, 
    //     default: ''
    // },
    // verifyOtpExpireAt: {
    //     type: Number,
    //     default: 0
    // },
    // isAccountVerified: {
    //     type: Boolean, 
    //     default: false
    // },
    resetOtp: {
        type: String, 
        default: ''
    },
    resetOtpExpireAt: {
        type: Number, 
        default: 0
    }

    ,
    profileImageUrl: { type: String, default: '' },
    bio: { type: String, default: '' }

}, { timestamps: true });

// Normalize/validate certain fields
userSchema.path('email').options.trim = true;
userSchema.path('email').options.lowercase = true;
userSchema.path('email').options.match = [/^\S+@\S+\.\S+$/, 'Invalid email'];

const userModel = mongoose.models.User || mongoose.model('User', userSchema);

export default userModel;