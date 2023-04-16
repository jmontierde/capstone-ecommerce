// It will catch all error in required products
module.exports = func => (req, res, next) =>
    Promise.resolve(func(req, res, next))
            .catch(next)