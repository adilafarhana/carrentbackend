const usermodel = require('../models/admin'); 
const { generateHashedPassword } = require("../helper/");
require('../config/db')

const signup = async () => {
    try {
        let input = {
            "name": "admin", 
            "phone": "987664677775", 
            "email": "admin@123.com",
            "password": "admin", 
            "gender": "male", 
            isAdmin: true 
        }

        let hashedpswd = await generateHashedPassword(input.password);
        input.password = hashedpswd; 

        let user = new usermodel(input); 
        await user.save(); 
        console.log('Admin data uploaded');
    } catch (error) {
        console.error("Error during signup", error);
    }
};

signup();
