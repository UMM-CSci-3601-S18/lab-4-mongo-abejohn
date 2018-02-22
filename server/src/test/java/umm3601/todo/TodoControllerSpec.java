package umm3601.todo;

import com.mongodb.BasicDBObject;
import com.mongodb.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.*;
import org.bson.codecs.*;
import org.bson.codecs.configuration.CodecRegistries;
import org.bson.codecs.configuration.CodecRegistry;
import org.bson.json.JsonReader;
import org.bson.types.ObjectId;
import org.junit.Before;
import org.junit.Test;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertTrue;

public class TodoControllerSpec {

    private TodoController todoController;
    private ObjectId samsId;
    @Before
    public void clearAndPopulateDB() throws IOException {
        MongoClient mongoClient = new MongoClient();
        MongoDatabase db = mongoClient.getDatabase("test");
        MongoCollection<Document> todoDocuments = db.getCollection("todos");
        todoDocuments.drop();
        List<Document> testTodos = new ArrayList<>();
        testTodos.add(Document.parse("{\n" +
            "                    owner: \"Blanche\",\n" +
            "                    status: false,\n" +
            "                    body: \"blanche body 1\",\n" +
            "                    category: \"software design\"\n" +
            "                }"));
        testTodos.add(Document.parse("{\n" +
            "                    owner: \"Fry\",\n" +
            "                    status: false,\n" +
            "                    body: \"fry body\",\n" +
            "                    category: \"homework\"\n" +
            "                }"));
        testTodos.add(Document.parse("{\n" +
            "                    owner: \"Jamie\",\n" +
            "                    status: 37,\n" +
            "                    body: true,\n" +
            "                    category: \"software design\"\n" +
            "                }"));

        samsId = new ObjectId();
        BasicDBObject sam = new BasicDBObject("_id", samsId);
        sam = sam.append("owner", "Sam")
            .append("status", true)
            .append("body", "sam body")
            .append("category", "videogames");



        todoDocuments.insertMany(testTodos);
        todoDocuments.insertOne(Document.parse(sam.toJson()));

        // It might be important to construct this _after_ the DB is set up
        // in case there are bits in the constructor that care about the state
        // of the database.
        todoController = new TodoController(db);
    }

    // http://stackoverflow.com/questions/34436952/json-parse-equivalent-in-mongo-driver-3-x-for-java
    private BsonArray parseJsonArray(String json) {
        final CodecRegistry codecRegistry
            = CodecRegistries.fromProviders(Arrays.asList(
            new ValueCodecProvider(),
            new BsonValueCodecProvider(),
            new DocumentCodecProvider()));

        JsonReader reader = new JsonReader(json);
        BsonArrayCodec arrayReader = new BsonArrayCodec(codecRegistry);

        return arrayReader.decode(reader, DecoderContext.builder().build());
    }

    private static String getOwner(BsonValue val) {
        BsonDocument doc = val.asDocument();
        return ((BsonString) doc.get("owner")).getValue();
    }

    @Test
    public void getAllTodos() {
        Map<String, String[]> emptyMap = new HashMap<>();
        String jsonResult = todoController.getTodos(emptyMap);
        BsonArray docs = parseJsonArray(jsonResult);

        assertEquals("Should be 4 todos", 4, docs.size());
        List<String> owners = docs
            .stream()
            .map(TodoControllerSpec::getOwner)
            .sorted()
            .collect(Collectors.toList());
        List<String> expectedOwners = Arrays.asList("Blanche", "Fry", "Jamie", "Sam");
        assertEquals("Owners should match", expectedOwners, owners);
    }

    @Test
    public void getTodosWithStatusFalse() {
        Map<String, String[]> argMap = new HashMap<>();
        argMap.put("status", new String[] { "false" });
        String jsonResult = todoController.getTodos(argMap);
        BsonArray docs = parseJsonArray(jsonResult);

        assertEquals("Should be 2 todos", 2, docs.size());
        List<String> owners = docs
            .stream()
            .map(TodoControllerSpec::getOwner)
            .sorted()
            .collect(Collectors.toList());
        List<String> expectedOwners = Arrays.asList("Blanche", "Fry");
        assertEquals("Owners should match", expectedOwners, owners);
    }

    @Test
    public void getSamById() {
        String jsonResult = todoController.getTodo(samsId.toHexString());
        Document sam = Document.parse(jsonResult);
        assertEquals("Owner should match", "Sam", sam.get("owner"));
        String noJsonResult = todoController.getTodo(new ObjectId().toString());
        assertNull("No owner should match",noJsonResult);

    }

    @Test
    public void addTodoTest(){
        boolean bool = todoController.addNewTodo("Brian",false,"umm", "homework");

        assertTrue("Add new todo should return true when todo is added,",bool);
        Map<String, String[]> argMap = new HashMap<>();
        argMap.put("owner", new String[] { "Brian" });
        String jsonResult = todoController.getTodos(argMap);
        BsonArray docs = parseJsonArray(jsonResult);

        List<String> owner = docs
            .stream()
            .map(TodoControllerSpec::getOwner)
            .sorted()
            .collect(Collectors.toList());
        assertEquals("Should return owner of new todo", "Brian", owner.get(0));
    }

    @Test
    public void getTodoByCategory(){
        Map<String, String[]> argMap = new HashMap<>();
        //Mongo in UserController is doing a regex search so can just take a Java Reg. Expression
        //This will search the company starting with an I or an F
        argMap.put("category", new String[] { "[software design, homework]" });
        String jsonResult = todoController.getTodos(argMap);
        BsonArray docs = parseJsonArray(jsonResult);
        assertEquals("Should be 4 todos", 4, docs.size());
        List<String> owner = docs
            .stream()
            .map(TodoControllerSpec::getOwner)
            .sorted()
            .collect(Collectors.toList());
        List<String> expectedOwner = Arrays.asList("Blanche","Fry","Jamie","Brian");
        //assertEquals("Owner should match", expectedOwner, owner);
    }
}
