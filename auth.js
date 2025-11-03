import bcrypt from "bcrypt";
import passport from "passport";
import { Strategy } from "passport-local";
import { connexionUser, getUserById } from "./model/restaurant.js";

const config = {
  usernameField: "courriel",
  passwordField: "mot_de_passe",
};

// stratégie de connexion locale
passport.use(
  new Strategy(config, async (courriel, mot_de_passe, done) => {
    try {
      // rechercher l'utilisateur dans la base de données
      const user = await connexionUser(courriel);
      if (!user) {
        return done(null, false, { message: "Utilisateur non trouvé." });
      }
      // vérifier le mot de passe
      const valide = await bcrypt.compare(mot_de_passe, user.mot_de_passe);
      if (!valide) {
        return done(null, false, { message: "Mot de passe incorrect." });
      }
      // authentification réussie
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  })
);

// sérialisation de l'utilisateur dans la session
passport.serializeUser((user, done) => {
  done(null, user.id_utilisateur);
});

// désérialisation de l'utilisateur à partir de la session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await getUserById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

export default passport;
