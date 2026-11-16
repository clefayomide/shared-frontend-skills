---
name: frontend-security
description: Standards and guidelines for securing frontend applications, including XSS prevention, authentication, session management, CSRF protection, secure routing, Content Security Policy, input validation, browser security, and dependency supply-chain security. Use when designing authentication flows, handling sensitive data, implementing API integrations, reviewing frontend code, or auditing application security.
---

# Frontend Security Standards & Guidelines

## 1. Core Security Principles

- **Security by Default**: Treat security as a fundamental engineering requirement throughout application design, implementation, testing, and deployment.
- **Defense in Depth**: Never rely on a single security mechanism. Combine browser protections, application-level controls, and backend enforcement.
- **Least Privilege**: Grant users, components, services, and third-party integrations only the permissions they require.
- **Zero Trust**: Never assume client-side state, user input, URL parameters, or API responses are trustworthy.
- **Secure Defaults**: Prefer secure browser APIs, framework protections, and established security libraries over custom implementations.
- **Backend Enforcement (BFF)**: Never treat frontend validation, hidden UI elements, route guards, or client-side authorization checks as security boundaries.
- **Fail Securely**: When security checks fail, deny the operation rather than silently allowing it.
- **Avoid Security Through Obscurity**: Do not rely on hidden routes, minification, obfuscation, or undisclosed frontend configuration to protect sensitive functionality.

## 2. XSS (Cross-Site Scripting) Prevention

- **Default JSX Escaping**: Rely on React's built-in JSX escaping for ordinary text interpolation. Do not assume it protects every DOM operation, HTML attribute, URL, or third-party library.
- **Unsafe HTML Rendering**:
  - Avoid `dangerouslySetInnerHTML` unless HTML rendering is genuinely required.
  - Never inject raw, unsanitized user-controlled HTML.
  - Use a maintained sanitization library such as DOMPurify when rendering untrusted HTML.
  - Configure sanitization according to the permitted HTML elements, attributes, and URL schemes.
- **DOM Manipulation**: Avoid unsafe DOM APIs such as `innerHTML`, `outerHTML`, and `document.write` when handling untrusted content.
- **Safe DOM APIs**: Prefer `textContent`, safe DOM properties, and framework-managed rendering for dynamic content.
- **URL Injection**: Validate user-controlled URLs before using them in `href`, `src`, iframe sources, or navigation APIs. Restrict allowed protocols and destinations where appropriate.
- **CSS Injection**: Avoid inserting untrusted values into CSS, style declarations, or dynamically generated selectors without appropriate validation.
- **DOM-Based XSS**: Treat values from URL parameters, fragments, browser storage, postMessage events, and API responses as untrusted.
- **Template and Expression Evaluation**: Never evaluate untrusted input using `eval()`, `new Function()`, or equivalent dynamic execution mechanisms.
- **Third-Party Libraries**: Review libraries that manipulate HTML or the DOM to ensure they do not introduce unsafe rendering paths.

## 3. Authentication, Sessions & Token Management

- **Prefer BFF Architecture**: Where practical, use a Backend-for-Frontend (BFF) pattern so browser JavaScript does not need direct access to long-lived authentication credentials.
- **Secure Session Cookies**:
  - Prefer server-managed session cookies using `HttpOnly` and `Secure`.
  - Set an appropriate `SameSite` policy (`Strict`, `Lax`, or `None`) based on authentication flows and cross-site requirements.
  - Use `SameSite=None` only when cross-site cookie behavior is required, and always combine it with `Secure`.
  - Set an appropriate expiration using `Max-Age` or `Expires`.
  - Restrict cookie scope using the narrowest practical `Domain` and `Path` attributes.
  - Consider the `__Host-` cookie prefix for host-bound session cookies where its requirements are suitable.
- **Token Storage**:
  - Never store session identifiers, access tokens, refresh tokens, or credentials in `localStorage` or `sessionStorage`.
  - Avoid storing sensitive authentication material in IndexedDB or other JavaScript-accessible persistent storage.
  - Prefer short-lived, server-managed sessions over long-lived browser-held credentials.
