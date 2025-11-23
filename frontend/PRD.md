---
title: Product Requirements Document
app: sleepy-jackrabbit-hum
created: 2025-11-23T18:48:14.297Z
version: 1
source: Deep Mode PRD Generation
---

# PRODUCT REQUIREMENTS DOCUMENT
## High-Low-Buffalo

### EXECUTIVE SUMMARY
*   **Product Vision:** To reimagine connection as something simple, intentional, and human by turning the family ritual of sharing a "High," a "Low," and a "Buffalo" (a surprising moment) into a digital tool. The application aims to help people slow down, reflect, and share what’s real, fostering genuine connection without the noise and performative pressure of traditional social media.
*   **Core Purpose:** The product solves the problem of emotional distance that grows between loved ones (family, friends) due to busy lives and inadequate communication tools. It provides a structured, low-pressure way for users in the "sandwich generation," young adults, and elders to share meaningful life moments and stay genuinely connected.
*   **Target Users:**
    1.  **The Sandwich Generation Adult (30s–50s):** Juggling kids, aging parents, and careers.
    2.  **The Young Adult (18–30s):** Navigating independence while wanting to stay connected to home.
    3.  **The Elder or Grandparent (60s+):** Valuing independence but desiring connection with family.
*   **Key Features (MVP):**
    *   **Reflection Management:** Users can create, share, and view daily/weekly reflections consisting of a High, Low, and Buffalo.
    *   **Herd Management:** Users can create and manage small, private groups ("Herds") to share reflections with.
    *   **Connection Management:** Users can connect with other individuals to share reflections one-on-one.
    *   **Curiosity Reactions:** Users can send a simple "tell me more" signal on a reflection to encourage deeper connection.
*   **Complexity Assessment:** Simple-to-Moderate
    *   **State Management:** Local (No real-time collaboration required).
    *   **External Integrations:** 1 (Email service for notifications).
    *   **Business Logic:** Moderate (Primary complexity lies in the access control rules for sharing reflections with individuals vs. groups).
    *   **Data Synchronization:** None.
*   **MVP Success Metrics:**
    *   Users can successfully complete the core workflow: create a reflection, share it with a specific audience (self, friend, or herd), and view reflections shared with them.
    *   The "Curiosity Reaction" feature is functional and sends a notification to the reflection's author.
    *   Users can create and manage connections and herds.

### 1. USERS & PERSONAS
*   **Primary Persona: The Sandwich Generation Adult ("Alex", 42)**
    *   **Context:** Alex is a parent to two school-aged children and also helps coordinate care for an aging parent who lives a few hours away. They have a demanding job and a wide circle of friends they struggle to keep up with. Communication has become purely logistical ("who is picking up the kids?").
    *   **Goals:** To feel emotionally close to their parents, partner, and close friends without adding another time-consuming task to their plate. To model healthy emotional sharing for their children.
    *   **Needs:** A simple, structured, and quick way to share meaningful updates. A way to check in on their parents that feels like care, not surveillance. A private space to connect with loved ones away from the performative nature of social media.

*   **Secondary Personas:**
    *   **The Young Adult ("Chloe", 19):** A college freshman living away from home for the first time. Wants to maintain a close bond with her family but on her own terms, without constant texting.
    *   **The Elder ("Robert", 75):** A grandparent who lives independently. He wants to feel included in his children's and grandchildren's daily lives without feeling like a burden or having to learn a complex new technology.

