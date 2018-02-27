/**
 *

package umm3601.todo;

import com.google.gson.Gson;
import com.mongodb.BasicDBObject;
import com.mongodb.util.JSON;
import spark.Request;
import spark.Response;

//aggregation
import com.mongodb.Block;
import com.mongodb.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Aggregates;
import com.mongodb.client.model.Accumulators;
import com.mongodb.client.model.Projections;
import com.mongodb.client.model.Filters;

import org.bson.Document;

public class TodoRequestAggregator {

    private final Gson gson;
    private MongoDatabase database;
    private final MongoCollection<Document> todoCollection;


    public TodoRequestAggregator(MongoDatabase database){
        gson = new Gson();
        this.database = database;
        todoCollection =database.getCollection("todos");
    }

    public String getTodoSummary(Request req, Response res) {
        res.type("application/json");

        todoCollection.aggregate(
            Arrays.asList(

            )
        )
    }
}
 */
