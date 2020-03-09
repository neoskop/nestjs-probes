export type ProbeCheck = () => Promise<boolean> | boolean;
export type ProbeType = "startup" | "readiness" | "liveness";
