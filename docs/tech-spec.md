# **Project Spec: Wedding RSVP Micro-Site**

## **​1. Core Tech Stack**

* ​**Frontend:** React (Vite)  
* ​**Styling:** Tailwind CSS  
* ​**Form Management:** react-hook-form with useFieldArray  
* ​**Validation:** zod (for runtime schema validation and type inference)  
* ​**Hosting:** Vercel (Frontend \+ Serverless Functions)  
* ​**Backend/Database:** Google Sheets \+ Google Apps Script (GAS)

## **​2. System Architecture**

​A three-tier serverless architecture designed for zero cost and high visibility for non-technical stakeholders (fiancée/planners).

1. ​**Client (Vite):** Collects guest data and handles UI states (Lookup \-\> Form \-\> Success).  
2. ​**API Proxy (Vercel Function):** Acts as a secure bridge. It holds the GOOGLE\_SCRIPT\_URL and INTERNAL\_SECRET in environment variables, preventing client-side exposure.  
3. ​**Database (Google Apps Script):** A doGet/doPost script attached to a Google Sheet. It handles data retrieval (lookup) and persistence (appending rows).

## **​3. Data Schema (Google Sheets)**

### **​Sheet 1: Invites (The Source of Truth)**

| search\_key | full\_name | max\_guests | status |
| ----- | ----- | ----- | ----- |
| jsmith | John Smith | 2 | PENDING |
| jdoe | Jane Doe | 2 | PENDING |

* ​**Logic:** search\_key is generated as lowerCase(first\_initial \+ last\_name).

### **​Sheet 2: RSVPs (The Raw Log)**

| timestamp | guest\_name | dietary | type | invite\_source |
| ----- | ----- | ----- | ----- | ----- |
| 2026-03-20 | John Smith | None | Primary | jsmith |
| 2026-03-20 | Jane Smith | Vegan | Plus-One | jsmith |

## **4\. Key Workflows & Logic**

### **​A. The Two-Tier Authentication**

* ​**Tier 1:** A global "Shared Secret" (e.g., kiwi2026) passed via URL param from a QR code to unlock the site.  
* ​**Tier 2:** A "First Initial \+ Last Name" lookup. If a guest enters "John Smith," the system searches for jsmith.

### **​B. The RSVP Form Logic**

* ​**Trust-Based:** The app fetches max\_guests for the specific key.  
* ​**Dynamic Inputs:** If max\_guests is 2, the UI shows the Primary Guest name and **one** additional optional text input for a Plus-One.  
* ​**Validation:** Use Zod to ensure the submitted array of guests does not exceed max\_guests.  
* ​**Kids Safety:** A conditional toggle "Are you bringing children?" reveals a mandatory checkbox acknowledging rural property hazards (water/livestock).

### **​C. Data Flattening (The Backend)**

* ​Instead of one row per "RSVP Submission," the Google Apps Script loops through the guest array and appends **one row per person**.  
* ​**Deduplication:** Manual cleanup strategy. The owner will use Google Sheets' "Remove Duplicates" tool or conditional formatting on the guest\_name column to handle "Double RSVPs" (e.g., if both partners in a household RSVP separately).

## **​5. Security & Constraints**

* ​**CORS:** Handled by the Vercel Proxy function to manage Google Apps Script's 302 redirects.  
* ​**Secrets:** All API keys and Google URLs are stored in Vercel Environment Variables.  
* ​**Normalization:** All name lookups are stripped of special characters, trimmed, and lowercased before matching.

## **​6. Implementation Checklist for AI Assistant**

1. ​**Setup:** Initialize Vite \+ Tailwind.  
2. ​**Schema:** Create rsvpSchema.ts using Zod for a nested object (Primary \+ array of Plus-Ones).  
3. ​**Lookup Hook:** Create a useGuestLookup hook to handle the initial fetch to the Vercel /api/lookup endpoint.  
4. ​**Form Component:** Build the RSVP form using useFieldArray. Implement the "Max Guest" cap logic.  
5. ​**Proxy:** Write the Vercel Serverless Function to forward requests to Google Apps Script.  
6. ​**GAS:** Write the doGet and doPost script for the Google Sheet

