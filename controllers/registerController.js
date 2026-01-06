const getRegister = async (req, res) => {
  res.render('register', { oldData: {}, errors: {} });
};

export { getRegister };
