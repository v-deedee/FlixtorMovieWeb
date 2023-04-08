const accountRouter = require('./account.route');

function routes(app) {

    app.use('/account', accountRouter);
}

module.exports = routes;