### 2. FUNCTIONAL REQUIREMENTS (MVP)
*   **2.1 Core MVP Features (All are Priority 0)**
    *   **FR-001: User Authentication**
        *   **Description:** Users can create a secure account, log in, manage their profile, and log out.
        *   **Entity Type:** System/Configuration
        *   **User Benefit:** Protects personal reflections and data, and allows for a personalized experience with connections and herds.
        *   **Primary User:** All Personas
        *   **Lifecycle Operations:**
            *   **Create:** Users can register for a new account using an email and password.
            *   **View:** Users can view their own basic profile information (name, email).
            *   **Edit:** Users can update their name and password.
            *   **Delete:** Users can delete their account.
            *   **Additional:** Users can use a "Forgot Password" flow to reset their password.
        *   **Acceptance Criteria:**
            *   - [ ] Given a user is new, when they provide a valid email and password, then a new account is created.
            *   - [ ] Given a user has an account, when they provide correct credentials, then they are logged in.
            *   - [ ] Given a user is logged in, when they navigate to settings, then they can change their password.
            *   - [ ] Given a user requests to delete their account, when they confirm the action, then their account and associated data are removed.

    *   **FR-002: Connection Management**
        *   **Description:** Users can connect with other users on the platform to enable one-on-one sharing.
        *   **Entity Type:** User-Generated Content
        *   **User Benefit:** Allows users to form the trusted relationships needed for private, one-on-one sharing.
        *   **Primary User:** All Personas
        *   **Lifecycle Operations:**
            *   **Create:** A user can send a connection request to another user via their email address.
            *   **View:** Users can view a list of their pending and accepted connections.
            *   **Edit:** A user can accept or decline a pending connection request.
            *   **Delete:** A user can remove an existing connection.
        *   **Acceptance Criteria:**
            *   - [ ] Given a user knows another user's email, when they send an invite, then the other user receives a connection request.
            *   - [ ] Given a user has a pending request, when they accept it, then both users appear in each other's connection lists.
            *   - [ ] Given a user has a connection, when they remove it, then they are no longer connected.

    *   **FR-003: Herd Management**
        *   **Description:** Users can create and manage small, private groups ("Herds") of their connections to share reflections with.
        *   **Entity Type:** User-Generated Content
        *   **User Benefit:** Facilitates sharing within a trusted circle, like a family or a close group of friends, mimicking the original dinner table ritual.
        *   **Primary User:** All Personas
        *   **Lifecycle Operations:**
            *   **Create:** A user can create a new Herd, give it a name, and add members from their list of connections.
            *   **View:** Users can view a list of Herds they belong to and see the members of each Herd.
            *   **Edit:** The creator of a Herd can add or remove members and rename the Herd.
            *   **Delete:** The creator of a Herd can delete it. Any user can leave a Herd they are a member of.
        *   **Acceptance Criteria:**
            *   - [ ] Given a user has connections, when they create a Herd, then they can select members and name the group.
            *   - [ ] Given a user is the creator of a Herd, when they edit it, then they can add/remove members.
            *   - [ ] Given a user is a member of a Herd, when they choose to leave, then they are removed from the member list.

    *   **FR-004: Reflection Management**
        *   **Description:** The core feature. Users can create a reflection containing a High, Low, and Buffalo, and share it with a specific audience. Users can view a history of their own reflections and those shared with them.
        *   **Entity Type:** User-Generated Content
        *   **User Benefit:** Provides the structure for meaningful self-reflection and connection with others.
        *   **Primary User:** All Personas
        *   **Lifecycle Operations:**
            *   **Create:** Users can fill in three text fields: High, Low, and Buffalo.
            *   **View:** Users can see a chronological feed of their own reflections and reflections shared with them by connections or Herds. They can click to view the full content of any reflection.
            *   **Edit:** Not allowed. Reflections are snapshots in time and cannot be edited after sharing to maintain authenticity.
            *   **Delete:** Users can delete their own past reflections. This will remove it from view for everyone it was shared with.
            *   **List/Search:** The main feed acts as a list. Users can filter the feed to see reflections from "Everyone", a specific connection, or a specific Herd.
            *   **Additional (Share):** When creating a reflection, the user must choose a single audience: Self (private), one Connection, or one Herd.
        *   **Acceptance Criteria:**
            *   - [ ] Given a user wants to reflect, when they open the app, then they are prompted to create a High-Low-Buffalo entry.
            *   - [ ] Given a user has filled out the reflection, when they proceed to share, then they must select one audience (Self, a Connection, or a Herd).
            *   - [ ] Given a reflection is shared with a Herd, then all members of that Herd can view it in their feed.
            *   - [ ] Given a user views their feed, then they only see their own reflections and reflections explicitly shared with them or their Herds.
            *   - [ ] Given a user created a reflection, when they choose to delete it, then it is removed from the system.

    *   **FR-005: Curiosity Reactions**
        *   **Description:** A simple, one-tap way for a user to express interest in a reflection they've received.
        *   **Entity Type:** Communication
        *   **User Benefit:** Closes the communication loop and signals care and interest, prompting deeper conversation offline without the pressure of text-based comments.
        *   **Primary User:** All Personas
        *   **Lifecycle Operations:**
            *   **Create:** A user can tap a "Curiosity" button (e.g., a buffalo icon) on a reflection in their feed.
            *   **Delete:** A user can tap the button again to remove their reaction.
            *   **View:** The author of a reflection can see who has reacted with curiosity.
        *   **Acceptance Criteria:**
            *   - [ ] Given a user is viewing a reflection from another person, when they tap the "Curiosity" button, then the author receives a notification.
            *   - [ ] Given a user has reacted to a reflection, when they view it again, then their reaction is visibly registered.
            *   - [ ] Given a user taps the reaction button again, then the reaction is removed and the notification is retracted (if possible) or a second notification is not sent.

    *   **FR-006: Basic Notifications**
        *   **Description:** A simple, non-customizable prompt to encourage users to reflect and share.
        *   **Entity Type:** System
        *   **User Benefit:** Helps build the habit and ritual of reflecting, which is key to the product's value.
        *   **Primary User:** All Personas
        *   **Lifecycle Operations:**
            *   **Create (System-generated):** The system sends a daily email to all users prompting them to share their High-Low-Buffalo.
        *   **Acceptance Criteria:**
            *   - [ ] Given a user has an account, when it is the scheduled time, then they receive an email prompting them to create a reflection.

