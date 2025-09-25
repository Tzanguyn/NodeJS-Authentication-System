import express from "express"; // Importing express for the web framework
import bodyParser from "body-parser"; // Importing bodyParser for parsing request bodies
import ejsLayouts from "express-ejs-layouts"; // Importing express-ejs-layouts for layout support
import path from "path"; // Importing express-ejs-layouts for layout support
import dotenv from "dotenv"; // Importing dotenv to load environment variables
import session from "express-session"; // Importing express-session for session management
import passport from "passport"; // Importing passport for authentication
import { Strategy as GoogleStrategy } from "passport-google-oauth20"; // Importing Google OAuth 2.0 strategy for passport

import { connectUsingMongoose } from "./config/mongodb.js"; // Importing MongoDB connection function
import { mailTransportMode } from "./config/nodemailerConfig.js"; // Log mail mode
import router from "./routes/routes.js"; // Importing main application routes
import authrouter from "./routes/authRoutes.js"; // Importing authentication routes

dotenv.config(); // Loading environment variables from .env file
const app = express(); // Initializing express application
const PORT = process.env.PORT || 3000; // Default port fallback

//SESSION
app.use(
  session({
    secret: "SecretKey",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

//MIDDLEWARE
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Passport
app.use(passport.initialize());
app.use(passport.session());

// Expose student info to all EJS views
app.use((req, res, next) => {
  res.locals.studentId = '22687631';
  res.locals.studentName = 'Nguyen Thi Tram';
  // Expose reCAPTCHA site key (use Google's public test key by default for localhost/dev)
  res.locals.recaptchaSiteKey = process.env.RECAPTCHA_SITE_KEY || '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI';
  next();
});

const hasGoogleOAuth = process.env.CLIENT_ID && process.env.CLIENT_SECRET;
if (hasGoogleOAuth) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL:
          process.env.GOOGLE_CALLBACK_URL || `http://localhost:${PORT}/auth/google/callback`,
        scope: ["profile", "email"],
      },
      function (accessToken, refreshToken, profile, callback) {
        callback(null, profile);
      }
    )
  );
} else {
  console.warn("Google OAuth disabled: set CLIENT_ID and CLIENT_SECRET in .env to enable.");
}

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// Set Templates
app.set("view engine", "ejs"); // Define template engine
app.use(ejsLayouts); // Use base template
app.set("views", path.join(path.resolve(), "views")); // Define template directory

// DB Connection
connectUsingMongoose();
console.log(`Mail transport: ${mailTransportMode}`);

//ROUTES
app.get("/", (req, res) => {
  return res.redirect("/user/signin");
});
app.use("/user", router);
app.use("/auth", authrouter);
app.use(express.static("public"));

//LISTEN
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
  // first commit marker for GitHub folder summary lines
