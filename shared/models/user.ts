export interface User {
  userId: string;
  refreshToken: string | null | undefined;
}

export interface FullUser {
  userId: string;
  refreshToken?: string | null | undefined;
  email: string;
  displayName: string;
  photoUrl: string | null;
}

export type UserUpdate = Partial<User>;

export class MinimalUserModel implements User {
  private _userId!: string;
  private _refreshToken: string | null = null;

  constructor(data: User | UserUpdate) {
    if (MinimalUserModel._isFullUser(data)) {
      this._validateUser(data);
    } else {
      this._validateUserUpdate(data);
    }

    this.userId = data.userId!;
    this.refreshToken = data.refreshToken ?? null;
  }

  // Type guard to check if data is a full User object
  private static _isFullUser(data: User | UserUpdate): data is User {
    return typeof data.userId === "string";
  }

  private _validateUser(data: User): void {
    if (!data.userId || typeof data.userId !== "string") {
      throw new Error("userId must be a string");
    }
    if (data.refreshToken != null && typeof data.refreshToken !== "string") {
      throw new Error("refreshToken must be a string or null");
    }
  }

  private _validateUserUpdate(data: UserUpdate): void {
    if ("refreshToken" in data) {
      const value = data.refreshToken;
      if (value != null && typeof value !== "string") {
        throw new Error("refreshToken must be a string or null");
      }
    }
  }

  public toJson(): User {
    return {
      userId: this.userId,
      refreshToken: this.refreshToken,
    };
  }

  get userId(): string {
    return this._userId;
  }
  set userId(val: string) {
    if (!val) throw new Error("userId required");
    this._userId = val;
  }

  get refreshToken(): string | null {
    return this._refreshToken;
  }
  set refreshToken(val: string | null) {
    this._refreshToken = val ?? null;
  }

  static fromJson(json: User): MinimalUserModel {
    return new MinimalUserModel({
      userId: json.userId,
      refreshToken: json.refreshToken ?? null,
    });
  }
}
