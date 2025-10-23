const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Category name is required'],
        unique: true,
        trim: true,
        max_length: [50, 'Category name must be less than 40 characters']
    },
    description: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

// Create text index for search optimization
categorySchema.index({ name: 'text', description: 'text' });

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;