const { Model, DataTypes } = require('sequelize');

class Todolist extends Model {
	static init(sequelize) {
		return super.init(
			{
				todoname: DataTypes.TEXT,
				is_checked: DataTypes.BOOLEAN,
			},
			{
				tableName: 'Todolist',
				modelName: 'todolist',
				sequelize,
			},
		);
	}

	static associate(models) {
		this.belongsTo(models.user, {
			foreignKey: 'todoOwner'
		});
	}
}

module.exports = Todolist;
