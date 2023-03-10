const { profile } = require('../../models');

exports.getProfile = async (req, res) => {
    try {

        const idUser = req.user.id;
        let data = await profile.findOne({
            where: {
                idUser,
            },
            attributes: {
                exclude: ["createdAt", "updatedAt", "idUser"],
            },
        });

        data = JSON.parse(JSON.stringify(data));

        data = {
            ...data,
            // image: process.env.PATH_FILE + data.image,
        };

        res.send({
            status: "Success",
            message: `Get Profile with ID: ${id} Success`,
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