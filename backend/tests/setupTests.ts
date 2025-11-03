const mock = require("mock-require");

mock("firebase-admin", {
  apps: [],
  initializeApp: () => ({}),
  auth: () => ({
    verifyIdToken: async (token: string): Promise<boolean> => true,
  }),
  firestore: () => ({
    collection: () => ({
      doc: () => ({
        get: async () => ({
          exists: true,
          data: () => ({ userId: "user123" }),
        }),
        set: async () => ({}),
        update: async () => ({}),
        delete: async () => ({}),
      }),
      where: () => ({
        get: async () => ({
          docs: [],
        }),
      }),
    }),
  }),
});
