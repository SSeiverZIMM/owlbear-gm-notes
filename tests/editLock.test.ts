import { beforeEach, describe, expect, it } from "vitest";
import { LOCK_TTL, forgetLocks, lockHolder, lockLapsesIn, noteLockSeen } from "../src/editLock";

const ana = { uid: "ana", name: "Ana", at: 1000 };

describe("edit locks", () => {
  beforeEach(() => forgetLocks());

  it("someone else's lock holds until it lapses, counted from when it was seen here", () => {
    noteLockSeen("n1", ana, 50_000);
    expect(lockHolder("n1", "beto", 50_000)).toEqual(ana);
    expect(lockHolder("n1", "beto", 50_000 + LOCK_TTL)).toEqual(ana);
    expect(lockHolder("n1", "beto", 50_000 + LOCK_TTL + 1)).toBeNull();
    expect(lockLapsesIn("n1", "beto", 60_000)).toBe(LOCK_TTL - 10_000);
  });

  it("one's own lock never blocks", () => {
    noteLockSeen("n1", ana, 0);
    expect(lockHolder("n1", "ana", 0)).toBeNull();
    expect(lockLapsesIn("n1", "ana", 0)).toBe(0);
  });

  it("a renewal (a new server time) restarts the count; the same one seen again doesn't", () => {
    noteLockSeen("n1", ana, 0);
    noteLockSeen("n1", ana, 40_000);
    expect(lockHolder("n1", "beto", LOCK_TTL + 1)).toBeNull();
    noteLockSeen("n1", { ...ana, at: 2000 }, 40_000);
    expect(lockHolder("n1", "beto", LOCK_TTL + 1)).toEqual({ ...ana, at: 2000 });
  });

  it("a lock let go is free at once", () => {
    noteLockSeen("n1", ana, 0);
    noteLockSeen("n1", null, 10);
    expect(lockHolder("n1", "beto", 10)).toBeNull();
  });

  it("nobody known here yet (a player before their first edit): any lock is someone else's", () => {
    noteLockSeen("n1", ana, 0);
    expect(lockHolder("n1", null, 0)).toEqual(ana);
  });
});
