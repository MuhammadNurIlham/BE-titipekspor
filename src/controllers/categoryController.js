const { category, memberCategory } = require('../../models');

exports.getCategories = async (req, res) => {
    try {
        const data = await category.findAll({
            attributes: {
                exclude: ["createdAt", "updatedAt"],
            },
        });

        res.send({
            status: "Success",
            message: "Get All data Category Success",
            data,
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: "Failed",
            message: "Server Error",
        });
    }
};

exports.getCategory = async (req, res) => {
    try {
        const {id} = req.params;
        const data = await category.findOne({
            where: {
                id,
            },
            attributes: {
                exclude: ["createdAt", "updatedAt"],
            },
        });

        res.send({
            status: "Success",
            message: `Get data category with ID: ${id} finished`,
            data,
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: "Failed",
            message: "Server Error",
        });
    }
};

exports.addCategory = async (req, res) => {
    try {
        const newCategory = await category.create(req.body);

        res.send({
            status: "Success",
            message: "Add Data Category Finished",
            data: {
                id: newCategory.id,
                name: newCategory.name,
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

exports.updateCategory = async (req, res) => {
    try {

        const {id} = req.params;

        const newCategory = await category.update(req.body, {
            where: {
                id,
            },
        });

        res.send({
            status: "Success",
            message: `Update Data Category with ID: ${id} Success`,
            data: {
                id: newCategory.id,
                name: newCategory.name,
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

exports.deleteCategory = async (req, res) => {
    try {

        const {id} = req.params;

        await category.destroy({
            where: {
                id,
            },
        });

        await memberCategory.destroy({
            where: {
                idCategory: id,
            },
        });

        res.send({
            status: "Success",
            message: `Delete Data Category with ID: ${id} Finished`,
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: "Failed",
            message: "Server Error",
        });
    }
};