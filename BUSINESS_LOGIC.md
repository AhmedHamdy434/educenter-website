# EduCenter Frontend — Business Logic & Implementation Documentation

> **Document Status:** Comprehensive Frontend Codebase Analysis (Verified against App Router Pages, Layouts, Features, Server Actions, TanStack Query Hooks, Zustand Stores, and Proxy Middleware)  
> **Frontend Architecture:** Next.js 16 (Turbopack, App Router), React 19, TypeScript, Tailwind CSS v4, TanStack Query v5, TanStack Table v8, React Hook Form + Zod, Zustand, Motion, Sonner  
> **Target Audience:** Engineering Team, Backend Developers, UI/UX Designers, and Product Managers

---

## 1. Frontend Architectural Overview

EduCenter Frontend is a modern **Next.js 16 App Router application** built with a **Feature-Based Modular Architecture**. It delivers a high-performance, accessible (WCAG 2.2 AA), and responsive Arabic (RTL) interface for three distinct user roles (**Center Owner**, **Teacher / Instructor**, and **Student**), alongside a public landing page and authentication portal.

```
src/
├── app/
│   ├── (landing)/                    # Public guest routes (Landing page, Login)
│   │   ├── layout.tsx                # Header + Footer layout
│   │   ├── page.tsx                  # Marketing Landing Page
│   │   └── login/page.tsx            # Login Page
│   └── (logged-in)/
│       └── dashboard/                # Protected role-scoped dashboard layouts
│           ├── layout.tsx            # Dashboard shell (Sidebar + DashboardHeader)
│           ├── (center-owner)/       # Center Owner / Admin views
│           ├── (instructor)/         # Teacher / Instructor views
│           └── (student)/            # Student portal views
├── components/                       # Global reusable UI (ui/, common/, layout/)
├── features/                         # Domain modules (auth, grades, subjects, teachers, students, groups, attendance, landing)
├── hooks/ / providers/               # Global React Query Provider, Custom Hooks
├── lib/                              # API Client (serverApiClient), toast handlers, utils (cn)
├── proxy.ts                          # Next.js 16 Route Protection, Role Redirects & Auth Proxy
└── types/                            # Global TypeScript types and API interfaces
```

---

## 2. Authentication, Role Routing & Next.js 16 Proxy (`proxy.ts`)

### 2.1 Route Protection & Redirection Logic
Routing and role-based protection are handled natively in `src/proxy.ts` using the Next.js 16 named export `proxy` function:

```
                                  Incoming Request
                                         │
                         ┌───────────────┴───────────────┐
                         ▼                               ▼
                   Has Token?                        No Token?
                         │                               │
            ┌────────────┴────────────┐                  ├─ Public route (/, /login) ──► Allow
            ▼                         ▼                  └─ Protected (/dashboard/*) ──► Redirect to /login
       Valid & Active?         Expired/Invalid?
            │                         │
            │                         ├─ Delete 'token' cookie
            │                         ├─ Strip Cookie from request headers
            │                         └─ Redirect to /login (if protected)
            ▼
   Route Role Matching:
   ├─ Request /login ────────────────────────► Redirect to Role Dashboard
   ├─ Role OWNER   ──► /dashboard/center-owner/*
   ├─ Role TEACHER ──► /dashboard/instructor/*
   └─ Role STUDENT ──► /dashboard/student/*
```

* **Token Lifecycle & Safe Cleanup**:
  - `decodeJwt(token)` parses the JWT payload in Edge runtime and verifies `payload.exp * 1000 >= Date.now()`.
  - If a token is expired or corrupted, the proxy automatically strips the `Cookie` header from incoming request headers and adds `response.cookies.delete("token")`.
  - This prevents Server Components (such as `<Header />`) from throwing `401 Unauthorized` console errors during server rendering.
* **Role Mappings**:
  - `UserRole.OWNER` $\rightarrow$ `/dashboard/center-owner`
  - `UserRole.TEACHER` $\rightarrow$ `/dashboard/instructor`
  - `UserRole.STUDENT` $\rightarrow$ `/dashboard/student`

---

## 3. Standard Feature Folder Pattern

Every business feature in `src/features/<feature>/` strictly implements the **Standard 7-Subfolder Architecture**:

```
src/features/<feature-name>/
├── actions/             # Next.js Server Actions ("use server") wrapping serverApiClient
├── components/          # Feature UI (ListClient, FormModal, Details, Columns)
├── hooks/               # TanStack Query custom queries (queries.ts) and mutations (mutations.ts)
├── schemas/             # Zod validation schemas (<feature>-schema.ts)
├── state/               # Zustand modal and selection stores (use<Feature>Modal.ts)
├── types/               # TypeScript interfaces and DTOs
└── utils/               # Domain-specific helpers and formatters
```

