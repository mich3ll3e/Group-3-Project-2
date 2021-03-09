// Creating our Message model
module.exports = function(sequelize, DataTypes) {
  // eslint-disable-next-line no-var
  var Message = sequelize.define("Message", {
    // The username cannot be null
    body: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1]
      }
    }
  });

  Message.associate = function(models) {
    Message.belongsTo(models.User, {
      foreignKey: {
        allowNull: false
      }
    });
  };

  return Message;
};
