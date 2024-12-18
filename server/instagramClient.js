// instagramClient.js
const { IgApiClient } = require('instagram-private-api');

const ig = new IgApiClient();

const login = async () => {
  ig.state.generateDevice(process.env.IG_USERNAME);
  await ig.simulate.preLoginFlow();
  const loggedInUser = await ig.account.login(process.env.IG_USERNAME, process.env.IG_PASSWORD);
  process.nextTick(async () => await ig.simulate.postLoginFlow());
  return loggedInUser;
};

module.exports = { ig, login };
