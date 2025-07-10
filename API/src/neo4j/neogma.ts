import { Neogma, ModelFactory } from 'neogma'
import { config } from '../config/env'
import { neoRelations, UserProperties } from './types'

const neogma = new Neogma(
  {
    url: config.NEO4J_URL,
    username: config.NEO4J_USER,
    password: config.NEO4J_PASSWORD,
  },
  {
    logger: console.log,
  }
)

type UserRelationships = {
  friends: never
}

const User = ModelFactory<UserProperties, UserRelationships>(
  {
    label: 'User',
    schema: {
      userId: { type: 'number', required: true },
      email: { type: 'string', required: true },
    },
    primaryKeyField: 'userId',
  },
  neogma
);

User.addRelationships({
  friends: {
    model: User,
    direction: 'out',
    name: neoRelations.friends,
    properties: {},
  },
})

export async function removeFriendRelation(userId1: number, userId2: number): Promise<void> {
  const query = `
    MATCH (u1:User {userId: $userId1})-[r:${neoRelations.friends}]->(u2:User {userId: $userId2})
    DELETE r
  `;

  await neogma.queryRunner.run(query, { userId1, userId2 });
}

export { neogma, User }