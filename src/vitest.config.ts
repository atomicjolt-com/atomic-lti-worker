import {
  defineWorkersProject,
} from "@cloudflare/vitest-pool-workers/config";

export default defineWorkersProject(async () => {
  return {
    test: {
      setupFiles: ["./test/apply-migrations.ts"],
      poolOptions: {
        workers: {
          singleWorker: true,
          wrangler: {
            configPath: "../wrangler.jsonc",
            environment: "production",
          }
        },
      },
    },
  };
});