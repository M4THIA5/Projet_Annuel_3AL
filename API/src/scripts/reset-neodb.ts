import neo4j from 'neo4j-driver';
import { config } from '../config/env';

async function resetNeo4jDB() {
  const driver = neo4j.driver(config.NEO4J_URL, neo4j.auth.basic(config.NEO4J_USER, config.NEO4J_PASSWORD));
  const session = driver.session();

  try {
    // Delete all nodes and relationships
    await session.run('MATCH (n) DETACH DELETE n');
    console.log('Neo4j database has been reset.');
  } catch (error) {
    console.error('Error resetting Neo4j database:', error);
  } finally {
    await session.close();
    await driver.close();
  }
}

resetNeo4jDB();