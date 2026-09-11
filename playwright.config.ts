import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir:'./tests/ui',workers:1,timeout:45000,
  use:{baseURL:'http://127.0.0.1:4321',headless:true,launchOptions:process.env.PLAYWRIGHT_EXECUTABLE_PATH?{executablePath:process.env.PLAYWRIGHT_EXECUTABLE_PATH}:{}},
  webServer:{command:'node node_modules/astro/bin/astro.mjs preview --host 127.0.0.1 --port 4321',url:'http://127.0.0.1:4321',reuseExistingServer:true},
});
