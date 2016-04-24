import bodyParser from 'body-parser';
import helmet from 'helmet';
import csrf from 'csurf';

export default (DI, app, config) => {

  app.use(helmet.csp({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:'],
      reportUri: `${config.cspReportUrl}`,
    },
  }));
  app.use(helmet.xssFilter());
  app.use(helmet.noSniff())
  app.use(helmet.frameguard());
  app.use(helmet.hidePoweredBy());

  // Expose CSRF token to view
  app.use(csrf());
  app.use((req, res, next) => {
    if (req.csrfToken) {
      res.locals.csrfToken = req.csrfToken();
    } else {
      res.locals.csrfToken = '__TOKEN__';
    }
    next();
  });

}