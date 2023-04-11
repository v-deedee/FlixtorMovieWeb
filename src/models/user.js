
module.exports = (sequelize, DataTypes) => {
    return sequelize.define('user', {
        id: {
            allowNull: false,
            type: DataTypes.INTEGER(3),
            primaryKey: true,
            autoIncrement: true
          },
        user_name: {
            allowNull: false,
            type: DataTypes.STRING(20),
          },
        email: {
            allowNull: false,
            type: DataTypes.STRING(30),
          },
        password: {
            allowNull: false,
            type: DataTypes.STRING(30),
          },
        role: {
            allowNull: false,
            type: DataTypes.INTEGER(1),
          },
        ban: {
            allowNull: false,
            type: DataTypes.INTEGER(1),
            default: 0,
          },
        create_at: {
            allowNull: false,
            type: DataTypes.DATE,
          },
        update_at: {
            allowNull: true,
            type: DataTypes.DATE,
            defaultValue: null, 
          },
    }, {
        tableName: 'user',
    });
};