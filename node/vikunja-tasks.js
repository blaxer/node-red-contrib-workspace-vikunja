module.exports = function(RED) {

    const http = require('./lib/api')(RED);

    function VikunjaTasksNode(config) {
        RED.nodes.createNode(this, config);

        const node = this;

         node.config = {
            url: config.vikunjaUrl,
            projectId: config.projectId,
            token: config.token,
            showCompleted: config.showCompleted !== false,
            showOnAllFlows: config.showOnAllFlows || false,
            refreshInterval: Number(config.refreshInterval || 0),
            taskX: Number(config.taskX || 100),
            taskY: Number(config.taskY || 100),
            titleWidth: Number(config.titleWidth || 200)
        };

        node.tasks = [];
        node.tabId = node.z;
        console.log("Vikunja node initialized, showOnAllFlows:", node.config.showOnAllFlows);

        node.tasks = [];

        async function loadTasks() {
            try {
                node.status({ fill: 'blue', shape: 'dot', text: 'loading' });
                const client = http.createClient({
                    url: node.config.url,
                    token: node.config.token
                });
                const tasks = await client.getTasks(node.config.projectId);

                node.tasks = node.config.showCompleted 
                    ? tasks 
                    : tasks.filter(t => !t.done);

            node.status({ fill: 'green', shape: 'dot', text: node.tasks.length + ' tasks' });
                console.log("Vikunja: Publishing update with", node.tasks.length, "tasks for node", node.id, "showOnAllFlows:", node.config.showOnAllFlows);

                const publishMsg = {
                    id: node.id,
                    tasks: node.tasks,
                    x: node.config.taskX,
                    y: node.config.taskY,
                    titleWidth: node.config.titleWidth,
                    zIndex: 1000,
                    showOnAllFlows: node.config.showOnAllFlows,
                    tabId: node.tabId,
                    currentTabOnly: !node.config.showOnAllFlows
                };

                RED.comms.publish("vikunja-tasks/update", publishMsg, true);

            } catch (error) {
                node.status({ fill: 'red', shape: 'dot', text: 'error' });
                node.error('Failed to load tasks: ' + error.message);
            }
        }

        function handleTaskAction(action, msg) {
            switch(action) {
                case 'refresh':
                    loadTasks();
                    break;
                case 'add':
                    if (msg.payload && msg.payload.title) {
                        const client = http.createClient({
                            url: node.config.url,
                            token: node.config.token
                        });
                        client.createTask(node.config.projectId, {
                            title: msg.payload.title,
                            description: msg.payload.description || '',
                            due_date: msg.payload.due_date || null
                        }).then(() => loadTasks())
                          .catch(err => node.error('Failed to create task: ' + err.message));
                    }
                    break;
                case 'toggle':
                    const taskId = msg.payload.taskId || msg.payload.id;
                    if (msg.payload && taskId) {
                        const client = http.createClient({
                            url: node.config.url,
                            token: node.config.token
                        });
                        client.toggleTaskCompletion(taskId)
                            .then(() => loadTasks())
                            .catch(err => node.error('Failed to toggle task: ' + err.message));
                    }
                    break;
                case 'delete':
                    const deleteTaskId = msg.payload.taskId || msg.payload.id;
                    if (msg.payload && deleteTaskId) {
                        const client = http.createClient({
                            url: node.config.url,
                            token: node.config.token
                        });
                        client.deleteTask(deleteTaskId)
                            .then(() => loadTasks())
                            .catch(err => node.error('Failed to delete task: ' + err.message));
                    }
                    break;
                case 'update':
                    const updateTaskId = msg.payload.taskId || msg.payload.id;
                    if (msg.payload && updateTaskId && msg.payload.data) {
                        const client = http.createClient({
                            url: node.config.url,
                            token: node.config.token
                        });
                        client.updateTask(updateTaskId, msg.payload.data)
                            .then(() => loadTasks())
                            .catch(err => node.error('Failed to update task: ' + err.message));
                    }
                    break;
                default:
                    node.warn('Unknown action: ' + action);
            }
        }

        // expose handleTaskAction for admin endpoint
        node.handleTaskAction = handleTaskAction;

        this.on('input', function(msg) {
            if (msg.payload === 'refresh' || (msg.payload && typeof msg.payload === 'object' && msg.payload.action)) {
                const action = typeof msg.payload === 'string' ? msg.payload : msg.payload.action;
                handleTaskAction(action, msg);
            }
        });

        this.on('close', function(removed, done) {
            const removeMsg = { id: node.id };
            RED.comms.publish("vikunja-tasks/remove", removeMsg, true);
            if (node.refreshTimer) clearInterval(node.refreshTimer);
            node.status({});
            if (removed) done();
            else done();
        });

        loadTasks();

        if (node.config.refreshInterval > 0) {
            node.refreshTimer = setInterval(loadTasks, node.config.refreshInterval * 60000);
        }
    }

    RED.nodes.registerType('vikunja-tasks', VikunjaTasksNode);

    RED.httpAdmin.post("/vikunja-tasks/:id/action", function(req, res) {
        const node = RED.nodes.getNode(req.params.id);
        if (!node) return res.status(404).json({ error: "Node not found" });

        node.handleTaskAction(req.body.action, { payload: req.body });
        res.json({ success: true });
    });
};
