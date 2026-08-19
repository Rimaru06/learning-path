import { driver } from "../config/database.js";

export const getGoals = async () => {
  const session = driver.session();

  try {
    const result = await session.run(`
      MATCH (g:Goal)
      RETURN g
      ORDER BY g.name
    `);

    return result.records.map((record) => {
      const goal = record.get("g");

      return {
        id: goal.properties.id,
        name: goal.properties.name,
        description: goal.properties.description,
      };
    });
  } finally {
    await session.close();
  }
};