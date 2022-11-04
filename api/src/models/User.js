const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            require: true,
        },
        hashedPassword: {
            type: String,
            required: true,
        }
    },
    {
        timestamps: true,
        toObject: {
            transform: (_doc, user) => {
                delete user.hashedPassword
                delete user.__v
                return user
            }
        }
    }
)

const User = mongoose.model("User", UserSchema)
module.exports = User