import { makeAutoObservable } from "mobx"
import type { User } from "../types/user.types"

export class UserModel {
    data: User

    constructor(user: User) {
        this.data = user
        makeAutoObservable(this, {}, { autoBind: true })
    }

    get id(): string {
        return this.data.id
    }

    get fullName(): string {
        return `${this.data.firstname} ${this.data.lastname}`.trim()
    }

    get displayName(): string {
        if (this.fullName.length > 0) return this.fullName
        return this.data.username
    }

    get hasAvatar(): boolean {
        return this.data.avatar.trim().length > 0
    }

    update(patch: Partial<User>) {
        this.data = {
            ...this.data,
            ...patch,
        }
    }

    is(userId: string): boolean {
        return this.id === userId
    }

    toJSON(): User {
        return this.data
    }
}
