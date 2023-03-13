const Joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const { user } = require('../../models');

exports.register = async (req, res) => {

    // our validation schema
    const schema = Joi.object({
        name: Joi.string().min(3).required(),
        email: Joi.string().email().min(6).required(),
        password: Joi.string().min(6).required(),
        phone: Joi.string().min(11).max(13).required()
    });

    // do validation and get error object from schema.validate
    const { error } = schema.validate(req.body);

    // if error exist send validation error message
    if (error)
        return res.status(400).send({
            error: {
                message: error.details[0].message,
            },
        });


    try {
        // Check if email is already registered
        const isAlready = await user.findOne({
            where: {
                email: req.body.email,
            },
        });

        if (isAlready) {
            return res.status(409).send({
                message: `Account with email: ${req.body.email} is Already`,
            });
        }


        // generate salt (random value) with 10 rounds
        const salt = await bcrypt.genSalt(10);

        // hash password from request with salt
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        const newUser = await user.create({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            phone: req.body.phone
        });

        // generate token
        // const token = jwt.sign({ id: user.id }, process.env.TOKEN_KEY);

        res.status(200).send({
            status: "Success",
            message: "Register Success",
            data: {
                name: newUser.name,
                email: newUser.email,
                // token,
            },
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: "Failed",
            message: "Server Error"
        });
    }
};

exports.login = async (req, res) => {

    // our validation schema
    const schema = Joi.object({
        email: Joi.string().email().min(6).required(),
        password: Joi.string().min(6).required(),
    });

    // do validation and get error object from schema.validate
    const { error } = schema.validate(req.body);

    // if error exist send validation error message
    if (error)
        return res.status(400).send({
            error: {
                message: error.details[0].message,
            },
        });

    try {
        const userExist = await user.findOne({
            where: {
                email: req.body.email,
            },
            attributes: {
                exclude: ["createdAt", "updatedAt"],
            },
        });

        // compare password between entered from client and from database
        const isValid = await bcrypt.compare(req.body.password, userExist.password);

        // check if not valid then return response with status 400 (bad request)
        if (!isValid) {
            return res.status(400).send({
                status: "Failed",
                message: "Credential is Invalid",
            });
        }

        const payload = { id: userExist.id }
        // generate token
        const token = jwt.sign(payload, process.env.SECRET_KEY);

        res.status(200).send({
            status: "Success",
            message: "Login Success",
            data: {
                id: userExist.id,
                name: userExist.name,
                email: userExist.email,
                token,
            },
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: "Failed",
            message: "Server Error",
        });
    }
};

exports.checkAuth = async (req, res) => {
    try {

        const { id } = req.user.id;

        const dataUser = await user.findOne({
            where: {
                id,
            },
            attributes: {
                exclude: ["createdAt", "updatedAt", "passowrd"],
            },
        });

        if (!dataUser) {
            return res.status(404).send({
                status: "Failed",
                message: "User Not Found",
            });
        };

        res.send({
            status: "Success",
            message: "Authorization",
            data: {
                user: {
                    id: dataUser.id,
                    name: dataUser.name,
                    email: dataUser.email,
                },
            },
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: "Failed",
            message: "Server Error",
        });
    }
};