### Core UI Component Pattern
1. **`<Feature>sListClient.tsx`** (Client Orchestrator):
   - Composes `<PageHeader>` (with action button triggering Zustand modal), `<TableSearch>`, `<FilterDropdown>`, `<SharedTable>`, and `<SharedModal>`.
2. **`<Feature>Form.tsx`** (Modal Form):
   - Managed via `react-hook-form` + `zodResolver(<feature>Schema)`.
   - Uses standardized inputs: `<FormInput>`, `<FormSelect>`, `<FormMultiSelect>`, and `<FormActions>`.
3. **`columns.tsx`** (Table Definitions):
   - Exports `get<Feature>Columns({ onEdit, onToggleStatus, togglingId })` returning TanStack Table column definitions with badges and action buttons.
4. **`use<Feature>Modal.ts`** (Zustand Store):
   - Manages `{ isOpen, mode: 'create' | 'edit', initialData, openModal, closeModal }`.

---

## 4. Role Dashboards & Feature Implementations

---

### 4.1 Marketing & Public Portal (`(landing)`)

#### 1. Landing Page (`/`)
* **Layout (`Header` & `Footer`)**:
  - Dynamic Header: Calls `getCurrentUser()` to render "لوحة التحكم" if logged in, or "تسجيل الدخول" if guest.
  - Smooth anchor navigation: `#hero`, `#features`, `#pricing`, `#testimonials`, `#contact`.
* **Components**:
  - `<Hero>`: Value proposition, CTA buttons, social proof avatar stack (+10,000 centers), and animated student illustration.
  - `<Features>`: 6 core capabilities (student management, groups, attendance, automated reports, billing, exams).
  - `<Pricing>`: Pricing plans fetched dynamically or statically with monthly/yearly toggle.
  - `<Testimonials>`: Client reviews carousel with ratings.
  - `<CTA>`: Conversion banner.
  - `<ContactUs>`: Interactive contact form with phone, email, and location.

#### 2. Login Page (`/login`)
* Split-screen layout with emerald marketing branding and `<LoginForm>`.
* Supports login by **Email** or **Phone Number**.
* Submits via `loginAction(data)`, stores HTTP-only `token` cookie (7 days duration), and triggers client-side redirect to dashboard.

---

### 4.2 Center Owner Dashboard (`/dashboard/center-owner`)

Designed for **Center Owners and Administrators** to manage the operational and academic lifecycle of the center.

```
Center Owner Dashboard
├── 1. Overview (/dashboard/center-owner)
├── 2. Grades Management (/dashboard/center-owner/grades)
├── 3. Subjects Management (/dashboard/center-owner/subjects)
├── 4. Teachers Management (/dashboard/center-owner/teachers)
├── 5. Students Management (/dashboard/center-owner/students)
├── 6. Groups Management (/dashboard/center-owner/groups)
│      └── Group Details (/dashboard/center-owner/groups/[id])
│           ├── Tab 1: Enrolled Students List
│           ├── Tab 2: Daily Attendance Tracking
│           ├── Tab 3: Attendance & Absence Reports
│           └── Tab 4: Student Monthly Payments Matrix
├── 7. Subscription Plan (/dashboard/center-owner/subscription) [Shell]
├── 8. Exams Management (/dashboard/center-owner/exams) [Shell]
└── 9. Center Settings (/dashboard/center-owner/settings) [Shell]
```

#### Detailed Owner Features:

#### 1. Grades (`/dashboard/center-owner/grades`)
- **List View**: Displays all academic grades with `order`, description, active badges, and action dropdowns.
- **Create / Edit Modal**: Form inputs for `name`, `order`, `description`, and `isActive`.
- **Status Toggle**: Instant status switch triggering optimistic UI updates and cache invalidation.
- **Server Actions**: `getGrades`, `createGradeAction`, `updateGradeAction`, `toggleGradeStatusAction`.

#### 2. Subjects (`/dashboard/center-owner/subjects`)
- **List View**: Filterable by `gradeId` dropdown and text search.
- **Create / Edit Modal**: Select associated `gradeId`, enter `name`, `description`, and active state.
- **Server Actions**: `getSubjects`, `createSubjectAction`, `updateSubjectAction`, `toggleSubjectStatusAction`.

