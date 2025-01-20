const passport = require('passport');
const { Strategy } = require('passport-openidconnect');
const dotenv = require('dotenv');

dotenv.config();

passport.use(
    new Strategy(
        {
            issuer: `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}/v2.0`,
            authorizationURL: `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}/oauth2/v2.0/authorize`,
            tokenURL: `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}/oauth2/v2.0/token`,
            clientID: process.env.AZURE_CLIENT_ID,
            clientSecret: process.env.AZURE_CLIENT_SECRET,
            callbackURL: process.env.AZURE_REDIRECT_URI,
            scope: ['openid', 'profile', 'email', 'User.Read']
        },
        (issuer, sub, profile, accessToken, refreshToken, done) => {
            return done(null, profile);
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((obj, done) => {
    done(null, obj);
});

module.exports = passport;