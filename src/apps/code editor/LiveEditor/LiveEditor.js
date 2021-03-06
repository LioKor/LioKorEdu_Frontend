import WS from "/src/utils/ws.js";
import WsServerAdapter from "./WsServerAdapter.js";


export default class LiveEditor {
  ws = null;
  editor = null;
  client = null;
  callbacks = {
    open: () => {},
    close: () => {},
    doc: (text) => {},
    registered: () => {},
    join: ({client_id, username}) => {},
    quit: ({client_id, username}) => {},
  };

  isDocGotten = false;
  username = undefined;

  constructor(editor, wsUrl) {
    // Get and setup ace editor
    this.editor = editor;
    editor.setOptions({
      readOnly: true,
      enableMultiselect: false,
    });

    // Create WebSocket connection
    this.ws = new WS(wsUrl, 'e', 'd');

    this.__setupHandlers();

    this.ws.open();
  }

  // Base events scenery:
  // 1. open
  // 2. doc (get text)
  // 3. -> join
  // 4. <- registered
  // 5. join/quit, working editorClient
  // 6. close

  __setupHandlers() {
    // Setup handlers on WebSocket connection:
    // Connect to server
    this.ws.handlers.open = () => {
      console.log('WS live redactor connected to server');
      this.callbacks.open();
    };

    // Disconnect form server
    this.ws.handlers.close = () => {
      console.log('WS live redactor disconnected from server');
      this.callbacks.close();
    };

    // Get initial text that other users typed.
    // Set EditorAdapter that will get editor's actions and set server's actions on it
    this.ws.handlers.doc = (data) => {
      if (this.username !== undefined)
        this.__sendJoin();
      this.isDocGotten = true;

      this.editor.setValue(data.document, 1);
      this.serverAdapter = new WsServerAdapter(this.ws);
      this.editorAdapter = new ot.AceEditorAdapter(this.editor);
      this.client = new ot.EditorClient(data.revision, data.clients, this.serverAdapter, this.editorAdapter);

      this.callbacks.doc(data.document);
    };

    // Our client registered => we can type text
    this.ws.handlers.registered = () => {
      this.editor.setOption('readOnly', false);
      this.callbacks.registered();
    };

    // New user joined
    this.ws.handlers.join = (data) => {
      console.log("User joined: ", data);
      this.callbacks.join(data);
    };

    // Some user quit
    this.ws.handlers.quit = (data) => {
      console.log("User quit with id: ", data);
      this.callbacks.quit(data);
    };
  }

  // Send our 'join' event on server
  join(username) {
    this.username = username;
    if (this.isDocGotten) {
      this.__sendJoin();
    }
  }
  __sendJoin() {
    this.ws.send('join', { username: this.username });
  }
  // Send our 'leave' event on server
  leave() {
    this.ws.send('leave', { username: this.username });
    this.ws.close();
    this.editorAdapter?.detach();
  }
}
