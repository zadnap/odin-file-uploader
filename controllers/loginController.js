const getLogin = async (req, res) => {
  res.render('login', { oldData: {}, errors: {} });
};

export { getLogin };
