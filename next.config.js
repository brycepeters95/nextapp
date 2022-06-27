const { withPlausibleProxy } = require("next-plausible");

module.exports = withPlausibleProxy()({
  images: {
    domains: ["cdn.brawlify.com"],
    minimumCacheTTL: 6000000,
  },
});
