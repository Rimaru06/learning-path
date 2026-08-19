import { driver } from "../config/database.js";

const seedDatabase = async () => {
  const session = driver.session();

  try {
    await driver.verifyConnectivity();
    console.log("Connected to CognoDB");

    // Clear existing development data
    await session.run(`
      MATCH (n)
      DETACH DELETE n
    `);

    // -------------------------
    // Users
    // -------------------------
    await session.run(
      `
      UNWIND $users AS user
      MERGE (u:User {id: user.id})
      SET u.name = user.name
      `,
      {
        users: [
          { id: "u1", name: "User 1" },
          { id: "u2", name: "User 2" },
          { id: "u3", name: "User 3" },
        ],
      }
    );

    // -------------------------
    // Goal
    // -------------------------
    await session.run(
      `
      MERGE (g:Goal {id: $id})
      SET g.name = $name,
          g.description = $description
      `,
      {
        id: "g1",
        name: "Backend Developer",
        description: "Learn the skills required to become a backend developer.",
      }
    );

    // -------------------------
    // Topics
    // -------------------------
    const topics = [
      ["t1", "Programming Fundamentals"],
      ["t2", "JavaScript"],
      ["t3", "Node.js"],
      ["t4", "Express"],
      ["t5", "Database Fundamentals"],
      ["t6", "SQL"],
      ["t7", "PostgreSQL"],
      ["t8", "Operating System Fundamentals"],
      ["t9", "Linux Basics"],
      ["t10", "Docker"],
      ["t11", "Computer Networks Fundamentals"],
      ["t12", "HTTP Basics"],
      ["t13", "REST APIs"],
    ];

    await session.run(
      `
      UNWIND $topics AS topic
      MERGE (t:Topic {id: topic[0]})
      SET t.name = topic[1]
      `,
      { topics }
    );

    // -------------------------
    // Goal → Required Topics
    // -------------------------
    await session.run(`
      MATCH (g:Goal {id: "g1"})

      MATCH (node:Topic {id: "t3"})
      MATCH (postgres:Topic {id: "t7"})
      MATCH (express:Topic {id: "t4"})
      MATCH (docker:Topic {id: "t10"})
      MATCH (rest:Topic {id: "t13"})

      MERGE (g)-[:REQUIRES]->(node)
      MERGE (g)-[:REQUIRES]->(postgres)
      MERGE (g)-[:REQUIRES]->(express)
      MERGE (g)-[:REQUIRES]->(docker)
      MERGE (g)-[:REQUIRES]->(rest)
    `);

    // -------------------------
    // Topic Prerequisites
    // -------------------------
    await session.run(`
      MATCH (node:Topic {id: "t3"})
      MATCH (js:Topic {id: "t2"})
      MATCH (fundamentals:Topic {id: "t1"})

      MATCH (express:Topic {id: "t4"})

      MATCH (postgres:Topic {id: "t7"})
      MATCH (sql:Topic {id: "t6"})
      MATCH (db:Topic {id: "t5"})

      MATCH (docker:Topic {id: "t10"})
      MATCH (linux:Topic {id: "t9"})
      MATCH (os:Topic {id: "t8"})

      MATCH (rest:Topic {id: "t13"})
      MATCH (http:Topic {id: "t12"})
      MATCH (cn:Topic {id: "t11"})

      MERGE (node)-[:PREREQUISITE]->(js)
      MERGE (js)-[:PREREQUISITE]->(fundamentals)

      MERGE (express)-[:PREREQUISITE]->(node)

      MERGE (postgres)-[:PREREQUISITE]->(sql)
      MERGE (sql)-[:PREREQUISITE]->(db)

      MERGE (docker)-[:PREREQUISITE]->(linux)
      MERGE (linux)-[:PREREQUISITE]->(os)

      MERGE (rest)-[:PREREQUISITE]->(http)
      MERGE (http)-[:PREREQUISITE]->(cn)
    `);

    // -------------------------
    // User → Goal
    // -------------------------
    await session.run(`
      MATCH (u1:User {id: "u1"})
      MATCH (u2:User {id: "u2"})
      MATCH (u3:User {id: "u3"})
      MATCH (g:Goal {id: "g1"})

      MERGE (u1)-[:HAS_GOAL]->(g)
      MERGE (u2)-[:HAS_GOAL]->(g)
      MERGE (u3)-[:HAS_GOAL]->(g)
    `);

    // -------------------------
    // User Knowledge
    // -------------------------
    await session.run(`
      MATCH (u2:User {id: "u2"})
      MATCH (u3:User {id: "u3"})

      MATCH (js:Topic {id: "t2"})
      MATCH (sql:Topic {id: "t6"})
      MATCH (linux:Topic {id: "t9"})
      MATCH (http:Topic {id: "t12"})

      MERGE (u2)-[:KNOWS]->(js)
      MERGE (u2)-[:KNOWS]->(sql)

      MERGE (u3)-[:KNOWS]->(js)
      MERGE (u3)-[:KNOWS]->(sql)
      MERGE (u3)-[:KNOWS]->(linux)
      MERGE (u3)-[:KNOWS]->(http)
    `);

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Database seeding failed:", error);
  } finally {
    await session.close();
    await driver.close();
  }
};

seedDatabase();