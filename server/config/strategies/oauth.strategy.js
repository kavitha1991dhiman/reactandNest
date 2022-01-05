var passport = require("passport"),
  OAuth2Strategy = require("passport-oauth").OAuth2Strategy;

passport.use(
  "oauth2",
  new OAuth2Strategy(
    {
      authorizationURL:
        "https://login.microsoftonline.com/335836de-42ef-43a2-b145-348c2ee9ca5b/oauth2/authorize",
      tokenURL:
        "https://login.microsoftonline.com/335836de-42ef-43a2-b145-348c2ee9ca5b/oauth2/token",
      clientID: "bad59f8a-27a3-4cba-9923-22abfebaf083",
      clientSecret: "V0cP:.v_bDDVL/qP54Ps7zhAMmm91hU*",
      callbackURL: "http://localhost:3000/auth/provider/callback"
    },
    function(accessToken, refreshToken, params, profile, done) {
      var jwt = require("jwt-simple");
      console.log("accessToken", accessToken);
      console.log("refreshToken", refreshToken);
      console.log("profile", params);
        var user = jwt.decode(params.id_token, "", true);
      done(null, user);
    }
  )
);
passport.serializeUser(function(user, done) {
    //console.log("profile : ", user);
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    //console.log("profile : ", user);
    done(null, user);
});
exports.PassportOAuthStrategy = passport;
