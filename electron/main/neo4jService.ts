import neo4j from 'neo4j-driver';
import { v4 as uuidv4 } from 'uuid';

export interface MessageNode {
  messageId: string;
  role: 'user' | 'assistant' | 'routed_input';
  providerId: string;
  content: string;
  timestamp: number;
  conversationId: string;
}

const NEO4J_URI = process.env.NEO4J_URI;
const NEO4J_USER = process.env.NEO4J_USER;
const NEO4J_PASSWORD = process.env.NEO4J_PASSWORD;

if (!NEO4J_URI || !NEO4J_USER || !NEO4J_PASSWORD) {
  throw new Error('Neo4j credentials are not set in environment variables');
}

const driver = neo4j.driver(NEO4J_URI, neo4j.auth.basic(NEO4J_USER, NEO4J_PASSWORD));

export async function initializeNeo4j() {
  try {
    await driver.verifyConnectivity();
    console.log('Connected to Neo4j');
  } catch (error) {
    console.error('Error connecting to Neo4j:', error);
    throw error;
  }
}

export async function closeNeo4j() {
  try {
    await driver.close();
    console.log('Neo4j driver closed');
  } catch (error) {
    console.error('Error closing Neo4j driver:', error);
    throw error;
  }
}

export async function setupDatabaseConstraints() {
  const session = driver.session();
  try {
    await session.run(`
      CREATE CONSTRAINT unique_message_id IF NOT EXISTS ON (m:Message) ASSERT m.messageId IS UNIQUE;
      CREATE CONSTRAINT unique_conversation_id IF NOT EXISTS ON (c:Conversation) ASSERT c.conversationId IS UNIQUE;
    `);
    console.log('Database constraints set up');
  } catch (error) {
    console.error('Error setting up database constraints:', error);
    throw error;
  } finally {
    await session.close();
  }
}

export async function recordInitialMessage(message: MessageNode) {
  const session = driver.session();
  try {
    await session.writeTransaction(tx =>
      tx.run(
        `
        MERGE (c:Conversation {conversationId: $conversationId})
        CREATE (m:Message {
          messageId: $messageId,
          role: $role,
          providerId: $providerId,
          content: $content,
          timestamp: $timestamp
        })
        MERGE (c)-[:HAS_MESSAGE]->(m)
        `,
        {
          conversationId: message.conversationId,
          messageId: message.messageId,
          role: message.role,
          providerId: message.providerId,
          content: message.content,
          timestamp: message.timestamp
        }
      )
    );
    console.log('Initial message recorded');
  } catch (error) {
    console.error('Error recording initial message:', error);
    throw error;
  } finally {
    await session.close();
  }
}

export async function recordBranchedMessage(sourceMessageId: string, newMessage: MessageNode) {
  const session = driver.session();
  try {
    await session.writeTransaction(tx =>
      tx.run(
        `
        MATCH (source:Message {messageId: $sourceMessageId})
        MERGE (c:Conversation {conversationId: $conversationId})
        CREATE (m:Message {
          messageId: $messageId,
          role: 'routed_input',
          providerId: $providerId,
          content: $content,
          timestamp: $timestamp
        })
        MERGE (source)-[:BRANCHED_FROM]->(m)
        MERGE (c)-[:HAS_MESSAGE]->(m)
        `,
        {
          sourceMessageId,
          conversationId: newMessage.conversationId,
          messageId: newMessage.messageId,
          providerId: newMessage.providerId,
          content: newMessage.content,
          timestamp: newMessage.timestamp
        }
      )
    );
    console.log('Branched message recorded');
  } catch (error) {
    console.error('Error recording branched message:', error);
    throw error;
  } finally {
    await session.close();
  }
}

export async function getConversationHistory(conversationId: string) {
  const session = driver.session();
  try {
    const result = await session.readTransaction(tx =>
      tx.run(
        `
        MATCH (c:Conversation {conversationId: $conversationId})-[:HAS_MESSAGE]->(m:Message)
        RETURN m ORDER BY m.timestamp
        `,
        { conversationId }
      )
    );
    return result.records.map(record => record.get('m').properties);
  } catch (error) {
    console.error('Error fetching conversation history:', error);
    throw error;
  } finally {
    await session.close();
  }
}

function getSession() {
  return driver.session();
}

async function executeTransaction(work) {
  const session = getSession();
  try {
    return await session.writeTransaction(work);
  } catch (error) {
    console.error('Error executing transaction:', error);
    throw error;
  } finally {
    await session.close();
  }
}