### 3. USER WORKFLOWS
*   **3.1 Primary Workflow: The Core Reflection Loop**
    *   **Trigger:** User receives a daily email prompt or opens the application.
    *   **Outcome:** The user shares a reflection, and a recipient feels a moment of connection.
    *   **Steps:**
        1.  User opens the app and is presented with a "Share your High-Low-Buffalo" screen.
        2.  User enters text for their "High," "Low," and "Buffalo" moments.
        3.  User clicks "Next" to proceed to the sharing screen.
        4.  System displays sharing options: "Just for Me," a list of individual Connections, and a list of Herds the user belongs to.
        5.  User selects one audience (e.g., "The Miller Family" Herd).
        6.  User clicks "Share."
        7.  System saves the reflection and makes it visible to all members of "The Miller Family" Herd.
        8.  Later, a member of the Herd logs in, sees the new reflection in their feed, and reads it.
        9.  The member taps the "Curiosity" button to show they're interested.
        10. The original user receives a notification: "[Member Name] is curious about your reflection."

*   **3.2 Entity Management Workflows**
    *   **Herd Management Workflow**
        *   **Create Herd:**
            1.  User navigates to the "Herds" area.
            2.  User clicks "Create New Herd."
            3.  User enters a name for the Herd (e.g., "Book Club").
            4.  User is shown a list of their connections and selects several to add.
            5.  User saves the Herd, and it now appears in their list of Herds.
        *   **Edit Herd:**
            1.  User navigates to the "Herds" area and selects a Herd they created.
            2.  User clicks the "Edit" option.
            3.  User adds or removes members from their connection list.
            4.  User saves the changes.
        *   **Delete Herd:**
            1.  User navigates to a Herd they created and selects the "Delete" option.
            2.  System asks for confirmation.
            3.  User confirms, and the Herd is permanently removed.

### 4. BUSINESS RULES
*   **Entity Lifecycle Rules:**
    *   **Reflection:**
        *   **Who can create:** Any authenticated user.
        *   **Who can view:** The creator and the selected audience (a single user or all members of a single Herd).
        *   **Who can edit:** No one (reflections are immutable after sharing).
        *   **Who can delete:** Only the creator.
        *   **What happens on deletion:** The reflection is hard-deleted and removed from the feeds of all recipients.
    *   **Herd:**
        *   **Who can create:** Any authenticated user.
        *   **Who can view:** All members of the Herd.
        *   **Who can edit:** Only the creator of the Herd.
        *   **Who can delete:** Only the creator of the Herd. Any member can leave a Herd.
*   **Access Control:**
    *   A user cannot see any reflections that were not explicitly shared with them or a Herd they are a member of.
    *   A user cannot see other users' lists of connections or Herds.

### 5. DATA REQUIREMENTS
*   **Core Entities (MVP):**
    *   **User:**
        *   **Type:** System/Configuration
        *   **Attributes:** `id`, `name`, `email`, `password_hash`, `created_at`, `updated_at`.
        *   **Relationships:** Has many Reflections, has many Connections, has many HerdMemberships.
    *   **Connection:**
        *   **Type:** User-Generated Content
        *   **Attributes:** `id`, `requester_id`, `recipient_id`, `status` (pending, accepted).
        *   **Relationships:** Belongs to two Users.
    *   **Herd:**
        *   **Type:** User-Generated Content
        *   **Attributes:** `id`, `name`, `creator_id`.
        *   **Relationships:** Belongs to a creator (User), has many HerdMemberships.
    *   **HerdMembership:**
        *   **Type:** System
        *   **Attributes:** `user_id`, `herd_id`.
        *   **Relationships:** Join table between User and Herd.
    *   **Reflection:**
        *   **Type:** User-Generated Content
        *   **Attributes:** `id`, `user_id`, `high_text`, `low_text`, `buffalo_text`, `audience_type` (self, user, herd), `audience_id`, `created_at`.
        *   **Relationships:** Belongs to a User.
    *   **Reaction:**
        *   **Type:** Communication
        *   **Attributes:** `id`, `reflection_id`, `user_id`, `reaction_type` ('curiosity').
        *   **Relationships:** Belongs to a User and a Reflection.