- **In-Memory Tokens**: If an architecture requires browser-held access tokens, keep them short-lived and in memory where possible. Understand that malicious JavaScript can still access tokens held in application memory.
- **Token Lifecycle**:
  - Implement appropriate token expiration and refresh mechanisms.
  - Rotate session identifiers after authentication and privilege changes.
  - Invalidate sessions during logout and account security events.
  - Avoid exposing tokens in URLs, logs, analytics, error reports, or browser history.
- **Authentication Flows**:
  - Use established authentication protocols and libraries rather than custom cryptographic implementations.
  - For OAuth 2.0 and OpenID Connect browser flows, use Authorization Code Flow with PKCE where applicable.
  - Validate OAuth `state`, OIDC `nonce`, and redirect URI requirements.
  - Do not expose client secrets in frontend source code or environment variables bundled into the application.
- **XSS Consideration**: `HttpOnly` prevents JavaScript from reading a cookie but does not prevent malicious JavaScript from making authenticated requests through the user's browser.

## 4. Authorization & Access Control

- **Server-Side Authorization**: Enforce access control on the backend for every protected resource and sensitive operation.
- **Client-Side Route Guards**: Use route guards to improve navigation and user experience, not as the actual authorization mechanism.
- **UI Permissions**: Hiding buttons, menus, or actions does not prevent users from invoking the underlying API directly.
- **Role and Permission Checks**: Treat permissions received from the backend as display guidance. The backend must independently verify authorization.
- **Object-Level Authorization**: Never assume a user can access a resource simply because its identifier is available in the frontend.
- **Privilege Boundaries**: Do not trust client-supplied roles, account identifiers, tenant IDs, or permission claims without server-side verification.
- **Sensitive Operations**: Require appropriate server-side authorization and, where necessary, additional verification for high-risk actions.

## 5. CSRF (Cross-Site Request Forgery) Prevention

- **Cookie-Based Authentication**: Treat cookie-authenticated state-changing requests as potential CSRF targets.
- **Backend Enforcement**: CSRF protection must be enforced by the backend, not solely by frontend request logic.
- **CSRF Tokens**: Use an appropriate server-validated CSRF token mechanism for cookie-authenticated requests where required.
- **SameSite Cookies**: Use `SameSite` as an additional CSRF defense, not as the only protection.
- **Origin Validation**: Validate the `Origin` header and, where appropriate, `Referer` as part of the backend's CSRF defense.
- **HTTP Methods**:
  - Use `GET` and other safe methods only for read-only operations.
  - Do not perform state-changing operations through `GET` requests.
  - Use appropriate methods such as `POST`, `PUT`, `PATCH`, and `DELETE` for state changes.
- **Custom Request Headers**: For APIs designed to require custom headers, ensure the backend validates them as part of its CSRF strategy.
- **Credentialed Requests**: Understand when `fetch` or Axios sends cookies, including the implications of `credentials: "include"` and Axios `withCredentials`.
- **CSRF Limitations**: Do not assume CORS, custom headers, or client-side request interceptors independently provide complete CSRF protection.

## 6. Secure Routing & Open Redirect Prevention

- **Redirect Validation**: Validate user-controlled redirect destinations before navigation.
- **Relative URL Preference**: Prefer known internal route paths over arbitrary URLs supplied through query parameters.
- **Trusted Origins**: When absolute URLs are necessary, parse and validate them against an explicit allowlist of trusted origins.
- **Protocol Restrictions**: Reject unsafe protocols such as `javascript:` and unexpected schemes.
- **Protocol-Relative URLs**: Reject untrusted destinations beginning with `//` or other URL forms that can escape the intended origin.
- **URL Parsing**: Use the platform `URL` API for parsing and validating destinations rather than relying on fragile string-prefix checks.
- **Route Parameters**: Treat URL parameters, path segments, and fragments as untrusted input.
- **Sensitive Data**: Never place authentication tokens, passwords, session identifiers, or other sensitive information in URLs.
- **Server-Side Validation**: Apply equivalent redirect validation on the backend wherever server-side redirects are supported.

## 7. Content Security Policy (CSP) & Security Headers

