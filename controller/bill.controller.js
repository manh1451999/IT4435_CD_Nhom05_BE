var billModel = require('../models/bill.model')
let userModel = require('../models/user.model');
let controller = {}

module.exports = controller

controller.index = async (req, res) => {
	try {
		let bill = await billModel.find().populate('service').populate("user", "point");
		res.json(bill);
	}
	catch (err) {
		console.log(err)
		res.status(500).json({ error: err })
	}
}

controller.billUser = async (req, res) => {
	try {
		let billUser = await billModel.find({ user: req.user.id }).populate('service');
		res.json(billUser);
	}
	catch (err) {
		console.log(err)
		res.status(500).json({ error: err })
	}
}

controller.newBill = async (req, res) => {
	try {

		let checkBill = await billModel.findOne({ userName: req.body.userName, phone: req.body.phone, bookHour: req.body.bookHour, bookDate: req.body.bookDate })
		if (checkBill) res.status(400).send({ message: "Người dùng đã đặt dịch vụ trước đó" })
		else {

			let newBill = await billModel.create({
				user: req.user.id, userName: req.body.userName, phone: req.body.phone, usedTime: req.body.usedTime,
				totalMoney: req.body.totalMoney,
				service: req.body.service,
				bookDate: req.body.bookDate,
				bookHour: req.body.bookHour

			});
			res.json(newBill);
		}

	}
	catch (err) {
		console.log(err)
		res.status(500).json({ error: err })
	}
}

controller.deleteBill = async (req, res) => {
	try {
		let id = req.params.id;
		let deleteBill = await billModel.remove({ _id: id })
		res.json(deleteBill);
	}
	catch (err) {
		console.log(err)
		res.status(500).json({ error: err })
	}
}
controller.updateStatus = async (req, res) => {
	try {
		let id = req.params.id || req.body.id;
		let status = req.body.status

		let updateStatus = await billModel.findOneAndUpdate({ _id: id }, { status: status }, { new: true }).populate('service').exec();
		if (status == 3) {
			if (req.user.id) {
				let checkUser = await userModel.findOne({ _id: req.user.id })
				checkUser.point += parseInt(updateStatus.totalMoney) / 1000
				checkUser.save()
			}
		}
		res.json(updateStatus);
	}
	catch (err) {
		console.log(err)
		res.status(500).json({ error: err })
	}
}

controller.checkSlot = async (req, res) => {
	try {
		let date = req.body.date;
		let listBill = await billModel.find({ bookDate: date })

		const bookHour = [
			{
				time: '7:30 am - 9:30 am'
			},
			{
				time: '10:00 am - 12:00 pm'
			},
			{
				time: '1:00 pm - 3:00 pm'
			},
			{
				time: '3:30 pm - 5:30 pm'
			},
			{
				time: '6:30 pm - 8:30 pm'
			}
		]
		let slots = bookHour.map((hour) => {
			let count = 5
			listBill.forEach((bill) => {
				if (bill.bookHour == hour.time) count--
			})
			return count
		})
		res.json(slots);
	}

	catch (err) {
		// console.log(err)
		res.status(500).json({ error: err })
	}
}