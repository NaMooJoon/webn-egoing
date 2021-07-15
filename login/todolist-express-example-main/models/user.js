const { Model, DataTypes } = require('sequelize');

class User extends Model {
	static init(sequelize) {
		return super.init(
			{
				name: DataTypes.TEXT,
				password: DataTypes.TEXT,
			},
			{
				tableName: 'User',
				modelName: 'user',
				sequelize,
			},
		);
	}

	static associate(models) {
		this.hasMany(models.todolist, {
			foreignKey: 'todoOwner'
		});
	}
}

module.exports = User
