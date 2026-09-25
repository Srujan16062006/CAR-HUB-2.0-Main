# CAR-HUB 2.O — Email Notification Setup Guide

This guide walks you through setting up automated email notifications for **CAR-HUB 2.O** test drive bookings using [EmailJS](https://www.emailjs.com/) (100% free, no backend server required).

---

## ⚠️ CRITICAL: Understanding the 5 Different Fields

Each field has a unique purpose and format. **They must NOT be identical:**

| Field Name | Type / Format | Where to Find in EmailJS | Example Value | Must NOT Be Confused With |
| :--- | :--- | :--- | :--- | :--- |
| **1. Public Key** | API Key (`user_...` or random string) | **Account** → **API Keys** | `user_AbCd1234xYz` | Service ID or Template IDs |
| **2. Service ID** | Service identifier (`service_...`) | **Email Services** tab | `service_carhub` | **Owner Template ID** (Service connects Gmail; Template is the email design) |
| **3. Owner Alert Template ID** | Template identifier (`template_...`) | **Email Templates** tab | `template_owner_alert` | **Service ID** and **Customer Template ID** |
| **4. Customer Confirmation Template ID** | Template identifier (`template_...`) | **Email Templates** tab | `template_customer_conf` | **Dealership Email** (Template ID is NOT an email address!) |
| **5. Dealership Notification Email** | Actual Email Address | Your personal / work inbox | `srujanlingalwar3@gmail.com` | **Customer Template ID** (This is an email inbox, NOT a template!) |

### Key Distinction Rules:
1. **Service ID ≠ Owner Template ID**:
   - `Service ID` tells EmailJS *which email account/service* to send through (e.g. Gmail).
   - `Owner Template ID` tells EmailJS *which email layout/content* to generate for the dealership.
   - If you put the same ID in both, EmailJS will reject the request with error 400.
2. **Customer Confirmation Template ID ≠ Dealership Notification Email**:
   - `Customer Confirmation Template ID` is an EmailJS ID (starts with `template_`). It is NOT an email address!
   - `Dealership Notification Email` is an actual email address like `srujanlingalwar3@gmail.com`.
3. **Owner Template ID ≠ Customer Confirmation Template ID**:
   - You must create **two separate templates** in EmailJS: Template 1 sends customer leads to you, and Template 2 sends a confirmation to the customer.

---

## Table of Contents
1. [How It Works](#1-how-it-works)
2. [Quick Setup Checklist](#2-quick-setup-checklist)
3. [Step 1: Create a Free EmailJS Account](#step-1-create-a-free-emailjs-account)
4. [Step 2: Connect Your Email Service (Gmail)](#step-2-connect-your-email-service-gmail)
5. [Step 3: Create Template 1 — Dealership Owner Alert](#step-3-create-template-1--dealership-owner-alert)
6. [Step 4: Create Template 2 — Customer Confirmation](#step-4-create-template-2--customer-confirmation)
7. [Step 5: Get Your EmailJS Public Key](#step-5-get-your-emailjs-public-key)
8. [Step 6: Configure CAR-HUB 2.O](#step-6-configure-car-hub-2o)
9. [Step 7: Testing Your Setup](#step-7-testing-your-setup)
10. [Troubleshooting & FAQs](#troubleshooting--faqs)

---

## 1. How It Works

When a customer fills out and submits the **Book a Test Drive** form on CAR-HUB 2.O:
1. **Email 1 (Dealership Alert)** is immediately sent to your dealership inbox (`srujanlingalwar3@gmail.com`) containing:
   - Customer Full Name
   - Customer Email
   - Customer Phone Number
   - Selected Car Model (e.g. *Toyota Supra MK5*, *Land Cruiser*, *Bugatti Chiron*)
   - Selected Dealership Branch (e.g. *Jubilee Hills*, *Gachibowli*, *Banjara Hills*, *Hitec City*)
   - Finance Interest status (*Yes* / *No*)
   - Timestamp of submission
2. **Email 2 (Customer Confirmation)** is sent to the customer's email address confirming their booking details, thanking them, and providing direct phone numbers to the dealership.

---

## 2. Quick Setup Checklist

You need **4 distinct IDs** from EmailJS and 1 email address:
- [ ] **Public Key** (Account User ID)
- [ ] **Service ID** (e.g., `service_carhub`) — *Different from Template IDs*
- [ ] **Owner Template ID** (e.g., `template_owner_alert`) — *Different from Service ID*
- [ ] **Customer Template ID** (e.g., `template_customer_conf`) — *Different from Owner Template & NOT an email*
- [ ] **Dealership Email** (`srujanlingalwar3@gmail.com`) — *Actual destination email address*

---

## Step 1: Create a Free EmailJS Account

1. Open [https://www.emailjs.com/](https://www.emailjs.com/) in your browser.
2. Click **Sign Up Free**.
3. The free plan gives you **200 free emails per month** with no credit card required.

---

## Step 2: Connect Your Email Service (Gmail)

1. In the EmailJS Dashboard, click **Email Services** on the left menu.
2. Click **Add New Service**.
3. Select **Gmail** (or Outlook/Yahoo/custom SMTP if preferred).
4. Click **Connect Account** and sign in with `srujanlingalwar3@gmail.com`.
5. Grant EmailJS permission to send emails on your behalf.
6. Note your **Service ID** (e.g., `service_xxxxxxx`).
   > *Note: This is your Service ID. It connects to your Gmail and is NOT an email template.*

---

## Step 3: Create Template 1 — Dealership Owner Alert

This template alerts you whenever someone books a test drive.

1. In the EmailJS Dashboard, click **Email Templates** on the left menu.
2. Click **Create New Template**.
3. Configure the **Settings** tab:
   - **Template Name**: `CAR-HUB Owner Alert`
   - **To Email**: `{{owner_email}}` (or directly `srujanlingalwar3@gmail.com`)
   - **From Name**: `CAR-HUB 2.O Booking System`
   - **Subject**: `🚗 New Test Drive Booking: {{customer_name}} - {{model}}`
   - **Reply-To**: `{{customer_email}}`
4. In the **Content** editor, paste the following HTML or text:

```html
<h2>New Test Drive Appointment Request</h2>
<p>A new customer has booked a test drive on CAR-HUB 2.O:</p>
<hr/>
<table cellpadding="8" style="border-collapse: collapse; width: 100%; max-width: 600px;">
  <tr><td><strong>Customer Name:</strong></td><td>{{customer_name}}</td></tr>
  <tr><td><strong>Email:</strong></td><td><a href="mailto:{{customer_email}}">{{customer_email}}</a></td></tr>
  <tr><td><strong>Mobile:</strong></td><td><a href="tel:{{customer_mobile}}">{{customer_mobile}}</a></td></tr>
  <tr><td><strong>Selected Model:</strong></td><td>{{model}}</td></tr>
  <tr><td><strong>Preferred Branch:</strong></td><td>{{branch}}</td></tr>
  <tr><td><strong>Financial Services Interest:</strong></td><td>{{finance_interest}}</td></tr>
  <tr><td><strong>Submitted At:</strong></td><td>{{submitted_at}}</td></tr>
</table>
<hr/>
<p><em>Reply to this email directly to contact the customer.</em></p>
```

5. Click **Save** in the top right.
6. Copy the **Template ID** shown below the template name (e.g., `template_owner_xxxx`).

---

## Step 4: Create Template 2 — Customer Confirmation

This template sends an automatic thank-you confirmation to the customer.

1. Click **Email Templates** -> **Create New Template**.
2. Configure the **Settings** tab:
   - **Template Name**: `CAR-HUB Customer Confirmation`
   - **To Email**: `{{to_email}}`
   - **From Name**: `CAR-HUB 2.O Hyderabad`
   - **Subject**: `Booking Confirmed: Your Test Drive for {{model}} at CAR-HUB 2.O`
   - **Reply-To**: `{{support_email}}`
3. In the **Content** editor, paste the following HTML or text:

```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
  <h2 style="color: #d32f2f;">Thank You for Booking with CAR-HUB 2.O</h2>
  <p>Dear <strong>{{to_name}}</strong>,</p>
  <p>We are delighted to confirm that we have received your test drive request for the <strong>{{model}}</strong>.</p>
  <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #d32f2f; margin: 20px 0;">
    <p style="margin: 4px 0;"><strong>Vehicle:</strong> {{model}}</p>
    <p style="margin: 4px 0;"><strong>Dealership Location:</strong> {{branch}}</p>
    <p style="margin: 4px 0;"><strong>Representative Assigned:</strong> Hyderabad Concierge Desk</p>
  </div>
  <p>Our sales representative from the <strong>{{branch}}</strong> branch will reach out to you shortly via phone to confirm your preferred date and time slot.</p>
  <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;"/>
  <h4>Branch Contact Details:</h4>
  <ul style="font-size: 14px; color: #555;">
    <li><strong>Jubilee Hills:</strong> +91 40 4852 9160 | srujan.jubileehills@gmail.com</li>
    <li><strong>Gachibowli:</strong> +91 40 6924 7350 | srujan.gachibowli@gmail.com</li>
    <li><strong>Banjara Hills:</strong> +91 40 2339 8470 | srujan.banjarahills@gmail.com</li>
    <li><strong>Hitec City:</strong> +91 40 6688 3590 | srujan.hiteccity@gmail.com</li>
  </ul>
  <p style="font-size: 12px; color: #888; margin-top: 20px;">CAR-HUB Pvt. Ltd. | Telangana's Premier Dealership</p>
</div>
```

4. Click **Save**.
5. Copy the **Template ID** (e.g., `template_customer_yyyy`).
   > *Note: This is an EmailJS Template ID (starts with template_), NOT an email address!*

---

## Step 5: Get Your EmailJS Public Key

1. In the EmailJS Dashboard, click on your profile/account icon in the bottom-left or navigate to **Account** -> **API Keys**.
2. Look for **Public Key** (previously known as User ID).
3. Copy the key (e.g., `user_abc123XYZ` or `v_xYz...`).

---

## Step 6: Configure CAR-HUB 2.O

You can configure CAR-HUB 2.O in either of two ways:

### Method A: Using the In-Browser "⚙️ Configure EmailJS" Modal (Easiest)
1. Open [http://127.0.0.1:5500/](http://127.0.0.1:5500/)
2. Scroll to the **Book a Test Drive** section.
3. Click the **"⚙️ Configure EmailJS"** button.
4. Enter your 4 distinct values:
   - **Public Key**: e.g., `user_xxxx`
   - **Service ID**: e.g., `service_carhub`
   - **Owner Alert Template ID**: e.g., `template_owner_alert`
   - **Customer Confirmation Template ID**: e.g., `template_customer_conf`
   - **Dealership Notification Email**: `srujanlingalwar3@gmail.com`
5. Click **"Save & Activate"** (or click **"Send Test Email"** to verify first).

### Method B: Directly in `index.html`
Open `CAR-HUB-2.O-main/index.html` and update the dataset values:

```javascript
document.body.dataset.emailjsUser = 'YOUR_EMAILJS_PUBLIC_KEY';
document.body.dataset.emailjsService = 'YOUR_SERVICE_ID';
document.body.dataset.emailjsOwnerTemplate = 'YOUR_OWNER_TEMPLATE_ID';
document.body.dataset.emailjsCustomerTemplate = 'YOUR_CUSTOMER_TEMPLATE_ID';
document.body.dataset.ownerEmail = 'srujanlingalwar3@gmail.com';
```

---

## Step 7: Testing Your Setup

### A. Dry-Run Mode (Test without sending real emails)
Navigate to:
```
http://127.0.0.1:5500/?dryrun=1
```
Open Developer Tools (`F12` -> **Console**). You will see the exact payloads that will be sent to the owner and customer.

### B. Live Test Drive Booking
1. Open [http://127.0.0.1:5500/](http://127.0.0.1:5500/)
2. Scroll to the **BOOK A TEST DRIVE** section.
3. Select a model, branch, salutation, fill in your name, a test email address, and a 10-digit mobile number.
4. Click **BOOK A TEST DRIVE**.
5. You should see a confirmation pop-up:
   > *"🎉 Test Drive Booked Successfully! Dealership alert sent to srujanlingalwar3@gmail.com and confirmation email sent to your email."*
6. Check your Gmail inbox (`srujanlingalwar3@gmail.com`) for the Dealership Alert email and the test customer inbox for the Customer Confirmation email.

---

## Troubleshooting & FAQs

### 1. Error: "Service ID and Owner Template ID must be different"
- You entered the same string in both the Service ID field and the Owner Template ID field.
- **Service ID** comes from the **Email Services** tab (e.g., `service_carhub`).
- **Owner Template ID** comes from the **Email Templates** tab (e.g., `template_owner123`).

### 2. Error: "Customer Confirmation Template ID and Dealership Notification Email must be different"
- You entered an email address (such as `srujanlingalwar3@gmail.com`) into the Customer Confirmation Template ID field.
- The Template ID must be the template ID generated in EmailJS (e.g., `template_customer456`), NOT an email address.

### 3. Error 400: "The Public Key is required"
- Your `emailjsUser` value is empty or invalid. Check your Public Key in EmailJS Account -> API Keys.

### 4. Error: "The service ID is not found"
- Double check that your `emailjsService` matches the Service ID in EmailJS **Email Services**.

### 5. Error: "The template ID is not found"
- Verify that both `emailjsOwnerTemplate` and `emailjsCustomerTemplate` IDs are spelled correctly.

### 6. Emails are going to Spam/Junk
- Check your Gmail spam folder. Mark as "Not Spam" once, or add your sender address to your Gmail contacts.
