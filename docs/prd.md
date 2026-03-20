# **Product Requirements Document (PRD): Wedding Micro-Site**

## **1\. Project Overview**

A single-page, mobile-first web application designed to communicate wedding logistics to guests and collect RSVP data. The site must feel premium and custom-built, but prioritize low maintenance and a friction-free user experience.

---

## **2\. Target Audience (User Personas)**

* **The Guests:** Diverse tech literacy levels. Need to find information quickly and RSVP without creating an account.  
* **The Couple (Admin):** Need an easy way to track headcounts and dietary requirements via Google Sheets without manual data entry.  
* **The Vendors (Caterers/Planners):** Need accurate, filterable data regarding meal choices and guest counts.

---

## **3\. Functional Requirements**

### **3.1 Authentication & Entry**

* **Requirement:** The RSVP section must be private.  
* **Logic:** Access is granted via a "Shared Secret" (e.g., a URL parameter or simple landing page password).  
* **QR Integration:** The RSVP link on physical invites should auto-fill the secret to bypass the splash screen.  
* Other informational screens can be public (optional)

### **3.2 Guest Identification (Lookup)**

* **Requirement:** Identify the guest's party size without exposing the full guest list.  
* **Logic:** Guest enters "First Initial \+ Last Name". System returns their `max_guests` allowance.  
* **Privacy:** Guests should only be able to see their own names and the "Group Display Name" (e.g., "The Smith Household").

### **3.3 Dynamic RSVP Form**

* **Primary Guest:** Automatically populated based on lookup.  
* **Plus-Ones:** Dynamic input fields appear only if `max_guests > 1`.  
* **Dietary Logic:** Every guest (primary \+ plus-ones) must have an individual field for dietary requirements.  
* **Kids & Safety:**  
  * A toggle for "Is this guest a kid?".  
  * If "Yes," display a mandatory safety disclosure regarding rural hazards (unfenced water, livestock, terrain).  
  * Ask for age range (\<5, 5-10 10+)  
  * Ask if they need a seat or high chair, or will be in a stroller  
  * Require a "Safety Acknowledgment" checkbox to proceed.

### **3.4 Information Modules**

*   
* **Schedule:** An overview of how the day will go, start time, end time, etc..  
* **Travel:** Integration with Google Maps for the venue. Info about public transport, parking, ubers, etc.  
* **Registry:** A polite section for gift information or "Wishing Well" details.  
* **Dress Code:** Clear visual or textual description of the expected attire.  
* **Housekeeping:** Any housekeeping info about vendors or the venue

---

## **4\. UI/UX Requirements**

* **Mobile-First:** 90% of guests will access the site via a phone after scanning a QR code.  
* **Offline Support:** Basic PWA functionality so guests can view the schedule and address even with poor cell reception at the venue. (stretch goal)  
* **Dark Mode:** Optional, but preferred for late-night viewing.  
* **Loading States:** High-quality "skeleton" loaders or spinners for the name lookup and form submission to mask serverless "cold starts."

---

## **5\. Technical Constraints & Out-of-Scope**

* **Data Integrity:** Duplicates will be handled manually by the admin; the app does not need complex de-duplication logic.  
* **Edits:** Guests cannot edit an RSVP once submitted via the UI. They must contact the couple (include a "Contact us" link), or submit again  
* **Email:** Automated confirmation emails are **Out-of-Scope** for the MVP (Minimum Viable Product).

---

## **6\. Success Metrics**

* **Completion Rate:** 100% of invited guests successfully submit the form without texting the couple for help.  
* **Data Accuracy:** Zero "mystery guests" appearing in the Google Sheet.

---
