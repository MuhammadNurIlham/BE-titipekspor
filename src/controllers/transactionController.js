const { user, transaction, membership } = require('../../models');

exports.getTransactions = async (req, res) => {
    try {

        const idBuyer = req.user.id;
        let data = await transaction.findAll({
            where: {
                idBuyer,
            },
            attributes: {
                exclude: ["updatedAt"],
            },
            include: [
                {
                    model: membership,
                    as: "membership",
                    attributes: {
                        exclude: ["createdAt", "updatedAt", "idUser"],
                    },
                },
                {
                    model: user,
                    as: "buyer",
                    attributes: {
                        exclude: ["createdAt", "updatedAt"],
                    },
                },
                {
                    model: user,
                    as: "seller",
                    attributes: {
                        exclude: ["createdAt", "updatedAt"],
                    },
                },
            ]
        });

        data = JSON.parse(JSON.stringify(data));

        data = data.map((item) => {
            return {
                ...item,
                membership: {
                    ...item.membership,
                    image: process.env.PATH_FILE + item.product.image,
                },
            };
        });

        res.send({
            status: "Success",
            data,
        });

    } catch (error) {
        console.log(error);
        res.send({
            status: "Failed",
            message: "Server Error",
        });
    }
};

exports.addTransaction = async (req, res) => {
    try {

        let data = req.body;

        data = {
            ...data,
            idBuyer: req.user.id,
        };

        await transaction.create(data);

        res.send({
            status: "Success",
            message: "Add transaction finished",
        });

    } catch (error) {
        console.log(error);
        res.send({
            status: "Failed",
            message: "Server Error",
        });
    }
};