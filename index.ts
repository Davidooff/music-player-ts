import app from "./src/express/main";
import DB from "./src/mongoose/db";
import DiscordBot from "./src/discord/main";
import env from "./src/env";
DB;
DiscordBot;
app.listen(env.PORT, () => {
  console.log(`The application is listening on port ${env.PORT}!`);
});
