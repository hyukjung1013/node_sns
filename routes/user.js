const express = require('express');
const router = express.Router();
const { User } = require('../models');

router.post('/:id/follow', async (req, res) => {
    try {
        const user = await User.findOne( { where: { id: req.user.id } } );
        await user.addFollowing(parseInt(req.params.id, 10));
        res.send('success');
    } catch (err) {
        console.error(err);
        next(err);
    }
});

module.exports = router; 