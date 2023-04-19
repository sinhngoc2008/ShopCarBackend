require('dotenv').config();
const { hashPassword } = require('../helper/hash');
const UserModel = require('../model/UserModel');
const { connectToDB } = require('../utils/db');
