import { generateSpec } from 'har-to-openapi'
import { readFileSync, writeFileSync } from 'fs'
import { reduceExamples, setRequired } from './common'
import old_spec from './openapi.json'
import { paths } from '../src/schema'

function diffFlatten(
    oldFlat: Record<string, any>,
    newFlat: Record<string, any>
) {
    const updated = Object.assign({}, oldFlat)
    const removed = Object.assign({}, newFlat)

    /**delete the unUpdated keys*/
    for (const key in newFlat) {
        if (newFlat[key] === oldFlat[key]) {
            delete updated[key]
            delete removed[key]
        }
    }

    return [updated, removed]
}

function flattenObject(obj: Record<string, any>) {
    const object = Object.create(null)
    const path: any[] = []
    const isObject = (value: any) => Object(value) === value

    function dig(obj: Record<string, any>) {
        for (const [key, value] of Object.entries(obj)) {
            path.push(key)
            if (isObject(value)) dig(value)
            else object[path.join('.')] = value
            path.pop()
        }
    }

    dig(obj)
    return object
}

;(async () => {
    const profileHar = JSON.parse(
        readFileSync('./spec/akasha_profile.har').toString('utf-8')
    )
    // const leaderboardHar = JSON.parse(readFileSync('./spec/akasha_leaderboard.har').toString('utf-8'))
    const { yamlSpec, domain, spec } = await generateSpec(profileHar, {
        attemptToParameterizeUrl: true,
        dropPathsWithoutSuccessfulResponse: true,
        urlFilter: /akasha\.cv\/api\/.*/,
    })
    // Reduce examples to no more than 2
    for (const [path, methods] of Object.entries(spec.paths)) {
        const examples =
            methods.get.responses['200'].content['application/json'].example
        methods.get.responses['200'].content['application/json'].example =
            reduceExamples(examples, 1)
    }

    // Set fields as required
    for (const [path, methods] of Object.entries(spec.paths)) {
        const schema =
            methods.get.responses['200'].content['application/json'].schema
        methods.get.responses['200'].content['application/json'].schema =
            setRequired(schema)
    }

    const newSpec = spec.paths
    const oldSpec = old_spec.paths as typeof newSpec

    const [updated, removed] = diffFlatten(
        flattenObject(oldSpec),
        flattenObject(newSpec)
    )
    console.log(updated)
    console.log(removed)
})()
