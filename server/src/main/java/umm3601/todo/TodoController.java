package umm3601.todo;

import com.google.gson.Gson;
import com.mongodb.*;
import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.util.JSON;
import org.bson.Document;
import org.bson.types.ObjectId;
import java.util.Iterator;
import java.util.Map;

import java.util.Arrays;

//aggregation
import com.mongodb.Block;
import com.mongodb.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Aggregates;
import com.mongodb.client.model.Accumulators;
import com.mongodb.client.model.Projections;
import com.mongodb.client.model.Filters;
import com.mongodb.client.AggregateIterable;


import static com.mongodb.client.model.Filters.eq;

public class TodoController {

    private final Gson gson;
    private MongoDatabase database;
    private final MongoCollection<Document> todoCollection;

    public TodoController(MongoDatabase database) {
        gson = new Gson();
        this.database = database;
        todoCollection =database.getCollection("todos");
    }

    /**
     * helper method to get single todo by id
     *
     * @param id mongo id of desired todo
     * @return desired todo as a JSON object if found,
     *  otherwise null
     */
    public String getTodo(String id) {
        FindIterable<Document> jsonTodos
            = todoCollection.find(eq("_id", new ObjectId(id)));

        Iterator<Document> iterator = jsonTodos.iterator();
        if (iterator.hasNext()) {
            Document todo = iterator.next();
            return todo.toJson();
        }
        else {
            return null;
        }
    }

    /**
     * helper method that iterates through collection,
     *  recieving all documents if no query parameter is specified,
     *  otherwise filtering by the parameters
     *
     * @param queryParams
     * @return array of todos in JSON formatted string
     */
    public String getTodos(Map<String, String[]> queryParams) {
        Document filterDoc = new Document();

        //filter by owner
        if (queryParams.containsKey("owner")) {
            String targetContent = (queryParams.get("owner")[0]);
            Document contentRegQuery = new Document();
            contentRegQuery.append("$regex", targetContent);
            contentRegQuery.append("$options", "i");
            filterDoc = filterDoc.append("owner", contentRegQuery);
        }

        //filter by status
        if (queryParams.containsKey("status")) {
            Boolean targetStatus = Boolean.parseBoolean(queryParams.get("status")[0]);
            filterDoc = filterDoc.append("status", targetStatus);
        }

        //filter by body
        if (queryParams.containsKey("body")) {
            String targetContent = (queryParams.get("body")[0]);
            Document contentRegQuery = new Document();
            contentRegQuery.append("$regex", targetContent);
            contentRegQuery.append("$options", "i");
            filterDoc = filterDoc.append("body", contentRegQuery);
        }

        //filter by category
        if (queryParams.containsKey("category")) {
            String targetContent = (queryParams.get("category")[0]);
            Document contentRegQuery = new Document();
            contentRegQuery.append("$regex", targetContent);
            contentRegQuery.append("$options", "i");
            filterDoc = filterDoc.append("category", contentRegQuery);
        }

        //FindIterable comes from mongo, Document comes from Gson
        FindIterable<Document> matchingTodos = todoCollection.find(filterDoc);

        return JSON.serialize(matchingTodos);
    }

    public String addNewTodo(String owner, Boolean status, String body, String category) {

        Document newTodo = new Document();
        newTodo.append("owner", owner);
        newTodo.append("status", status);
        newTodo.append("body", body);
        newTodo.append("category", category);

        try {
            todoCollection.insertOne(newTodo);
            ObjectId id = newTodo.getObjectId("_id");
            System.err.println("Successfully added new todo [_id=" + id + ", owner=" + owner + ", status=" + status + " body=" + body + " category=" + category + ']');

            return JSON.serialize(id);
        } catch (MongoException me) {
            me.printStackTrace();
            return null;
        }

    }

    public String getTodoSummary() {
        Document summaryDoc = new Document();

        String[] categories = {"video games", "software design","groceries","homework"};

        String[] owners = {"Blanche", "Fry", "Workman", "Dawn", "Roberta", "Barry"};

        double[] categoryCount = new double[4];

        double[] ownerCount = new double[6];

        //categories
        for (int i = 0; i < 4; i++) {
            Document doc = new Document("category",categories[i]);

            categoryCount[i] = 100 /(double)todoCollection.count(doc);
        }

        for (int i = 0; i < 4; i++) {
            summaryDoc.append(categories[i] + " Todos complete", todoCollection.aggregate(
                Arrays.asList(
                    Aggregates.match(Filters.eq("category", categories[i])),
                    Aggregates.match(Filters.eq("status", true)),
                    Aggregates.group("$category", Accumulators.sum("finished todos", 1) , Accumulators.sum("percent done", categoryCount[i]))
                )
                )
            );
        }

        //owners
        for (int i = 0; i < 6; i++) {
            Document doc = new Document("owner",owners[i]);

            ownerCount[i] = 100 /(double)todoCollection.count(doc);
        }

        for (int i = 0; i < 6; i++) {
            summaryDoc.append(owners[i] + " Todos complete", todoCollection.aggregate(
                Arrays.asList(
                    Aggregates.match(Filters.eq("owner", owners[i])),
                    Aggregates.match(Filters.eq("status", true)),
                    Aggregates.group("$owner", Accumulators.sum("finished todos", 1) , Accumulators.sum("percent done", ownerCount[i]))
                )
                )
            );
        }

        return summaryDoc.toJson();
    }

    public static void main(String[] args) {
        MongoClient mongoClient = new MongoClient();
        MongoDatabase userDatabase = mongoClient.getDatabase("dev");
        TodoController todoController = new TodoController(userDatabase);

        System.out.println(todoController.getTodoSummary());
    }

}
