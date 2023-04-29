const homeRouter = require('./home.route');
const accountRouter = require('./account.route');
const movieRouter = require('./movie.route')

function routes(app) {

    app.use('/', homeRouter);
    app.use('/account', accountRouter);
    app.use('/movie', movieRouter)
}

module.exports = routes;