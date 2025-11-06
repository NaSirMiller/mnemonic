export interface User {
  userId: string;
  refreshToken?: string | null;
}

export type UserUpdate = Partial<User>;

export class UserModel implements User {
  private _userId!: string;
  private _refreshToken?: string | null;

  constructor(data: User | UserUpdate) {
    if (UserModel._isFullUser(data)) {
      this._validateUser(data);
    } else {
      this._validateUserUpdate(data);
    }

    this.userId = data.userId!;
    this.refreshToken = data.refreshToken ?? null;
  }

  private static _isFullUser(data: User | UserUpdate): data is User {
    return typeof data.userId === "string";
  }

  private _validateUser(data: User): void {
    if (!data.userId || typeof data.userId !== "string")
      throw new Error("userId must be a string");
    if (data.refreshToken && typeof data.refreshToken !== "string")
      throw new Error("refreshToken must be a string");
  }

  private _validateUserUpdate(data: UserUpdate): void {
    for (const [key, value] of Object.entries(data)) {
      switch (key) {
        case "refreshToken":
          if (value !== undefined && value !== null && typeof value !== "string")
            throw new Error("refreshToken must be a string or null");
          break;
      }
    }
  }

  public toJson(): User {
    return {
      userId: this.userId,
      refreshToken: this.refreshToken ?? null,
    };
  }
  
  get userId(): string {
    return this._userId;
  }
  set userId(val: string) {
    if (!val) throw new Error("userId required");
    this._userId = val;
  }

  get refreshToken(): string | null | undefined {
    return this._refreshToken;
  }
  set refreshToken(val: string | null | undefined) {
    this._refreshToken = val ?? null;
  }

  static fromJson(json: User): UserModel {
    return new UserModel({
      userId: json.userId,
      refreshToken: json.refreshToken ?? null,
    });
  }
}
