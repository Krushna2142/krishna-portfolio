package com.example.portfolio;

import org.junit.jupiter.api.Test;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;

public class MongoClientConnectionTest {

    @Test
    public void testMongoConnection() {
        // Your MongoDB connection string for the new cluster
        String connectionString = "mongodb+srv://Krushna:jrXk7PgkvwcByGSD@portfoliocluster.iq0ahoj.mongodb.net/?retryWrites=true&w=majority&appName=PortfolioCluster";

        try (MongoClient mongoClient = MongoClients.create(connectionString)) {
            // Try listing DB names (forces connection)
            mongoClient.listDatabaseNames().first();

            System.out.println("MongoDB Connection Successful!");
        } catch (Exception e) {
            System.err.println("MongoDB Connection Failed!");
            e.printStackTrace();
            assert false : "Connection to MongoDB failed: " + e.getMessage();
        }
    }
}