### 6. INTEGRATION REQUIREMENTS
*   **External Systems:**
    *   **Transactional Email Service (e.g., SendGrid, Postmark):**
        *   **Purpose:** To send user invitation emails, password resets, and the daily reflection prompt notifications.
        *   **Data Exchange:** User email addresses and notification content.
        *   **Frequency:** On-demand for invites/resets, daily for prompts.

### 7. FUNCTIONAL VIEWS/AREAS
*   **Primary Views:**
    *   **Dashboard / Feed:** The default view after login. A chronological list of the user's own reflections and reflections shared with them. This is the primary consumption area.
    *   **Create Reflection Form:** A simple, full-screen view with three text inputs for High, Low, and Buffalo.
    *   **Share Screen:** A view presented after filling out the reflection form, where the user selects the audience.
    *   **History View:** The Dashboard/Feed serves as the history view, with filters to narrow down by person or Herd.
    *   **Herds Management Area:** A view to see, create, and manage Herds.
    *   **Connections Management Area:** A view to see current connections and manage pending requests.
    *   **Settings Area:** A view for managing profile information (name, password) and deleting the account.

### 8. MVP SCOPE & DEFERRED FEATURES
*   **8.1 MVP Success Definition**
    *   The core workflow of creating, sharing, and viewing a text-based reflection can be completed end-to-end by a new user. All features defined as "Core MVP" in Section 2 are fully functional and tested.

*   **8.2 In Scope for MVP**
    *   FR-001: User Authentication
    *   FR-002: Connection Management
    *   FR-003: Herd Management
    *   FR-004: Reflection Management (Text-only)
    *   FR-005: Curiosity Reactions
    *   FR-006: Basic Notifications (Daily Email)

*   **8.3 Deferred Features (Post-MVP Roadmap)**
    *   **DF-001: Photo and Voice Input for Reflections**
        *   **Description:** Allow users to upload a photo or record a short audio clip for their High, Low, or Buffalo.
        *   **Reason for Deferral:** Adds significant complexity (file storage, content delivery, UI for recording/playback). The core value can be validated with text-only input first, as stated in the user's plan.
    *   **DF-002: Advanced Notification Controls**
        *   **Description:** Allow users to choose the frequency (daily, weekly), timing, and delivery method of prompts, and to pause them.
        *   **Reason for Deferral:** Not essential for the core validation loop. A simple daily email is sufficient to build the initial habit. Customization is a V2 enhancement.
    *   **DF-003: In-App Reminders to Follow Up**
        *   **Description:** A feature to flag a reflection to remind oneself to ask for more details later.
        *   **Reason for Deferral:** Secondary "nice-to-have" feature. The core "Curiosity Reaction" already provides the primary feedback mechanism.
    *   **DF-004: Copy-to-Clipboard Sharing**
        *   **Description:** Allow users to easily copy the text of a reflection to share it outside the application.
        *   **Reason for Deferral:** The core focus of the MVP is fostering connection *within* the private app ecosystem. External sharing is a secondary feature.
    *   **DF-005: Advanced Visual Polish**
        *   **Description:** Implementation of micro-animations and other playful visual elements.
        *   **Reason for Deferral:** This is a "delight" feature. The MVP will focus on a clean, functional, and usable interface first. Polish can be added in subsequent sprints.
    *   **DF-006: Optional Printing or Physical Keepsakes**
        *   **Description:** A feature to export and print reflections.
        *   **Reason for Deferral:** High complexity involving file generation and potential third-party integrations. It is not part of the core digital loop.

### 9. ASSUMPTIONS & DECISIONS
*   **Key Assumptions Made:**
    *   **Connection Method:** It is assumed that users will invite others to connect via their email address. The system will handle sending an invitation to new users to sign up.
    *   **One Audience Per Reflection:** The system is designed with the assumption that a single reflection is created for a single audience (Self, one Connection, or one Herd). A user wanting to share different things with different groups would create separate reflections.
    *   **Reaction Notification:** It is assumed that a "Curiosity Reaction" should trigger an email notification to the author of the reflection to ensure the feedback loop is closed.
    *   **Immutability of Reflections:** A key product decision is that reflections cannot be edited after they are shared. This encourages authenticity and treats them as a "moment in time."

PRD Complete - Ready for development