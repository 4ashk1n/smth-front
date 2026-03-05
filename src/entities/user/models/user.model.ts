import { type IsSubscribedResponse, type SubscribeResponse, type UnsubscribeResponse, type UserMetrics, type UserMetricsResponse } from "@smth/shared"
import { makeAutoObservable } from "mobx"
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

    async isSubscribedTo(userId: string): Promise<boolean> {
        const response = await apiRequest<IsSubscribedResponse>(`/users/${userId}/subscribed`, {credentials: 'include'})
        return response.data.subscribed
    }

    async subscribeTo(userId: string): Promise<void> {
        await apiRequest<SubscribeResponse>(`/users/${userId}/subscribe`, { method: 'POST', credentials: 'include' })
    }

    async unsubscribeFrom(userId: string): Promise<void> {
        await apiRequest<UnsubscribeResponse>(`/users/${userId}/subscribe`, { method: 'DELETE', credentials: 'include' })
    }

    changeMetrics(patch: Partial<UserMetrics>): void {
        this.metrics = {
            ...this.metrics,
            ...patch,
        }
    }

    toJSON(): User {
        return this.data
    }
}