- **CSP Enforcement**: Define and enforce a Content Security Policy appropriate for the application.
- **Avoid Unsafe Directives**:
  - Avoid `'unsafe-inline'` for scripts where possible.
  - Avoid `'unsafe-eval'`.
  - Prefer nonce-based or hash-based script authorization.
  - Use `strict-dynamic` where appropriate and supported by the application's CSP design.
- **Resource Restrictions**: Define restrictive directives for scripts, styles, images, fonts, connections, frames, and other resource types.
- **Trusted Origins**: Allow only necessary and trusted origins. Avoid broad wildcards.
- **Third-Party Scripts**: Minimize third-party scripts and assess their security implications before adding them to the application.
- **CSP Reporting**: Configure CSP reporting where supported to identify policy violations and investigate unexpected resource execution.
- **Deployment Configuration**: Configure CSP and other HTTP security headers at the server, reverse proxy, CDN, or hosting layer as appropriate.
- **Additional Security Headers**: Evaluate and configure:
  - `Strict-Transport-Security` (HSTS).
  - `X-Content-Type-Options: nosniff`.
  - `Referrer-Policy`.
  - `frame-ancestors` through CSP to control framing and reduce clickjacking risks.
  - `Permissions-Policy` to restrict unnecessary browser capabilities.
- **Header Ownership**: Ensure security headers are consistently applied across application routes, including error pages and dynamically rendered responses.
- **CSP Compatibility**: Do not weaken CSP merely to accommodate an insecure dependency or unnecessary inline execution.

## 8. Input Validation & Data Handling

- **Treat Input as Untrusted**: Validate data originating from forms, URL parameters, browser storage, postMessage events, and external APIs.
- **Schema Validation**: Use schema validation libraries such as Zod to validate expected data structures and types.
- **Runtime Validation**: TypeScript types provide compile-time guarantees, not runtime validation. Validate external data at runtime.
- **Validation Boundaries**:
  - Validate user input in the frontend for usability and immediate feedback.
  - Validate all untrusted input again on the backend before processing or persisting it.
  - Never treat frontend validation as a security boundary.
- **Allowlist Validation**: Prefer explicit allowlists for accepted values, formats, and enumerations over broad denylist-based validation.
- **Output Encoding**: Apply context-appropriate output encoding or sanitization when displaying untrusted data.
- **Prototype Pollution**:
  - Avoid unsafe recursive object merging and assignment of untrusted object properties.
  - Reject dangerous property names such as `__proto__`, `constructor`, and `prototype` where relevant.
  - Prefer well-maintained libraries and safe object construction patterns.
- **Sensitive Data**: Avoid exposing credentials, secrets, personal information, or confidential business data in client-side state, logs, or error messages.
- **Data Minimization**: Only request, retain, and expose the information required for the current operation.

## 9. API Communication, CORS & Network Security

- **HTTPS Only**: Ensure application APIs and sensitive resources are accessed over HTTPS.
- **Mixed Content**: Avoid loading insecure HTTP resources from HTTPS pages.
- **CORS Configuration**:
  - Configure CORS on the backend using explicit trusted origins.
  - Avoid wildcard origins for credentialed or sensitive API access.
  - Never blindly reflect arbitrary `Origin` header values.
  - Allow only the necessary methods and request headers.
- **CORS Limitations**: CORS is a browser-enforced cross-origin access policy, not authentication, authorization, or a general CSRF defense.
- **Credentialed Requests**: Ensure cross-origin credential handling is intentional and compatible with cookie and CORS policies.
- **API Destinations**: Avoid sending sensitive information to arbitrary URLs supplied by users or external responses.
- **Request Interceptors**: Do not attach authentication tokens or sensitive headers indiscriminately to every outgoing request. Restrict credentials to trusted API destinations.
- **Error Handling**: Avoid exposing internal stack traces, infrastructure details, secrets, or sensitive backend responses to users.
- **Retry Logic**: Ensure retries do not unintentionally duplicate sensitive or non-idempotent operations.

## 10. Browser Messaging, Iframes & Third-Party Integrations

- **postMessage Validation**:
  - Validate the sender's `origin` before processing incoming messages.
  - Validate message structure and expected data types.
  - Use an explicit `targetOrigin` instead of `*` when sending sensitive messages.
  - Never trust message content solely because it comes from an iframe.
