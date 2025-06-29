import neo4j from 'neo4j-driver'
import { FriendsResult, neoRelations, UserProperties } from './types'

const driver = neo4j.driver(
  'bolt://localhost:7687',
  neo4j.auth.basic('neo4j', 'password')
)

export async function getUserFriends(userId: number): Promise<FriendsResult> {
  const session = driver.session()
  try {
    const result = await session.run(
      `
      MATCH (u:User {userId: $userId})
      OPTIONAL MATCH (u)-[:${neoRelations.friends}]->(f:User)
      OPTIONAL MATCH (u)<-[:${neoRelations.friends}]-(d:User)
      RETURN u, collect(DISTINCT f) AS sent, collect(DISTINCT d) AS received
      `,
      { userId }
    )

    const record = result.records[0]
    const sent: UserProperties[] = record.get('sent')
      .filter((s: any) => s !== null)
      .map((s: any) => s.properties)

    const received: UserProperties[] = record.get('received')
      .filter((r: any) => r !== null)
      .map((r: any) => r.properties)


    const friends: UserProperties[] = sent.filter(s =>
      received.some(r => r.userId === s.userId)
    )

    // en_attente = sent but not received
    const pending: UserProperties[] = sent.filter(s =>
      !received.some(r => r.userId === s.userId)
    )

    const friend_requests: UserProperties[] = received.filter(r =>
      !sent.some(s => s.userId === r.userId)
    )

    return { friends, pending, friend_requests }
  } finally {
    await session.close()
  }
}