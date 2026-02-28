# ChatApp

Despite the name, this is not a fully developed or maintained chat application.

This repository is kept only for personal reference and learning documentation.  
The project does work, but parts of the UI were generated using ai during experimentation, so this is not something I claim as a fully self-crafted product.

The purpose of keeping this repository public is to preserve the learning process, architecture decisions, and implementation patterns explored while building it.


# Features

## Main Interface

This is the primary chat interface of the application.

- The center panel displays the active conversation.
- The sidebar lists previous chats for quick navigation.
- Users can select an existing chat or start a new one.
- Messages are displayed in chronological order.

Below is a preview of the main layout:

<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/11747d51-c57a-4f24-a427-ee561406209c" />



## Authentication & Authorization

- The login flow returns **401 Unauthorized** when invalid credentials are provided, confirming proper authentication checks.  
- The registration flow returns **409 Conflict** when attempting to create a user that already exists, enforcing uniqueness constraints.
  
<img width="1024" height="576" alt="image" src="https://github.com/user-attachments/assets/94bd78d9-3598-4501-bec7-b63f34c53571" />


