const mongoose = require("mongoose");
const {isEmail} = require("validator");
const bcrypt = require("bcrypt");




const userSchema = mongoose.Schema({
    email:{
        type:String,
        require:[true,"Please enter an email"],
        unique:true, //email should be unique
        lowercase:true,
        validate:[isEmail,"Please enter valid email"]
    },
    password:{
        type:String,
        require:[true,"Please enter an password"],
        minLength:[6,"Minimum password length is 5 char"]
    }
});

// fire a fun after doc save to db
userSchema.post("save", (doc,next)=>{
    console.log("new user was created & saved", doc);
    next();
});

//#13 static method to login user
userSchema.statics.login = async function(email, password){
    const user = await this.findOne({email});
    if(user){
        const auth = await bcrypt.compare(password,user.password);
        if(auth){
            return user;
        }
        throw Error("incorrect password");
    }
    throw Error("incorrect email");
}

// fire a fun before doc save to db
userSchema.pre("save", async function(next){
    // console.log(" user about to be created & saved", this);
    // this refer to user;
    const salt =await bcrypt.genSalt();  // generate salt
    this.password =await bcrypt.hash(this.password,salt); // hash password+salt combination 
    next();
});

const User = mongoose.model("user", userSchema);

module.exports = User;