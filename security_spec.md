# ArtisanConnect Security Specification

## 1. Data Invariants
- A `User` profile must match their `request.auth.uid`.
- A `ServiceRequest` must have a valid `clientId` matching the creator.
- A `Proposal` must reference a valid `requestId` and have `artisanId` matching the creator.
- A `Chat` is only accessible to its `participants`.
- A `Review` can only be created once for a specific `requestId` by each participant.
- `createdAt` and `updatedAt` must be server-generated.

## 2. Dirty Dozen Payloads (Rejection Tests)
1. **Identity Spoofing:** Create a user profile with a different `uid` than `auth.uid`.
2. **Role Escalation:** A client attempting to update their own `role` to `admin` or an artisan trying to change to `client` after creation.
3. **Ghost Request:** Creating a `ServiceRequest` as a client but with someone else's `clientId`.
4. **Invalid Request Status:** Updating a `ServiceRequest` status to `assigned` without an `assignedArtisanId`.
5. **Proposal Hijack:** An artisan submitting a `Proposal` for a request they don't own (wait, they should be able to, but they shouldn't be able to edit someone else's proposal).
6. **Price Poisoning:** Sending a `Proposal` with a negative price or a price that is a 1MB string.
7. **Chat Intrusion:** A user trying to read a `Chat` where they are not in the `participants` list.
8. **Message Forge:** Sending a message with a `senderId` that doesn't match the current user.
9. **Review Spam:** Creating multiple reviews for the same request.
10. **Terminal State Breakout:** Trying to update a `ServiceRequest` after its status is `completed`.
11. **Timestamp Manipulation:** Providing a client-side `createdAt` date that isn't `request.time`.
12. **Orphaned Write:** Creating a proposal for a `ServiceRequest` that doesn't exist.

## 3. Test Runner
(I will implement the rules addressing these in the next step).
