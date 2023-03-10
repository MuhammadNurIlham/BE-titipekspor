const { membership, user, category, memberCategory } = require('../../models');

exports.getMemberships = async (req, res) => {
    try {

        const data = await membership.findAll({
            include: [
                {
                    model: user,
                    as: "user",
                    attributes: {
                        exclude: ["createdAt", "updatedAt"]
                    }
                },
                {
                    model: category,
                    as: "categories",
                    through: {
                        model: memberCategory,
                        as: "bridge",
                        attributes: [],
                    },
                    attributes: {
                        exclude: ["createdAt", "updatedAt"],
                    },
                },
            ],
            attributes: {
                exclude: ["createdAt", "updatedAt"],
            },
        });

        data = JSON.parse(JSON.stringify(data));

        data = data.map((item) => {
            return {
                ...item,
                // image: process.env.PATH_FILE + item.image,
            };
        });

        res.send({
            status: "Success",
            message: "Get All Membership Finished",
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

exports.getMembership = async (req, res) => {
    try {

        const { id } = req.params;
        const data = await membership.findOne({
            where: {
                id,
            },
            include: [
                {
                    model: user,
                    as: "user",
                    attributes: {
                        exclude: ["createdAt", "updatedAt"]
                    }
                },
                {
                    model: category,
                    as: "categories",
                    through: {
                        model: memberCategory,
                        as: "bridge",
                        attributes: [],
                    },
                    attributes: {
                        exclude: ["createdAt", "updatedAt"],
                    },
                },
            ],
            attributes: {
                exclude: ["createdAt", "updatedAt"],
            },
        });

        data = JSON.parse(JSON.stringify(data));

        data = {
            ...data,
            // image: process.env.PATH_FILE + data.image,
        }

        res.send({
            status: "Success",
            message: `Get Membership with ID: ${id} Finished`,
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

exports.addMembership = async (req, res) => {
    try {

        const { categoryId } = req.body;
        categoryId = categoryId.split(",");

        const data = {
            name: req.body.name,
            desc: req.body.desc,
            price: req.body.price,
            image: req.file.filename,
            idUser: req.user.id,
        };

        let newMembership = await membership.create(data);

        const memberCategoryData = categoryId.map((item) => {
            return { idMembership: newMembership.id, idCategory: parseInt(item) };
        });

        await memberCategory.bulkCreate(memberCategoryData);

        let membershipData = await membership.findOne({
            where: {
                id: newMembership.id,
            },
            include: [
                {
                    model: user,
                    as: "user",
                    attributes: {
                        exclude: ["createdAt", "updatedAt"]
                    }
                },
                {
                    model: category,
                    as: "categories",
                    through: {
                        model: memberCategory,
                        as: "bridge",
                        attributes: [],
                    },
                    attributes: {
                        exclude: ["createdAt", "updatedAt"],
                    },
                },
            ],
            attributes: {
                exclude: ["createdAt", "updatedAt"],
            },
        });

        membershipData = JSON.parse(JSON.stringify(membershipData));

        res.send({
            status: "Success",
            data: {
                ...membershipData,
                // image: process.env.PATH_FILE + membershipData.image,
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

exports.updateMembership = async (req, res) => {
    try {

        const {id} = req.params;
        let {categoryId} = req.body;
        categoryId = await categoryId.split(",");

        const data = {
            name: req?.body?.name,
            desc: req?.body?.desc,
            price: req?.body?.price,
            image: req?.file?.filename,
            idUser: req?.user?.id,
        };

        await memberCategory.destroy({
            where: {
                idMembership: id,
            },
        });

        let memberCategoryData = [];
        if (categoryId != 0 && categoryId[0] != "") {
            memberCategoryData = categoryId.map((item) => {
                return {
                    idMembership: parseInt(id),
                    idCategory: parseInt(item)
                };
            });
        }

        if (memberCategoryData.length != 0) {
            await memberCategory.bulkCreate(memberCategoryData);
        }

        await membership.update(data, {
            where: {
                id,
            },
        });

        res.send({
            status: "Success",
            data: {
                id,
                data,
                memberCategoryData,
                image: req?.file?.filename,
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

exports.deleteMembership = async (req, res) => {
    try {

        const {id} = req.params;

        await membership.destroy({
            where :{
                id,
            },
        });

        await memberCategory.destroy({
            where: {
                idMembership: id,
            },
        });

        res.send({
            status: "Success",
            message: `Delete Membership with ID: ${id} Finished`,
        });
        
    } catch (error) {
        console.log(error);
        res.send({
            status: "Failed",
            message: "Server Error",
        });
    }
};