- **Iframe Security**:
  - Use the `sandbox` attribute where appropriate.
  - Grant only the minimum required iframe permissions.
  - Configure CSP `frame-src` and `frame-ancestors` according to the intended integration.
- **Third-Party Integrations**:
  - Review the security and privacy implications of external SDKs, scripts, widgets, and embedded content.
  - Load resources only from trusted sources.
  - Use Subresource Integrity (SRI) for eligible externally hosted static resources.
  - Avoid exposing authentication credentials or sensitive application data to third-party scripts.
- **Payment Integrations**:
  - Prefer hosted payment fields, hosted checkout, or provider-controlled secure components when handling card details.
  - Never store raw card numbers, CVVs, or other prohibited payment credentials in application storage or logs.
  - Verify payment results and transaction status through trusted backend or payment-provider communication, not solely through browser callbacks or query parameters.

## 11. File Uploads & Downloads

- **File Type Validation**: Treat file extensions and browser-provided MIME types as untrusted. The backend must independently validate file content and type.
- **File Size Limits**: Enforce upload size and resource limits.
- **File Content**: Do not assume uploaded files are safe because they have an allowed extension.
- **File Previews**: Handle user-provided files carefully when rendering previews. Avoid interpreting untrusted file content as executable HTML or script.
- **Object URLs**: Revoke temporary object URLs created with `URL.createObjectURL()` when they are no longer required.
- **Downloads**: Avoid constructing download destinations from untrusted input. Use safe filenames and appropriate server response headers.
- **Server-Side Processing**: Malware scanning, file validation, authorization, and secure storage must be handled by appropriate backend services.

## 12. Dependency & Supply Chain Security

- **Dependency Auditing**: Integrate automated vulnerability scanning into development and CI/CD workflows using tools such as `npm audit`, Snyk, or equivalent solutions.
- **Lockfiles**: Commit and consistently use the package manager lockfile (`package-lock.json`, `pnpm-lock.yaml`, or equivalent) to ensure reproducible dependency resolution.
- **Version Management**:
  - Avoid uncontrolled dependency upgrades.
  - Review dependency updates, especially major versions and security-related changes.
  - Use intentional version ranges and lockfile enforcement.
- **Package Integrity**: Use trusted package registries and verify package integrity where supported.
- **Dependency Provenance**: Evaluate package maintainers, release history, ownership changes, maintenance status, and unexpected dependency behavior.
- **Minimize Dependencies**: Avoid introducing packages for functionality that can be implemented safely with existing platform APIs or established project utilities.
- **Transitive Dependencies**: Review vulnerabilities and risks in transitive dependencies, not just direct dependencies.
- **CI/CD Enforcement**: Establish appropriate vulnerability thresholds and remediation policies. Do not automatically suppress security findings without investigation.
- **Secret Scanning**: Use automated secret detection to prevent credentials, API keys, and private configuration from entering source control.
- **Build Artifacts**: Ensure frontend build outputs do not contain private keys, server-only environment variables, or other sensitive configuration.

## 13. Client-Side Storage & Browser Security

- **Storage Classification**: Classify browser data according to sensitivity, persistence requirements, and exposure risks before choosing a storage mechanism.
- **localStorage and sessionStorage**:
  - Do not store authentication credentials, session identifiers, or sensitive secrets.
  - Treat stored values as untrusted and validate them before use.
  - Avoid persisting sensitive personal or financial information unnecessarily.
- **IndexedDB**: Do not assume IndexedDB provides confidentiality or protects data from malicious JavaScript executing in the same origin.
- **Cookies**: Use server-managed secure cookies for session management where appropriate.
- **Cache Storage**: Avoid caching sensitive authenticated responses unless caching is explicitly designed and access is properly controlled.
- **Service Workers**: Review service worker registration, scope, update behavior, caching logic, and message handling for security risks.
- **Client Configuration**: Treat all configuration bundled into frontend applications as public, including variables exposed through framework-specific public environment prefixes.
- **Secrets**: Never embed private API keys, database credentials, signing keys, service account credentials, or backend secrets in frontend code.

## 14. Security Testing & Validation

