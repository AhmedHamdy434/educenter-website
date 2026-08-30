# Center Platform & Roles Integration Guide (دليل منصة المركز التعليمي وتكامل الواجهات)

> **Target Audience:** Frontend Engineering Team building the **Educational Center Web Application & Portals**.  
> **Scope:** **Single Tenant (Center-Scoped)** — Covers interactions for `OWNER`, `ADMIN`, `TEACHER`, `STUDENT`, and the Public **Parent Portal**.

---

## 1. Role Scopes & Permission Hierarchy

Every authenticated user in the Center application belongs to a specific educational center (`user.centerId`). The frontend must dynamically adapt navigation, screens, and action buttons based on the user's role:

```
                            ┌───────────────────────────────┐
                            │    Center Education Tenant    │
                            └───────────────┬───────────────┘
                                            │
            ┌───────────────────┬───────────┴───────────┬───────────────────┐
            ▼                   ▼                       ▼                   ▼
    ┌───────────────┐   ┌───────────────┐       ┌───────────────┐   ┌───────────────┐
    │     OWNER     │   │     ADMIN     │       │    TEACHER    │   │    STUDENT    │
    │  Center Owner │   │ Center Manager│       │ Class Teacher │   │Enrolled Pupil │
    └───────────────┘   └───────────────┘       └───────────────┘   └───────────────┘
```

---

## 2. Subscription Lifecycle & Grace Period Handling (Center Level)

### 2.1 Capturing the Grace Period Header
The backend returns a special warning header during the 3 days following subscription expiration:
```http
X-Subscription-Warning: Grace period active. X days remaining.
```

**Axios Interceptor Implementation:**
```typescript
apiClient.interceptors.response.use((response) => {
  const warningHeader = response.headers['x-subscription-warning'];
  if (warningHeader) {
    // Notify center state store
    useSubscriptionStore.getState().setWarning(warningHeader);
  }
  return response;
});
```

### 2.2 Who Sees the Grace Period Banner?
> [!IMPORTANT]
> **Role-Specific Banner Visibility:**  
> - **Display Banner For:** `OWNER` and `ADMIN` **ONLY**.  
> - **DO NOT Display For:** `TEACHER` and `STUDENT` (Teachers and Students are educational end-users and should not be burdened with billing/renewal warnings).

### 2.3 Read-Only Mode (After Grace Period)
When the 3-day grace period ends:
1. **Safe Reads (`GET`, `HEAD`, `OPTIONS`)**: Remain fully accessible so center staff can review records, student lists, and export data.
2. **Mutating Actions (`POST`, `PUT`, `PATCH`, `DELETE`)**: Blocked with `403 ForbiddenException`:
   `'اشتراك السنتر منتهي، برجاء التجديد لاستكمال الإضافة والتعديل.'`
3. **UI Adaptation for Owner/Admin:** Disable all "Add", "Create", "Edit", and "Delete" buttons with a tooltip: *"اشتراك المركز منتهي، يرجى التجديد لاستئناف العمليات"*.

---

## 3. Security & Authentication for Center Users

### 3.1 Mandatory Password Change (`mustChangePassword`)
- **Login Response (`POST /auth/login`)**:
  When `mustChangePassword === true` (common for new teachers, students, or admins created with default credentials):
  - The UI must open a mandatory modal (or route to `/change-password`).
  - Calls `PATCH /auth/change-password` with `{ currentPassword, newPassword }`.
  - Upon success, clears modal and enables normal app navigation.

### 3.2 Forgot & Reset Password Flow via OTP
1. **Forgot Password Screen (`POST /auth/forgot-password`)**:
   - Field: `email`.
   - Sends a 6-digit OTP code to the email (valid for 10 minutes).
   - Shows OTP input screen with a countdown timer.
2. **Reset Password Screen (`POST /auth/reset-password`)**:
   - Fields: `email`, `otp`, `newPassword`.
   - On success: Displays confirmation toast and redirects to login.

---

## 4. Center Owner Dashboard (`OWNER` Role)

The `OWNER` has unrestricted administrative and financial authority over their center:

### 4.1 Exclusive Capabilities
- **Center Administrators Management (`/admins`)**:
  - `GET /admins`: View list of appointed center managers.
  - `POST /admins`: Appoint a new manager with `fullName`, `email`, `phone`, `avatar`, and optional `password`. Credentials are automatically dispatched via WhatsApp.
- **Academic Catalog Creation**:
  - Only `OWNER` can execute `POST /grades` and `POST /subjects` (Admins can only view/update existing ones).
- **Center Subscription Overview (`GET /centers/my-subscription`)**:
  - View current plan limits, remaining days, student/teacher/subject quotas, and grace period status.

### 4.2 Full Operational Access
- Full management of Center Users (`/users`), Teachers, Students, Groups, Attendance, Payments, Audit Logs (`/audit-logs`), and Notifications (`/notifications`).

