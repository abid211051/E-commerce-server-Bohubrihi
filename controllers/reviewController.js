const { Review } = require('../models/reviews')

module.exports.createReview = async (req, res) => {
    try {
        const newreview = new Review({
            prodid: req.body.prodid,
            name: req.body.name,
            ratings: parseInt(req.body.ratings),
            feedback: req.body.feedback
        })
        await newreview.save();
        return res.status(201).send(newreview)
    } catch (error) {
        console.log(error.message);
        return res.status(500).send(error.message);
    }
}

module.exports.getReviewbyId = async (req, res) => {
    const prod_id = req.params.id;
    try {
        const allreview = await Review.find({ prodid: prod_id })
        return res.status(201).send(allreview);
    } catch (error) {
        console.log(error.message);
        return res.status(500).send(error.message);
    }
}