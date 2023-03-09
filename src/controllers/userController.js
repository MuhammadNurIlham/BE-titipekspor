const { user, profile } = require('../../models');

exports.addUser = async (req, res) => {
    try {

        const data = req.body;
        const newUser = await user.create(data);

        res.send({
            status: "Success",
            message: "Add User Success",
            dataUser: {
                newUser
            },
        });

    } catch (error) {
        console.log(error);
        res.send({
            status: "Failed",
            message: "Server Error"
        });
    }
};

exports.getUsers = async (req, res) => {
    try {

        const users = await user.findAll({
            include: {
                model: profile,
                as: "profile",
                attributes: {
                    exclude: ["createdAt", "updateAt"],
                }
            },
            attributes: {
                exclude: ["createdAt", "updateAt"]
            }
        });

        res.send({
            status: "Success",
            message: "Get All User Finished",
            data: {
                users
            },
        });

    } catch (error) {
        console.log(error);
        res.send({
            status: "Failed",
            message: "Server Error",
        });
    }
};

exports.getUser = async (req, res) => {
    try {

        const { id } = req.params;

        const data = await user.findOne({
            where: {
                id,
            },
            include: {
                model: profile,
                as: "profile",
                attributes: {
                    exclude: ["createdAt", "updateAt"],
                }
            },
            attributes: {
                exclude: ["createdAt", "updateAt"]
            }
        });

        res.send({
            status: "Success",
            message: `Find User with ID: ${id} Success`,
            data: {
                user: data,
            },
        });

    } catch (error) {
        console.log(error);
        res.send({
            status: "Failed",
            message: "Server Error",
        });
    }
};

exports.updateUser = async(req, res) => {
    try {

        const {id} = req.params;

        await user.update(req.body, {
            where: {
                id,
            },
        });

        res.send({
            status: "Success",
            message: `Update user with ID: ${id} Success`,
            data: req.body,
        });
        
    } catch (error) {
        console.log(error);
        res.send({
            status: "Failed",
            message: "Server Error",
        });
    }
};

exports.deleteUser = async(req, res) => {
    try {

        const {id} = req.params;

        await user.destroy({
            where: {
                id,
            },
        });

        res.send({
            status: "Success",
            message: `Delete user with ID: ${id} Success`,
        });
        
    } catch (error) {
        console.log(error);
        res.send({
            status: "Failed",
            message: "Server Error",
        });
    }
};