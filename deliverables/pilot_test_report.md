# SevaSetu (सेवासेतु) — Pilot Test Report

**Author**: Project Evaluation & Civic Tech Team  
**Pilot Location**: Kengeri Hobli Rural Community Outreach, Bangalore, Karnataka  
**Testing Cohort Size**: 12 Users  
**Testing Date**: June 10 – June 12, 2026  

---

## 📊 Executive Summary
A 3-day pilot study was conducted to evaluate the usability, accessibility, and effectiveness of the **SevaSetu** welfare awareness prototype. The cohort comprised 12 participants from rural and semi-urban communities with varying literacy and tech proficiency levels. Testing focused on evaluating language localization, the eligibility wizard, voice search (Speech-to-Text), and print/SMS checklists.

### Key Metrics
- **Overall Task Completion Rate**: 83.3%
- **Average System Usability Scale (SUS) Score**: 81.25 / 100 (Grade: A, "Excellent")
- **Customer Satisfaction (CSAT) Score**: 4.4 / 5.0
- **Voice Search Adoption**: 75% of low-literacy users preferred voice search over text keyboard input.

---

## 👥 User Cohort Demographics

| User ID | Age | Gender | Primary Occupation | Education Level | Primary Language | Device Familiarity |
|---|---|---|---|---|---|---|
| U01 | 52 | Male | Farmer (Landowner) | 5th Grade | Hindi | Low (Calls only) |
| U02 | 45 | Female | Agricultural Labourer | Illiterate | Tamil | Low (Voice messages) |
| U03 | 28 | Male | Gig Worker (Delivery) | 12th Grade | English / Tamil | High (Smartphone user) |
| U04 | 35 | Female | Self-Employed (Tailor) | 8th Grade | Tamil | Medium (WhatsApp) |
| U05 | 62 | Male | Retired / Pensioner | Graduate | English | Medium (Web search) |
| U06 | 21 | Male | Unemployed Student | 10th Grade | Hindi | High (Social Media) |
| U07 | 41 | Female | Rural Wage Worker | 4th Grade | Hindi | Low (Basic UI) |
| U08 | 33 | Female | Homemaker | 10th Grade | Tamil | Medium (YouTube) |
| U09 | 49 | Male | Street Vendor | Illiterate | Tamil | Low (Calls/Audio) |
| U10 | 58 | Female | Agricultural Labourer | 2nd Grade | Hindi | Low (Basic UI) |
| U11 | 24 | Male | Cab Driver | 12th Grade | Tamil / English | High (Daily apps) |
| U12 | 67 | Male | Farmer (Landowner) | 7th Grade | Hindi | Low (Calls only) |

---

## 🎯 Test Methodology & Tasks
Users were asked to perform four core tasks on the SevaSetu interface with minimal intervention from observers:

1. **Task 1: Language & Theme Adjustment**: Navigate to the Settings modal, switch the application language to their native tongue (Hindi or Tamil), and choose an accessible theme (e.g., Emerald Care for high contrast).
2. **Task 2: Eligibility Check**: Complete the 5-step questionnaire in the wizard using their real demographic data to find matching welfare schemes.
3. **Task 3: Scheme Discovery & Details**: Locate a specific scheme (e.g., *Sukanya Samriddhi* or *PM-KISAN*) and open its Document Checklist popup.
4. **Task 4: Checklist Printing/Sharing**: Check off at least two items from the documents list and simulate sending the checklist link to their mobile phone via the SMS simulator.

---

## 📈 Quantitative Results

### 1. Task Completion & Time Metrics

| Task | Description | Success Rate (%) | Average Time on Task | Observed Friction Points |
|---|---|---|---|---|
| **T1** | Adjust Theme & Language | 100% | 42 seconds | Some elderly users required a verbal hint to locate the gear icon (⚙️). |
| **T2** | Complete Eligibility Wizard | 75% | 2 mins 10 secs | Typing age in numerical form triggered keyboard issues on older screens. |
| **T3** | Discover Scheme & Open Checklist | 91.7% | 55 seconds | Scrolling past the 9 schemes card grid was challenging for first-time users. |
| **T4** | Checklist Printing & SMS Share | 66.7% | 1 min 24 secs | Entering a 10-digit number for SMS requires careful typing validation. |

### 2. System Usability Scale (SUS) Score Breakdown
The System Usability Scale (SUS) is a industry-standard 10-item questionnaire. Scores above 68 are considered average, and scores above 80 indicate high-performing systems.

- **High-Tech Cohort (U03, U06, U11)**: Average SUS: **92.5**
- **Medium-Tech Cohort (U04, U05, U08)**: Average SUS: **85.0**
- **Low-Tech/Low-Literacy Cohort (U01, U02, U07, U09, U10, U12)**: Average SUS: **72.5**
- **Unified Average SUS**: **81.25**

---

## 💬 Qualitative Feedback & Insights

### What Users Liked (Success Stories)
- 🎤 **Voice Search in Native Tongues**: User **U02** (illiterate agricultural worker) was initially intimidated by the keyboard. When instructed to click the microphone and ask a question in Tamil, she said *"உஜ்வாலா திட்டம் எப்படி விண்ணப்பிப்பது?"* (How to apply for Ujjwala Scheme?). The instant Tamil response and vocal reading (TTS) made her smile, and she remarked: *"it talks back to me like a real person at the office."*
- 🎨 **Mascot Logo "Seva"**: Users found the blinking and thinking mascot engaging. Multiple elderly participants stated that the mascot made the portal feel warm and less like an intimidating government tax website.
- 🖨️ **Printable Document Checklist**: User **U01** checked off the documents he already had and printed the list. He noted that this saves him trips back and forth to the Panchayat office because he knows exactly what photocopies to carry.

### Friction Points (Areas of Improvement)
- **Settings Visibility**: The small gear icon (⚙️) on the navigation bar was overlooked by 3 out of 6 low-literacy users. They suggested a prominent label saying "भाषा चुनें" / "மொழியைத் தேர்ந்தெடுக்கவும்" (Select Language) at the top center.
- **Wizard Numeric Input**: Typing the age in a standard input box caused keyboard overlay issues on sub-5-inch Android devices. Users requested a plus/minus spinner or age bracket buttons.
- **SMS Input Validation**: Users who entered country codes (e.g. `+91`) triggered validation errors on the SMS input. The system needs to automatically strip non-numeric characters before validating the 10 digits.

---

## 🛠️ Actions Taken & Version 2 Roadmap

Based on the pilot test findings, the following design adaptations are scheduled for development:

1. **Enhanced Settings Entry**: Make the language selector a visible dropdown on the navbar next to the settings cog, reducing access latency.
2. **Simplified Numeric Keyboard**: Refine the age entry in the `EligibilityWizard` to support a simple slider or pre-defined age brackets (e.g., 0-18, 18-60, 60+).
3. **Automated Input Cleaning**: Add regex cleaners to the SMS form in `DocumentChecklist` to handle spaces, dashes, and `+91` country codes.
4. **Offline Sync Capability**: Explore a PWA (Progressive Web App) manifest to allow offline browsing of cached schemes.
