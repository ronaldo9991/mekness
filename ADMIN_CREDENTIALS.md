# 🔐 Admin Credentials

## All Three Admin Tiers

### 1️⃣ Super Admin (Full Control)
- **Email**: `superadmin@mekness.com`
- **Username**: `superadmin`
- **Password**: `Admin@12345`
- **Powers**:
  - ✅ Full system access
  - ✅ View all users (no restrictions)
  - ✅ Impersonate any user
  - ✅ Add/Remove funds from user accounts
  - ✅ Manage all admin users
  - ✅ Access all countries
  - ✅ Approve/Reject documents
  - ✅ Manage support tickets
  - ✅ View all activity logs

### 2️⃣ Middle Admin (Country-Based Access)
- **Email**: `middleadmin@mekness.com`
- **Username**: `middleadmin`
- **Password**: `Middle@12345`
- **Powers**:
  - ✅ View users from assigned countries only
  - ✅ Approve/Reject documents
  - ✅ Manage support tickets
  - ✅ View deposits/withdrawals
  - ✅ View trading accounts
  - ❌ Cannot impersonate users
  - ❌ Cannot add/remove funds
  - ❌ Cannot manage other admins

### 3️⃣ Normal Admin (Standard Access)
- **Email**: `normaladmin@mekness.com`
- **Username**: `normaladmin`
- **Password**: `Normal@12345`
- **Powers**:
  - ✅ View all users
  - ✅ Approve/Reject documents
  - ✅ Manage support tickets
  - ✅ View deposits/withdrawals
  - ✅ View trading accounts
  - ❌ Cannot impersonate users
  - ❌ Cannot add/remove funds
  - ❌ Cannot manage other admins

---

## 🌐 Login URL

**Admin Login**: http://localhost:5000/signin

Or directly: http://localhost:5000/admin/login

> **Note**: All three admin types can log in through the same sign-in page at `/signin`. The system will automatically detect if you're logging in as an admin and redirect you to the admin dashboard.

---

## 👤 Demo User Account

For testing the user dashboard:

- **Email**: `demo@mekness.com`
- **Username**: `demo`
- **Password**: `demo123`

---

## 🔄 Quick Switch Testing

You can quickly test all three admin tiers by:
1. Log in with one admin account
2. Check the features available
3. Log out
4. Log in with another admin account
5. Notice the different permissions and access levels

---

## 🛡️ Security Notes

⚠️ **Important**: These are development credentials. In production:
- Change all default passwords immediately
- Use strong, unique passwords
- Enable 2FA where possible
- Implement password rotation policies
- Use environment variables for sensitive data
- Never commit credentials to version control

---

## 📊 Testing Features by Admin Type

### Super Admin Testing Checklist:
- [ ] Impersonate a user (Clients page)
- [ ] Add funds to a user account
- [ ] Remove funds from a user account
- [ ] Create new middle/normal admin accounts
- [ ] Approve/reject documents
- [ ] Manage support tickets
- [ ] View all activity logs

### Middle Admin Testing Checklist:
- [ ] View users (should be filtered by country if assignments exist)
- [ ] Approve/reject documents
- [ ] Reply to support tickets
- [ ] View deposits/withdrawals
- [ ] Try to impersonate (should fail)

### Normal Admin Testing Checklist:
- [ ] View all users
- [ ] Approve/reject documents
- [ ] Reply to support tickets
- [ ] View deposits/withdrawals
- [ ] Try to add funds (should fail)

---

Last Updated: November 14, 2025

