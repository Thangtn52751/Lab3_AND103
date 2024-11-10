const mongoose = require('mongoose');

const SanphamSchema = mongoose.Schema({

    ten: {
        type: String,
        required: true
    },

    gia: {
        type: Number,
        required: true
    },

    soluong: {
        type: Number,
        required: true
    },

    tonkho: {
        type: Boolean
    },

});

const SanphamModel = mongoose.model('user', SanphamSchema);

module.exports = SanphamModel;