#### 3. Teachers (`/dashboard/center-owner/teachers`)
- **List View**: Displays teacher avatar, name, phone, email, specialization, salary, assigned subjects count, and status.
- **Create / Edit Modal**: Inputs for full name, email, phone, password (optional), specialization, salary, bio, and multi-select dropdown for `subjectIds`.
- **Server Actions**: `getTeachers`, `createTeacherAction`, `updateTeacherAction`, `toggleTeacherStatusAction`.

#### 4. Students (`/dashboard/center-owner/students`)
- **List View**: Displays student name, phone, email, parent phone, grade badge, enrollment date, and action menu.
- **Create / Edit Modal**: Full name, email, phone, parent phone, grade selection, notes, and password.
- **Payments History Modal**: Clicking "سجل المدفوعات" opens `<StudentPaymentsModal>` displaying all historical payments made by this student across all groups.
- **Server Actions**: `getStudents`, `createStudentAction`, `updateStudentAction`, `toggleStudentStatusAction`, `getStudentPaymentsAction`.

#### 5. Groups (`/dashboard/center-owner/groups`)
- **List View**: Displays group name, grade, subject, teacher name, schedule pills, capacity progress bar (`enrolled / capacity`), and monthly fee.
- **Create / Edit Modal**: Grade selector $\rightarrow$ Subject selector $\rightarrow$ Teacher selector $\rightarrow$ capacity, monthly fee, start date, months count, and interactive weekly schedule picker (Day, Hour, Minute, AM/PM).
- **Group Details Page (`/groups/[id]`)**: Full hub containing 4 interactive tabs:
  1. **قائمة الطلاب (Students)**: Table of enrolled students with search, join date, parent phone, and removal button. Includes `<AddStudentsModal>` to enroll students by grade.
  2. **تسجيل الحضور (Attendance)**: Date picker to open or select a session, roster table with 4 attendance buttons (`حاضر`, `غائب`, `متأخر`, `معذور`), absence reason input, and bulk save button.
  3. **التقارير والإحصائيات (Reports)**: Attendance rate gauge, total sessions, top 5 absent students, and perfect attendance honor list.
  4. **سجل المدفوعات (Payments Matrix)**: Student-by-month payment grid displaying paid status, date paid, amount, unpaid months, and a "تسجيل دفع" button to record monthly fee.

---

### 4.3 Instructor / Teacher Dashboard (`/dashboard/instructor`)

Tailored for **Teachers and Instructors** to focus on their assigned teaching groups and attendance workflows.

```
Instructor Dashboard
├── 1. Overview (/dashboard/instructor)
├── 2. Assigned Groups (/dashboard/instructor/groups)
│      └── Group Details (/dashboard/instructor/groups/[id])
│           ├── Tab 1: Enrolled Students List (View Only)
│           ├── Tab 2: Daily Attendance Tracking & Recording
│           └── Tab 3: Group Attendance Reports & Statistics
├── 3. Attendance Sessions History (/dashboard/instructor/attendance)
├── 4. Exams Management (/dashboard/instructor/exams) [Shell]
├── 5. Assignments Management (/dashboard/instructor/assignments) [Shell]
└── 6. Account Settings (/dashboard/instructor/settings) [Shell]
```

#### Key Teacher Features:
1. **Assigned Groups (`/dashboard/instructor/groups`)**: Automatically filtered by the backend to only show groups taught by the logged-in teacher (`teacherId`).
2. **Attendance Taking (`/groups/[id]` $\rightarrow$ Attendance Tab)**: Instructors can open today's session, record presence/absence/late/excused for each student, and save attendance in bulk.
3. **Attendance History (`/dashboard/instructor/attendance`)**: Comprehensive session logs and historical records.
4. **Read-Only Restrictions**: In Group Details, the teacher cannot remove students, cannot add students, and cannot see the Owner's financial payment tab.

---

### 4.4 Student Portal Dashboard (`/dashboard/student`)

Tailored for **Students** to track their enrolled classes, attendance records, and tuition payments.

```
Student Portal Dashboard
├── 1. Overview (/dashboard/student)
├── 2. Enrolled Subjects & Groups (/dashboard/student/subjects)
├── 3. Attendance History & Report (/dashboard/student/attendance)
├── 4. Tuition Payments History (/dashboard/student/payments)
├── 5. Exams & Quizzes (/dashboard/student/exams) [Shell]
├── 6. Homework & Assignments (/dashboard/student/assignments) [Shell]
├── 7. Academic Results & Grades (/dashboard/student/results) [Shell]
└── 8. Student Profile Settings (/dashboard/student/settings) [Shell]
```

