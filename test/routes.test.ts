import { promisify } from 'util'
import { exec } from 'child_process'
import { createServer } from 'http'

import { loadEnv } from 'vite'
import { test, beforeAll, expect, vi, describe, afterAll } from 'vitest'
import { SuperAgentTest, agent as _agent } from 'supertest'
import { Deta } from 'deta'

const execAsync = promisify(exec)

let agent: SuperAgentTest

const testKey = 'test-counter'
const nonExistentKey = 'non-exists-key'
const testInitViews = 5
const badgeSvgExpected = '<title>test label: %count</title>'
const badgeTitleExpected =
  '<svg width="77.9" height="20" viewBox="0 0 779 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="test label: %count">'
const badgeTextExpected1 = '<text x="664" y="148" textLength="70" fill="#000" opacity="0.25">%count</text>'
const badgeTextExpected2 = '<text x="654" y="138" textLength="70">%count</text>'

beforeAll(async () => {
  Object.assign(process.env, loadEnv('', './', '')) // load .env from local testing

  vi.stubEnv('NITRO_DETA_BASE_NAME', 'test')
  vi.stubEnv('NITRO_PRESET', 'node')

  await execAsync('pnpm build')
  // @ts-ignore
  const { handler } = await import('../.output/server/index.mjs')
  agent = _agent(createServer(handler))

  const deta = Deta()
  const base = deta.Base(process.env.NITRO_DETA_BASE_NAME)

  await base.put({ views: testInitViews }, testKey)
})

afterAll(async () => {
  const deta = Deta()
  const base = deta.Base(process.env.NITRO_DETA_BASE_NAME)

  await base.delete(testKey)
})

describe('Test json counter route', () => {
  test('JSON resp headers', async () => {
    const res = await agent.get(`/${testKey}`).set('origin', 'https://example.com').expect(200)
    expect(res.headers['content-type']).toMatch(/json/)
    expect(res.headers['cache-control']).toMatch(/no-store/)
    expect(res.headers['access-control-allow-origin']).toEqual(process.env.NITRO_ALLOW_ORIGIN || '*')
  })
  test('JSON resp', async () => {
    const res = await agent.get('/' + testKey).expect(200)
    expect(res.body.counter).toEqual(testInitViews + 2)
  })
  test('JSON resp noIncrement', async () => {
    const res = await agent.get(`/${testKey}?noIncrement`).expect(200)
    expect(res.body.counter).toEqual(testInitViews + 2)
  })
  test('JSON resp noIncrement non-existent key', async () => {
    const res = await agent.get(`/${nonExistentKey}?noIncrement`).expect(200)
    expect(res.body.counter).toEqual(0)
  })
})

describe('Test badge counter route', () => {
  test('Badge resp headers', async () => {
    const res = await agent.get(`/${testKey}/badge`).set('origin', 'https://example.com').expect(200)
    expect(res.headers['content-type']).toEqual('image/svg+xml; charset=utf-8')
    expect(res.headers['cache-control']).toMatch(/no-store/)
    expect(res.headers['access-control-allow-origin']).toEqual(process.env.NITRO_ALLOW_ORIGIN || '*')
  })
  test('Badge resp', async () => {
    const res = await agent.get(`/${testKey}/badge?color=pink&label=test+label`).expect(200)
    const body = res.body.toString()
    const viewsExpected = (testInitViews + 4).toString()
    expect(body).toContain(badgeSvgExpected.replace('%count', viewsExpected))
    expect(body).toContain(badgeTitleExpected.replace('%count', viewsExpected))
    expect(body).toContain(badgeTextExpected1.replace('%count', viewsExpected))
    expect(body).toContain(badgeTextExpected2.replace('%count', viewsExpected))
  })
  test('Badge noIncrement resp', async () => {
    const res = await agent.get(`/${testKey}/badge?color=pink&label=test+label&noIncrement`).expect(200)
    const body = res.body.toString()
    const viewsExpected = (testInitViews + 4).toString()
    expect(body).toContain(badgeSvgExpected.replace('%count', viewsExpected))
    expect(body).toContain(badgeTitleExpected.replace('%count', viewsExpected))
    expect(body).toContain(badgeTextExpected1.replace('%count', viewsExpected))
    expect(body).toContain(badgeTextExpected2.replace('%count', viewsExpected))
  })
  test('Badge noIncrement resp non-existent key', async () => {
    const res = await agent.get(`/${nonExistentKey}/badge?color=pink&label=test+label&noIncrement`).expect(200)
    const body = res.body.toString()
    const viewsExpected = '0'
    expect(body).toContain(badgeSvgExpected.replace('%count', viewsExpected))
    expect(body).toContain(badgeTitleExpected.replace('%count', viewsExpected))
    expect(body).toContain(badgeTextExpected1.replace('%count', viewsExpected))
    expect(body).toContain(badgeTextExpected2.replace('%count', viewsExpected))
  })
})
