export default {
  repos: [".", "types", "mongoose", "api", "event-bus", "web", "analytics"],
  isNpm: {
    types: true,
    mongoose: true,
  },
  hasLocalDeps: {
    mongoose: ["types"],
  }
};
