const { CosmosClient } = require("@azure/cosmos");

// Connection string read securely from Key Vault via environment variable
// NO hardcoded secrets - enterprise security best practice
const connectionString = process.env.COSMOS_CONNECTION_STRING;
const databaseId = process.env.COSMOS_DATABASE || "MidtermDB";
const containerId = process.env.COSMOS_CONTAINER || "Items";

function getContainer() {
    const client = new CosmosClient(connectionString);
    return client.database(databaseId).container(containerId);
}

module.exports = async function (context, req) {
    context.log("ItemsAPI function triggered - Method:", req.method);

    const method = req.method.toUpperCase();
    const itemId = req.params.item_id;

    try {
        const container = getContainer();

        // POST /api/items - Create item
        if (method === "POST") {
            const body = req.body;
            if (!body || !body.id) {
                context.res = {
                    status: 400,
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ error: "Request body must include an id field" })
                };
                return;
            }
            const { resource: createdItem } = await container.items.create(body);
            context.res = {
                status: 201,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: "Item created successfully", item: createdItem })
            };

        // GET /api/items/{id} - Read item
        } else if (method === "GET" && itemId) {
            const { resource: item } = await container.item(itemId, itemId).read();
            if (!item) {
                context.res = { status: 404, body: JSON.stringify({ error: "Item not found" }) };
                return;
            }
            context.res = {
                status: 200,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(item)
            };

        // DELETE /api/items/{id} - Delete item
        } else if (method === "DELETE" && itemId) {
            await container.item(itemId, itemId).delete();
            context.res = {
                status: 200,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: `Item ${itemId} deleted successfully` })
            };

        // GET /api/items - List all items
        } else if (method === "GET" && !itemId) {
            const { resources: items } = await container.items.readAll().fetchAll();
            context.res = {
                status: 200,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: "Items retrieved successfully", count: items.length, items: items })
            };

        } else {
            context.res = {
                status: 400,
                body: JSON.stringify({ error: "Invalid route or method" })
            };
        }

    } catch (error) {
        context.log.error("Error:", error.message);
        context.res = {
            status: 500,
            body: JSON.stringify({ error: "Internal server error", details: error.message })
        };
    }
};
