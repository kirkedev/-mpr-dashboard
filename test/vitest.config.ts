import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        root: "..",
        coverage: {
            all: true,
            provider: "istanbul",
            include: ["{api,lib}/**/*.ts"],
            reportsDirectory: "test/coverage"
        }
    }
});