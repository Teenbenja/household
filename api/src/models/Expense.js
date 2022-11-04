const mongoose = require("mongoose")

const ExpenseSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            require: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        category: {
            type: [
                { 
                  type: String, 
                  enum: ["吃饭", "超市", "衣", "家居", "车", "小孩", "化妆品", "出行/娱乐", "其它"] 
                }
            ],
            required: true
        },
        createdBy: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true,
        toObject: {
            transform: (_doc, expense) => {
                expense.id = expense._id
                delete expense._id
                delete expense.__v
                return expense
            }
        }
    }
)

const Expense = mongoose.model("Expense", ExpenseSchema)
module.exports = Expense