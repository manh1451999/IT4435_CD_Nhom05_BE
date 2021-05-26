var orderModel = require('../models/order.model')
var categoryModel = require('../models/category.model')
var userModel = require('../models/user.model')

let controller = {}

controller.getListOrder = async (req, res) => {
    try {
        let listOrder = await orderModel.find().populate('user', 'email');
        res.json(listOrder);
    }
    catch (err) {
        res.status(500).json({ error: err })
    }
}

controller.getOrderByUser = async (req, res) => {
    try {

        let id = req.user.id;
        let order = await orderModel.find({ user: id }).populate('user', 'email');
        res.json(order);

    }
    catch (err) {
        console.log(err)
        res.status(500).json({ error: err })
    }
}

controller.upadteStatus = async (req, res) => {
    try {

        let status = req.body.status;
        let orderId = req.body._id;


        let orderUpdate = await orderModel.findOneAndUpdate({ _id: orderId }, { status: status }, { new: true });


        if (status == 2) {
            if (req.user.id) {
                let checkUser = await userModel.findOne({ _id: req.user.id })
                checkUser.point += parseInt(orderUpdate.totalMoney) / 1000
                checkUser.save()
            }
        }

        res.json(orderUpdate)




    }
    catch (err) {
        console.log(err)
        res.status(500).json({ error: err })
    }
}


controller.deleteOrderById = async (req, res) => {

    try {
        let id = req.params.id
        let orderDelete = await orderModel.findByIdAndDelete(id)
        res.json(orderDelete);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: err })
    }
}


module.exports = controller