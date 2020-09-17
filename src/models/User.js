const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.VIRTUAL,
    hash_password: DataTypes.STRING,
  },
  {
    hooks: {
      beforeSave: async user => {
        if (user.password) {
          user.hash_password = await bcrypt.hash(user.password, 8);
        }
      },
    }
  });

  User.prototype.checkPassword = function(password) {
    return bcrypt.compare(password, this.hash_password);
  };

  return User;
};