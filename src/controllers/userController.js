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
          console.log('error in userController.login', error.message);
          res.status(500).send();
      }
    }
  },
  async store(req, res) {
    try {
      const user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      })
      res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
      switch (error.message) {
        case 'null value in column "name" violates not-null constraint':
          res.status(422).json({ message: `Can't create a user without a name` });
          break
        case 'null value in column "email" violates not-null constraint':
          res.status(422).json({ message: `Can't create a user without an email` });
          break
        case 'null value in column "hash_password" violates not-null constraint':
          res.status(422).json({ message: `Can't create a user without a password` });
          break
        default:
          console.log('error in userController.store', error.message);
          res.status(500).send();
      }
    }
  }
};