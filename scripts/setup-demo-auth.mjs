import { emitKeypressEvents } from 'node:readline'
import { randomBytes, pbkdf2Sync } from 'node:crypto'
import { readFileSync, writeFileSync, existsSync } from 'node:fs'

// Password is entered without echo and is never written to disk or command arguments.
if (!process.stdin.isTTY) throw new Error('Run this command in an interactive terminal.')
console.log('Frontend demo only. This does not provide real account security.')
async function secret(prompt) {
  process.stdout.write(prompt)
  emitKeypressEvents(process.stdin)
  process.stdin.setRawMode(true)
  process.stdin.resume()
  return new Promise((resolve, reject) => {
    let value = ''
    const finish = () => { process.stdin.off('keypress', handler); process.stdin.setRawMode(false); process.stdin.pause(); process.stdout.write('\n') }
    function handler(text, key = {}) {
      if (key.ctrl && key.name === 'c') { finish(); reject(new Error('Cancelled')); return }
      if (key.name === 'return') { finish(); resolve(value); return }
      if (key.name === 'backspace') { value = value.slice(0, -1); return }
      if (!key.ctrl && !key.meta && text && [...text].every(char => char.charCodeAt(0) >= 32)) value += text
    }
    process.stdin.on('keypress', handler)
  })
}
let password = await secret('New demo password (12+ characters, hidden): ')
let confirmation = await secret('Confirm password (hidden): ')
if (password.length < 12 || password !== confirmation) throw new Error('Password must match and contain at least 12 characters. No changes saved.')
const salt = randomBytes(32).toString('hex')
const verifier = pbkdf2Sync(password, salt, 600000, 32, 'sha256').toString('hex')
password = ''; confirmation = ''
const file = new URL('../.env.local', import.meta.url)
const existing = existsSync(file) ? readFileSync(file, 'utf8') : ''
const kept = existing.split(/\r?\n/).filter(line => !/^\s*VITE_DEMO_AUTH_(SALT|VERIFIER)\s*=/.test(line)).join('\n')
writeFileSync(file, `${kept.trimEnd()}\nVITE_DEMO_AUTH_SALT=${salt}\nVITE_DEMO_AUTH_VERIFIER=${verifier}\n`, { mode: 0o600 })
console.log('Demo verifier saved to ignored .env.local. No password saved. Restart Vite; sign in as demo@mellowbake.test.')
