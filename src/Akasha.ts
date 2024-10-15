import { operations } from './schema'
// eslint-disable-next-line @typescript-eslint/no-require-imports
const pkg = require('../package.json')

type GetCalculationsForUser =
    operations['getApiGetCalculationsForUserById']['responses']['200']['content']['application/json']

type GetBuilds =
    operations['getApiBuilds']['responses']['200']['content']['application/json']

type GetApiFiltersArtifacts =
    operations['getApiFiltersArtifacts']['responses']['200']['content']['application/json']

type GetApiFiltersCategories =
    operations['getApiFiltersCategories']['responses']['200']['content']['application/json']

type GetApiFiltersCharacters =
    operations['getApiFiltersCharacters']['responses']['200']['content']['application/json']

export default class AkashaAPI {
    private baseURL = 'https://akasha.cv/api/'
    private usage: string = ''
    private header: HeadersInit = {
        'User-Agent': `Akasha.js / v${pkg} (${this.usage})`,
    }

    /**
     *
     * @param usage - Intended usage of the consumer of the API wrapper (kept to a single sentence, appended to user agent)
     * @example new Akasha("external stats for {uuid}")
     * @example new Akasha("live percentiles of characters for my account")
     */
    constructor(usage: string = '') {
        this.usage = usage
    }

    async getCalculationsForUser(
        uuid: string
    ): Promise<GetCalculationsForUser> {
        const url = `${this.baseURL}getCalculationsForUser/${uuid}`
        const response = await fetch(url, {
            method: 'GET',
            headers: this.header,
        })
        return await response.json()
    }

    async getBuildsForUser(uuid: string): Promise<GetBuilds> {
        const url = `${this.baseURL}builds/?uid=${uuid}`
        const response = await fetch(url, {
            method: 'GET',
            headers: this.header,
        })
        return await response.json()
    }

    async getApiFiltersArtifacts(): Promise<GetApiFiltersArtifacts> {
        const url = `${this.baseURL}filters/artifacts`
        const response = await fetch(url, {
            method: 'GET',
            headers: this.header,
        })
        return await response.json()
    }

    async getApiFiltersCategories(): Promise<GetApiFiltersCategories> {
        const url = `${this.baseURL}filters/categories`
        const response = await fetch(url, {
            method: 'GET',
            headers: this.header,
        })
        return await response.json()
    }

    async getApiFiltersCharacters(): Promise<GetApiFiltersCharacters> {
        const url = `${this.baseURL}filters/characters`
        const response = await fetch(url, { method: 'GET' })
        return await response.json()
    }
}
