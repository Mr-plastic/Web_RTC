    const io = require("socket.io-client");
    const server = require("../server"); // ← 如果這裡拿到 undefined，表示 server.js 沒正確 export

    let client1, client2;
    const SOCKET_URL = "http://localhost:3000";

    beforeAll((done) => {
    server.listen(3000, () => {
        done();
    });
    });

    afterAll((done) => {
        client1 && client1.close();
        client2 && client2.close();
        server.close(() => done());
    });

    test("connect test", (done) => {
    client1 = io(SOCKET_URL);

    client1.on("connect", () => {
        console.log("Client connected");
        expect(client1.connected).toBe(true);
        client1.close();
        done();
    });

    client1.on("connect_error", (err) => {
        console.error("connect failed", err);
        done(err); 
    });
    });


    test("Client 1 should receive 'created' when joining a new room", (done) => {
        client1 = io(SOCKET_URL);
        client1.on("connect", () => {
        client1.emit("join", "testRoom");

        client1.on("created", () => {
            expect(client1.connected).toBe(true);
            done();
        });
        });
    });

    test("Client 2 should receive 'joined' when joining an existing room", (done) => {
        client2 = io(SOCKET_URL);
        client2.on("connect", () => {
        client2.emit("join", "testRoom");

        client2.on("joined", () => {
            expect(client2.connected).toBe(true);
            done();
        });

        client2.on("full", () => {
            done(new Error("Client 2 should not receive 'full'"));
        });
        });
    });

