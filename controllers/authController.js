const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Handle error fun
const handleErrors = (err) => {
    console.log(err.message, err.code);  // err.message come from user and pass validation;

    let errors = { email: "", password: "" }

    // incorrect email (for login)
    if (err.message === "incorrect email") {
        errors.email = "that email is not registered"
    }
    // incorrect pass (for pass)
    if (err.message === "incorrect password") {
        errors.password = "password is incorrect"
    }

    // duplicate error code i.e register with same email
    if (err.code === 11000) {
        errors.email = "that email is already registered";
        return errors;
    }
    // Validation error
    if (err.message.includes("user validation failed")) {
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message;
        });
    }
    return errors;
}

// generate token using jwt
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
    return jwt.sign({ id }, "amit singh", {
        expiresIn: maxAge
    });
}

module.exports.signup_get = (req, res) => {
    res.render("signup");

}

module.exports.login_get = (req, res) => {
    res.render("login");
}

module.exports.signup_post = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.create({ email, password });
        // call token fun
        const token = createToken(user._id);
        res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 })
        res.status(200).json({ user: user._id });
    } catch (error) {

        const errors = handleErrors(error);
        console.log(errors);
        res.status(400).json({ errors });
    }

}



module.exports.login_post = async (req, res) => {
    // console.log(req.body);
    const { email, password } = req.body;

    try {
        const user = await User.login(email, password); // static login method created in User.js

        // create jwt
        const token = createToken(user._id);
        res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 })
        res.status(200).json({ user: user._id });
    } catch (err) {

        const errors = handleErrors(err);

        res.status(400).json({ errors });
    }
}

// logout 
module.exports.logout_get = (req, res) => {
    res.cookie("jwt", "", { maxAge: 1 });
    res.redirect("/");
}