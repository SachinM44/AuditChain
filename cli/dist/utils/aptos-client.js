"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAptosClient = getAptosClient;
const ts_sdk_1 = require("@aptos-labs/ts-sdk");
const config_1 = require("./config");
let client = null;
function getAptosClient() {
    if (!client) {
        const config = new ts_sdk_1.AptosConfig({
            network: ts_sdk_1.Network.TESTNET,
            fullnode: config_1.NODE_URL
        });
        client = new ts_sdk_1.Aptos(config);
    }
    return client;
}
//# sourceMappingURL=aptos-client.js.map