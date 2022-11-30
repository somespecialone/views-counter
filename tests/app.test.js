const request = require("supertest");

require("dotenv").config();

const app = require("../src/app");
const { db } = require("../src/config/db.config");

const testKey = "test-counter";
const testInitViews = 5;
const badgeExpected =
  '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="78" ' +
  'height="20" role="img" aria-label="test label: %count"><title>test label: %count' +
  "</title><linearGradient " +
  'id="s" x2="0" y2="100%"><stop offset="0" stop-color="#bbb" stop-opacity=".1"/><stop offset="1" ' +
  'stop-opacity=".1"/></linearGradient><clipPath id="r"><rect width="78" height="20" rx="3" ' +
  'fill="#fff"/></clipPath><g clip-path="url(#r)"><rect width="61" height="20" fill="#555"/><rect x="61" ' +
  'width="17" height="20" fill="pink"/><rect width="78" height="20" fill="url(#s)"/></g><g fill="#fff" ' +
  'text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" ' +
  'text-rendering="geometricPrecision" font-size="110"><text aria-hidden="true" x="315" y="150" ' +
  'fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="510">test label</text><text ' +
  'x="315" y="140" transform="scale(.1)" fill="#fff" textLength="510">test label</text><text ' +
  'aria-hidden="true" x="685" y="150" fill="#ccc" fill-opacity=".3" transform="scale(.1)" ' +
  'textLength="70">%count</text><text x="685" y="140" transform="scale(.1)" fill="#333" ' +
  'textLength="70">%count</text></g></svg>';
const errorBadgeExpected =
  '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" ' +
  'width="170" height="20" role="img" aria-label="error: invalid badge param/s"><title>error: invalid badge ' +
  'param/s</title><linearGradient id="s" x2="0" y2="100%"><stop offset="0" stop-color="#bbb" ' +
  'stop-opacity=".1"/><stop offset="1" stop-opacity=".1"/></linearGradient><clipPath id="r"><rect ' +
  'width="170" height="20" rx="3" fill="#fff"/></clipPath><g clip-path="url(#r)"><rect width="37" ' +
  'height="20" fill="#555"/><rect x="37" width="133" height="20" fill="#e05d44"/><rect width="170" ' +
  'height="20" fill="url(#s)"/></g><g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu ' +
  'Sans,sans-serif" text-rendering="geometricPrecision" font-size="110"><text aria-hidden="true" x="195" ' +
  'y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="270">error</text><text ' +
  'x="195" y="140" transform="scale(.1)" fill="#fff" textLength="270">error</text><text aria-hidden="true" ' +
  'x="1025" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="1230">invalid badge ' +
  'param/s</text><text x="1025" y="140" transform="scale(.1)" fill="#fff" textLength="1230">invalid badge ' +
  "param/s</text></g></svg>";

beforeAll(() => {
  return db.put({ views: testInitViews }, testKey);
});

afterAll(() => {
  return db.delete(testKey);
});

describe("Test json counter route", () => {
  test("JSON resp headers", async () => {
    const res = await request(app).get(`/${testKey}`);
    expect(res.status).toEqual(200);
    expect(res.headers["content-type"]).toMatch(/json/);
    expect(res.headers["cache-control"]).toEqual("max-age=0, no-cache, no-store, must-revalidate");
    expect(res.headers["access-control-allow-origin"]).toEqual("*");
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
    const res = await request(app).get("/non-exists-key?noIncrement=1");
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
    const res = await request(app).get("/non-exists-key/badge?color=pink&label=test+label&noIncrement=1");
    expect(res.status).toEqual(200);
    expect(res.body.toString()).toEqual(badgeExpected.replaceAll("%count", 0));
  });
  test("Error badge resp", async () => {
    const res = await request(app).get(`/${testKey}/badge?style=invalid-style`);
    expect(res.status).toEqual(400);
    expect(res.body.toString()).toEqual(errorBadgeExpected);
  });
});
