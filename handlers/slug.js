const slugs = new Set(['home', 'login'])



module.exports = function (app, express) {
    app.set('view engine', 'ejs')
    app.use(express.urlencoded({ extended: false }))
    app.use(express.static(__dirname + '/public'))
    app.use(express.static(__dirname + '/node_modules/jquery/dist'));
    app.use(express.static(__dirname + '/node_modules/bootstrap/dist'));
    //app.use(express.static(__dirname + '/node_modules/particles-js'));
    app.use(express.json())
    app.get('/', function (req, res) {
        res.render("home")
    });
    app.get('/:slug', function (req, res) {
        res.render(slugs.has(req.params.slug) ? req.params.slug : '404')
    });
    app.post('/', (req, res) => {
        console.log(req.body)
    })
}