declare module "hubot" {
  /** Adapter-provided channel metadata (hubot-slack). */
  export interface ChannelInfo {
    is_private?: boolean;
    is_im?: boolean;
    name?: string;
  }

  export interface User {
    id: string;
    name: string;
    real_name?: string;
    room?: string;
    email_address?: string;
    /** hubot-auth style roles (roles.ts). */
    roles?: string[];
    /** Set by adapters/scripts for DM detection (seen.ts). */
    pm?: boolean;
    /** Per-user counters (most-spoken-words.ts). */
    msgcount?: number;
    /** Word-frequency map (most-spoken-words.ts). */
    words?: { [word: string]: number };
  }

  export interface Envelope {
    room?: string;
    id?: string;
    user?: User;
    message?: Message;
  }

  export interface Message {
    text?: string;
    room: string;
    user: User;
    done?: boolean;
    finish(): void;
    /** Adapter-specific structured channel info (hubot-slack). */
    channel?: ChannelInfo;
    /** Original adapter payload (hubot-slack). */
    rawMessage?: { channel?: ChannelInfo };
    /**
     * Checked defensively in middleware.ts exactly as the CoffeeScript
     * original did (`msg.message?.channel?.is_private` on what is already
     * a Message). Optional here so that faithful code still compiles.
     */
    message?: { channel?: ChannelInfo };
  }

  export interface HttpResponse {
    statusCode: number;
    headers?: { [header: string]: string | string[] | undefined };
  }

  export interface HttpCallback {
    (
      err: Error | null,
      res: HttpResponse | null,
      body: string | null,
    ): void;
  }

  /** Chainable hubot ScopedHttpClient surface used by these scripts. */
  export interface HttpClient {
    header(name: string, value: string): HttpClient;
    query(options: { [key: string]: string | number | boolean }): HttpClient;
    /** Returns the callback-invoking thunk of hubot's http client. */
    get(): (callback: HttpCallback) => void;
    post(body: string): (callback: HttpCallback) => void;
  }

  export interface Response {
    message: Message;
    match: RegExpMatchArray;
    robot: Robot;
    envelope: Envelope;
    send(...messages: Array<string | Record<string, unknown>>): void;
    reply(...strings: Array<string | Record<string, unknown>>): void;
    emote(...strings: string[]): void;
    random<T>(items: T[]): T;
    http(url: string): HttpClient;
  }

  export interface BrainData {
    users: { [id: string]: User };
    [key: string]: any;
  }

  export interface Brain {
    data: BrainData;
    get<T = any>(key: string): T;
    set<T = any>(key: string, value: T): void;
    remove?(key: string): void;
    userForId(id: string, options?: Partial<User>): User;
    userForName(name: string): User | null;
    usersForRawFuzzyName(name: string): User[];
    usersForFuzzyName(name: string): User[];
    on(event: string, callback: (...args: any[]) => void): void;
    emit(event: string, ...args: any[]): void;
  }

  export interface Logger {
    error(...args: any[]): void;
    warning(...args: any[]): void;
    info(...args: any[]): void;
    debug(...args: any[]): void;
  }

  export interface ListenerContext {
    response: Response;
    listener: { options?: Record<string, unknown> };
  }

  export interface ReceiveContext {
    response: Response;
  }

  export interface RequestHandlerParams {
    routerPath?: string;
  }

  export type HubotRequest = import("http").IncomingMessage & {
    body?: any;
    params?: Record<string, string>;
    route?: { path?: string };
  };

  export type HubotResponse = import("http").ServerResponse;

  export interface Router {
    get(
      path: string,
      callback: (req: HubotRequest, res: HubotResponse) => void,
    ): void;
    post(
      path: string,
      callback: (req: HubotRequest, res: HubotResponse) => void,
    ): void;
    put(
      path: string,
      callback: (req: HubotRequest, res: HubotResponse) => void,
    ): void;
    delete(
      path: string,
      callback: (req: HubotRequest, res: HubotResponse) => void,
    ): void;
  }

  export interface Robot {
    name: string;
    adapterName: string;
    version: string;
    alias?: string;
    brain: Brain;
    logger: Logger;
    router: Router;
    respond(regex: RegExp, callback: (msg: Response) => void): void;
    hear(regex: RegExp, callback: (msg: Response) => void): void;
    on(event: string, callback: (...args: any[]) => void): void;
    emit(event: string, ...args: any[]): void;
    /**
     * hubot 2.x accepts an Envelope, a bare User, or a room string as the
     * send target (adapters duck-type on it).
     */
    send(
      target: Envelope | User | string,
      ...messages: Array<string | Record<string, unknown>>
    ): void;
    reply(
      target: Envelope | User | string,
      ...messages: Array<string | Record<string, unknown>>
    ): void;
    http(url: string): HttpClient;
    helpCommands(): string[];
    loadFile? (path: string, file: string): void;
    receiveMiddleware(
      callback: (
        context: ReceiveContext,
        next: (done: () => void) => void,
        done: () => void,
      ) => void,
    ): void;
    listenerMiddleware(
      callback: (
        context: ListenerContext,
        next: (done: () => void) => void,
        done: () => void,
      ) => void,
    ): void;
  }
}
