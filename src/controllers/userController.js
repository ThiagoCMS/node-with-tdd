const { User } = require('../models');

module.exports = {
  async login(req, res) {
    const user = await User.findOne({
      where: {
        email: req.body.email,
        password: req.body.password,
      },
      attributes: ['id', 'name', 'email']
    });
    return res.status(200).json(user);
  }
}