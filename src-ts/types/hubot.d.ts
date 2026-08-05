declare module "hubot" {
  export interface User {
    id: string;
    name: string;
    room?: string;
    email_address?: string;
    [key: string]: any;
  }

  export interface Message {
    text?: string;
    room: string;
    user: User;
    channel?: { is_private?: boolean; is_im?: boolean };
    [key: string]: any;
  }

  export interface Response {
    message: Message;
    match: RegExpMatchArray;
    envelope?: any;
    send(...strings: any[]): void;
    reply(...strings: any[]): void;
    random<T>(items: T[]): T;
  }

  export interface Brain {
    data: {
      users: { [id: string]: User };
      [key: string]: any;
    };
    get(key: string): any;
    set(key: string, value: any): void;
    userForId(id: string): User;
    userForName(name: string): User | null;
    usersForFuzzyName(name: string): User[];
  }

  export interface Logger {
    error(...args: any[]): void;
    warning(...args: any[]): void;
    info(...args: any[]): void;
  }

  export interface Robot {
    name: string;
    adapterName: string;
    brain: Brain;
    logger: Logger;
    respond(regex: RegExp, callback: (msg: Response) => void): void;
    hear(regex: RegExp, callback: (msg: Response) => void): void;
    on(event: string, callback: (...args: any[]) => void): void;
    emit(event: string, ...args: any[]): void;
    send(envelope: any, ...strings: any[]): void;
    http(url: string): any;
  }
}
