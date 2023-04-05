const request = require("supertest");

require("dotenv").config();

const app = require("../src/main");
const { db } = require("../src/config/db.config");

const testKey = "test-counter";
const nonExistentKey = "non-exists-key";
const testInitViews = 5;
const badgeExpected =
  "<svg width=\"77.9\" height=\"20\" viewBox=\"0 0 779 200\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"test label: %count\">\n" +
  "  <title>test label: %count</title>\n" +
  "  <linearGradient id=\"a\" x2=\"0\" y2=\"100%\">\n" +
  "    <stop offset=\"0\" stop-opacity=\".1\" stop-color=\"#EEE\"/>\n" +
  "    <stop offset=\"1\" stop-opacity=\".1\"/>\n" +
  "  </linearGradient>\n" +
  "  <mask id=\"m\"><rect width=\"779\" height=\"200\" rx=\"30\" fill=\"#FFF\"/></mask>\n" +
  "  <g mask=\"url(#m)\">\n" +
  "    <rect width=\"609\" height=\"200\" fill=\"#555\"/>\n" +
  "    <rect width=\"170\" height=\"200\" fill=\"#E5B\" x=\"609\"/>\n" +
  "    <rect width=\"779\" height=\"200\" fill=\"url(#a)\"/>\n" +
  "  </g>\n" +
  "  <g aria-hidden=\"true\" fill=\"#fff\" text-anchor=\"start\" font-family=\"Verdana,DejaVu Sans,sans-serif\" font-size=\"110\">\n" +
  "    <text x=\"60\" y=\"148\" textLength=\"509\" fill=\"#000\" opacity=\"0.25\">test label</text>\n" +
  "    <text x=\"50\" y=\"138\" textLength=\"509\">test label</text>\n" +
  "    <text x=\"664\" y=\"148\" textLength=\"70\" fill=\"#000\" opacity=\"0.25\">%count</text>\n" +
  "    <text x=\"654\" y=\"138\" textLength=\"70\">%count</text>\n" +
  "  </g>\n" +
  "  \n" +
  "</svg>";

beforeAll(async () => {
  await db.put({ views: testInitViews }, testKey);
});

afterAll(async () => {
  await db.delete(testKey);
});

describe("Test json counter route", () => {
  test("JSON resp headers", async () => {
    const res = await request(app).get(`/${testKey}`);
    expect(res.status).toEqual(200);
    expect(res.headers["content-type"]).toMatch(/json/);
    expect(res.headers["cache-control"]).toEqual("max-age=0, no-cache, no-store, must-revalidate");
    expect(res.headers["access-control-allow-origin"]).toEqual("*");
    expect(res.headers["access-control-allow-headers"]).toEqual("*");
  });
  test("JSON resp", async () => {
    const res = await request(app).get("/" + testKey);
    expect(res.status).toEqual(200);
    expect(res.body.counter).toEqual(testInitViews + 2);
  });
  test("JSON resp noIncrement", async () => {
    const res = await request(app).get(`/${testKey}?noIncrement=1`);
    expect(res.status).toEqual(200);
    expect(res.body.counter).toEqual(testInitViews + 2);
  });
  test("JSON resp noIncrement non-existent key", async () => {
    const res = await request(app).get(`/${nonExistentKey}?noIncrement=1`);
    expect(res.status).toEqual(200);
    expect(res.body.counter).toEqual(0);
  });
});

describe("Test badge counter route", () => {
  test("Badge resp headers", async () => {
    const res = await request(app).get(`/${testKey}/badge`);
    expect(res.status).toEqual(200);
    expect(res.headers["content-type"]).toEqual("image/svg+xml; charset=utf-8");
    expect(res.headers["cache-control"]).toEqual("max-age=0, no-cache, no-store, must-revalidate");
    expect(res.headers["access-control-allow-origin"]).toEqual("*");
  });
  test("Badge resp", async () => {
    const res = await request(app).get(`/${testKey}/badge?color=pink&label=test+label`);
    expect(res.status).toEqual(200);
    expect(res.body.toString()).toEqual(badgeExpected.replaceAll("%count", testInitViews + 4));
  });
  test("Badge noIncrement resp", async () => {
    const res = await request(app).get(`/${testKey}/badge?color=pink&label=test+label&noIncrement=1`);
    expect(res.status).toEqual(200);
    expect(res.body.toString()).toEqual(badgeExpected.replaceAll("%count", testInitViews + 4));
  });
  test("Badge noIncrement resp non-existent key", async () => {
    const res = await request(app).get(`/${nonExistentKey}/badge?color=pink&label=test+label&noIncrement=1`);
    expect(res.status).toEqual(200);
    expect(res.body.toString()).toEqual(badgeExpected.replaceAll("%count", 0));
  });
});
