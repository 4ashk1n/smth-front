import { makeAutoObservable, ObservableMap } from "mobx"
import { UserModel } from "../models/user.model"
import type { User } from "../types/user.types"

export class UsersStore {
    usersById: ObservableMap<string, UserModel> = new ObservableMap()

    constructor() {
        makeAutoObservable(this, {}, { autoBind: true })
    }

    get users(): UserModel[] {
        return Array.from(this.usersById.values())
    }

    getById(userId: string): UserModel | undefined {
        return this.usersById.get(userId)
    }

    has(userId: string): boolean {
        return this.usersById.has(userId)
    }

    upsert(user: User): UserModel {
        const existing = this.usersById.get(user.id)
        if (existing) {
            existing.update(user)
            return existing
        }

        const model = new UserModel(user)
        this.usersById.set(model.id, model)
        return model
    }

    upsertMany(users: User[]) {
        users.forEach((user) => this.upsert(user))
    }

    remove(userId: string) {
        this.usersById.delete(userId)
    }

    clear() {
        this.usersById.clear()
    }
}
