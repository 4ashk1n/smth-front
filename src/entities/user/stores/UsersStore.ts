import type { UserResponse } from "@smth/shared"
import { makeAutoObservable, ObservableMap, runInAction } from "mobx"
import { apiRequest } from "../../../shared/api"
import { UserModel } from "../models/user.model"
import type { User } from "../types/user.types"

export class UsersStore {
    usersById: ObservableMap<string, UserModel> = new ObservableMap()
    focusedUserId: string | null = null

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

    async fetchById(userId: string): Promise<UserModel | null> {
        const existing = this.getById(userId)
        if (existing) return existing

        try {
            const user = await apiRequest<UserResponse>('/users/' + userId)
            if (!user.success || !user.data) {
                return null
            }
            let model = null
            runInAction(() => {
                model = this.upsert(user.data)
            })
            return model
        } catch {
            return null
        }
    }
}
