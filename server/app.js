var cookieParser = require("cookie-parser");
var express = require("express");
const session = require("express-session");
var createError = require("http-errors");
var path = require("path");
var logger = require("morgan");
const helmet = require("helmet");
const passport = require("passport");
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo")(session);
var csrf = require('csurf')
var oauth = require("./config/strategies/oauth.strategy").PassportOAuthStrategy;
var jobRouter = require('./modules/job/routes/job.routes');
var queueMgr = require("./modules/queue/util/queuemanager");


/*
  The following call initializes 
  and checks the processors for all the
  queues that will be used in the application 
*/
queueMgr.startTheQueues();

var app = express();

app.use(helmet());
var csrfProtection = csrf({ cookie: true })
//db connection
var mongoconnStr = process.env.MONGOCONNSTR;

var conn = mongoose.connect(
  mongoconnStr,
  {
    autoIndex: true,
    authSource: process.env.MONGOADMINDB,
    auth: {
      user: process.env.MONGOUSER,
      password: process.env.MONGOUPASS
    },
    useNewUrlParser: true
  },
  err => {
    if (!(null === err)) console.log("DB error", err);
  }
);

mongoose.connection.on("error", function(err) {
  console.error("MongoDB connection error: " + err);
  process.exit(-1);
});

app.use(
  session({
    secret: process.env.SESSIONSECRET,
    resave: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    saveUninitialized: true,
    cookie: {
      // secure: false,
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 100
    }
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Redirect the user to the OAuth 2.0 provider for authentication.  When
// complete, the provider will redirect the user back to the application at
//     /auth/provider/callback
app.get("/check", oauth.authenticate("oauth2"));

// The OAuth 2.0 provider has redirected the user back to the application.
// Finish the authentication process by attempting to obtain an access
// token.  If authorization was granted, the user will be logged in.
// Otherwise, authentication has failed.
app.get(
  "/auth/provider/callback",
  oauth.authenticate("oauth2", {
    session: true,
    failureMessage: true,
    successRedirect: "/",
    failureRedirect: "/check"
  })
);

 app.use("/job", isAuthenticated, jobRouter);
//app.use("/users", isAuthenticated, usersRouter);

app.use(
    isAuthenticated,
    csrfProtection,
  express.static(path.join(__dirname, "../dist/public"))
);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);

  res.send("error/Invalid input");
});

function isAuthenticated(req, res, next) {
  // do any checks you want to in here

  // CHECK THE USER STORED IN SESSION FOR A CUSTOM VARIABLE
  // you can do this however you want with whatever variables you set up
  if (null !== req.user && undefined !== req.user) return next();
  // IF A USER ISN'T LOGGED IN, THEN REDIRECT THEM SOMEWHERE
  else res.redirect("/check");
}

module.exports = app;
