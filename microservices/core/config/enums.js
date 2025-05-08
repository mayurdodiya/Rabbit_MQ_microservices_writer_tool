const enums = {
  complexity: ["A", "B", "C", "D"],

  HTTP_CODES: {
    BAD_REQUEST: 400,
    DUPLICATE_VALUE: 409,
    FORBIDDEN: 403,
    INTERNAL_SERVER_ERROR: 500,
    METHOD_NOT_ALLOWED: 405,
    MOVED_PERMANENTLY: 301,
    NO_CONTENT_FOUND: 204,
    NOT_ACCEPTABLE: 406,
    NOT_FOUND: 404,
    OK: 200,
    PERMANENT_REDIRECT: 308,
    UNAUTHORIZED: 401,
    UPGRADE_REQUIRED: 426,
    VALIDATION_ERROR: 422,
  },

  ROLE: {
    SUPER_ADMIN: "SuperAdmin",
    USER: "User",
    CLIENT: "Client",
    ADMIN: "Admin",
    INVESTOR: "investor",
    COMPANY: "company",
    STARTUP_EMPLOYEE: "employee",
    FUND_MANAGER: "fundManager",
    VC_MANAGER: "vcManager",
    BACK_OFFICE: "backOffice",
  },

  COMPANY_REQUEST_STATUS: {
    LEAD: "LEAD",
    CONTACT_MADE: "CONTACT_MADE",
    PROPOSAL_MADE: "PROPOSAL_MADE",
    NEGOTIATIONS_STARTED: "NEGOTIATIONS_STARTED",
    REJECTED: "REJECTED",
    COMPLETED: "COMPLETED",
    COMPANYCREATED: "COMPANYCREATED",
  },

  BLOG_STATUS: {
    DRAFT: "Draft",
    PENDING: "Pending",
    APPROVED: "Approved",
    REJECTED: "Rejected",
  },

  RMQ_ROUTING_KEYS: {
    USER_SERVICE: "User-Key",
    ADMIN_SERVICE: "Admin-Key",
    EVENT_SERVICE: "Event-Key",
  },

  RMQ_QUEUS: {
    MESSAGE_QUEUE: "Message-Queue",
  },
};

module.exports = enums;
