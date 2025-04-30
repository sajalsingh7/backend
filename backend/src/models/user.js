const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv')
dotenv.config();

const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  profilePicture: {
    type: String,
    default: ''
  },
  contacts: [{
    type: Schema.Types.ObjectId,
    ref: 'Contacts'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
},{
  timestamps: true
});

userSchema.pre('save', async function(next) {
  if(this.isModified('password') || this.isNew) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }
  next();
});

userSchema.methods.comparePassword = function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;