#### Key Student Features:
1. **Enrolled Groups & Subjects (`/dashboard/student/subjects`)**: Displays cards of all groups the student is actively enrolled in, including teacher name, subject, and weekly schedule.
2. **Attendance Report (`/dashboard/student/attendance`)**: Displays overall attendance percentage, counts of attended/absent sessions, and chronological session logs with attendance status and excuse notes.
3. **Tuition Payments (`/dashboard/student/payments`)**: Displays a clean table of all subscription payments made, including month date, group name, amount paid, payment date, and transaction notes.

---

## 5. API Client, State Management & Shared Layer

### 5.1 API Client (`src/lib/api/apiClient.ts`)
* **Isomorphic Client**: Works in Server Components, Server Actions, and Client Components.
* **Automatic Auth Header**: Extracts `token` from Next.js `cookies()` on the server or `document.cookie` on the browser and attaches `Authorization: Bearer <token>`.
* **Safe 401 Unauthorized Handling**: Clears client/server cookies automatically without logging unhandled error stack traces.
* **Standard Response**: Returns `{ success: boolean, message: string, data: T, meta?: Meta }`.

### 5.2 State Management Architecture
* **Server State**: Managed exclusively via **TanStack Query (React Query v5)** with structured query keys (e.g. `['grades']`, `['teachers', params]`, `['group-details', id]`). Mutations automatically invalidate active query keys.
* **Modal & Dialog UI State**: Managed via lightweight **Zustand** stores (`useGradeModal`, `useSubjectModal`, `useTeacherModal`, `useStudentModal`, `useGroupModal`).
* **Forms & Validation**: Built with `react-hook-form` + `@hookform/resolvers/zod` + `zod` for zero-lag uncontrolled inputs.

---

## 6. Frontend vs Backend Integration Status & Gaps

| Feature Area | Frontend UI Status | Backend API Status | Integration State | Notes / Action Required |
| :--- | :---: | :---: | :---: | :--- |
| **Authentication & Login** | ✅ Complete | ✅ Complete | **Fully Integrated** | Full login, JWT cookie storage, logout, role redirect. |
| **Landing Page** | ✅ Complete | ✅ Complete | **Fully Integrated** | Dynamic header auth status, responsive sections. |
| **Grades Management** | ✅ Complete | ✅ Complete | **Fully Integrated** | Full CRUD, ordering, status toggle. |
| **Subjects Management** | ✅ Complete | ✅ Complete | **Fully Integrated** | Full CRUD, grade filtering, dropdown options. |
| **Teachers Management** | ✅ Complete | ✅ Complete | **Fully Integrated** | Full CRUD, subject diff-sync, status toggle. |
| **Students Management** | ✅ Complete | ✅ Complete | **Fully Integrated** | Full CRUD, grade enrollment, payments history modal. |
| **Groups & Scheduling** | ✅ Complete | ✅ Complete | **Fully Integrated** | Full CRUD, multi-slot schedule, capacity check. |
| **Group Student Enrollment** | ✅ Complete | ✅ Complete | **Fully Integrated** | Add students modal, seat validation, remove students. |
| **Attendance Session & Save** | ✅ Complete | ✅ Complete | **Fully Integrated** | UTC midnight session, bulk upsert, reasons. |
| **Attendance Reports** | ✅ Complete | ✅ Complete | **Fully Integrated** | Group summary stats, student chronological report. |
| **Monthly Payments Matrix** | ✅ Complete | ✅ Complete | **Fully Integrated** | Required/paid/unpaid months grid, record payment. |
| **Exams Management** | ⚠️ Shell / Placeholder | ❌ Missing | **Frontend Ahead (Backend Missing)** | UI pages exist in all 3 dashboards; backend has no models or endpoints. |
| **Assignments Management** | ⚠️ Shell / Placeholder | ❌ Missing | **Frontend Ahead (Backend Missing)** | UI pages exist in Instructor and Student dashboards; backend missing. |
| **Student Results** | ⚠️ Shell / Placeholder | ❌ Missing | **Frontend Ahead (Backend Missing)** | UI page exists in Student dashboard; backend missing. |
| **Center Subscription Page** | ⚠️ Shell / Placeholder | ⚠️ Partial | **Needs Frontend Implementation** | Backend has endpoints; frontend has placeholder page. |
| **Center Settings Page** | ⚠️ Shell / Placeholder | ⚠️ Partial | **Needs Frontend Implementation** | Backend has `PATCH /centers/:id`; frontend has placeholder page. |

---

## 7. Complete Frontend Route & Component Inventory

The following table provides the complete inventory of all routes, layouts, and components in the frontend application:

