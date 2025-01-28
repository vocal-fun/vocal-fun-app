class VocalService {
  private socket: WebSocket | null = null;
  private isConnected: boolean = false;
  private messageHandlers: { [key: string]: (message: any) => void } = {};
  private onConnectedCallback: any = null;

  initializeWebSocket(): void {
    try {
      this.socket = new WebSocket("ws://15.206.168.54:8000/ws");

      this.socket.onopen = () => {
        console.info("WebSocket connection established.");
        this.isConnected = true;

        if (this.onConnectedCallback) {
          this.onConnectedCallback();
        }
      };

      this.socket.onclose = () => {
        console.info("WebSocket connection closed. Reconnecting...");
        this.isConnected = false;
        setTimeout(() => this.initializeWebSocket(), 1000);
      };

      this.socket.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      this.socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        const messageType = message.message_type;
        if (messageType === "tts_stream") {
          // Handle streaming data
          if (this.messageHandlers["tts_stream"]) {
            this.messageHandlers["tts_stream"](message.stream_data);
          }
        } else if (messageType && this.messageHandlers[messageType]) {
          this.messageHandlers[messageType](message);
        } else {
          console.warn(`Unhandled message type: ${messageType}`);
        }
      };
    } catch (error) {
      console.error("Error initializing WebSocket:", error);
    }
  }

  /**
   * Register a message handler for a specific message type
   * @param messageType - The type of message to handle
   * @param handler - The function to handle the message
   */
  onMessage(messageType: string, handler: (message: any) => void) {
    this.messageHandlers[messageType] = handler;
  }

  onConnected(handler: () => void) {
    if (this.isConnected) {
      handler();
    } else {
      this.onConnectedCallback = handler;
    }
  }

  /**
   * Send a transcript to the server and handle the response
   * @param transcript - The transcript text
   */
  getVocalResponse(transcript: string) {
    if (this.socket?.readyState === WebSocket.OPEN) {
      console.info("Sending transcript:", transcript);
      this.socket.send(JSON.stringify({ type: "transcript", data: transcript }));
    } else {
      console.error("WebSocket is not open. Transcript cannot be sent.");
    }
  }

  /**
   * Set the voice personality on the server
   * @param personality - The personality to set
   */
  setVoicePersonality(personality: string) {
    if (this.socket?.readyState === WebSocket.OPEN) {
      console.info("Setting voice personality:", personality);
      this.socket.send(JSON.stringify({ type: "personality", data: personality }));
    } else {
      console.error("WebSocket is not open. Personality cannot be set.");
    }
  }

  /**
   * Request the initial voice line from the server
   */
  getInitialVoiceLine() {
    if (this.socket?.readyState === WebSocket.OPEN) {
      console.info("Requesting initial voice line...");
      this.socket.send(JSON.stringify({ type: "start_vocal" }));
    } else {
      console.error("WebSocket is not open. Initial voice line cannot be requested.");
    }
  }
}

const vocalService = new VocalService();

export { vocalService };
