import neo4j from "neo4j-driver";
import "dotenv/config";

export const driver = neo4j.driver(
  process.env.COGNODB_URI!,
  neo4j.auth.basic(process.env.COGNODB_USERNAME!, process.env.COGNODB_PASSWORD!)
);


export const connectToDatabase = async () => {
    try {
        await driver.verifyConnectivity();
        console.log("Connected to the database successfully!");
    } catch (error) {
        console.error("Error connecting to the database:", error);
        await driver.close();
        return;
    }
}