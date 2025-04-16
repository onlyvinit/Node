const mongoose = require('mongoose')

const recipeSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    ingredients: [{
        type: String,
        required: true,
    }],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin', 
        required: true,
      },
})

const Recipe  = mongoose.model ("recipe" , recipeSchema)

module.exports = Recipe;