---

## 5. Center Administrator Dashboard (`ADMIN` Role)

Center Managers (`ADMIN`) perform daily operational tasks with strict privilege escalation safeguards:

### 5.1 Operational Capabilities
- **Manage Users (`/users`)**: Search, filter by role (`TEACHER`, `STUDENT`), and toggle active status.
- **Manage Academics & Classes**: Manage teachers, students, groups, enrollments, daily attendance sessions, and monthly fee collections.
- **Review Logs**: Access `/audit-logs` and `/notifications`.

### 5.2 Security Boundaries for Admin
> [!WARNING]
> **Hard Backend Restrictions for `ADMIN` Role:**
> 1. **No Access to `/admins`**: Admins cannot view or create other managers (returns `403 Forbidden`).
> 2. **Cannot Modify Owner or Peer Admins (`PATCH /users/:id`)**: The backend rejects attempts by an Admin to edit or disable the `OWNER` account or other `ADMIN` accounts.
> 3. **Cannot Create New Grades/Subjects**: Creation restricted to `OWNER`.
> 4. **Cannot Change User Roles**: Role field is immutable.

---

## 6. Teacher Portal (`TEACHER` Role)

The teacher interface is scoped strictly to academic execution for their assigned groups:

### 6.1 What the Teacher Sees & Manages
1. **Assigned Groups (`GET /groups`)**:
   - Only returns groups where `teacherId === currentTeacher.id`.
   - Cannot view other teachers' groups.
2. **Class Attendance (`/groups/:groupId/attendance/...`)**:
   - Open/retrieve today's session (`POST /groups/:groupId/attendance/session`).
   - Record student presence, absence, lateness, and excuse notes (`POST .../save`).
   - View group attendance reports and statistics.
3. **Student Tuition Status (`GET /students/:studentId/payments`)**:
   - Can inspect monthly payment status **only for students currently enrolled in the teacher's groups**.
4. **Generate Parent Magic Links (`POST /p/generate/:studentId`)**:
   - Teacher can generate a 30-day magic report link for any taught student to share with parents.
5. **Teacher Profile (`GET /auth/me`, `GET /teachers/:id`)**:
   - View assigned subjects and basic profile details.

### 6.2 What is Hidden from Teachers
- Center subscription warnings, financial totals, audit logs, center settings, other teachers' profiles/salaries, and inactive/unassigned groups.

---

## 7. Student Portal (`STUDENT` Role)

The student interface is a **clean, read-only personal progress dashboard**:

### 7.1 What the Student Sees
1. **Enrolled Groups (`GET /groups`)**:
   - Lists only the active groups in which the student is enrolled (`GroupStudent`).
   - Displays schedule, assigned teacher name, subject, and group name.
2. **Personal Attendance Records (`GET /students/me/attendance/report`)**:
   - Attendance percentage, total sessions, counts of Present, Absent, Late, and Excused.
   - Detailed session history with dates and recorded absence reasons.
3. **Personal Tuition Payment History (`GET /students/:studentId/payments`)**:
   - List of paid monthly fees, dates of payment, and enrolled group fee receipts.
4. **Personal Profile (`GET /auth/me`)**:
   - Student info, grade level, and parent contact details.

### 7.2 Strict Student Isolation
- Students cannot view other students' records, group-wide attendance matrices, payment statuses of peers, or any administrative settings.

---

## 8. Parent Magic Link Portal (`/p/:token`)

A zero-friction, public mobile-responsive web view for parents that does not require login or passwords:

```
                            ┌───────────────────────────────┐
                            │      Parent Magic Report      │
                            │        (GET /p/:token)        │
                            └───────────────┬───────────────┘
                                            │
         ┌──────────────────────────────────┼──────────────────────────────────┐
         ▼                                  ▼                                  ▼
┌──────────────────┐               ┌──────────────────┐               ┌──────────────────┐
│ Attendance Rates │               │ Enrolled Groups  │               │ Monthly Tuition  │
│   & Absence Log  │               │   & Subjects     │               │  Payment Status  │
└──────────────────┘               └──────────────────┘               └──────────────────┘
```

### 8.1 Generating the Link (Staff Action)
- Available to `OWNER`, `ADMIN`, and `TEACHER` on the student profile page.
- Calling `POST /p/generate/:studentId` returns a 30-day token.
- UI Action: Button to **"Copy Parent Link"** (`https://center-domain.com/p/{token}`) or **"Send via WhatsApp"**.

### 8.2 Parent Report Screen Details
- **Student Profile**: Name, grade, center name, and center contact information.
- **Attendance Summary**: Total sessions, attendance percentage, and dates of any unexcused absences.
- **Academic Enrollment**: List of current groups, subjects, and teachers.
- **Tuition & Payment Status**: Transparent view of paid vs pending months for each enrolled subject.
