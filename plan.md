# Implementation Plan - AfyaRoute

AfyaRoute is a healthcare navigation and referral intelligence system for Kenya. This plan outlines the development of a mobile-first web application featuring a patient portal, hospital dashboard, and admin panel.

## Scope Summary
- **Patient Web App**: Hospital search, live queue tracking, referral viewing, and appointment booking.
- **Hospital Dashboard**: Queue management, referral handling, staff management, and basic analytics.
- **Admin Panel**: Hospital onboarding and system-wide monitoring.
- **Data Layer**: Client-side state management using `localStorage` and React Context for persistence in this session (no server-side DB).

## Assumptions & Open Questions
- **Auth**: Simplified mock authentication for hospitals and admin.
- **Notifications**: SMS/WhatsApp notifications will be simulated with UI toasts/alerts.
- **Real-time**: Simulated with local state intervals since there is no backend/Supabase.

## Affected Areas
- **Frontend**: All interfaces (Patient, Hospital, Admin).
- **State Management**: Robust local storage and context providers to mock database behavior.
- **Navigation**: Multi-role routing (Patient, Staff, Admin).

## Implementation Phases

### Phase 1: Foundation & Mock Data (frontend_engineer)
- Set up project structure and routing (React Router).
- Define comprehensive mock data schemas for Hospitals, Departments, Queues, and Referrals.
- Implement a `DataProvider` using Context + `localStorage` to simulate a shared database.
- **Deliverables**: Router setup, Global state provider, Seed data.

### Phase 2: Patient Portal (frontend_engineer)
- **Home**: Search bar, categories, "Nearest Care" emergency button.
- **Listings**: Hospital list with distance and live queue status.
- **Hospital Detail**: Department breakdown, specialist list, "Join Queue" and "Book" actions.
- **Queue/Referral View**: Personal active queue tracking and referral summary.
- **Deliverables**: Patient-facing views and search functionality.

### Phase 3: Hospital Dashboard (frontend_engineer)
- **Overview**: Stats on daily patients and queue status.
- **Queue Manager**: Department-specific queues, "Call Next", "Complete" patient actions.
- **Referral Manager**: Inbox for incoming referrals, "Accept/Reject" logic, and a referral form to send patients to other hospitals.
- **Staff/Services**: Basic management of doctors and department hours.
- **Deliverables**: Functional hospital dashboard for staff.

### Phase 4: Admin Panel & Integration (quick_fix_engineer)
- **Admin Dashboard**: List of registered hospitals, verification toggle, and system-wide stats.
- **Polishing**: Implement the "Healthcare UI" (Blue/Green theme), refine mobile responsiveness.
- **Mock Notifications**: Add `sonner` toasts to simulate SMS/WhatsApp updates.
- **Deliverables**: Admin panel, final UI refinements, simulation logic.

## Technical Details
- **Styling**: Tailwind CSS with a clean healthcare-focused color palette.
- **Icons**: Lucide React.
- **Components**: Radix UI (via existing shadcn components).

## Sequencing
- Phase 1 is a prerequisite for all other phases.
- Phases 2 and 3 can be developed in parallel if needed, but depend on the common data layer from Phase 1.
