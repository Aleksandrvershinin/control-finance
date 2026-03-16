import { Injectable } from '@nestjs/common'

type CacheItem = {
    value: any
    expiresAt: number
}

@Injectable()
export class MemoryCacheService {
    private store = new Map<string, CacheItem>()

    set(key: string, value: any, ttlMs: number) {
        const expiresAt = Date.now() + ttlMs
        this.store.set(key, { value, expiresAt })
    }

    get<T = any>(key: string): T | null {
        const item = this.store.get(key)
        if (!item) return null

        if (Date.now() > item.expiresAt) {
            this.store.delete(key)
            return null
        }

        return item.value
    }

    delete(key: string) {
        this.store.delete(key)
    }
}
