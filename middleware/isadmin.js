module.exports = (req, res, next) => {
    if (req.user.role !== 'admin') return res.status(400).send('Not an admin');
    next()
}