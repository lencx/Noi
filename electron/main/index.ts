import { app } from 'electron';
import { initializeNeo4j, closeNeo4j, setupDatabaseConstraints } from './neo4jService';

app.whenReady().then(async () => {
  await initializeNeo4j();
  setTimeout(async () => {
    await setupDatabaseConstraints();
  }, 1000);
});

app.on('before-quit', async (event) => {
  event.preventDefault();
  await closeNeo4j();
  app.quit();
});
