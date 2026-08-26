/** Demo credentials for local / hackathon presentations. */
export const DEMO_CLERK = {
  pin: "1234",
  loginPath: "/admin/login",
} as const;

export const DEMO_FAMILY = {
  name: "Jane Kamau",
  email: "family@demo.hakitrack.test",
  phone: "254711111111",
  caseNumber: "CR-2026-089",
  loginPath: "/family/login",
} as const;

export const DEMO_ACCOUNTS = {
  clerk: DEMO_CLERK,
  family: DEMO_FAMILY,
} as const;
