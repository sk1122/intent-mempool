import { API } from "./api";
import { listenIntents } from "./solver";

const api = new API()
listenIntents()

api.runServer(8080)