- **Static Analysis**: Use appropriate static analysis and security linting tools to identify insecure patterns.
- **Dependency Scanning**: Run vulnerability audits for direct and transitive dependencies.
- **Secret Detection**: Scan source code, commits, and build artifacts for accidentally exposed credentials.
- **XSS Testing**: Test untrusted input across rendering contexts, including HTML, attributes, URLs, and DOM manipulation.
- **Authentication Testing**: Verify session lifecycle, token expiration, logout, refresh behavior, and authentication failure handling.
- **Authorization Testing**: Verify that protected operations remain inaccessible when client-side route guards or UI restrictions are bypassed.
- **CSRF Testing**: Verify that cookie-authenticated state-changing requests are protected against unauthorized cross-site requests.
- **Redirect Testing**: Test internal and external redirect handling, including protocol-relative and unsafe URL schemes.
- **CSP Testing**: Verify that the configured CSP blocks unauthorized script execution and unexpected resource loading.
- **API Security Testing**: Validate CORS behavior, credential handling, error responses, and request destination restrictions.
- **Integration Testing**: Test security-sensitive flows such as authentication, payment initiation, session expiration, and permission-dependent operations.
- **Manual Review**: Automated scanners cannot identify every security issue. Perform manual threat analysis and code review for sensitive flows.
- **Backend Collaboration**: Coordinate with backend engineers to verify controls that cannot be established from frontend code alone.

## 15. Security Review & Reporting

When reviewing frontend code for security:

- Identify the affected component, feature, API integration, or user flow.
- Describe the vulnerability, its attack scenario, and potential impact.
- Identify the trust boundary being violated.
- Distinguish frontend implementation defects from backend enforcement gaps.
- Classify findings by severity:
  - **Critical**: A vulnerability enabling severe compromise, such as account takeover, arbitrary code execution, or exposure of highly sensitive data.
  - **High**: A significant vulnerability that could compromise authentication, authorization, sensitive data, or important application functionality.
  - **Medium**: A vulnerability with limited exploitability or impact that still requires remediation.
  - **Low**: A security weakness with limited direct impact or a defense-in-depth improvement.
  - **Informational**: A security observation or recommendation that does not represent a confirmed vulnerability.
- Provide actionable remediation guidance.
- Avoid reporting theoretical risks as confirmed vulnerabilities without sufficient evidence.
- Prioritize findings based on exploitability, impact, exposure, and affected users.

## 16. AI-Assisted Security Review Guidelines

When using AI tools to review or generate frontend code:

- Treat generated code as untrusted until reviewed and tested.
- Verify authentication, authorization, token handling, and cryptographic recommendations against established security practices.
- Do not allow AI-generated code to introduce unsafe DOM manipulation, dynamic code execution, or insecure storage patterns.
- Review generated dependencies and installation commands before accepting them.
- Never provide production secrets, private keys, credentials, or sensitive customer information to AI tools.
- Require human review for security-critical changes.
- Do not assume that generated code is secure because it follows framework conventions.

## 17. Final Security Checklist

Before considering an implementation complete, verify:

- [ ] Untrusted content is rendered safely.
- [ ] Unsafe HTML injection and dynamic code execution are avoided.
- [ ] Authentication credentials and session identifiers are not stored in browser-accessible persistent storage.
- [ ] Session cookies use appropriate security attributes.
- [ ] Authentication and authorization are enforced by the backend.
- [ ] Redirect destinations are validated against trusted destinations.
- [ ] Cookie-authenticated state-changing requests have appropriate CSRF protection.
- [ ] CSP and relevant security headers are configured.
- [ ] External input is validated at runtime and revalidated by the backend.
- [ ] API destinations and credential forwarding are restricted to trusted origins.
- [ ] CORS is configured intentionally and is not mistaken for an authorization mechanism.
- [ ] Iframe and postMessage integrations validate origins and permissions.
- [ ] Sensitive data is not exposed through logs, URLs, client bundles, or third-party integrations.
- [ ] File uploads and downloads follow appropriate security controls.
- [ ] Dependencies are audited and lockfiles are maintained.
- [ ] Secrets are excluded from source code and frontend build artifacts.
- [ ] Security-sensitive flows have appropriate automated and manual tests.
- [ ] No known critical or high-severity security vulnerabilities remain.
