const Todolist = require('../models/todolist');

exports.getList = async (req, res) => {
	if ((req.session.login === 'undefined') || !req.session.login) {
		res.status(401).json({});
		return;
	}
	
	Todolist.findAll({
		where: { todoOwner: req.session.idx }
	}).then(result => {
		res.json(result);
	});
}

exports.createItem = async (req, res) => {
	if ((req.session.login === 'undefined') || !req.session.login) {
		res.status(401).json({});
		return;
	}

	Todolist.create({
		todoOwner: req.session.idx,
		todoname: req.body.name,
		is_checked: false,
	}).then(result => {
		res.json(result);
	});
}

exports.updateItem = async (req, res) => {
	if ((req.session.login === 'undefined') || !req.session.login) {
		res.status(401).json({});
		return;
	}

	Todolist.update({
		is_checked: req.body.is_checked,
	}, {
		where: { 
			id: req.body.todo_id,
			todoOwner: req.session.idx,
		}
	}).then(result => {
		res.json(result);
	});
}

exports.deleteItem = async (req, res) => {
	if ((req.session.login === 'undefined') || !req.session.login) {
		res.status(401).json({});
		return;
	}

	Todolist.destroy({
		where: {
			todoOwner: req.session.idx,
			id: req.body.todo_id,
		}
	}).then(result => {
		res.json({});
	});
}
