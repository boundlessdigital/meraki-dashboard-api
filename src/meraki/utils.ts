import path from 'path'
import fs from 'fs'

export function has_own_property(obj: object, property: string) {
    return Object.prototype.hasOwnProperty.call(obj, property)
}

export function debug_log(message: string) {
    process.stdout.write(JSON.stringify(message, null, 4))
}

export async function write_file(
    dir: string,
    filename: string,
    content: string
) {
    const output_file = path.join(dir, filename)
    fs.writeFileSync(output_file, content)
}

export class BuildException extends Error {
    payload: object

    constructor(message: string, payload: object) {
        super(message)
        this.name = 'BuildException'
        this.payload = payload
    }
}
