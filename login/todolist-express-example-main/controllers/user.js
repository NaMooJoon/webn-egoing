const User = require('../models/user');

exports.getUser = async (req, res) => {
	let responseData = { 'login': false };

	if (req.session.login) {
		User.findOne({
			where: { id: req.session.idx },
		}).then((user) => {
			console.log(user);
			user_data = {
				'id': user.dataValues.id,
				'name': user.dataValues.name,
			}

			responseData['login'] = true;
			responseData['user'] = user_data;
			res.json(responseData);
		});
	}
	else
		res.json(responseData);
	
}

exports.loginUser = async (req, res) => {
	let responseData;

	User.findOne({
		where: { name: req.body.id }
	}).then((user) => {
		if (user == null || user.dataValues.password != req.body.pw) {
			responseData = { 'login': false };
			return res.json(responseData);
		}
		else {
			responseData = { 'login': true, 'user_id': user.dataValues.id };
			req.session.login = true;
			req.session.idx = user.dataValues.id;
			req.session.save(() => {
				return res.json(responseData);
			});
		}
	});
}

exports.logoutUser = async (req, res) => {
	req.session.destroy(() => {});
	res.redirect('/user');
}

exports.signUp = async (req, res) => {
	id = req.body.id;
	pw = req.body.pw;

	if (id == null || pw == null) {
		res.json({});
		return;
	}

	User.create({
		name: req.body.id,
		password: req.body.pw
	}).then(result => {
		res.json(result);
	});
}
