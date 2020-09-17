const { User } = require('../models');

module.exports = {
  async login(req, res) {
    try {
      const user = await User.findOne({
        where: {
          email: req.body.email,
        },
        attributes: ['id', 'name', 'email', 'hash_password'],
      });
      if (await user.checkPassword(req.body.password)) {
        const { hash_password, ...rest_user } = user.dataValues;
        return res.status(200).json(rest_user);
      }
      return res.status(401).json({ message: 'User not found' });
    } catch (error) {
      switch (error.message) {
        case "Cannot read property 'checkPassword' of null":
          res.status(401).json({ message: 'User not found' });
          break;
        default:
          console.log('error in /login', error.message);
          res.status(500).send();
      }
    }
  },
};