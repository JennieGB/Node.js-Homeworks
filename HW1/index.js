const http = require('http');

let visits = {};

const server = http.createServer((req, res) => {
    if (req.method === 'GET') {
        if (req.url === '/') {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html');
            res.setHeader('Content-Type', 'text/html; charset=utf-8');
            res.end(`
                <html>
                    <body>
                        <h1>Корневая страница</h1>
                        <p>Просмотров: ${visits[req.url] || 0}</p>
                        <a href="/about">Ссылка на страницу /about</a>
                    </body>
                </html>
            `);

            visits[req.url] = (visits[req.url] || 0) + 1;
        } else if (req.url === '/about') {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html');
            res.setHeader('Content-Type', 'text/html; charset=utf-8');
            res.end(`
                <html>
                    <body>
                        <h1>Страница about</h1>
                        <p>Просмотров: ${visits[req.url] || 0}</p>
                        <a href="/">Ссылка на страницу /</a>
                    </body>
                </html>
            `);

            visits[req.url] = (visits[req.url] || 0) + 1;
        } else {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'text/plain');
            res.end('404 Not Found\n');
        }
    } else {
        res.statusCode = 405;
        res.setHeader('Content-Type', 'text/plain');
        res.end('405 Method Not Allowed\n');
    }
});

server.listen(3000, '127.0.0.1', () => {
    console.log('Server running at http://127.0.0.1:3000/');
});


