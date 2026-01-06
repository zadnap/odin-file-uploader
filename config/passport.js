import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma.js";

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await prisma.user.findUnique({
        where: {
          username,
        },
      });

      if (!user) {
        return done(null, false, { message: "Invalid username or password" });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return done(null, false, { message: "Invalid username or password" });
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }),
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        username: true,
        displayName: true,
        createdAt: true,
      },
    });

    done(null, user);
  } catch (err) {
    done(err);
  }
});