| Route Path | Role Access | Component / Page | Key Server Actions / API Hooks | Integration Status |
| :--- | :--- | :--- | :--- | :---: |
| `/` | Public | `src/app/(landing)/page.tsx` | `getCurrentUser` | **Integrated** |
| `/login` | Public | `src/app/(landing)/login/page.tsx` | `loginAction` | **Integrated** |
| `/dashboard` | All Roles | `src/app/(logged-in)/dashboard/page.tsx` | Redirection based on role | **Integrated** |
| `/dashboard/center-owner` | `OWNER` | `center-owner/page.tsx` | Overview metrics | **Integrated** |
| `/dashboard/center-owner/grades` | `OWNER` | `grades/page.tsx` (`GradesListClient`) | `getGrades`, `createGradeAction`, `updateGradeAction`, `toggleGradeStatusAction` | **Integrated** |
| `/dashboard/center-owner/subjects` | `OWNER` | `subjects/page.tsx` (`SubjectsListClient`) | `getSubjects`, `createSubjectAction`, `updateSubjectAction`, `toggleSubjectStatusAction` | **Integrated** |
| `/dashboard/center-owner/teachers` | `OWNER` | `teachers/page.tsx` (`TeachersListClient`) | `getTeachers`, `createTeacherAction`, `updateTeacherAction`, `toggleTeacherStatusAction` | **Integrated** |
| `/dashboard/center-owner/students` | `OWNER` | `students/page.tsx` (`StudentsListClient`) | `getStudents`, `createStudentAction`, `updateStudentAction`, `toggleStudentStatusAction`, `getStudentPaymentsAction` | **Integrated** |
| `/dashboard/center-owner/groups` | `OWNER` | `groups/page.tsx` (`GroupsListClient`) | `getGroups`, `createGroupAction`, `updateGroupAction`, `toggleGroupStatusAction` | **Integrated** |
| `/dashboard/center-owner/groups/[id]` | `OWNER` | `groups/[id]/page.tsx` (`GroupDetailsClient`) | `getGroupDetails`, `addStudentsToGroupAction`, `removeStudentFromGroupAction`, `saveAttendanceAction`, `payMonthAction` | **Integrated** |
| `/dashboard/center-owner/subscription` | `OWNER` | `subscription/page.tsx` | — | ⚠️ Placeholder Shell |
| `/dashboard/center-owner/exams` | `OWNER` | `exams/page.tsx` | — | ⚠️ Placeholder Shell |
| `/dashboard/center-owner/settings` | `OWNER` | `settings/page.tsx` | — | ⚠️ Placeholder Shell |
| `/dashboard/instructor` | `TEACHER` | `instructor/page.tsx` | Instructor Overview | **Integrated** |
| `/dashboard/instructor/groups` | `TEACHER` | `instructor/groups/page.tsx` | `getGroups` (scoped to teacher) | **Integrated** |
| `/dashboard/instructor/groups/[id]` | `TEACHER` | `instructor/groups/[id]/page.tsx` | `getGroupDetails`, `saveAttendanceAction`, `getGroupReportAction` | **Integrated** |
| `/dashboard/instructor/attendance` | `TEACHER` | `instructor/attendance/page.tsx` | `getTeacherGroupsAttendance` | **Integrated** |
| `/dashboard/instructor/exams` | `TEACHER` | `instructor/exams/page.tsx` | — | ⚠️ Placeholder Shell |
| `/dashboard/instructor/assignments` | `TEACHER` | `instructor/assignments/page.tsx` | — | ⚠️ Placeholder Shell |
| `/dashboard/instructor/settings` | `TEACHER` | `instructor/settings/page.tsx` | — | ⚠️ Placeholder Shell |
| `/dashboard/student` | `STUDENT` | `student/page.tsx` | Student Portal Overview | **Integrated** |
| `/dashboard/student/subjects` | `STUDENT` | `student/subjects/page.tsx` | `getStudentEnrolledGroups` | **Integrated** |
| `/dashboard/student/attendance` | `STUDENT` | `student/attendance/page.tsx` | `getStudentAttendanceReport` | **Integrated** |
| `/dashboard/student/payments` | `STUDENT` | `student/payments/page.tsx` (`StudentPaymentsClient`) | `getStudentPayments` | **Integrated** |
| `/dashboard/student/exams` | `STUDENT` | `student/exams/page.tsx` | — | ⚠️ Placeholder Shell |
| `/dashboard/student/assignments` | `STUDENT` | `student/assignments/page.tsx` | — | ⚠️ Placeholder Shell |
| `/dashboard/student/results` | `STUDENT` | `student/results/page.tsx` | — | ⚠️ Placeholder Shell |
| `/dashboard/student/settings` | `STUDENT` | `student/settings/page.tsx` | — | ⚠️ Placeholder Shell |
