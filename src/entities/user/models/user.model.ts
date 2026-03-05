import { makeAutoObservable } from "mobx"
import type { UserMetricsResponse } from "../../../../../smth-shared/dist/cjs/types"
import { apiRequest } from "../../../shared/api"
import type { User } from "../types/user.types"

export class UserModel {
    data: User
    metrics: {
        articles: number 
        followers: number
        following: number
        loaded: boolean
    } = {
        articles: 0,
        followers: 0,
        following: 0,
        loaded: false
    }

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

    async fetchMetrics(): Promise<void> {
        if (this.metrics.loaded) return
        const metrics = await apiRequest<UserMetricsResponse>(`/users/${this.id}/metrics`)
        this.metrics = {
            ...this.metrics,
            ...metrics.data,
            loaded: true,
        }
    }

    toJSON(): User {
        return this.data
    }
}
