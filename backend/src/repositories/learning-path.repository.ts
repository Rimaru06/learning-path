import { driver } from "../config/database.js";
import type { Goal, Topic, GoalTopic } from "../types/index.js";

export const getUserGoal = async (userId: string): Promise<Goal | null> => {
  const session = driver.session();
  try {
    const result = await session.run(
      `MATCH (u:User {id: $userId})-[:HAS_GOAL]->(g:Goal) RETURN g`,
      { userId }
    );
    if (result.records.length === 0) return null;
    const goal = result.records[0]!.get("g");
    return {
      id: goal.properties.id,
      name: goal.properties.name,
      description: goal.properties.description,
    };
  } finally {
    await session.close();
  }
};

export const getUserKnownTopics = async (userId: string): Promise<Topic[]> => {
  const session = driver.session();
  try {
    const result = await session.run(
      `MATCH (u:User {id: $userId})-[:KNOWS]->(t:Topic) RETURN t`,
      { userId }
    );
    return result.records.map((record) => {
      const t = record.get("t");
      return { id: t.properties.id, name: t.properties.name };
    });
  } finally {
    await session.close();
  }
};

// Returns every topic in the goal's dependency tree with its direct prerequisites.
export const getGoalTopics = async (goalId: string): Promise<GoalTopic[]> => {
  const session = driver.session();
  try {
    const result = await session.run(
      `
      MATCH (g:Goal {id: $goalId})-[:REQUIRES]->(required:Topic)
      OPTIONAL MATCH (required)-[:PREREQUISITE*0..]->(dep:Topic)
      WITH collect(DISTINCT required) + collect(DISTINCT dep) AS allTopics
      UNWIND allTopics AS topic
      WITH DISTINCT topic
      OPTIONAL MATCH (topic)-[:PREREQUISITE]->(prereq:Topic)
      WITH topic, collect(prereq) AS prereqs
      RETURN
        topic.id       AS topicId,
        topic.name     AS topicName,
        [p IN prereqs | {id: p.id, name: p.name}] AS directPrerequisites
      `,
      { goalId }
    );
    return result.records.map((record) => ({
      id: record.get("topicId") as string,
      name: record.get("topicName") as string,
      prerequisites: record.get("directPrerequisites") as Array<{
        id: string;
        name: string;
      }>,
    }));
  } finally {
    await session.close();
  }
};

export const markTopicKnown = async (
  userId: string,
  topicId: string
): Promise<void> => {
  const session = driver.session();
  try {
    const result = await session.run(
      `MATCH (u:User {id: $userId}), (t:Topic {id: $topicId})
       MERGE (u)-[:KNOWS]->(t)
       RETURN u`,
      { userId, topicId }
    );
    if (result.records.length === 0) {
      throw new Error("User or topic not found");
    }
  } finally {
    await session.close();
  }
};

export const unmarkTopicKnown = async (
  userId: string,
  topicId: string
): Promise<void> => {
  const session = driver.session();
  try {
    await session.run(
      `MATCH (u:User {id: $userId})-[r:KNOWS]->(t:Topic {id: $topicId})
       DELETE r`,
      { userId, topicId }
    );
  } finally {
    await session.close();
  }
};

export const setUserGoal = async (
  userId: string,
  goalId: string
): Promise<Goal | null> => {
  const session = driver.session();
  try {
    const result = await session.run(
      `MATCH (u:User {id: $userId}), (g:Goal {id: $goalId})
       OPTIONAL MATCH (u)-[r:HAS_GOAL]->(:Goal)
       DELETE r
       WITH u, g
       MERGE (u)-[:HAS_GOAL]->(g)
       RETURN g`,
      { userId, goalId }
    );
    if (result.records.length === 0) return null;
    const goal = result.records[0]!.get("g");
    return {
      id: goal.properties.id,
      name: goal.properties.name,
      description: goal.properties.description,
    };
  } finally {
    await session.close();
  }
};