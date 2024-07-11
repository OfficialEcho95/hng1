const mongoose = require('mongoose');

const organisationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    orgId: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
});

const Organisation = mongoose.model('Organisation', organisationSchema);
module.exports = Organisation;
