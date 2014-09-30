var staticPath = __dirname + '/static';
var conf = {
    projectPath: __dirname,//папка проекта. абсолютный путь. как правило, не надо его менять.
    staticPath: staticPath,//путь до статики
    viewsPath: staticPath + '/views',//путь до вьюх
    routesPath: __dirname + '/routes',//путь дл роутов
    viewCache: false,
    port: 3000,
    mongoConnect: 'mongodb://10.46.1.210:27017/mksite',
    session: {
        secret: "Fj549t=_s-4g-dfh34uyHdfy54&3450hfgjslfsgfgnpsggpoag0JFj54834thK)=",
        redis: {
            host: "localhost",
            port: 6379
        }
    }
};

module.exports = conf;